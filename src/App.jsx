import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCatalog from './components/ProductCatalog';
import KPRSimulation from './components/KPRSimulation';
import Footer from './components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
      offset: 100
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden pt-20">
      <Navbar />
      <Hero />
      <ProductCatalog />
      <KPRSimulation />
      <Footer />
    </div>
  );
}

export default App;
