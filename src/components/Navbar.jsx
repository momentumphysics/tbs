import React, { useState, useEffect, useRef } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    const controlNavbar = () => {
        if (typeof window !== 'undefined') {
            if (window.scrollY > lastScrollY.current && window.scrollY > 100) { // scrolling down
                setIsVisible(false);
            } else { // scrolling up
                setIsVisible(true);
            }
            lastScrollY.current = window.scrollY;
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, []);

    const handleScroll = (e, targetId) => {
        e.preventDefault();

        if (targetId === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const element = document.querySelector(targetId);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
        setIsOpen(false);
    };

    return (
        <nav className={`bg-white shadow-sm fixed top-0 w-full z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex-shrink-0 flex items-center">
                        {/* Logo */}
                        <a href="#" onClick={(e) => handleScroll(e, '#')} className="cursor-pointer">
                            <img
                                className="h-12 w-auto"
                                src="/img/Logo header.avif"
                                alt="Hexa Real Estate"
                            />
                        </a>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
                        <a href="#" onClick={(e) => handleScroll(e, '#')} className="text-gray-700 hover:text-blue-900 hover:underline hover:decoration-2 hover:underline-offset-4 px-3 py-2 font-medium transition-all duration-200">Beranda</a>
                        <a href="#katalog" onClick={(e) => handleScroll(e, '#katalog')} className="text-gray-700 hover:text-blue-900 hover:underline hover:decoration-2 hover:underline-offset-4 px-3 py-2 font-medium transition-all duration-200">Tipe Rumah</a>
                        <a href="#simulasi" onClick={(e) => handleScroll(e, '#simulasi')} className="text-gray-700 hover:text-blue-900 hover:underline hover:decoration-2 hover:underline-offset-4 px-3 py-2 font-medium transition-all duration-200">Simulasi KPR</a>
                        <a href="#kontak" onClick={(e) => handleScroll(e, '#kontak')} className="bg-primary text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md">Kontak</a>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path className={!isOpen ? 'block' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                <path className={isOpen ? 'block' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white border-t`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <a href="#" onClick={(e) => handleScroll(e, '#')} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-gray-50">Beranda</a>
                    <a href="#katalog" onClick={(e) => handleScroll(e, '#katalog')} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-gray-50">Tipe Rumah</a>
                    <a href="#simulasi" onClick={(e) => handleScroll(e, '#simulasi')} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-900 hover:bg-gray-50">Simulasi KPR</a>
                    <a href="#kontak" onClick={(e) => handleScroll(e, '#kontak')} className="block px-3 py-2 text-base font-medium text-white bg-primary rounded-md">Kontak</a>
                </div>
            </div>
        </nav>
    );
}
