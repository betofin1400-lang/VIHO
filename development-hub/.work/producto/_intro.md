# Workspace: Producto

Este es el único workspace del proyecto VIHO Arquitectura.

**Producto:** Agente pre-cotizador de cocinas + landing page para WhatsApp.

## Qué vive aquí

Todo el trabajo de desarrollo se organiza bajo este workspace como items:
- `feat-*`: funcionalidades nuevas (motor de cálculo, agente IA, etc.)
- `change-*`: mejoras o ajustes a funcionalidad existente
- `fix-*`: correcciones de bugs

## Cómo empezar

1. Crea una rama desde `master` (o desde el ambiente del que se dependa)
2. Documenta los requisitos en `<item>/docs/`
3. Usa `/viho-forjar-skill producto/<item>` para generar el playbook
4. Desarrolla fase por fase con `/viho-desarrollar producto/<item>`

## Stack

- **Frontend:** Next.js 16 + React 19 + Tailwind 4 + shadcn/ui
- **Backend:** Next.js API routes
- **Integración:** Google Drive API (service account)
- **Despliegue:** Vercel

## Patrones relevantes

- `docs/front/01-paleta-marca-viho.md` — colores y sistema de diseño
- `docs/front/03-flujo-conversacion-agente.md` — flujo del agente
- `docs/back/02-motor-calculo-cotizacion.md` — motor de cálculo
