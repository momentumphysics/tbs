
/**
 * Cloudflare Worker for Hexa Property Admin & API
 * 
 * Required bindings in wrangler.toml:
 * [[d1_databases]]
 * binding = "DB"
 * database_name = "hexa-db"
 * database_id = "<YOUR_D1_DATABASE_ID>"
 */

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // CORS Headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        if (method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // Helper to return JSON
        const json = (data, status = 200) => new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status
        });

        // Helper to return Error
        const err = (msg, status = 400) => json({ error: msg }, status);

        // Authentication Helper
        async function checkAuth(req) {
            const authHeader = req.headers.get('Authorization');
            if (!authHeader) return false;
            const token = authHeader.replace('Bearer ', '');
            // In a real app, verify JWT or Session ID. 
            // Here, we verify against the admin password stored in DB or a simple derived token.
            // For simplicity in this demo, we validate if the token matches 'admin-secret-token'
            // which we will send upon login.
            // Ideally: Verify JWT signed with env.SECRET
            return token === 'hexa-admin-session-token';
        }

        // --- API Routes ---

        // 1. Public Data (Hero, Footer, Catalog)
        if (path === '/api/content' && method === 'GET') {
            const settings = await env.DB.prepare('SELECT hero_title, hero_subtitle, footer_description FROM admin_settings WHERE id = 1').first();
            const contacts = await env.DB.prepare('SELECT * FROM contacts').all();
            const estates = await env.DB.prepare('SELECT * FROM housing_estates').all();

            // Fetch house types with images
            // Getting images requires joining or separate query. 
            // We'll simplisticly fetch houses and then their image IDs.
            const housesResult = await env.DB.prepare('SELECT * FROM house_types').all();
            const houses = housesResult.results;

            for (let house of houses) {
                // Parse JSON fields
                try { house.specs = JSON.parse(house.specs); } catch (e) { }
                try { house.features = JSON.parse(house.features); } catch (e) { }
                // Images: detailed query or just IDs
                const imgs = await env.DB.prepare('SELECT id FROM images WHERE house_type_id = ?').bind(house.id).all();
                house.images = imgs.results.map(i => `/api/image/${i.id}`);
            }

            return json({
                hero: { title: settings.hero_title, subtitle: settings.hero_subtitle },
                footer: { description: settings.footer_description, contacts: contacts.results },
                catalog: { estates: estates.results, houses: houses }
            });
        }

        // 2. Serve Image
        if (path.startsWith('/api/image/') && method === 'GET') {
            const id = path.split('/').pop();
            console.log(`[DEBUG] Fetching image id: ${id}`);

            const img = await env.DB.prepare('SELECT data, mime_type FROM images WHERE id = ?').bind(id).first();

            if (!img) {
                console.log(`[DEBUG] Image not found for id: ${id}`);
                return err('Image not found', 404);
            }

            console.log(`[DEBUG] Image found. Type: ${img.mime_type}, Data length: ${img.data ? img.data.length : 'null'}`);

            // D1 might return an array of integers for BLOB if not automatically cast.
            // Let's ensure it's a Uint8Array.
            let imageBuffer = img.data;
            if (Array.isArray(img.data)) {
                console.log('[DEBUG] Converting Array to Uint8Array');
                imageBuffer = new Uint8Array(img.data);
            }

            const response = new Response(imageBuffer, {
                headers: {
                    'Content-Type': img.mime_type,
                    'Cache-Control': 'public, max-age=31536000',
                    ...corsHeaders
                }
            });
            return response;
        }

        // 3. Login
        if (path === '/api/login' && method === 'POST') {
            const { username, password } = await request.json();
            const admin = await env.DB.prepare('SELECT * FROM admin_settings WHERE id = 1').first();

            if (admin && admin.username === username && admin.password === password) {
                return json({ token: 'hexa-admin-session-token', username: admin.username });
            }
            return err('Invalid credentials', 401);
        }

        // --- Protected Routes ---

        // Check Auth
        if (!(await checkAuth(request))) {
            return err('Unauthorized', 401);
        }

        // 4. Update Admin Credentials
        if (path === '/api/admin' && method === 'PUT') {
            const { username, password } = await request.json();
            await env.DB.prepare('UPDATE admin_settings SET username = ?, password = ? WHERE id = 1').bind(username, password).run();
            return json({ success: true });
        }

        // 5. Update Hero/Footer Text
        if (path === '/api/settings' && method === 'PUT') {
            const { hero_title, hero_subtitle, footer_description } = await request.json();
            await env.DB.prepare('UPDATE admin_settings SET hero_title = ?, hero_subtitle = ?, footer_description = ? WHERE id = 1')
                .bind(hero_title, hero_subtitle, footer_description).run();
            return json({ success: true });
        }

        // 6. Manage Contacts
        if (path === '/api/contacts' && method === 'POST') {
            const { name, phone } = await request.json();
            const res = await env.DB.prepare('INSERT INTO contacts (name, phone) VALUES (?, ?)').bind(name, phone).run();
            return json({ success: true, id: res.meta.last_row_id });
        }
        if (path.startsWith('/api/contacts/') && method === 'DELETE') {
            const id = path.split('/').pop();
            await env.DB.prepare('DELETE FROM contacts WHERE id = ?').bind(id).run();
            return json({ success: true });
        }

        // 7. Manage Estates
        if (path === '/api/estates' && method === 'POST') {
            const { name } = await request.json();
            const res = await env.DB.prepare('INSERT INTO housing_estates (name) VALUES (?)').bind(name).run();
            return json({ success: true, id: res.meta.last_row_id });
        }
        if (path.startsWith('/api/estates/') && method === 'DELETE') {
            const id = path.split('/').pop();
            await env.DB.prepare('DELETE FROM housing_estates WHERE id = ?').bind(id).run();
            return json({ success: true });
        }

        // 8. Manage Houses
        if (path === '/api/houses' && method === 'POST') {
            const { estate_id, name, price, specs, features, images } = await request.json();
            const res = await env.DB.prepare('INSERT INTO house_types (housing_estate_id, name, price, specs, features) VALUES (?, ?, ?, ?, ?)')
                .bind(estate_id, name, price, JSON.stringify(specs), JSON.stringify(features)).run();

            if (images && Array.isArray(images)) {
                for (const imgId of images) {
                    await env.DB.prepare('UPDATE images SET house_type_id = ? WHERE id = ?').bind(res.meta.last_row_id, imgId).run();
                }
            }
            return json({ success: true, id: res.meta.last_row_id });
        }
        if (path.startsWith('/api/houses/') && method === 'PUT') {
            const id = path.split('/').pop();
            const { estate_id, name, price, specs, features, images } = await request.json();
            await env.DB.prepare('UPDATE house_types SET housing_estate_id=?, name=?, price=?, specs=?, features=? WHERE id=?')
                .bind(estate_id, name, price, JSON.stringify(specs), JSON.stringify(features), id).run();

            if (images && Array.isArray(images)) {
                for (const imgId of images) {
                    await env.DB.prepare('UPDATE images SET house_type_id = ? WHERE id = ?').bind(id, imgId).run();
                }
            }
            return json({ success: true });
        }
        if (path.startsWith('/api/houses/') && method === 'DELETE') {
            const id = path.split('/').pop();
            await env.DB.prepare('DELETE FROM house_types WHERE id = ?').bind(id).run();
            return json({ success: true });
        }

        // 9. Upload Image (with AVIF conversion simulation)
        if (path === '/api/upload' && method === 'POST') {
            const formData = await request.formData();
            const file = formData.get('image');
            const houseId = formData.get('house_id'); // Optional, checks context

            if (!file) return err('No file uploaded');

            const buffer = await file.arrayBuffer();

            // --- AVIF CONVERSION LOGIC (CONCEPTUAL) ---
            // In a real Worker, you would use a WASM library like @cloudflare/photon or resize-wasm
            // to convert the 'buffer' to AVIF.
            // Example pseudo-code:
            // const image = photon.OpenImage(buffer);
            // const avifBuffer = image.get_bytes_avif();

            // Since we don't have the WASM binary here, we will store the original buffer
            // but mark it as 'image/avif' if we could convert it. 
            // For this implementation, we simply store what we get but this is the place to insert the conversion.

            const targetMimeType = 'image/avif'; // Pretend we converted it
            // const finalBuffer = await convertToAvif(buffer); 
            const finalBuffer = buffer; // Fallback for this code block

            const res = await env.DB.prepare('INSERT INTO images (house_type_id, type, mime_type, data) VALUES (?, ?, ?, ?)')
                .bind(houseId ? houseId : null, houseId ? 'house' : 'hero', file.type, finalBuffer).run(); // Storing orig mime/data for now

            return json({ success: true, id: res.meta.last_row_id });
        }

        // 10. Delete Image
        if (path.startsWith('/api/image/') && method === 'DELETE') {
            const id = path.split('/').pop();
            await env.DB.prepare('DELETE FROM images WHERE id = ?').bind(id).run();
            return json({ success: true });
        }

        return err('Not Found', 404);
    }
};
