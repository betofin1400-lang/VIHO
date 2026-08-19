# Contexto Técnico — feat-landing-page

## Patrones seleccionados

| Doc | Por qué aplica |
|-----|----------------|
| `docs/front/01-paleta-marca-viho.md` | La landing usa la paleta de marca: fondos oscuros, dorado para CTAs, tipografía definida |
| `docs/front/03-flujo-conversacion-agente.md` | El botón "Cotizar" del nav lleva al wizard existente |
| `docs/arquitectura-general.md` | Stack Next.js 16 + React 19 + Tailwind 4, estructura del proyecto |

## Patrones descartados

| Doc | Por qué NO aplica |
|-----|-------------------|
| `docs/back/02-motor-calculo-cotizacion.md` | La landing no implementa el motor de cálculo, solo enlaza al wizard |

## Anclas de código

| Ancla | Archivo | Línea |
|-------|---------|-------|
| Wizard actual | `src/app/page.tsx` | Todo el archivo (no modificar) |
| Estilos globales | `src/app/globals.css` | Configuración de Tailwind |
| API Google Drive | `src/app/api/generate-workspace/route.ts` | No modificar |

## Decisiones técnicas

1. **Componentes:** Crear componentes separados por sección (Hero, Nav, Portafolio, Servicios, SobreMí, Contacto, Footer)
2. **Estilos:** Usar Tailwind CSS con la paleta de marca definida
3. **Imágenes:** Usar placeholder images temporalmente hasta que el cliente provea fotos reales
4. **Formulario:** Implementar con estado local (sin backend por ahora)
5. **Navegación:** Scroll suave entre secciones con intersection observer
6. **Responsive:** Mobile-first pero optimizado para desktop/tablet

## Estructura de componentes propuesta

```
src/app/
├── page.tsx                    (wizard existente - NO MODIFICAR)
├── landing/
│   └── page.tsx                (nueva landing page)
├── components/
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── Nav.tsx
│   │   ├── Portafolio.tsx
│   │   ├── Servicios.tsx
│   │   ├── SobreMi.tsx
│   │   ├── Contacto.tsx
│   │   └── Footer.tsx
│   └── ui/                     (componentes compartidos)
└── globals.css
```
