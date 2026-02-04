
import React from 'react';

export default function Footer() {
    return (
        <footer id="kontak" className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:grid-cols-3">

                    {/* Brand Info */}
                    <div data-aos="fade-up">
                        <div className="flex items-center mb-4">
                            <img
                                className="h-7 w-auto"
                                src="/img/Logo header.avif"
                                alt="Hexa Logo"
                            />
                            <span className="ml-2 text-xl font-bold text-gray-900">Property</span>
                        </div>
                        <p className="text-gray-500 text-sm">
                            Mewujudkan hunian impian dengan kualitas terbaik dan lokasi strategis di Makassar & Gowa.
                        </p>
                    </div>

                    {/* Location */}
                    <div data-aos="fade-up" data-aos-delay="100">
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                            Lokasi Kantor
                        </h3>
                        <div className="flex items-start text-gray-500">
                            <svg className="h-6 w-6 mr-2 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p>
                                Jl. Tun Abdul Razak Perum Bumi Aroepala R 10 - 12,<br />
                                Paccinongang, Makassar, Gowa,<br />
                                Sulsel 90235
                            </p>
                        </div>
                        

                        <a
                            href="https://maps.app.goo.gl/SzNLC79ZxAnZLscq9"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 flex items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group bg-white shadow-sm"
                        >
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-bold text-gray-900">Google Maps</p>
                                <p className="text-xs text-gray-500">Klik untuk petunjuk arah</p>
                            </div>
                        </a>
                        <div className="mt-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                ⚠️ Unit terbatas — jangan sampai kehabisan!
                            </span>
                        </div>
                    </div>

                    {/* Contacts */}
                    <div data-aos="fade-up" data-aos-delay="200">
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                            Hubungi Kami
                        </h3>
                        <div className="space-y-4">
                            <a href="https://www.tiktok.com/@agenhexa" target="_blank" rel="noreferrer" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all group">
                                <div className="flex-shrink-0 h-10 w-10 bg-black rounded-full flex items-center justify-center text-white group-hover:bg-gray-800 transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">TikTok</p>
                                    <p className="text-sm text-gray-500">@agenhexa</p>
                                </div>
                            </a>

                            <a href="https://wa.me/6289669153464" target="_blank" rel="noreferrer" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-accent hover:bg-yellow-50 transition-all group">
                                <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">Rizqi</p>
                                    <p className="text-sm text-gray-500">089669153464</p>
                                </div>
                            </a>

                            <a href="https://wa.me/6285780574811" target="_blank" rel="noreferrer" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-accent hover:bg-yellow-50 transition-all group">
                                <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">Achmad</p>
                                    <p className="text-sm text-gray-500">085780574811</p>
                                </div>
                            </a>
                        </div>
                        {/* 
                        <div className="mt-8 text-center bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <span className="font-semibold text-accent text-sm uppercase tracking-wide">Hubungi agen kami untuk kunjungan lokasi sekarang!</span>
                        </div> */}
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-8 text-center">
                    <p className="text-base text-gray-400">
                        &copy; {new Date().getFullYear()} Hexa Property. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
