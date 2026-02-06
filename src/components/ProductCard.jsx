import React, { useState } from 'react';
import ImageModal from './ImageModal';


export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group border border-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <img
            src={isHovered && product.hoverImage ? product.hoverImage : product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
          />
          <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            Unit Terbatas
          </div>

          {/* Expand Icon */}
          <div className="absolute bottom-3 right-3 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
            {product.isSold && (
              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider border border-red-200">
                Sold
              </span>
            )}
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <span className="mr-2">📐</span> Luas Tanah {product.specs.luas_tanah || product.specs.luas || '-'}
            </div>
            <div className="flex items-center">
              <span className="mr-2">🏠</span> Luas {product.specs.luas_bangunan || '-'} m²
            </div>
            <div className="flex items-center">
              <span className="mr-2">🛏️</span> {product.specs.bedrooms} Kamar Tidur
            </div>
            <div className="flex items-center">
              <span className="mr-2">🚿</span> {product.specs.bathrooms} Kamar Mandi
            </div>
          </div>

          {/* Features Chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.features.map((feature, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                {feature}
              </span>
            ))}
          </div>

          {/* Pricing Block */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-100">
            {product.pricing ? (
              <>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm text-gray-500">Harga</span>
                  <span className="text-lg font-bold text-primary">{product.pricing.price}</span>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex justify-between">
                    <span>DP 10%</span>
                    <span className="font-medium text-gray-700">{product.pricing.dp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Angsuran</span>
                    <span className="font-medium text-green-600">{product.pricing.installment15}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-2">
                <span className="text-accent font-bold text-sm">Hubungi Kami untuk Promo Spesial</span>
              </div>
            )}

            {/* Video Link Button */}
            {product.videoLink && product.videoLink !== '#' && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <a
                  href={product.videoLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center w-full px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                  Tonton Video Unit
                </a>
              </div>
            )}
          </div>


        </div>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={product.images || [product.image, product.hoverImage].filter(Boolean)} // Pass all images
        alt={product.name}
      />
    </>
  );
}
