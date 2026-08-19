'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ProjectModal, { type Project } from './ProjectModal';

const allProjects: Project[] = [
  {
    id: 1,
    name: 'Cocina ALFA Cali',
    location: 'Cali, Colombia',
    area: '12 m²',
    year: '2026',
    category: 'Cocina',
    description: 'Cocina moderna con acabados en Duratex Cinza y Verde Olivo. Muebles altos y bajos con herrajes Unihopper, mesón en piedra sinterizada Altea Calcattra Royale. Diseño integral que maximiza el espacio con soluciones de almacenamiento inteligente.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    features: ['Muebles Duratex 15mm', 'Herrajes Unihopper', 'Mesón Altea', 'LED 110V', 'Instalación integral'],
    status: 'Completado',
  },
  {
    id: 2,
    name: 'Baño Suite Master',
    location: 'Cali, Colombia',
    area: '8 m²',
    year: '2026',
    category: 'Baño',
    description: 'Diseño de baño principal con acabados en porcelanato de gran formato, cabinetería flotante en material compacto HPL, ducha tipoWalk-in con cerámica antiderrapante y grifería de diseño.',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
    features: ['Porcelanato 120x60', 'Cabinetería HPL', 'Walk-in shower', 'Grifería premium'],
    status: 'Completado',
  },
  {
    id: 3,
    name: 'Estudio Home Office',
    location: 'Cali, Colombia',
    area: '10 m²',
    year: '2026',
    category: 'Estudio',
    description: 'Espacio de trabajo optimizado con escritorio integrado, estantería modular y soluciones de almacenamiento para equipo y documentos. Iluminación LED empotrada y tomas de corriente estratégicas.',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80',
    features: ['Escritorio integrado', 'Estantería modular', 'LED empotrada', 'Cable management'],
    status: 'Completado',
  },
  {
    id: 4,
    name: 'Closet Walk-in',
    location: 'Cali, Colombia',
    area: '6 m²',
    year: '2025',
    category: 'Closet',
    description: 'Walk-in closet con sistema de organizadores interiores, cajones con apertura suave, barras ajustables y espejo integral. Acabados en melamina texturizada con herrajes de alta gama.',
    image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=800&q=80',
    features: ['Organizadores interiores', 'Cajones soft-close', 'Barras ajustables', 'Espejo integral'],
    status: 'Completado',
  },
  {
    id: 5,
    name: 'Cocina Isla Central',
    location: 'Cali, Colombia',
    area: '18 m²',
    year: '2025',
    category: 'Cocina',
    description: 'Cocina amplia con isla central, diseñada para familias. Acabados en tonos neutros con acentos en dorado. Soluciones de almacenamiento para utensilios y electrodomésticos de gran formato.',
    image: 'https://images.unsplash.com/photo-1556909172-89cf0b8fdd9d?w=800&q=80',
    features: ['Isla central', 'Almacenamiento amplio', 'Tonos neutros', 'Acentos dorados'],
    status: 'Completado',
  },
  {
    id: 6,
    name: 'Baño Infantil',
    location: 'Cali, Colombia',
    area: '5 m²',
    year: '2025',
    category: 'Baño',
    description: 'Baño infantil con acabados coloridos y seguros. Piso antiderrapante, cabinetería redondeada y soluciones de almacenamiento para accesorios infantiles.',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80',
    features: ['Piso antiderrapante', 'Bordes redondeados', 'Almacenamiento infantil', 'Acabados seguros'],
    status: 'Completado',
  },
];

const INITIAL_COUNT = 3;
const LOAD_MORE_COUNT = 3;

export default function Portafolio() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const visibleProjects = allProjects.slice(0, visibleCount);
  const hasMore = visibleCount < allProjects.length;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, allProjects.length));
  };

  return (
    <section id="portafolio" className="py-20 md:py-28 bg-[#0E2B1D]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Nuestros <span className="text-[#DEA71A]">Proyectos</span>
          </h2>
          <p className="text-[#CCCBCD] max-w-2xl mx-auto">
            Cada proyecto es una historia de transformación. Mira cómo convertimos espacios en ambientes que inspiran.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProjects.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group relative h-72 rounded-xl overflow-hidden cursor-pointer text-left"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${project.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <span className="text-[#DEA71A] text-sm font-semibold mb-1">
                  {project.location}
                </span>
                <h3 className="text-white text-xl font-bold mb-2">
                  {project.name}
                </h3>
                <div className="flex items-center gap-2 text-white/60 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver detalles
                  <ArrowRight size={16} />
                </div>
              </div>
            </button>
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={loadMore}
              className="border border-[#DEA71A] text-[#DEA71A] hover:bg-[#DEA71A] hover:text-black px-8 py-3 rounded font-semibold transition-colors"
            >
              Cargar más proyectos
            </button>
          </div>
        )}
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
