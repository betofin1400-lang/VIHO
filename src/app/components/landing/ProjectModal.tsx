'use client';

import { X, MapPin, Calendar, Ruler } from 'lucide-react';

export interface Project {
  id: number;
  name: string;
  location: string;
  area: string;
  year: string;
  category: string;
  description: string;
  image: string;
  features: string[];
  status: string;
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div
        className="relative bg-[#1A1A1A] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white z-10"
        >
          <X size={24} />
        </button>

        <div className="relative h-64 md:h-80">
          <div
            className="absolute inset-0 bg-cover bg-center rounded-t-xl"
            style={{ backgroundImage: `url(${project.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent" />
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#DEA71A]/20 text-[#DEA71A] text-xs font-semibold px-3 py-1 rounded-full">
              {project.category}
            </span>
            <span className="bg-white/10 text-[#CCCBCD] text-xs font-semibold px-3 py-1 rounded-full">
              {project.status}
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {project.name}
          </h3>

          <div className="flex flex-wrap gap-4 mb-6 text-sm text-[#CCCBCD]">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-[#DEA71A]" />
              {project.location}
            </div>
            <div className="flex items-center gap-2">
              <Ruler size={16} className="text-[#DEA71A]" />
              {project.area}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#DEA71A]" />
              {project.year}
            </div>
          </div>

          <p className="text-[#CCCBCD] leading-relaxed mb-6">
            {project.description}
          </p>

          <div>
            <h4 className="text-white font-semibold mb-3">Características</h4>
            <div className="grid grid-cols-2 gap-2">
              {project.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm text-[#CCCBCD]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#DEA71A]" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
