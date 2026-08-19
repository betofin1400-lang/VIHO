'use client';

export default function SobreMi() {
  return (
    <section id="sobre-mi" className="py-20 md:py-28 bg-[#0E2B1D]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-xl overflow-hidden bg-[#2A2A2A] border border-white/10">
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-32 h-32 rounded-full bg-[#DEA71A]/20 flex items-center justify-center mb-6">
                  <span className="text-5xl font-bold text-[#DEA71A]">SV</span>
                </div>
                <p className="text-[#CCCBCD] text-sm">
                  PENDIENTE: Imagen del cliente
                </p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-[#DEA71A]/30 rounded-xl -z-10" />
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Sobre <span className="text-[#DEA71A]">mí</span>
            </h2>
            <div className="w-16 h-1 bg-[#DEA71A] mb-8" />

            <h3 className="text-xl font-semibold text-white mb-1">
              Sebastián Vizcaíno Hoyos
            </h3>
            <p className="text-[#DEA71A] mb-6">Arquitecto y Fundador</p>

            <div className="space-y-4 text-[#CCCBCD] leading-relaxed">
              <p>
                Con experiencia en diseño de interiores y arquitectura, fundé VIHO con la visión de
                crear espacios que no solo sean hermosos, sino que transformen la experiencia de habitar
                un hogar — cocinas, baños, estudios y closets.
              </p>
              <p>
                Mi enfoque combina diseño contemporáneo con materiales de alta calidad y un servicio
                integral. Cada proyecto es una oportunidad para crear ambientes que reflejen la esencia
                de quienes los habitan.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-[#DEA71A]">+50</div>
                <div className="text-sm text-[#CCCBCD]">Proyectos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#DEA71A]">+5</div>
                <div className="text-sm text-[#CCCBCD]">Años exp.</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#DEA71A]">100%</div>
                <div className="text-sm text-[#CCCBCD]">Compromiso</div>
              </div>
            </div>

            <p className="mt-8 text-xs text-[#CCCBCD]/60 italic">
              ⚠ PENDIENTE: Biografía completa sujeta a revisión del cliente.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
