import React from 'react';
import ProductCard from './ProductCard';

export default function ProductCatalog() {
    const products = [
        {
            id: 1,
            name: 'Dahlia Type 85',
            image: '/img/Dahlia/1-Dahlia depan.avif',
            hoverImage: '/img/Dahlia/2-Dahlia dalam.avif',
            images: [
                '/img/Dahlia/1-Dahlia depan.avif',
                '/img/Dahlia/2-Dahlia dalam.avif',
                '/img/Dahlia/3-Dahlia dapur.avif',
                '/img/Dahlia/4-Dahlia dalam2.avif',
                '/img/Dahlia/5-Dahlia Lahan.avif',
                '/img/Dahlia/6-Dahlia kamar.avif',
                '/img/Dahlia/7-Dahlia tangga.avif',
                '/img/Dahlia/8-Dahlia kamar atas.avif',
                '/img/Dahlia/9-Dahlia kamar atas utama.avif',
                '/img/Dahlia/10-Dahlia balkon.avif',
                '/img/Dahlia/11-Dahlia balkon2.avif',
            ],
            videoLink: 'https://vt.tiktok.com/ZS5WXRFAL/',
            specs: {
                luas: 'LT 6x15 | LB 85 m²',
                bedrooms: '3 Kamar Tidur',
                bathrooms: '3 Kamar Mandi',
                garage: 'Garasi Luas',
            },
            features: ['Taman + Lahan Kosong', 'Bebas Banjir', 'Westafel Tersedia'],
            pricing: {
                price: 'Rp 900.000.000',
                dp: 'Rp 90.000.000',
                installment15: 'Rp 5.400.000/bulan',
            }
        },
        {
            id: 2,
            name: 'Pinisi UNM Type 85',
            image: '/img/Pinisi/1-Pinisi depan.avif',
            hoverImage: '/img/Pinisi/3-Pinisi Dalam.avif',
            images: [
                '/img/Pinisi/1-Pinisi depan.avif',
                '/img/Pinisi/2-Pinisi teras.avif',
                '/img/Pinisi/3-Pinisi Dalam.avif',
                '/img/Pinisi/4-Pinisi Dapur.avif',
                '/img/Pinisi/5-Pinisi Lahan.avif',
                '/img/Pinisi/6-Pinisi kamar.avif',
                '/img/Pinisi/7-Pinisi tangga.avif',
                '/img/Pinisi/8-Pinisi WC.avif',
                '/img/Pinisi/9-Pinisi kamar atas.avif',
                '/img/Pinisi/10-Pinisi balkon.avif',
            ],
            videoLink: 'https://vt.tiktok.com/ZS5sCatUq/',
            specs: {
                luas: 'LT 6x13 | LB 85 m²',
                bedrooms: '3 Kamar Tidur',
                bathrooms: '3 Kamar Mandi',
                garage: 'Garasi Luas',
            },
            features: ['Taman + Lahan Kosong', 'Bebas Banjir', 'Westafel Tersedia'],
            pricing: {
                price: 'Rp 850.000.000',
                dp: 'Rp 85.000.000',
                installment15: 'Rp 5.900.000/bulan',
            }
        },
        {
            id: 3,
            name: 'Edelweiss Type 112',
            image: '/img/Edelweiss/1-Edelweiss depan.avif',
            hoverImage: '/img/Edelweiss/2-Edelweiss dalam.avif',
            images: [
                '/img/Edelweiss/1-Edelweiss depan.avif',
                '/img/Edelweiss/2-Edelweiss dalam.avif',
                '/img/Edelweiss/3-Edelweiss dapur.avif',
                '/img/Edelweiss/4-Edelweiss lahan.avif',
                '/img/Edelweiss/5-Edelweiss Kamar.avif',
                '/img/Edelweiss/6-Edelweiss WC.avif',
                '/img/Edelweiss/7-Edelweiss tangga.avif',
                '/img/Edelweiss/8-Edelweiss atas tangga.avif',
                '/img/Edelweiss/9-Edelweiss kamar atas.avif',
            ],
            videoLink: 'https://vt.tiktok.com/ZS5KoDYeo/',
            specs: {
                luas: 'LT 9x15 | LB 112 m²',
                bedrooms: '3 Kamar Mandi',
                bathrooms: '3 Kamar Tidur',
                garage: 'Garasi Luas',
            },
            features: ['Taman Depan & Belakang', 'Tanah Sangat Luas', 'Premium Design'],
            pricing: {
                price: 'Rp 1.200.000.000',
                dp: 'Rp 120.000.000',
                installment15: 'Rp 7.300.000/bulan',
            }
        }
    ];

    return (
        <div id="katalog" className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16" data-aos="fade-up">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Pilihan Tipe Rumah Kami
                    </h2>
                    <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                        Temukan desain yang sesuai dengan gaya hidup Anda, dari minimalis modern hingga premium family home.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {products.map((product, index) => (
                        <div key={product.id} data-aos="fade-up" data-aos-delay={index * 100}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
