import React, { useContext } from 'react';
import { DataContext } from '../App';

export default function Hero() {
    const { data } = useContext(DataContext);
    const hero = data?.hero || {};

    const handleScroll = (e, targetId) => {
        e.preventDefault();
        const element = document.querySelector(targetId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth'
            });
        }
    };

    return (
        <div id="beranda" className="relative bg-gray-900 h-screen h-[100dvh] overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <img
                    className="w-full h-full object-cover"
                    src={hero.image || "/img/Edelweiss/1-Edelweiss depan.avif"} // Fallback logic
                    alt="Hexa Modern Living"
                />
                <div className="absolute inset-0 bg-gray-900/60 mix-blend-multiply" aria-hidden="true"></div>
            </div>

            <div className="relative w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-center sm:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl max-w-3xl" data-aos="fade-up">
                    {hero.title || "Hexa: Solusi Rumah Impian Anda"}
                </h1>
                <p className="mt-4 sm:mt-6 text-base sm:text-xl text-gray-300 max-w-2xl" data-aos="fade-up" data-aos-delay="200">
                    {hero.subtitle || "Rumah luas, cicilan fleksibel, DP ringan! Unit terbatas. Temukan kenyamanan hidup di lingkungan terbaik."}
                </p>
                <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:justify-start gap-4 sm:gap-3" data-aos="fade-up" data-aos-delay="400">
                    <div className="rounded-md shadow">
                        <a
                            href="#katalog"
                            onClick={(e) => handleScroll(e, '#katalog')}
                            className="w-full flex items-center justify-center px-8 py-4 sm:py-3 border border-transparent text-base font-medium rounded-md text-white bg-accent hover:bg-yellow-600 md:text-lg transition-all"
                        >
                            Lihat Tipe Rumah
                        </a>
                    </div>
                    <div>
                        <a
                            href="#kontak"
                            onClick={(e) => handleScroll(e, '#kontak')}
                            className="w-full flex items-center justify-center px-8 py-4 sm:py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 md:text-lg transition-all"
                        >
                            Hubungi Kami
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
