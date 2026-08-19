import Nav from '../components/landing/Nav';
import Hero from '../components/landing/Hero';
import Portafolio from '../components/landing/Portafolio';
import Servicios from '../components/landing/Servicios';
import SobreMi from '../components/landing/SobreMi';
import Contacto from '../components/landing/Contacto';
import Footer from '../components/landing/Footer';

export const metadata = {
  title: 'VIHO Arquitectura | Diseño de Cocinas en Cali',
  description:
    'Estudio especializado en diseño y construcción de cocinas en Cali, Colombia. Creamos espacios que transforman hogares.',
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#1A1A1A]">
      <Nav />
      <Hero />
      <Portafolio />
      <Servicios />
      <SobreMi />
      <Contacto />
      <Footer />
    </main>
  );
}
