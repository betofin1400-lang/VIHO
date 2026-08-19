'use client';

import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const scrollToPortafolio = () => {
    const el = document.querySelector('#portafolio');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="inicio"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80)',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Diseñamos espacios que{' '}
          <span className="text-[#DEA71A]">transforman</span> tu hogar
        </h1>
        <p className="text-lg md:text-xl text-[#CCCBCD] mb-8 max-w-2xl mx-auto">
          Estudio de arquitectura especializado en cocinas, baños, estudios y closets en Cali.
          Creamos espacios que combinan elegancia, funcionalidad y materiales de alta calidad.
        </p>
        <button
          onClick={scrollToPortafolio}
          className="bg-[#DEA71A] hover:bg-[#E1CB82] text-black px-8 py-4 rounded font-semibold text-lg transition-colors inline-flex items-center gap-2"
        >
          Conoce nuestro trabajo
          <ChevronDown size={20} />
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown size={32} className="text-[#DEA71A]" />
      </div>
    </section>
  );
}
