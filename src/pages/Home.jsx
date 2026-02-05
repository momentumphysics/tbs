import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductCatalog from '../components/ProductCatalog';
import Footer from '../components/Footer';

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col overflow-x-hidden pt-20">
            <Navbar />
            <Hero />
            <ProductCatalog />
            <Footer />
        </div>
    );
}
