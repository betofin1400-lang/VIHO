# Centro de desarrollo — VIHO Arquitectura

Este directorio es el **centro de desarrollo** de VIHO Arquitectura: la infraestructura de documentación
y método que hace que desarrollar con agentes sea repetible, auditable y acumulativo.

Todo son archivos de texto versionados en git. **Cero base de datos, cero servidor, cero servicio
externo**: el estado del proyecto viaja en el mismo commit que el código.

---

## 1. Las cuatro piezas

| Pieza | Qué es |
|---|---|
| `docs/` | **El insumo.** La biblioteca de patrones técnicos, indexada por `docs/index.md`, que dice *cuándo* cargar cada uno. |
| `.work/` | **El trabajo.** Un workspace (`producto/`) con funcionalidades organizadas como items. |
| `.claude/skills/` | **El método.** Los 11 procedimientos del pipeline (viho-centro, viho-forjar-skill, viho-desarrollar, etc.). |

## 2. Archivos que mandan

| Archivo | Qué decide |
|---|---|
| `.centro-desarrollo.json` | Dónde está todo: repos, workspaces, skills, slices. |
| `.claude/config-proyecto.md` | Cómo se trabaja: stack, comandos, ramas, reglas. |
| `docs/index.md` | Qué documentación se carga para cada tarea. |
| `.work/<ws>/<item>/progreso.md` | El estado real de cada funcionalidad. |

## 3. Flujo de trabajo

```
1. Crea .work/producto/<item>/docs/ y escribe ahí los requisitos.
2. /viho-forjar-skill producto/<item>     -> prevalida, selecciona patrones, genera playbook
3. /viho-desarrollar producto/<item>       -> ejecuta fase a fase, con memoria de resume
4. /viho-centro-doctor                     -> chequeo de integridad
```

`<item>` se nombra `feat-<slug>` | `change-<slug>` | `fix-<slug>`.

## 4. Puesta a punto

```bash
# 1. Instalar skills (symlinks en ~/.claude/skills/)
/viho-centro-instalar

# 2. Verificar salud del centro
/viho-centro-doctor
```

## 5. Reglas de la casa

- **Los archivos generados no se editan a mano**: el playbook de un item y las páginas del tablero.
- **Nada entra a `docs/` sin aprobación humana.** Las lecciones (`docs/lecciones.md`) sí se anexan solas.
- **Todo patrón nace con anclas de código** y con su fila en `docs/index.md` en el mismo cambio.
- **Sin evidencia ejecutada, un criterio no está cumplido.**
- **Un item ≤ 30 criterios de aceptación.**

## 6. Estado del centro

- **Skills:** 11 procedimientos (viho-centro, viho-centro-instalar, viho-centro-doctor, viho-forjar-skill, viho-desarrollar, viho-particionar-hu, viho-validar-requisitos, viho-casos-prueba, viho-verificar-docs, viho-commit, viho-pr-comments-review)
- **Patrones:** 3 (front/01-paleta-marca, back/02-motor-calculo, front/03-flujo-conversacion)
- **Workspaces:** 1 (`producto`)

## 7. Proyecto

- **Nombre:** VIHO Arquitectura
- **Stack:** Next.js 16 + React 19 + Tailwind 4 + shadcn/ui
- **Integración:** Google Drive API
- **Despliegue:** Vercel
- **Colores:** Verde #0E2B1D, Dorado #DEA71A, Arena #E1CB82, Salvia #ADC2AF, Gris #CCCBCD
