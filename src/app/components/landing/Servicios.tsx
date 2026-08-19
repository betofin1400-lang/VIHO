'use client';

import { Paintbrush, Bath, BookOpen, Archive } from 'lucide-react';

const services = [
  {
    icon: Paintbrush,
    title: 'Cocinas',
    description:
      'Diseño y construcción de cocinas personalizadas. Lineales, en L, con península o en isla — cada cocina es única, diseñada a medida de tus necesidades y estilo de vida.',
  },
  {
    icon: Bath,
    title: 'Baños',
    description:
      'Transformamos baños en espacios funcionales y elegantes. Diseño integral con acabados de alta calidad que combinan estética y confort.',
  },
  {
    icon: BookOpen,
    title: 'Estudios',
    description:
      'Creamos espacios de trabajo y estudio optimizados. Diseño que potencia la productividad con soluciones de almacenamiento y iluminación inteligente.',
  },
  {
    icon: Archive,
    title: 'Closets',
    description:
      'Closets y Walk-in closets diseñados al milímetro. Soluciones de almacenamiento que aprovechan cada centímetro con acabados premium.',
  },
];

export default function Servicios() {
  return (
    <section id="servicios" className="py-20 md:py-28 bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Nuestros <span className="text-[#DEA71A]">Servicios</span>
          </h2>
          <p className="text-[#CCCBCD] max-w-2xl mx-auto">
            Diseñamos y construimos espacios integrales: cocinas, baños, estudios y closets con acabados de alta calidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="bg-[#2A2A2A] border border-white/5 rounded-xl p-8 hover:border-[#DEA71A]/30 transition-colors group"
              >
                <div className="w-14 h-14 rounded-lg bg-[#DEA71A]/10 flex items-center justify-center mb-6 group-hover:bg-[#DEA71A]/20 transition-colors">
                  <Icon size={28} className="text-[#DEA71A]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-[#CCCBCD] leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
