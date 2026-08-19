# CLAUDE.md — VIHO Arquitectura

## Regla obligatoria: Centro de Desarrollo

**Todo desarrollo en este proyecto DEBE seguir el flujo del centro de desarrollo.**

El centro de desarrollo vive en `development-hub/` y es la fuente de verdad para:
- Patrones técnicos (`docs/`)
- Flujo de trabajo (`.work/`)
- Skills del pipeline (`.claude/skills/viho-*`)

### Flujo obligatorio

```
1. /viho-forjar-skill producto/<item>     -> prevalida, selecciona patrones, genera playbook
2. /viho-desarrollar producto/<item>       -> ejecuta fase a fase con memoria de resume
3. /viho-centro-doctor                     -> verificación de integridad
```

### Sitio del centro

Abrir con doble clic (cero red, cero servidor):
```
file:///home/samontoya/Projects/agente_arquitectura/development-hub/centro-desarrollo/index.html
```

Regenerar el sitio:
```bash
python3 development-hub/.claude/skills/viho-sitio/render.py development-hub
```

### Stack
- **Frontend:** Next.js 16 + React 19 + Tailwind 4 + shadcn/ui
- **Backend:** Next.js API routes
- **Integración:** Google Drive API (service account)
- **Despliegue:** Vercel

### Comandos del proyecto
```bash
npm run dev          # desarrollo local
npm run build        # build de producción
npm run lint         # verificación de código
```

### Colores de marca
- Verde oscuro: `#0E2B1D`
- Dorado: `#DEA71A`
- Arena: `#E1CB82`
- Salvia: `#ADC2AF`
- Gris: `#CCCBCD`
