'use client';

import { useState, useEffect, KeyboardEvent } from 'react';
import { Lock, FileText, UploadCloud, CheckCircle, ArrowRight, X, Plus, Monitor, MessageSquare, LayoutTemplate } from 'lucide-react';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authInput, setAuthInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const [step, setStep] = useState(1);
  const [hasGeneratedDrive, setHasGeneratedDrive] = useState(false);
  const [driveLink, setDriveLink] = useState('#');
  const [sheetsLink, setSheetsLink] = useState('#');
  const [showVisualizerModal, setShowVisualizerModal] = useState(false);

  const [formData, setFormData] = useState({
    nombreContacto: '',
    correo: '',
    estructuraWeb: 'one-page',
    disenoResponsive: 'mobile-first',
    seccionesWeb: ['Portafolio de proyectos', 'Servicios', 'Contacto'] as string[],
    estiloVisual: '',
    referenciasVisuales: '',
    tiposProyecto: [] as string[],
    tipologiasCocina: [] as string[],
    reglasNegocio: '',
    pregunta1: '¿Qué tipo de proyecto tienes en mente?',
    pregunta2: '¿Cuál es el área aproximada en m²?',
    pregunta3: '¿Tienes ya el lote o el inmueble?',
    pregunta4: '¿Cuál es tu presupuesto estimado?',
    tipoEntregaEstimado: '',
    dominioUser: '',
    hostingUser: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const [customProyectoInput, setCustomProyectoInput] = useState('');
  const [customTipologiaInput, setCustomTipologiaInput] = useState('');
  const [showCustomProyecto, setShowCustomProyecto] = useState(false);
  const [showCustomTipologia, setShowCustomTipologia] = useState(false);

  useEffect(() => {
    const sessionStr = localStorage.getItem('viho_onboarding_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session.expiresAt && Date.now() < session.expiresAt) {
          setIsAuthenticated(true);
          if (session.hasGeneratedDrive) {
            setHasGeneratedDrive(true);
            if (session.driveLink) setDriveLink(session.driveLink);
            if (session.sheetsLink) setSheetsLink(session.sheetsLink);
            setStep(5);
          } else {
            if (session.step) setStep(session.step);
            if (session.formData) setFormData({ ...formData, ...session.formData });
          }
        } else {
          localStorage.removeItem('viho_onboarding_session');
        }
      } catch (e) {
        console.error("Error parsing session data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && isAuthenticated) {
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem('viho_onboarding_session', JSON.stringify({
        expiresAt,
        step,
        formData,
        hasGeneratedDrive,
        driveLink,
        sheetsLink
      }));
    }
  }, [isAuthenticated, isLoaded, step, formData, hasGeneratedDrive, driveLink, sheetsLink]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authInput === 'viho2026') {
      setIsCheckingStatus(true);
      try {
        const response = await fetch('/api/check-status');
        const data = await response.json();
        if (data.completed) {
          setHasGeneratedDrive(true);
          setDriveLink(data.folderLink);
          setSheetsLink(data.spreadsheetLink);
          setStep(5);
        }
      } catch (error) {
        console.error('Error checking status', error);
      } finally {
        setIsCheckingStatus(false);
        setIsAuthenticated(true);
        setAuthError(false);
      }
    } else {
      setAuthError(true);
    }
  };

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 5));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const toggleArrayItem = (field: 'tiposProyecto' | 'tipologiasCocina' | 'seccionesWeb', value: string) => {
    setFormData((prev) => {
      const current = prev[field];
      return {
        ...prev,
        [field]: current.includes(value) ? current.filter((i) => i !== value) : [...current, value]
      };
    });
  };

  const handleAddCustomTag = (field: 'tiposProyecto' | 'tipologiasCocina', value: string, resetInput: () => void, closeInput: () => void) => {
    const trimmed = value.trim();
    if (trimmed && !formData[field].includes(trimmed)) {
      setFormData(prev => ({ ...prev, [field]: [...prev[field], trimmed] }));
    }
    resetInput();
    closeInput();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, field: 'tiposProyecto' | 'tipologiasCocina', value: string, resetInput: () => void, closeInput: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomTag(field, value, resetInput, closeInput);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setApiError('');
    try {
      const response = await fetch('/api/generate-workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al conectar con Google Cloud');
      }

      setDriveLink(data.folderLink);
      setSheetsLink(data.spreadsheetLink);
      setHasGeneratedDrive(true);
      setStep(5);
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('viho_onboarding_session');
    setStep(1);
    setHasGeneratedDrive(false);
    setDriveLink('#');
    setSheetsLink('#');
    setFormData({
      nombreContacto: '',
      correo: '',
      estructuraWeb: 'one-page',
      disenoResponsive: 'mobile-first',
      seccionesWeb: ['Portafolio de proyectos', 'Servicios', 'Contacto'],
      estiloVisual: '',
      referenciasVisuales: '',
      tiposProyecto: [],
      tipologiasCocina: [],
      reglasNegocio: '',
      pregunta1: '¿Qué tipo de proyecto tienes en mente?',
      pregunta2: '¿Cuál es el área aproximada en m²?',
      pregunta3: '¿Tienes ya el lote o el inmueble?',
      pregunta4: '¿Cuál es tu presupuesto estimado?',
      tipoEntregaEstimado: '',
      dominioUser: '',
      hostingUser: '',
    });
  };

  const defaultProyectos = ['Cocinas', 'Baños', 'Salas', 'Estudios', 'Habitaciones', 'Remodelación Completa'];
  const defaultTipologias = ['Lineal', 'En L', 'Con Península', 'En Isla'];
  const defaultSecciones = ['Portafolio de proyectos', 'Sobre mí / el estudio', 'Servicios', 'Blog', 'Testimonios', 'Contacto'];
  const estilosVisuales = ['Minimalista / blanco', 'Cálido / natural', 'Oscuro / elegante', 'Colorido / vibrante', 'Industrial / concreto', 'Clásico / sobrio'];

  if (!isLoaded) return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-[#0E2B1D]">Cargando...</div>;

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-4 font-sans">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-[#0E2B1D]/5 border border-[#E1CB82]/30 p-8 text-center animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 bg-[#0E2B1D] rounded-xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-[#DEA71A]" />
          </div>
          <h1 className="text-2xl font-bold text-[#0E2B1D] tracking-tight mb-2 uppercase">VIHO Arquitectura</h1>
          <p className="text-[#0E2B1D]/70 mb-8 text-sm">Ingresa la clave de acceso para continuar con el onboarding de tu Agente Pre-cotizador.</p>
          
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <input 
                type="password" 
                placeholder="Clave de acceso"
                autoFocus
                className={`w-full px-4 py-3 rounded-lg border ${authError ? 'border-red-400 focus:ring-red-400' : 'border-[#CCCBCD]/50 focus:border-[#DEA71A] focus:ring-[#DEA71A]'} focus:ring-1 outline-none transition-all`}
                value={authInput}
                onChange={e => {setAuthInput(e.target.value); setAuthError(false);}}
                disabled={isCheckingStatus}
              />
              {authError && <p className="text-red-500 text-xs mt-1">Clave incorrecta.</p>}
            </div>
            <button 
              type="submit"
              disabled={isCheckingStatus}
              className="w-full bg-[#0E2B1D] hover:bg-[#0E2B1D]/90 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all active:scale-95 tracking-wide disabled:opacity-70"
            >
              {isCheckingStatus ? 'Verificando...' : 'Acceder al Portal'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#0E2B1D] font-sans">
      
      {/* MODAL VISUALIZADOR */}
      {showVisualizerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowVisualizerModal(false)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowVisualizerModal(false)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <X className="w-5 h-5 text-gray-700" />
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-[#0E2B1D] mb-6 text-center">Estructuras de Página Web</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* One Page Example */}
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="bg-gray-100 p-3 border-b text-center font-bold text-gray-700">One-page (Landing Page)</div>
                  <div className="p-6 bg-gray-50 flex flex-col items-center">
                    <div className="w-full max-w-[200px] space-y-2 relative">
                      <div className="w-full h-8 bg-white border border-gray-200 rounded flex justify-between px-2 items-center">
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                        <div className="flex gap-1">
                          <div className="w-4 h-1 bg-gray-300 rounded"></div>
                          <div className="w-4 h-1 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                      <div className="w-full h-24 bg-gradient-to-br from-[#0E2B1D] to-[#ADC2AF] rounded flex flex-col items-center justify-center p-2">
                        <div className="w-3/4 h-2 bg-white/30 rounded mb-1"></div>
                        <div className="w-1/2 h-2 bg-white/30 rounded"></div>
                      </div>
                      <div className="w-full bg-white border border-gray-200 rounded p-2 flex gap-2">
                        <div className="w-1/3 h-8 bg-gray-100 rounded"></div>
                        <div className="w-1/3 h-8 bg-gray-100 rounded"></div>
                        <div className="w-1/3 h-8 bg-gray-100 rounded"></div>
                      </div>
                      <div className="w-full h-20 bg-white border border-[#DEA71A] rounded p-2 flex items-center justify-center">
                        <div className="text-xs text-[#DEA71A] font-bold">Agente Pre-cotizador</div>
                      </div>
                      <div className="w-full h-8 bg-gray-800 rounded"></div>
                      <div className="absolute right-[-20px] top-10 flex flex-col items-center gap-1 opacity-50">
                        <div className="w-1 h-24 bg-gray-300 rounded-full"></div>
                        <div className="text-[10px]">Scroll</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-white text-sm text-gray-600">
                    <p className="font-semibold text-black mb-1">Ideal para conversión rápida.</p>
                    El usuario navega haciendo <em>scroll</em> hacia abajo. Todas las secciones (servicios, portafolio, cotizador) viven en una misma página larga. Excelente para celular.
                  </div>
                </div>

                {/* Multi Page Example */}
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="bg-gray-100 p-3 border-b text-center font-bold text-gray-700">Múltiples Secciones</div>
                  <div className="p-6 bg-gray-50 flex flex-col items-center">
                    <div className="w-full max-w-[200px] space-y-4 relative">
                      <div className="w-full shadow-md rounded border border-gray-300 bg-white opacity-80 scale-95 translate-y-2 absolute">
                        <div className="h-16"></div>
                      </div>
                      <div className="w-full shadow-md rounded border border-gray-300 bg-white opacity-90 scale-95 translate-y-1 absolute left-2">
                        <div className="h-16"></div>
                      </div>
                      <div className="w-full relative bg-white border border-gray-200 rounded shadow-md z-10 space-y-2 p-2">
                        <div className="w-full h-8 bg-gray-100 rounded flex justify-between px-2 items-center">
                          <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                          <div className="flex gap-1">
                            <div className="w-4 h-1 bg-[#DEA71A] rounded"></div>
                            <div className="w-4 h-1 bg-gray-400 rounded"></div>
                          </div>
                        </div>
                        <div className="w-full h-20 bg-[#0E2B1D] rounded flex flex-col items-center justify-center p-2">
                          <div className="w-3/4 h-2 bg-white/30 rounded"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <div className="h-10 bg-gray-200 rounded"></div>
                          <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-white text-sm text-gray-600 mt-[50px]">
                    <p className="font-semibold text-black mb-1">Ideal para contenido profundo.</p>
                    El usuario navega haciendo <em>clic</em> en el menú superior para ir a páginas distintas (Inicio, Portafolio, Contacto). Permite mostrar mucho más contenido detallado.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="w-full px-8 py-5 border-b border-[#E1CB82]/30 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0E2B1D] rounded-sm flex items-center justify-center text-[#DEA71A] font-bold text-xl tracking-widest">V</div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-[0.2em] leading-none uppercase">VIHO</span>
            <span className="text-[10px] tracking-widest text-[#ADC2AF] uppercase">Arquitectura</span>
          </div>
        </div>
        <div className="text-xs font-semibold tracking-widest text-[#DEA71A] uppercase border border-[#DEA71A] px-3 py-1 rounded-full hidden sm:block">
          Onboarding
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-3xl">
          
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-light tracking-tight text-[#0E2B1D] mb-3">
              {step === 1 && "Bienvenido a tu nueva experiencia digital."}
              {step === 2 && "Diseño de la Página Web."}
              {step === 3 && "Configuración del Agente de IA."}
              {step === 4 && "Accesos Técnicos."}
              {step === 5 && "Espacio de trabajo listo."}
            </h1>
            <p className="text-[#0E2B1D]/60 text-base max-w-xl mx-auto">
              {step === 1 && "Para arrancar con tu Agente Pre-cotizador y página web, necesitamos algunos insumos mínimos."}
              {step === 2 && "Dile al mundo quién eres. Definamos la estructura y el estilo visual de tu sitio."}
              {step === 3 && "Dale instrucciones al agente sobre qué proyectos ofreces y cómo calcular precios."}
              {step === 4 && "Para montar la web necesitamos conocer tus dominios. La privacidad es nuestra prioridad."}
              {step === 5 && "Hemos compartido las carpetas seguras donde vivirá tu tabla de tarifas y ejemplos de calibración."}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg shadow-[#0E2B1D]/5 overflow-hidden border border-[#E1CB82]/20 relative">
            <div className="w-full h-1.5 bg-[#FAFAFA]">
              <div className="h-full bg-[#DEA71A] transition-all duration-500 ease-out" style={{ width: `${(step / 5) * 100}%` }} />
            </div>
            
            <div className="p-8 sm:p-10">
              
              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#0E2B1D] text-lg">Tus Datos Generales</h3>
                    <div>
                      <label className="block text-sm font-medium text-[#0E2B1D]/60 mb-1.5">Nombre del Estudio / Persona</label>
                      <input 
                        type="text" 
                        placeholder="Ej. Sebastián Vizcaíno"
                        className="w-full px-4 py-3 rounded-lg border border-[#CCCBCD]/50 focus:border-[#DEA71A] focus:ring-1 focus:ring-[#DEA71A] outline-none transition-all"
                        value={formData.nombreContacto}
                        onChange={e => setFormData({...formData, nombreContacto: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0E2B1D]/60 mb-1.5">Correo de Notificaciones</label>
                      <input 
                        type="email" 
                        placeholder="tucorreo@viho.com"
                        className="w-full px-4 py-3 rounded-lg border border-[#CCCBCD]/50 focus:border-[#DEA71A] focus:ring-1 focus:ring-[#DEA71A] outline-none transition-all"
                        value={formData.correo}
                        onChange={e => setFormData({...formData, correo: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Diseño Web */}
              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-[#0E2B1D] text-lg flex items-center gap-2">
                        <LayoutTemplate className="w-5 h-5 text-[#DEA71A]" /> 1. Estructura de la Web
                      </h3>
                      <button 
                        onClick={() => setShowVisualizerModal(true)}
                        className="text-xs text-[#DEA71A] hover:text-[#c99516] underline font-medium"
                      >
                        Ver ejemplos visuales
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition-all ${formData.estructuraWeb === 'one-page' ? 'border-[#0E2B1D] bg-[#0E2B1D] text-white shadow-md' : 'border-[#CCCBCD]/50 hover:border-[#ADC2AF] bg-white'}`}>
                        <input type="radio" name="estructura" value="one-page" className="hidden" checked={formData.estructuraWeb === 'one-page'} onChange={() => setFormData({...formData, estructuraWeb: 'one-page'})} />
                        <div className="font-bold mb-1">One-page (Landing)</div>
                        <div className={`text-xs ${formData.estructuraWeb === 'one-page' ? 'text-white/70' : 'text-[#0E2B1D]/60'}`}>Todo el contenido en una sola página larga y directa.</div>
                      </label>
                      <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition-all ${formData.estructuraWeb === 'multi-page' ? 'border-[#0E2B1D] bg-[#0E2B1D] text-white shadow-md' : 'border-[#CCCBCD]/50 hover:border-[#ADC2AF] bg-white'}`}>
                        <input type="radio" name="estructura" value="multi-page" className="hidden" checked={formData.estructuraWeb === 'multi-page'} onChange={() => setFormData({...formData, estructuraWeb: 'multi-page'})} />
                        <div className="font-bold mb-1">Múltiples Secciones</div>
                        <div className={`text-xs ${formData.estructuraWeb === 'multi-page' ? 'text-white/70' : 'text-[#0E2B1D]/60'}`}>Páginas separadas para el inicio, portafolio, servicios, etc.</div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#0E2B1D] text-lg">2. Enfoque de Diseño (Responsividad)</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition-all ${formData.disenoResponsive === 'mobile-first' ? 'border-[#0E2B1D] bg-[#0E2B1D] text-white shadow-md' : 'border-[#CCCBCD]/50 hover:border-[#ADC2AF] bg-white'}`}>
                        <input type="radio" name="responsive" value="mobile-first" className="hidden" checked={formData.disenoResponsive === 'mobile-first'} onChange={() => setFormData({...formData, disenoResponsive: 'mobile-first'})} />
                        <div className="font-bold mb-1">Mobile First</div>
                        <div className={`text-xs ${formData.disenoResponsive === 'mobile-first' ? 'text-white/70' : 'text-[#0E2B1D]/60'}`}>Diseñado pensando primero en celulares (donde te verá el 70%+ de tu tráfico), adaptado a PC.</div>
                      </label>
                      <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition-all ${formData.disenoResponsive === 'desktop-first' ? 'border-[#0E2B1D] bg-[#0E2B1D] text-white shadow-md' : 'border-[#CCCBCD]/50 hover:border-[#ADC2AF] bg-white'}`}>
                        <input type="radio" name="responsive" value="desktop-first" className="hidden" checked={formData.disenoResponsive === 'desktop-first'} onChange={() => setFormData({...formData, disenoResponsive: 'desktop-first'})} />
                        <div className="font-bold mb-1">PC / Tablet First</div>
                        <div className={`text-xs ${formData.disenoResponsive === 'desktop-first' ? 'text-white/70' : 'text-[#0E2B1D]/60'}`}>Diseñado pensado primero para pantallas grandes (excelente para lucir portafolios de render), adaptado a celular.</div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#0E2B1D] text-lg">3. Secciones a incluir</h3>
                    <p className="text-sm text-[#0E2B1D]/60 -mt-2">Selecciona las secciones clave que deseas mostrar a tus clientes.</p>
                    <div className="flex flex-wrap gap-2">
                      {defaultSecciones.map(item => (
                        <label key={item} className={`flex items-center gap-2 px-3 py-2 rounded-full border cursor-pointer transition-all ${formData.seccionesWeb.includes(item) ? 'border-[#0E2B1D] bg-[#0E2B1D] text-white shadow-md' : 'border-[#CCCBCD]/50 hover:border-[#ADC2AF] text-[#0E2B1D]/70 bg-white'}`}>
                          <input type="checkbox" className="hidden" checked={formData.seccionesWeb.includes(item)} onChange={() => toggleArrayItem('seccionesWeb', item)} />
                          <span className="text-sm font-medium">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#0E2B1D] text-lg">4. Estilo Visual</h3>
                    <p className="text-sm text-[#0E2B1D]/60 -mt-2">Define la personalidad visual que mejor represente a tu marca.</p>
                    <div className="grid grid-cols-2 gap-2">
                      {estilosVisuales.map(item => (
                        <label key={item} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${formData.estiloVisual === item ? 'border-[#DEA71A] bg-[#E1CB82]/10 text-[#0E2B1D] font-bold' : 'border-[#CCCBCD]/50 hover:border-[#ADC2AF] text-[#0E2B1D]/70 bg-white'}`}>
                          <input type="radio" name="estilo" value={item} className="hidden" checked={formData.estiloVisual === item} onChange={() => setFormData({...formData, estiloVisual: item})} />
                          <span className="text-sm">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#0E2B1D]/60 mb-1.5">Referencias visuales (Webs que te gusten, links)</label>
                    <input 
                      type="text" 
                      placeholder="Ej. https://ejemplo.com, https://otro.com"
                      className="w-full px-4 py-3 rounded-lg border border-[#CCCBCD]/50 focus:border-[#DEA71A] focus:ring-1 focus:ring-[#DEA71A] outline-none transition-all"
                      value={formData.referenciasVisuales}
                      onChange={e => setFormData({...formData, referenciasVisuales: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Configuración Agente */}
              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#0E2B1D] text-lg flex items-center gap-2"><MessageSquare className="w-5 h-5 text-[#DEA71A]" /> 1. Tipos de Proyecto a Cotizar</h3>
                    <p className="text-sm text-[#0E2B1D]/60 -mt-2">Selecciona los servicios principales que ofrecerá el agente inteligente.</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set([...defaultProyectos, ...formData.tiposProyecto])).map(item => (
                        <label key={item} className={`flex items-center gap-2 px-3 py-2 rounded-full border cursor-pointer transition-all ${formData.tiposProyecto.includes(item) ? 'border-[#0E2B1D] bg-[#0E2B1D] text-white shadow-md' : 'border-[#CCCBCD]/50 hover:border-[#ADC2AF] text-[#0E2B1D]/70 bg-white'}`}>
                          <input type="checkbox" className="hidden" checked={formData.tiposProyecto.includes(item)} onChange={() => toggleArrayItem('tiposProyecto', item)} />
                          <span className="text-sm font-medium">{item}</span>
                          {formData.tiposProyecto.includes(item) && !defaultProyectos.includes(item) && (
                            <X className="w-3 h-3 hover:text-red-400" onClick={(e) => { e.preventDefault(); toggleArrayItem('tiposProyecto', item); }} />
                          )}
                        </label>
                      ))}
                      {!showCustomProyecto ? (
                        <button onClick={() => setShowCustomProyecto(true)} className="flex items-center gap-1 px-3 py-2 rounded-full border border-dashed border-[#CCCBCD] text-[#0E2B1D]/60 hover:border-[#0E2B1D] hover:text-[#0E2B1D] transition-colors text-sm font-medium">
                          <Plus className="w-4 h-4" /> Otro
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input type="text" autoFocus className="px-3 py-1.5 text-sm rounded-full border border-[#DEA71A] outline-none" placeholder="Nuevo..." value={customProyectoInput} onChange={e => setCustomProyectoInput(e.target.value)} onKeyDown={e => handleKeyDown(e, 'tiposProyecto', customProyectoInput, () => setCustomProyectoInput(''), () => setShowCustomProyecto(false))} onBlur={() => handleAddCustomTag('tiposProyecto', customProyectoInput, () => setCustomProyectoInput(''), () => setShowCustomProyecto(false))} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sub-selector para Cocinas */}
                  {formData.tiposProyecto.includes('Cocinas') && (
                    <div className="space-y-3 mt-2 ml-1 animate-in fade-in duration-300">
                      <h4 className="font-semibold text-[#0E2B1D]/80 text-sm flex items-center gap-2">
                        <span className="text-[#DEA71A]">↳</span> Tipologías de Cocina a ofrecer
                      </h4>
                      <div className="flex flex-wrap gap-2 pl-5">
                        {Array.from(new Set([...defaultTipologias, ...formData.tipologiasCocina])).map(item => (
                          <label key={item} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-all ${formData.tipologiasCocina.includes(item) ? 'border-[#0E2B1D] bg-[#0E2B1D] text-white shadow-md' : 'border-[#CCCBCD]/50 hover:border-[#ADC2AF] text-[#0E2B1D]/70 bg-white'}`}>
                            <input type="checkbox" className="hidden" checked={formData.tipologiasCocina.includes(item)} onChange={() => toggleArrayItem('tipologiasCocina', item)} />
                            <span className="text-xs font-medium">{item}</span>
                            {formData.tipologiasCocina.includes(item) && !defaultTipologias.includes(item) && (
                              <X className="w-3 h-3 hover:text-red-400" onClick={(e) => { e.preventDefault(); toggleArrayItem('tipologiasCocina', item); }} />
                            )}
                          </label>
                        ))}
                        {!showCustomTipologia ? (
                          <button onClick={() => setShowCustomTipologia(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-[#CCCBCD] text-[#0E2B1D]/60 hover:border-[#0E2B1D] hover:text-[#0E2B1D] transition-colors text-xs font-medium">
                            <Plus className="w-3 h-3" /> Otro
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <input type="text" autoFocus className="px-3 py-1 text-xs rounded-full border border-[#DEA71A] outline-none w-24" placeholder="Nuevo..." value={customTipologiaInput} onChange={e => setCustomTipologiaInput(e.target.value)} onKeyDown={e => handleKeyDown(e, 'tipologiasCocina', customTipologiaInput, () => setCustomTipologiaInput(''), () => setShowCustomTipologia(false))} onBlur={() => handleAddCustomTag('tipologiasCocina', customTipologiaInput, () => setCustomTipologiaInput(''), () => setShowCustomTipologia(false))} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#0E2B1D] text-lg">2. ¿Qué le pregunta el agente?</h3>
                    <p className="text-sm text-[#0E2B1D]/60 -mt-2">Define las 4 preguntas principales para armar la cotización. <strong className="text-[#DEA71A]">Estas son una base, pero puedes editarlas libremente.</strong></p>
                    <div className="grid gap-3">
                      <input type="text" className="w-full px-4 py-2 text-sm rounded-lg border border-[#CCCBCD]/50 focus:border-[#DEA71A] focus:ring-1 focus:ring-[#DEA71A] outline-none transition-all" value={formData.pregunta1} onChange={e => setFormData({...formData, pregunta1: e.target.value})} />
                      <input type="text" className="w-full px-4 py-2 text-sm rounded-lg border border-[#CCCBCD]/50 focus:border-[#DEA71A] focus:ring-1 focus:ring-[#DEA71A] outline-none transition-all" value={formData.pregunta2} onChange={e => setFormData({...formData, pregunta2: e.target.value})} />
                      <input type="text" className="w-full px-4 py-2 text-sm rounded-lg border border-[#CCCBCD]/50 focus:border-[#DEA71A] focus:ring-1 focus:ring-[#DEA71A] outline-none transition-all" value={formData.pregunta3} onChange={e => setFormData({...formData, pregunta3: e.target.value})} />
                      <input type="text" className="w-full px-4 py-2 text-sm rounded-lg border border-[#CCCBCD]/50 focus:border-[#DEA71A] focus:ring-1 focus:ring-[#DEA71A] outline-none transition-all" value={formData.pregunta4} onChange={e => setFormData({...formData, pregunta4: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#0E2B1D] text-lg">3. Reglas de Negocio Especiales</h3>
                    <p className="text-sm text-[#0E2B1D]/60 -mt-2">Enumera aquí tus reglas separadas por guiones. Se cargarán en una hoja de tu Excel directamente para que puedas complementarlas luego.</p>
                    <textarea 
                      placeholder="- Si la ciudad está fuera del valle, cobra 20% extra.&#10;- Si es un rediseño, cobra demolición."
                      className="w-full h-32 px-4 py-3 rounded-lg border border-[#CCCBCD]/50 focus:border-[#DEA71A] focus:ring-1 focus:ring-[#DEA71A] outline-none transition-all text-sm resize-none"
                      value={formData.reglasNegocio}
                      onChange={e => setFormData({...formData, reglasNegocio: e.target.value})}
                    />
                    <p className="text-xs text-[#0E2B1D]/60 italic">Nota: Una vez nos compartas tus documentos e información, nosotros nos encargaremos de complementar y afinar estas reglas de negocio.</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#0E2B1D] text-lg">4. ¿Qué entrega al final de la charla?</h3>
                    <p className="text-sm text-[#0E2B1D]/60 -mt-2">Por ejemplo: Generar el lead con correo, orientar al usuario con un rango de precio si la cotización lleva muchas variables, etc.</p>
                    <textarea 
                      placeholder="Ej. Si la cotización tiene muchas variables, solo entregar un estimado amplio y generar el lead para orientar al cliente conservando la información."
                      className="w-full h-24 px-4 py-3 rounded-lg border border-[#CCCBCD]/50 focus:border-[#DEA71A] focus:ring-1 focus:ring-[#DEA71A] outline-none transition-all text-sm resize-none"
                      value={formData.tipoEntregaEstimado}
                      onChange={e => setFormData({...formData, tipoEntregaEstimado: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Dominios y Accesos */}
              {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-[#E1CB82]/10 p-5 rounded-lg border border-[#E1CB82]/30 flex gap-4 items-start mb-6">
                    <Monitor className="w-6 h-6 text-[#DEA71A] mt-0.5" />
                    <div>
                      <h4 className="font-bold text-[#0E2B1D] mb-1">Publicación en tu sitio</h4>
                      <p className="text-sm text-[#0E2B1D]/70">
                        Para poder publicar la web terminada y conectar el agente, requeriremos estos datos de acceso más adelante. Si no los tienes a la mano, puedes dejarlos en blanco por ahora.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0E2B1D]/60 mb-1.5">Dominio (URL actual)</label>
                      <input 
                        type="text" 
                        placeholder="Ej. vihoarquitectura.com"
                        className="w-full px-4 py-3 rounded-lg border border-[#CCCBCD]/50 focus:border-[#DEA71A] focus:ring-1 focus:ring-[#DEA71A] outline-none transition-all"
                        value={formData.dominioUser}
                        onChange={e => setFormData({...formData, dominioUser: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0E2B1D]/60 mb-1.5">Proveedor de Hosting / DNS</label>
                      <input 
                        type="text" 
                        placeholder="Ej. Hostinger, GoDaddy, cPanel..."
                        className="w-full px-4 py-3 rounded-lg border border-[#CCCBCD]/50 focus:border-[#DEA71A] focus:ring-1 focus:ring-[#DEA71A] outline-none transition-all"
                        value={formData.hostingUser}
                        onChange={e => setFormData({...formData, hostingUser: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  {apiError && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
                      <strong>Error:</strong> {apiError}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5: Success & Drive Links */}
              {step === 5 && (
                <div className="py-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                  <div className="w-16 h-16 bg-[#0E2B1D] text-[#DEA71A] rounded-full flex items-center justify-center mb-5 shadow-lg">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#0E2B1D] mb-2">¡Espacio de Trabajo Listo!</h2>
                  <p className="text-[#0E2B1D]/70 mb-8 max-w-md">
                    Hemos procesado tus respuestas y te hemos dado acceso a las carpetas maestras.
                  </p>
                  
                  <div className="w-full space-y-3">
                    <a href={sheetsLink} target="_blank" rel="noreferrer" className="flex items-center p-4 border border-[#CCCBCD]/50 rounded-xl hover:border-[#0E2B1D] hover:shadow-md transition-all group bg-white relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#DEA71A]"></div>
                      <div className="w-10 h-10 bg-[#E1CB82]/20 text-[#DEA71A] rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-bold text-[#0E2B1D]">1. Brief y Reglas (Sheets)</div>
                        <div className="text-xs text-[#0E2B1D]/60 mt-0.5 leading-relaxed">
                          Aquí quedó guardado tu Brief vertical. También podrás configurar tus precios base y reglas de negocio.
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#0E2B1D]/60 group-hover:text-[#DEA71A] transition-colors ml-2" />
                    </a>
                    
                    <a href={driveLink} target="_blank" rel="noreferrer" className="flex items-center p-4 border border-[#CCCBCD]/50 rounded-xl hover:border-[#0E2B1D] hover:shadow-md transition-all group bg-white relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#ADC2AF]"></div>
                      <div className="w-10 h-10 bg-[#ADC2AF]/20 text-[#0E2B1D] rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform flex-shrink-0">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-bold text-[#0E2B1D]">2. Carpeta de Conocimiento (Drive)</div>
                        <div className="text-xs text-[#0E2B1D]/60 mt-0.5 leading-relaxed">
                          Sube aquí cualquier archivo relevante (Excel de valores, cotizaciones de ejemplo, PDFs, etc.) para darle más conocimiento a la IA.
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#0E2B1D]/60 group-hover:text-[#DEA71A] transition-colors ml-2" />
                    </a>
                  </div>

                </div>
              )}

              {/* Navigation Footer */}
              {step < 5 && (
                <div className="mt-10 pt-6 border-t border-[#CCCBCD]/30 flex justify-between">
                  <button
                    onClick={handlePrev}
                    className={`px-6 py-2.5 rounded-lg text-[#0E2B1D] font-medium transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'hover:bg-[#CCCBCD]/20'}`}
                  >
                    Atrás
                  </button>
                  
                  {step < 4 ? (
                    <button
                      onClick={handleNext}
                      className="px-8 py-2.5 bg-[#0E2B1D] hover:bg-[#0E2B1D]/90 text-white font-medium rounded-lg shadow-md transition-all active:scale-95 tracking-wide flex items-center gap-2"
                    >
                      Siguiente <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-8 py-2.5 bg-[#DEA71A] hover:bg-[#c99516] text-[#0E2B1D] font-bold rounded-lg shadow-md transition-all active:scale-95 tracking-wide flex items-center gap-2 disabled:opacity-70"
                    >
                      {isSubmitting ? 'Generando...' : 'Generar Espacio de Trabajo'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Footer Tecnológico */}
      <footer className="mt-auto py-4 text-center text-[#0E2B1D]/30 text-xs animate-in fade-in duration-1000">
        Creado con tecnologías modernas como React, usadas por empresas como Netflix, Facebook y Airbnb.
      </footer>
    </main>
  );
}
