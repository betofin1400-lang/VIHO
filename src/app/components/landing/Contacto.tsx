'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

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

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrar con backend/envío de email
    console.log('Formulario enviado:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section id="contacto" className="py-20 md:py-28 bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para tu <span className="text-[#DEA71A]">proyecto</span>?
          </h2>
          <p className="text-[#CCCBCD] max-w-2xl mx-auto">
            Cuéntanos tu idea — cocinas, baños, estudios o closets — y te ayudaremos a hacerla realidad. Agenda una cita con nuestro equipo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full bg-[#2A2A2A] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#DEA71A] transition-colors"
                  placeholder="Tu nombre"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#2A2A2A] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#DEA71A] transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full bg-[#2A2A2A] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#DEA71A] transition-colors"
                    placeholder="Tu teléfono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Mensaje
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  className="w-full bg-[#2A2A2A] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#DEA71A] transition-colors resize-none"
                  placeholder="Cuéntanos sobre tu proyecto..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#DEA71A] hover:bg-[#E1CB82] text-black font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitted ? (
                  '¡Mensaje enviado!'
                ) : (
                  <>
                    Enviar Mensaje
                    <Send size={18} />
                  </>
                )}
              </button>

              <p className="text-xs text-[#CCCBCD]/60 italic text-center">
                ⚠ PENDIENTE: Funcionalidad de envío de email por definir.
              </p>
            </form>
          </div>

          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#DEA71A]/10 flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-[#DEA71A]" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Email</h4>
                  <a
                    href="mailto:sebastianvizcaino@vihoarquitectura.co"
                    className="text-[#CCCBCD] hover:text-[#DEA71A] transition-colors"
                  >
                    sebastianvizcaino@vihoarquitectura.co
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#DEA71A]/10 flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-[#DEA71A]" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Teléfono</h4>
                  <p className="text-[#CCCBCD]/60 italic">
                    PENDIENTE: Número de teléfono por definir
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#DEA71A]/10 flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-[#DEA71A]" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Ubicación</h4>
                  <p className="text-[#CCCBCD]">Cali, Colombia</p>
                  <p className="text-[#CCCBCD]/60 text-sm italic">
                    ⚠ PENDIENTE: Dirección exacta por definir
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#DEA71A]/10 flex items-center justify-center shrink-0">
                  <InstagramIcon />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Redes Sociales</h4>
                  <div className="flex gap-4 mt-2">
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
                  <p className="text-[#CCCBCD]/60 text-sm mt-2 italic">
                    ⚠ Links por vincular
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-white/10 h-48">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.123456789!2d-76.5306!3d3.4516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMjcnMDUuOCJOIDc2wrAzMTQ5LjIiVw!5e0!3m2!1ses!2sco!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(1) invert(1) brightness(0.7)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación VIHO Arquitectura"
              />
            </div>
            <p className="text-xs text-[#CCCBCD]/60 italic text-center">
              ⚠ PENDIENTE: Mapa con ubicación real del estudio.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
