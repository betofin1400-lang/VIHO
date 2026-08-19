---
name: feat-landing-page
description: Playbook para la landing page de VIHO Arquitectura. One-page dark/elegant con Portafolio, Servicios, Sobre mí y Contacto.
---

# Playbook — feat-landing-page

## Tipo
**Feature** — Funcionalidad nueva (landing page completa)

## Complejidad
**Media-Alta** — 10 criterios de aceptación, 38 casos de prueba, 7 componentes nuevos

## Stack
- Next.js 16 + React 19
- Tailwind CSS 4
- TypeScript
- Google Fonts (Inter o Montserrat)

## Fases

### Fase 1: Análisis (completada)
- [x] HU escrita con 10 CA
- [x] Contexto de negocio documentado
- [x] Patrones seleccionados (front/01, front/03, arquitectura-general)
- [x] 38 casos de prueba definidos
- [ ] **PENDIENTE:** Respuestas a 8 preguntas abiertas del cliente

### Fase 2: Diseño
- [ ] Crear estructura de componentes en `src/app/components/landing/`
- [ ] Crear página en `src/app/landing/page.tsx`
- [ ] Definir layout responsive (desktop → tablet → mobile)
- [ ] Seleccionar tipografía (Inter o Montserrat)
- [ ] Definir espaciados y tamaños

### Fase 3: Implementación
- [ ] **3.1** Crear componente `Nav.tsx` (sticky, blur, dorado)
- [ ] **3.2** Crear componente `Hero.tsx` (full-screen, imagen bg, CTA)
- [ ] **3.3** Crear componente `Portafolio.tsx` (grid responsive, hover effects)
- [ ] **3.4** Crear componente `Servicios.tsx` (grid 2x2, íconos dorados)
- [ ] **3.5** Crear componente `SobreMi.tsx` (layout 2 columnas)
- [ ] **3.6** Crear componente `Contacto.tsx` (form + datos)
- [ ] **3.7** Crear componente `Footer.tsx` (copyright, redes)
- [ ] **3.8** Crear `landing/page.tsx` que ensambla todos los componentes
- [ ] **3.9** Implementar scroll suave con Intersection Observer
- [ ] **3.10** Agregar lazy loading en imágenes

### Fase 4: Verificación
- [ ] Ejecutar `npm run lint` → debe pasar sin errores
- [ ] Ejecutar `npm run build` → debe compilar correctamente
- [ ] Verificar responsive en desktop, tablet y móvil
- [ ] Verificar colores de marca en todas las secciones
- [ ] Verificar que el botón "Cotizar" lleva al wizard (/)

### Fase 5: Cierre
- [ ] Actualizar `progreso.md` con estado final
- [ ] Commit siguiendo convención del proyecto
- [ ] Proponer patrones nuevos si los hay
- [ ] Regenerar sitio del centro

## Puertas de calidad

| Puerta | Gate |
|--------|------|
| **Fase 2 → 3** | Layout aprobado, componentes definidos |
| **Fase 3 → 4** | Todos los componentes creados, `npm run build` pasa |
| **Fase 4 → 5** | Todos los CA verificados, sin errores de lint |

## Configuración del item

```yaml
item: feat-landing-page
workspace: producto
tipo: feature
complejidad: media-alta
rama: feat/landing-page
base: master
```

## Patrones aplicables

| Patrón | Cuándo cargar |
|--------|---------------|
| `front/01-paleta-marca-viho.md` | Siempre — colores de marca |
| `front/03-flujo-conversacion-agente.md` | Al implementar el nav (botón Cotizar) |
| `arquitectura-general.md` | Siempre — stack y estructura |

## Notas de implementación

1. **NO MODIFICAR** `src/app/page.tsx` (wizard existente)
2. La landing va en una ruta separada: `/landing`
3. El botón "Cotizar" del nav redirige a `/` (wizard)
4. Usar placeholder images hasta que el cliente provea fotos
5. El formulario es solo visual (sin backend por ahora)
6. Seguir la paleta de marca: #0E2B1D, #DEA71A, #E1CB82, #ADC2AF, #CCCBCD
