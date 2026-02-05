import React, { useState } from 'react';
import { apiFetch } from '../../utils/api';

export default function Settings() {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await apiFetch('/admin', {
                method: 'PUT',
                body: JSON.stringify({ username, password })
            });
            if (res.ok) {
                setMessage('Kredensial berhasil diperbarui (Anda mungkin perlu login ulang)');
            } else {
                setMessage('Gagal memperbarui');
            }
        } catch (e) {
            setMessage('Error');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow max-w-lg">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Pengaturan Akun Admin</h2>
            {message && <div className="mb-4 text-sm text-blue-600">{message}</div>}

            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Username Baru</label>
                    <input
                        className="w-full border p-2 rounded"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Password Baru</label>
                    <input
                        className="w-full border p-2 rounded"
                        type="password"
                        placeholder="Minimal 6 karakter"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Update Kredensial</button>
            </form>
        </div>
    );
}
