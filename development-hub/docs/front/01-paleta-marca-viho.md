---
titulo: "Paleta de marca VIHO y sistema de diseño"
tipo: "patrón"
rol: "desarrollador"
proyecto: "viho"
tags: [branding, colores, tailwind, ui]
actualizado: "2026-08-19"
fuente: "docs/referencia/VIHO_Arquitectura_Libro_de_Marca.pdf + Cotización_VIHO.pdf"
---

# Paleta de marca VIHO y sistema de diseño

## Fuente de la verdad
- `docs/referencia/VIHO_Arquitectura_Libro_de_Marca.pdf` (libro de marca oficial)
- `docs/referencia/Cotización_VIHO.pdf` (sección "Paleta de marca VIHO")
- `src/app/page.tsx` (implementación actual verificada)

## Espécimen de referencia
El wizard actual en `src/app/page.tsx` implementa esta paleta correctamente:
- Headers: `bg-[#0E2B1D]` (verde oscuro)
- Botones primarios: `bg-[#0E2B1D]` con texto blanco
- Botones de acción: `bg-[#DEA71A]` (dorado)
- Borders activos: `border-[#DEA71A]`
- Bordes inactivos: `border-[#CCCBCD]/50`
- Fondos: `bg-[#FAFAFA]`

## La paleta

| Color | Código | Hex Tailwind | Uso |
|-------|--------|-------------|-----|
| Verde oscuro | #0E2B1D | `[#0E2B1D]` | Base, fondos, títulos, headers |
| Dorado | #DEA71A | `[#DEA71A]` | Acentos, CTAs, bordes activos, progreso |
| Arena | #E1CB82 | `[#E1CB82]` | Detalles, resaltados suaves, bordes hover |
| Salvia | #ADC2AF | `[#ADC2AF]` | Fondos secundarios, iconos, divisiones |
| Gris | #CCCBCD | `[#CCCBCD]` | Texto de apoyo, placeholders, bordes inactivos |
| Blanco | #FAFAFA | `[#FAFAFA]` | Fondo principal de la app |

## Reglas para el desarrollador

1. **Nunca hardcodear colores** directamente en componentes. Usar los tokens de Tailwind o crear una constante `colors` en un archivo dedicado.
2. ** Verde oscuro** = estructura. Headers, footers, fondos de secciones, tarjetas principales.
3. ** Dorado** = acción. Botones primarios, indicadores de progreso, links activos, badges de estado.
4. ** Arena** = énfasis suave. Borders en hover, fondos de cards alternas, separadores.
5. ** Salvia** = secundario. Iconos decorativos, badges, líneas de separación sutiles.
6. ** Gris** = soporte. Labels, placeholders, texto secundario, bordes inactivos.
7. **Contraste**: verificar que el texto sobre fondos de marca tenga suficiente contraste (WCAG AA mínimo).
8. **Consistencia**: usar los mismos colores que las redes sociales de VIHO (Facebook, Instagram).

## Dónde NO se cumple
- Ninguna excepción conocida. La paleta se respeta en todo el código actual.

## Reglas al cierre
- [ ] Cualquier nuevo componente usa los tokens de color definidos
- [ ] No agregar colores nuevos sin actualizar este patrón
- [ ] Verificar contraste en fondos oscuros con texto claro
