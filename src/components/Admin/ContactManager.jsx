import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/api';

export default function ContactManager() {
    const [contacts, setContacts] = useState([]);
    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try {
            const res = await apiFetch('/content');
            if (res.ok) {
                const data = await res.json();
                setContacts(data.footer.contacts || []);
            }
        } catch (e) {
            console.error("Failed to load contacts");
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await apiFetch('/contacts', {
                method: 'POST',
                body: JSON.stringify({ name: newName, phone: newPhone })
            });
            if (res.ok) {
                setNewName('');
                setNewPhone('');
                loadContacts();
            }
        } catch (e) {
            alert('Gagal menambah kontak');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Hapus kontak ini?')) return;
        try {
            const res = await apiFetch(`/contacts/${id}`, { method: 'DELETE' });
            if (res.ok) loadContacts();
        } catch (e) {
            alert('Gagal menghapus');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Manajemen Kontak (WhatsApp)</h2>

            {/* List */}
            <div className="space-y-4 mb-8">
                {contacts.map(contact => (
                    <div key={contact.id} className="flex items-center justify-between p-4 bg-gray-50 rounded border">
                        <div>
                            <p className="font-medium text-gray-900">{contact.name}</p>
                            <p className="text-sm text-gray-500">{contact.phone}</p>
                        </div>
                        <button
                            onClick={() => handleDelete(contact.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                            Hapus
                        </button>
                    </div>
                ))}
                {contacts.length === 0 && <p className="text-gray-500 text-center">Belum ada kontak.</p>}
            </div>

            {/* Add Form */}
            <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Tambah Kontak Baru</h3>
                <form onSubmit={handleAdd} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Nama Agen</label>
                        <input
                            type="text"
                            required
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Nomor HP (WhatsApp)</label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: 08123456789"
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
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
