import React, { useContext } from 'react';
import { DataContext } from '../App';
import ProductCard from './ProductCard';

export default function ProductCatalog() {
    const { data } = useContext(DataContext);
    const estates = data?.catalog?.estates || [];
    const rawHouses = data?.catalog?.houses || [];

    const products = rawHouses.map(h => {
        const estate = estates.find(e => e.id === h.housing_estate_id);

        // Simple heuristic for DP formatting if price is a string number
        const priceNum = parseInt((h.price || '0').replace(/\D/g, '')) || 0;
        const dpVal = priceNum * 0.1;
        const fmt = (n) => 'Rp ' + n.toLocaleString('id-ID');

        return {
            id: h.id,
            name: h.name,
            estateId: h.housing_estate_id,
            estateName: estate ? estate.name : 'Lainnya',
            image: h.images && h.images.length > 0 ? h.images[0] : '/img/placeholder.png', // Fallback
            hoverImage: h.images && h.images.length > 1 ? h.images[1] : (h.images?.[0] || '/img/placeholder.png'),
            images: h.images || [],
            videoLink: h.video_link || '#',
            specs: h.specs || { luas_tanah: '-', luas_bangunan: '-', bedrooms: '-', bathrooms: '-', garage: '-' },
            features: h.features || [],
            pricing: {
                price: h.price || 'Hubungi Kami',
                dp: dpVal ? fmt(dpVal) : 'N.A',
                installment15: 'Hubungi Marketing',
            }
        };
    });

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

                {products.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">Data properti belum tersedia.</div>
                ) : (
                    <div className="space-y-16">
                        {estates.map(estate => {
                            const estateProducts = products.filter(p => p.estateId === estate.id);
                            if (estateProducts.length === 0) return null;

                            return (
                                <div key={estate.id} data-aos="fade-up">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-indigo-600 pl-4">
                                        {estate.name}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                        {estateProducts.map((product, index) => (
                                            <div key={product.id} data-aos="fade-up" data-aos-delay={index * 100}>
                                                <ProductCard product={product} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Handle products with no estate or invalid estate */}
                        {products.filter(p => !p.estateId || !estates.find(e => e.id === p.estateId)).length > 0 && (
                            <div data-aos="fade-up">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-gray-600 pl-4">
                                    Lainnya
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    {products.filter(p => !p.estateId || !estates.find(e => e.id === p.estateId)).map((product, index) => (
                                        <div key={product.id} data-aos="fade-up" data-aos-delay={index * 100}>
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
