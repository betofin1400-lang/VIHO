'use client';

import FloatingChat from '../components/agent/FloatingChat';

export default function AgentePage() {
  return (
    <div className="min-h-screen bg-[#0E2B1D]">
      {/* Placeholder content to simulate landing */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-white mb-6">
          VIHO <span className="text-[#DEA71A]">Arquitectura</span>
        </h1>
        <p className="text-[#CCCBCD] text-lg mb-8 max-w-2xl">
          Explora nuestra landing y prueba el botón flotante de cotización.
          Haz clic en el ícono de chat en la esquina inferior derecha.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {['Cocinas', 'Baños', 'Estudios', 'Closets'].map((tipo) => (
            <div
              key={tipo}
              className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6 hover:border-[#DEA71A]/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-[#DEA71A]/10 flex items-center justify-center mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-white font-semibold mb-2">{tipo}</h3>
              <p className="text-[#CCCBCD]/60 text-sm">
                Diseño personalizado con materiales de alta calidad.
              </p>
            </div>
          ))}
        </div>

        <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">Prototipo: Chat Flotante (FAB + Modal)</h2>
          <p className="text-[#CCCBCD]/60 text-sm mb-4">
            Esta página simula la landing. El botón flotante en la esquina inferior derecha abre un chat
            modal con el flujo de pre-cotización mock.
          </p>
          <ul className="text-[#CCCBCD]/60 text-sm space-y-1">
            <li>✅ Botón flotante (FAB) con indicador de nuevo mensaje</li>
            <li>✅ Modal de chat con header, burbujas e input</li>
            <li>✅ Flujo mock: tipo → tipología → medidas → tendencia → presupuesto</li>
            <li>✅ Opciones como botones clickeables</li>
            <li>✅ Mensaje de cierre con rango de precio simulado</li>
            <li>⚠ Sin modelo de IA real — respuestas predefinidas</li>
          </ul>
        </div>
      </div>

      <FloatingChat />
    </div>
  );
}
