'use client';

import { ArrowUp } from 'lucide-react';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0E2B1D] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="text-white font-bold text-xl tracking-wider mb-4">
              VIHO <span className="text-[#DEA71A]">ARQUITECTURA</span>
            </div>
            <p className="text-[#CCCBCD] text-sm leading-relaxed">
              Estudio de arquitectura especializado en cocinas, baños, estudios y closets.
              Creamos espacios que transforman hogares.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Enlaces</h4>
            <div className="flex flex-col gap-2">
              <a href="#inicio" className="text-[#CCCBCD] hover:text-[#DEA71A] transition-colors text-sm">
                Inicio
              </a>
              <a href="#portafolio" className="text-[#CCCBCD] hover:text-[#DEA71A] transition-colors text-sm">
                Portafolio
              </a>
              <a href="#servicios" className="text-[#CCCBCD] hover:text-[#DEA71A] transition-colors text-sm">
                Servicios
              </a>
              <a href="#contacto" className="text-[#CCCBCD] hover:text-[#DEA71A] transition-colors text-sm">
                Contacto
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Síguenos</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#DEA71A]/20 transition-colors"
                title="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#DEA71A]/20 transition-colors"
                title="Facebook"
              >
                <FacebookIcon />
              </a>
            </div>
            <p className="text-[#CCCBCD]/60 text-xs mt-3 italic">
              ⚠ Links por vincular
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#CCCBCD]/60 text-sm">
            © 2026 VIHO Arquitectura. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-6">
            <a href="#" className="text-[#CCCBCD]/60 hover:text-[#DEA71A] transition-colors text-sm">
              Política de Privacidad
            </a>
            <a href="#" className="text-[#CCCBCD]/60 hover:text-[#DEA71A] transition-colors text-sm">
              Términos
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-[#DEA71A]/10 flex items-center justify-center hover:bg-[#DEA71A]/20 transition-colors"
          >
            <ArrowUp size={18} className="text-[#DEA71A]" />
          </button>
        </div>
      </div>
    </footer>
  );
}
