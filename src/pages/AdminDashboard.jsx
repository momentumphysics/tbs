import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { DataContext } from '../App';
import DashboardHome from '../components/Admin/DashboardHome';
import EstateManager from '../components/Admin/EstateManager';
import HouseManager from '../components/Admin/HouseManager';
import ContactManager from '../components/Admin/ContactManager';
import Settings from '../components/Admin/Settings';

export default function AdminDashboard() {
    const { data } = useContext(DataContext);
    const siteTitle = data?.site?.title || "Hexa Admin";

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            navigate('/edit');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        navigate('/edit');
    };

    const navItems = [
        { name: 'Konten Utama', path: '/admin' },
        { name: 'Perumahan', path: '/admin/estates' },
        { name: 'Tipe Rumah', path: '/admin/houses' },
        { name: 'Kontak', path: '/admin/contacts' },
        { name: 'Pengaturan', path: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md hidden md:block">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800">{siteTitle}</h1>
                </div>
                <nav className="mt-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`block px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${location.pathname === item.path ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : ''
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 transition-colors mt-8 border-t"
                    >
                        Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <div className="md:hidden mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow">
                    <span className="font-bold">Menu</span>
                    <div className="space-x-4">
                        {navItems.map(item => (
                            <Link key={item.path} to={item.path} className="text-sm underline px-1">{item.name}</Link>
                        ))}
                        <button onClick={handleLogout} className="text-sm text-red-600">Logout</button>
                    </div>
                </div>

                <Routes>
                    <Route path="/" element={<DashboardHome />} />
                    <Route path="/estates" element={<EstateManager />} />
                    <Route path="/houses" element={<HouseManager />} />
                    <Route path="/contacts" element={<ContactManager />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </main>
        </div>
    );
}
