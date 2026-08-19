'use client';

import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Users, Mail, Calendar, ArrowLeft, Download, Trash2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { loadLeads, type Lead } from '../components/agent/useChat';

const ADMIN_PASSWORD = 'viho2026';
const ADMIN_AUTH_KEY = 'viho_admin_auth';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if already authenticated
  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_AUTH_KEY);
    if (stored === 'authenticated') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Load leads when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const loadedLeads = loadLeads();
      setLeads(loadedLeads.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem(ADMIN_AUTH_KEY, 'authenticated');
      setAuthError(false);
    } else {
      setAuthError(true);
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(ADMIN_AUTH_KEY);
    setPassword('');
    setSelectedLead(null);
  };

  const handleDeleteLead = (leadId: string) => {
    if (confirm('¿Estás seguro de eliminar este lead?')) {
      const updatedLeads = leads.filter(l => l.id !== leadId);
      setLeads(updatedLeads);
      localStorage.setItem('viho_leads', JSON.stringify(updatedLeads));
      if (selectedLead?.id === leadId) {
        setSelectedLead(null);
      }
    }
  };

  const handleClearAllLeads = () => {
    if (confirm('¿Estás seguro de eliminar TODOS los leads? Esta acción no se puede deshacer.')) {
      setLeads([]);
      localStorage.removeItem('viho_leads');
      setSelectedLead(null);
    }
  };

  const handleExportLeads = () => {
    const dataStr = JSON.stringify(leads, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `viho-leads-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0E2B1D] flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0E2B1D] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-[#CCCBCD]/60 hover:text-white transition-colors mb-6">
              <ArrowLeft size={16} />
              <span>Volver al sitio</span>
            </Link>
            <div className="w-16 h-16 rounded-full bg-[#DEA71A]/20 flex items-center justify-center mx-auto mb-4 border border-[#DEA71A]/30">
              <Lock size={24} className="text-[#DEA71A]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Panel de Administración</h1>
            <p className="text-[#CCCBCD]/60">VIHO Arquitectura · Leads</p>
          </div>

          <form onSubmit={handleLogin} className="bg-[#1A1A1A] rounded-2xl border border-white/10 p-6">
            <div className="mb-4">
              <label className="block text-[#CCCBCD]/60 text-sm mb-2">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#2A2A2A] border border-white/10 rounded-xl px-4 py-3 text-white pr-12 focus:outline-none focus:border-[#DEA71A]/50 transition-colors"
                  placeholder="Ingresa la contraseña"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#CCCBCD]/60 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                Contraseña incorrecta. Intenta de nuevo.
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#DEA71A] hover:bg-[#E1CB82] text-black font-semibold rounded-xl py-3 transition-colors"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-[#0E2B1D]">
      {/* Header */}
      <header className="bg-[#1A1A1A] border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              <ArrowLeft size={20} className="text-white" />
            </Link>
            <div>
              <h1 className="text-white font-semibold text-lg">Panel de Administración</h1>
              <p className="text-[#CCCBCD]/60 text-sm">VIHO Arquitectura · {leads.length} leads capturados</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const loadedLeads = loadLeads();
                setLeads(loadedLeads.sort((a, b) => 
                  new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                ));
              }}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              title="Recargar leads"
            >
              <RefreshCw size={18} className="text-white" />
            </button>
            <button
              onClick={handleExportLeads}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              title="Exportar leads"
            >
              <Download size={18} className="text-white" />
            </button>
            <button
              onClick={handleClearAllLeads}
              className="w-10 h-10 rounded-full bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors"
              title="Eliminar todos los leads"
            >
              <Trash2 size={18} className="text-red-400" />
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto p-6">
        {leads.length === 0 ? (
          <div className="text-center py-20">
            <Users size={48} className="text-[#CCCBCD]/20 mx-auto mb-4" />
            <h2 className="text-white text-xl font-semibold mb-2">No hay leads aún</h2>
            <p className="text-[#CCCBCD]/60">Los leads aparecerán aquí cuando los usuarios completen el chat con el asistente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leads list */}
            <div className="lg:col-span-1 space-y-3">
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Users size={18} className="text-[#DEA71A]" />
                Leads ({leads.length})
              </h2>
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedLead?.id === lead.id
                      ? 'bg-[#DEA71A]/10 border-[#DEA71A]/30'
                      : 'bg-[#1A1A1A] border-white/5 hover:bg-[#2A2A2A]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{lead.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLead(lead.id);
                      }}
                      className="text-[#CCCBCD]/40 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-[#CCCBCD]/60 text-xs mb-1">
                    <Mail size={12} />
                    <span>{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#CCCBCD]/60 text-xs">
                    <Calendar size={12} />
                    <span>{formatDate(lead.timestamp)}</span>
                  </div>
                  <div className="mt-2 text-xs text-[#DEA71A]">
                    {lead.projectType} · {lead.projectTypology}
                  </div>
                </div>
              ))}
            </div>

            {/* Lead detail */}
            <div className="lg:col-span-2">
              {selectedLead ? (
                <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-semibold text-lg">{selectedLead.name}</h3>
                    <span className="text-[#CCCBCD]/60 text-sm">{formatDate(selectedLead.timestamp)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#2A2A2A] rounded-xl p-4 border border-white/5">
                      <span className="text-[#CCCBCD]/60 text-xs uppercase tracking-wider">Email</span>
                      <p className="text-white mt-1">{selectedLead.email}</p>
                    </div>
                    <div className="bg-[#2A2A2A] rounded-xl p-4 border border-white/5">
                      <span className="text-[#CCCBCD]/60 text-xs uppercase tracking-wider">Tipo de Proyecto</span>
                      <p className="text-white mt-1">{selectedLead.projectType}</p>
                    </div>
                    <div className="bg-[#2A2A2A] rounded-xl p-4 border border-white/5">
                      <span className="text-[#CCCBCD]/60 text-xs uppercase tracking-wider">Tipología</span>
                      <p className="text-white mt-1">{selectedLead.projectTypology}</p>
                    </div>
                    <div className="bg-[#2A2A2A] rounded-xl p-4 border border-white/5">
                      <span className="text-[#CCCBCD]/60 text-xs uppercase tracking-wider">Área</span>
                      <p className="text-white mt-1">{selectedLead.area}</p>
                    </div>
                    <div className="bg-[#2A2A2A] rounded-xl p-4 border border-white/5">
                      <span className="text-[#CCCBCD]/60 text-xs uppercase tracking-wider">Tendencia</span>
                      <p className="text-white mt-1">{selectedLead.trend}</p>
                    </div>
                    <div className="bg-[#2A2A2A] rounded-xl p-4 border border-white/5">
                      <span className="text-[#CCCBCD]/60 text-xs uppercase tracking-wider">Presupuesto</span>
                      <p className="text-white mt-1">{selectedLead.budget}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-[#DEA71A]/20 flex items-center justify-center text-xs">📋</span>
                      Estimación del Asistente
                    </h4>
                    <div className="bg-[#2A2A2A] rounded-xl p-4 border border-white/5 text-[#CCCBCD] text-sm whitespace-pre-line">
                      {selectedLead.aiEstimation || 'No se generó estimación'}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-[#DEA71A]/20 flex items-center justify-center text-xs">💬</span>
                      Conversación Completa
                    </h4>
                    <div className="bg-[#2A2A2A] rounded-xl p-4 border border-white/5 max-h-96 overflow-y-auto space-y-3">
                      {selectedLead.fullConversation.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                              msg.sender === 'user'
                                ? 'bg-[#DEA71A]/20 text-[#DEA71A]'
                                : 'bg-[#1A1A1A] text-[#CCCBCD]'
                            }`}
                          >
                            <span className="text-xs opacity-60 block mb-1">
                              {msg.sender === 'user' ? 'Usuario' : 'Asistente'}
                            </span>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 p-12 text-center">
                  <Users size={48} className="text-[#CCCBCD]/20 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-semibold mb-2">Selecciona un lead</h3>
                  <p className="text-[#CCCBCD]/60">Haz clic en un lead de la izquierda para ver los detalles.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
