import React, { useContext } from 'react';
import { DataContext } from '../App';

export default function Footer() {
    const { data } = useContext(DataContext);
    const description = data?.footer?.description || "Menyediakan hunian berkualitas dengan desain modern dan lingkungan yang nyaman untuk keluarga Anda di Makassar dan Gowa.";
    const title = data?.site?.title || "Hexa Property";
    const logo = data?.site?.logo;

    const contacts = data?.footer?.contacts || [
        { id: 1, name: 'Rizqi', phone: '089669153464' },
        { id: 2, name: 'Achmad', phone: '085780574811' }
    ];

    const formatWaLink = (phone) => {
        // Ensure format 62...
        if (!phone) return '#';
        let num = phone.replace(/\D/g, '');
        if (num.startsWith('0')) num = '62' + num.substring(1);
        else if (num.startsWith('8')) num = '62' + num;
        return `https://wa.me/${num}`;
    };

    return (
        <footer id="kontak" className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                    {/* Brand Column */}
                    <div>
                        <div className="flex items-center gap-3">
                            {logo && <img src={logo} alt={title} className="h-10 w-auto object-contain" />}
                            <span className="text-2xl font-bold text-gray-900">{title}</span>
                        </div>
                        <p className="mt-4 text-gray-500 leading-relaxed max-w-sm">
                            {description}
                        </p>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Hubungi Kami</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {contacts.map(contact => (
                                <a
                                    key={contact.id}
                                    href={formatWaLink(contact.phone)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-accent hover:bg-yellow-50 transition-all group"
                                >
                                    <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                                        <p className="text-sm text-gray-500">{contact.phone}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-8 text-center">
                    <p className="text-base text-gray-400">
                        &copy; {new Date().getFullYear()} {title}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
