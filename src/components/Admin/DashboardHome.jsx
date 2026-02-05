import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/api';

export default function DashboardHome() {
    const [heroTitle, setHeroTitle] = useState('');
    const [heroSubtitle, setHeroSubtitle] = useState('');
    const [footerDesc, setFooterDesc] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await apiFetch('/content'); // Reusing public endpoint to get current values
            if (res.ok) {
                const data = await res.json();
                setHeroTitle(data.hero.title);
                setHeroSubtitle(data.hero.subtitle);
                setFooterDesc(data.footer.description);
            }
        } catch (e) {
            console.error("Failed to load settings");
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
                    footer_description: footerDesc
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
                <div>
                    <label className="block text-sm font-medium text-gray-700">Judul Utama (Hero)</label>
                    <input
                        type="text"
                        value={heroTitle}
                        onChange={(e) => setHeroTitle(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Sub-Judul (Hero)</label>
                    <textarea
                        value={heroSubtitle}
                        onChange={(e) => setHeroSubtitle(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
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
