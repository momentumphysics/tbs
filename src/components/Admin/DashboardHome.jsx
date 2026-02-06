import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/api';

export default function DashboardHome() {
    const [heroTitle, setHeroTitle] = useState('');
    const [heroSubtitle, setHeroSubtitle] = useState('');
    const [footerDesc, setFooterDesc] = useState('');
    const [webTitle, setWebTitle] = useState('');
    const [logoPreview, setLogoPreview] = useState(null);
    const [logoId, setLogoId] = useState(null);

    const [loading, setLoading] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await apiFetch('/content');
            if (res.ok) {
                const data = await res.json();
                setHeroTitle(data.hero.title);
                setHeroSubtitle(data.hero.subtitle);
                setFooterDesc(data.footer.description);
                setWebTitle(data.site?.title || '');
                setLogoPreview(data.site?.logo || null);
                // We'd ideally need the ID too. But API currently returns cooked URL.
                // We can extract ID or just rely on new uploads.
                // For now, if we don't change the logo, we send null or keep existing?
                // The PUT endpoint updates ALL fields. So we should start with a valid ID if possible.
                // Alternatively, we ignore logo_id update if it is null in the request
                // But let's assume if they don't upload a new one, we keep the old one on the backend?
                // My backend query updates `logo_id = ?`. If I send null, it wipes it!
                // So I need to fetch the ID. The public API `/content` doesn't expose ID explicitly, only URL `.../api/image/123`.
                // I can extract ID from URL.
                if (data.site?.logo) {
                    const parts = data.site.logo.split('/');
                    setLogoId(parts[parts.length - 1]);
                }
            }
        } catch (e) {
            console.error("Failed to load settings");
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingLogo(true);
        try {
            // Dynamic import for compressor
            const { compressImage } = await import('../../utils/imageCompressor');
            const compressedFile = await compressImage(file);

            const formData = new FormData();
            formData.append('image', compressedFile);
            formData.append('type', 'hero'); // Just reusing 'hero' or 'house', schema check isn't strict on 'logo' type, maybe 'hero' fits best or just 'house'

            const res = await apiFetch('/upload', { method: 'POST', body: formData });
            if (res.ok) {
                const json = await res.json();
                setLogoId(json.id);
                setLogoPreview(URL.createObjectURL(compressedFile));
            }
        } catch (error) {
            console.error("Logo upload failed", error);
            alert("Gagal mengupload logo");
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const res = await apiFetch('/settings', {
                method: 'PUT',
                body: JSON.stringify({
                    hero_title: heroTitle,
                    hero_subtitle: heroSubtitle,
                    footer_description: footerDesc,
                    web_title: webTitle,
                    logo_id: logoId
                })
            });
            if (res.ok) {
                setMessage('Perubahan berhasil disimpan!');
            } else {
                setMessage('Gagal menyimpan perubahan.');
            }
        } catch (e) {
            setMessage('Terjadi kesalahan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Edit Konten Utama</h2>
            {message && <div className={`p-4 mb-4 rounded ${message.includes('Gagal') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</div>}

            <form onSubmit={handleSave} className="space-y-6">

                {/* Site Identity */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                    <h3 className="font-semibold text-gray-700">Identitas Website</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Website / Brand</label>
                        <input
                            type="text"
                            value={webTitle}
                            onChange={(e) => setWebTitle(e.target.value)}
                            placeholder="Contoh: Hexa Property"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Logo Website</label>
                        <div className="mt-2 flex items-center space-x-4">
                            {logoPreview && (
                                <img src={logoPreview} alt="Logo Preview" className="h-16 w-16 object-contain border rounded bg-white" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                disabled={uploadingLogo}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                        </div>
                        {uploadingLogo && <span className="text-xs text-blue-600">Uploading...</span>}
                    </div>
                </div>

                {/* Hero Section */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 border-b pb-2">Halaman Depan (Hero)</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Judul Utama</label>
                        <input
                            type="text"
                            value={heroTitle}
                            onChange={(e) => setHeroTitle(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sub-Judul</label>
                        <textarea
                            value={heroSubtitle}
                            onChange={(e) => setHeroSubtitle(e.target.value)}
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                {/* Footer Section */}
                <div>
                    <h3 className="font-semibold text-gray-700 border-b pb-2 mb-4">Footer</h3>
                    <label className="block text-sm font-medium text-gray-700">Deskripsi Footer</label>
                    <textarea
                        value={footerDesc}
                        onChange={(e) => setFooterDesc(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
                >
                    {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </form>
        </div>
    );
}
