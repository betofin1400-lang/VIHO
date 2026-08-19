'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Portafolio', href: '#portafolio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Sobre mí', href: '#sobre-mi' },
  { label: 'Contacto', href: '#contacto' },
];

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setIsMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/80 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => scrollTo('#inicio')} className="text-white font-bold text-xl tracking-wider">
          VIHO <span className="text-[#DEA71A]">ARQUITECTURA</span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-[#CCCBCD] hover:text-[#DEA71A] transition-colors text-sm font-medium"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('#contacto')}
            className="bg-[#DEA71A] hover:bg-[#E1CB82] text-black px-5 py-2 rounded font-semibold text-sm transition-colors"
          >
            Cotizar
          </button>
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10">
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-[#CCCBCD] hover:text-[#DEA71A] transition-colors text-left text-lg"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('#contacto')}
              className="bg-[#DEA71A] hover:bg-[#E1CB82] text-black px-5 py-3 rounded font-semibold text-center mt-2"
            >
              Cotizar
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
