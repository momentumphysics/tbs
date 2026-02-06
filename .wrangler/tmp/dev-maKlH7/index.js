var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-H2dsUr/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// workers/index.js
var workers_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };
    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    const json = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status
    }), "json");
    const err = /* @__PURE__ */ __name((msg, status = 400) => json({ error: msg }, status), "err");
    async function checkAuth(req) {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) return false;
      const token = authHeader.replace("Bearer ", "");
      return token === "hexa-admin-session-token";
    }
    __name(checkAuth, "checkAuth");
    if (path === "/api/content" && method === "GET") {
      const settings = await env.DB.prepare("SELECT hero_title, hero_subtitle, footer_description, web_title, logo_id FROM admin_settings WHERE id = 1").first();
      const contacts = await env.DB.prepare("SELECT * FROM contacts").all();
      const estates = await env.DB.prepare("SELECT * FROM housing_estates").all();
      const housesResult = await env.DB.prepare("SELECT * FROM house_types").all();
      const houses = housesResult.results;
      for (let house of houses) {
        try {
          house.specs = JSON.parse(house.specs);
        } catch (e) {
        }
        try {
          house.features = JSON.parse(house.features);
        } catch (e) {
        }
        const imgs = await env.DB.prepare("SELECT id FROM images WHERE house_type_id = ?").bind(house.id).all();
        house.images = imgs.results.map((i) => `/api/image/${i.id}`);
      }
      const heroImg = await env.DB.prepare("SELECT id FROM images WHERE type = 'hero' ORDER BY id DESC LIMIT 1").first();
      const heroImageUrl = heroImg ? `/api/image/${heroImg.id}` : null;
      const logoUrl = settings.logo_id ? `/api/image/${settings.logo_id}` : null;
      return json({
        site: { title: settings.web_title, logo: logoUrl },
        hero: { title: settings.hero_title, subtitle: settings.hero_subtitle, image: heroImageUrl },
        footer: { description: settings.footer_description, contacts: contacts.results },
        catalog: { estates: estates.results, houses }
      });
    }
    if (path.startsWith("/api/image/") && method === "GET") {
      const id = path.split("/").pop();
      console.log(`[DEBUG] Fetching image id: ${id}`);
      const img = await env.DB.prepare("SELECT data, mime_type FROM images WHERE id = ?").bind(id).first();
      if (!img) {
        console.log(`[DEBUG] Image not found for id: ${id}`);
        return err("Image not found", 404);
      }
      console.log(`[DEBUG] Image found. Type: ${img.mime_type}, Data length: ${img.data ? img.data.length : "null"}`);
      let imageBuffer = img.data;
      if (Array.isArray(img.data)) {
        console.log("[DEBUG] Converting Array to Uint8Array");
        imageBuffer = new Uint8Array(img.data);
      }
      const response = new Response(imageBuffer, {
        headers: {
          "Content-Type": img.mime_type,
          "Cache-Control": "public, max-age=31536000",
          ...corsHeaders
        }
      });
      return response;
    }
    if (path === "/api/login" && method === "POST") {
      const { username, password } = await request.json();
      const admin = await env.DB.prepare("SELECT * FROM admin_settings WHERE id = 1").first();
      if (admin && admin.username === username && admin.password === password) {
        return json({ token: "hexa-admin-session-token", username: admin.username });
      }
      return err("Invalid credentials", 401);
    }
    if (!await checkAuth(request)) {
      return err("Unauthorized", 401);
    }
    if (path === "/api/admin" && method === "PUT") {
      const { username, password } = await request.json();
      await env.DB.prepare("UPDATE admin_settings SET username = ?, password = ? WHERE id = 1").bind(username, password).run();
      return json({ success: true });
    }
    if (path === "/api/settings" && method === "PUT") {
      const { hero_title, hero_subtitle, footer_description, web_title, logo_id } = await request.json();
      await env.DB.prepare(`UPDATE admin_settings SET 
                hero_title = ?, 
                hero_subtitle = ?, 
                footer_description = ?,
                web_title = ?,
                logo_id = ?
            WHERE id = 1`).bind(hero_title, hero_subtitle, footer_description, web_title, logo_id).run();
      return json({ success: true });
    }
    if (path === "/api/contacts" && method === "POST") {
      const { name, phone } = await request.json();
      const res = await env.DB.prepare("INSERT INTO contacts (name, phone) VALUES (?, ?)").bind(name, phone).run();
      return json({ success: true, id: res.meta.last_row_id });
    }
    if (path.startsWith("/api/contacts/") && method === "DELETE") {
      const id = path.split("/").pop();
      await env.DB.prepare("DELETE FROM contacts WHERE id = ?").bind(id).run();
      return json({ success: true });
    }
    if (path === "/api/estates" && method === "POST") {
      const { name } = await request.json();
      const res = await env.DB.prepare("INSERT INTO housing_estates (name) VALUES (?)").bind(name).run();
      return json({ success: true, id: res.meta.last_row_id });
    }
    if (path.startsWith("/api/estates/") && method === "DELETE") {
      const id = path.split("/").pop();
      await env.DB.prepare("DELETE FROM housing_estates WHERE id = ?").bind(id).run();
      return json({ success: true });
    }
    if (path === "/api/houses" && method === "POST") {
      const { estate_id, name, price, specs, features, images, video_link, is_sold } = await request.json();
      const res = await env.DB.prepare("INSERT INTO house_types (housing_estate_id, name, price, specs, features, video_link, is_sold) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(estate_id, name, price, JSON.stringify(specs), JSON.stringify(features), video_link || "", is_sold ? 1 : 0).run();
      if (images && Array.isArray(images)) {
        for (const imgId of images) {
          await env.DB.prepare("UPDATE images SET house_type_id = ? WHERE id = ?").bind(res.meta.last_row_id, imgId).run();
        }
      }
      return json({ success: true, id: res.meta.last_row_id });
    }
    if (path.startsWith("/api/houses/") && method === "PUT") {
      const id = path.split("/").pop();
      const { estate_id, name, price, specs, features, images, video_link, is_sold } = await request.json();
      await env.DB.prepare("UPDATE house_types SET housing_estate_id=?, name=?, price=?, specs=?, features=?, video_link=?, is_sold=? WHERE id=?").bind(estate_id, name, price, JSON.stringify(specs), JSON.stringify(features), video_link || "", is_sold ? 1 : 0, id).run();
      if (images && Array.isArray(images)) {
        for (const imgId of images) {
          await env.DB.prepare("UPDATE images SET house_type_id = ? WHERE id = ?").bind(id, imgId).run();
        }
      }
      return json({ success: true });
    }
    if (path.startsWith("/api/houses/") && method === "DELETE") {
      const id = path.split("/").pop();
      await env.DB.prepare("DELETE FROM house_types WHERE id = ?").bind(id).run();
      return json({ success: true });
    }
    if (path === "/api/upload" && method === "POST") {
      const formData = await request.formData();
      const file = formData.get("image");
      const houseId = formData.get("house_id");
      if (!file) return err("No file uploaded");
      const buffer = await file.arrayBuffer();
      const targetMimeType = "image/avif";
      const finalBuffer = buffer;
      const res = await env.DB.prepare("INSERT INTO images (house_type_id, type, mime_type, data) VALUES (?, ?, ?, ?)").bind(houseId ? houseId : null, houseId ? "house" : "hero", file.type, finalBuffer).run();
      return json({ success: true, id: res.meta.last_row_id });
    }
    if (path.startsWith("/api/image/") && method === "DELETE") {
      const id = path.split("/").pop();
      await env.DB.prepare("DELETE FROM images WHERE id = ?").bind(id).run();
      return json({ success: true });
    }
    return err("Not Found", 404);
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// .wrangler/tmp/bundle-H2dsUr/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default
];
var middleware_insertion_facade_default = workers_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-H2dsUr/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
