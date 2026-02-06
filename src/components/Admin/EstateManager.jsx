import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/api';

export default function EstateManager() {
    const [estates, setEstates] = useState([]);
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await apiFetch('/content');
            if (res.ok) {
                const data = await res.json();
                setEstates(data.catalog.estates || []);
            }
        } catch (e) {
            console.error("Failed to load estates");
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await apiFetch('/estates', {
                method: 'POST',
                body: JSON.stringify({ name: newName })
            });
            if (res.ok) {
                setNewName('');
                loadData();
            }
        } catch (e) {
            alert('Gagal menambah perumahan');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Hapus perumahan ini?')) return;
        try {
            const res = await apiFetch(`/estates/${id}`, { method: 'DELETE' });
            if (res.ok) {
                loadData();
            } else {
                const data = await res.json();
                if (data.dependentHouses && data.dependentHouses.length > 0) {
                    alert(`Gagal menghapus! Tipe rumah berikut harus dihapus terlebih dahulu:\n\n- ${data.dependentHouses.join('\n- ')}`);
                } else {
                    alert('Gagal menghapus perumahan.');
                }
            }
        } catch (e) {
            alert('Gagal menghapus perumahan. Terjadi kesalahan jaringan.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Manajemen Perumahan (Cluster/Area)</h2>

            {/* List */}
            <div className="space-y-4 mb-8">
                {estates.map(est => (
                    <div key={est.id} className="flex items-center justify-between p-4 bg-gray-50 rounded border">
                        <div>
                            <p className="font-medium text-gray-900">{est.name}</p>
                        </div>
                        <button
                            onClick={() => handleDelete(est.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                            Hapus
                        </button>
                    </div>
                ))}
                {estates.length === 0 && <p className="text-gray-500 text-center">Belum ada data perumahan.</p>}
            </div>

            {/* Add Form */}
            <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Tambah Perumahan Baru</h3>
                <form onSubmit={handleAdd} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Nama Perumahan</label>
                        <input
                            type="text"
                            required
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            placeholder="Contoh: Cluster Dahlia"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700"
                    >
                        {loading ? '...' : 'Tambah'}
                    </button>
                </form>
            </div>
        </div>
    );
}
