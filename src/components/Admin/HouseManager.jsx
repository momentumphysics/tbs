import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/api';

export default function HouseManager() {
    const [houses, setHouses] = useState([]);
    const [estates, setEstates] = useState([]);
    const [view, setView] = useState('list'); // list | form
    const [editingId, setEditingId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        estate_id: '',
        name: '',
        price: '',
        video_link: '',
        luas: '',
        bedrooms: '',
        bathrooms: '',
        garage: '',
        features: '',
        images: [] // Array of {id, preview}
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = await apiFetch('/content');
        if (res.ok) {
            const data = await res.json();
            setHouses(data.catalog.houses || []);
            setEstates(data.catalog.estates || []);
        }
    };

    const resetForm = () => {
        setFormData({
            estate_id: estates.length > 0 ? estates[0].id : '',
            name: '',
            price: '',
            video_link: '',
            luas: '',
            bedrooms: '',
            bathrooms: '',
            garage: '',
            features: '',
            images: []
        });
        setEditingId(null);
    };

    const handleEdit = (house) => {
        setEditingId(house.id);
        setFormData({
            estate_id: house.housing_estate_id,
            name: house.name,
            price: house.price,
            video_link: house.video_link,
            luas: house.specs?.luas || '',
            bedrooms: house.specs?.bedrooms || '',
            bathrooms: house.specs?.bathrooms || '',
            garage: house.specs?.garage || '',
            features: (house.features || []).join('\n'),
            images: (house.images || []).map(url => ({ id: url.split('/').pop(), preview: url })) // Extract ID from URL for logic
        });
        setView('form');
    };

    const handleDelete = async (id) => {
        if (!confirm('Hapus tipe rumah ini?')) return;
        await apiFetch(`/houses/${id}`, { method: 'DELETE' });
        loadData();
    };

    const handleDeleteImage = async (imageId, index) => {
        if (!confirm('Hapus gambar ini?')) return;

        // Optimistically remove from UI
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData(prev => ({ ...prev, images: newImages }));

        try {
            // If it has an ID, delete from server
            if (imageId) {
                await apiFetch(`/image/${imageId}`, { method: 'DELETE' });
            }
        } catch (e) {
            console.error("Failed to delete image", e);
            alert("Gagal menghapus gambar di server");
            // Revert? For now, we assume success or user sees error.
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        const newImages = [...formData.images];

        // Dynamic import to avoid issues if module not ready? No, standard import.
        const { compressImage } = await import('../../utils/imageCompressor');

        for (const file of files) {
            try {
                // Compress Client Side
                const compressedFile = await compressImage(file);

                const data = new FormData();
                data.append('image', compressedFile);
                data.append('type', 'house');

                const res = await apiFetch('/upload', {
                    method: 'POST',
                    body: data
                });

                if (res.ok) {
                    const json = await res.json();
                    const preview = URL.createObjectURL(compressedFile);
                    newImages.push({ id: json.id, preview: preview });
                }
            } catch (err) {
                console.error("Upload/Compression failed", err);
            }
        }
        setFormData(prev => ({ ...prev, images: newImages }));
        setUploading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            estate_id: formData.estate_id,
            name: formData.name,
            price: formData.price,
            video_link: formData.video_link,
            specs: {
                luas: formData.luas,
                bedrooms: formData.bedrooms,
                bathrooms: formData.bathrooms,
                garage: formData.garage
            },
            features: formData.features.split('\n').filter(x => x.trim()),
            images: formData.images.map(img => img.id)
        };

        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `/houses/${editingId}` : '/houses';

            const res = await apiFetch(url, {
                method,
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setView('list');
                resetForm();
                loadData();
            }
        } catch (e) {
            alert('Gagal menyimpan');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Manajemen Tipe Rumah</h2>
                {view === 'list' && (
                    <button
                        onClick={() => { resetForm(); setView('form'); }}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Tambah Rumah
                    </button>
                )}
                {view === 'form' && (
                    <button
                        onClick={() => { setView('list'); }}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Batal
                    </button>
                )}
            </div>

            {view === 'list' ? (
                <div className="grid grid-cols-1 gap-4">
                    {houses.map(house => (
                        <div key={house.id} className="border p-4 rounded flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">{house.name}</h3>
                                <p className="text-sm text-gray-500">
                                    {estates.find(e => e.id === house.housing_estate_id)?.name} - {house.price}
                                </p>
                            </div>
                            <div className="space-x-2">
                                <button onClick={() => handleEdit(house)} className="text-blue-600 text-sm">Edit</button>
                                <button onClick={() => handleDelete(house.id)} className="text-red-600 text-sm">Hapus</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Estate Select */}
                    <div>
                        <label className="block text-sm font-medium">Perumahan</label>
                        <select
                            className="w-full border p-2 rounded"
                            value={formData.estate_id}
                            onChange={(e) => setFormData({ ...formData, estate_id: parseInt(e.target.value) })}
                        >
                            {estates.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Nama Tipe</label>
                            <input className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Harga</label>
                            <input className="w-full border p-2 rounded" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                        </div>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Luas (LT/LB)</label>
                            <input className="w-full border p-2 rounded" value={formData.luas} onChange={e => setFormData({ ...formData, luas: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Kamar Tidur</label>
                            <input className="w-full border p-2 rounded" value={formData.bedrooms} onChange={e => setFormData({ ...formData, bedrooms: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Kamar Mandi</label>
                            <input className="w-full border p-2 rounded" value={formData.bathrooms} onChange={e => setFormData({ ...formData, bathrooms: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Garasi</label>
                            <input className="w-full border p-2 rounded" value={formData.garage} onChange={e => setFormData({ ...formData, garage: e.target.value })} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Fitur (Pisahkan dengan baris baru)</label>
                        <textarea className="w-full border p-2 rounded" rows={4} value={formData.features} onChange={e => setFormData({ ...formData, features: e.target.value })} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Link Video TikTok</label>
                        <input className="w-full border p-2 rounded" value={formData.video_link} onChange={e => setFormData({ ...formData, video_link: e.target.value })} />
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium">Gambar</label>
                        <div className="grid grid-cols-4 gap-4 mb-2">
                            {formData.images.map((img, idx) => (
                                <div key={idx} className="relative group">
                                    <img src={img.preview} alt="preview" className="h-24 w-full object-cover rounded shadow-sm" />
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteImage(img.id, idx)}
                                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Hapus Gambar"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                        {uploading && <p className="text-sm text-blue-600 mt-2">Mengkompres & Mengunggah... (Mohon tunggu)</p>}
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded font-medium">Simpan</button>
                    </div>
                </form>
            )}
        </div>
    );
}
