---
name: {{ITEM}}
description: Playbook del item {{WORKSPACE}}/{{ITEM}}. GENERADO por la forja. Lo ejecuta el runner una fase por invocación.
---

# Playbook · `{{WORKSPACE}}/{{ITEM}}`

<!--
  MOLDE DEL PLAYBOOK. La forja lo estampa resolviendo TODOS los tokens y lo escribe en
  `.work/<ws>/<item>/skills/SKILL.md`. Si al terminar queda un `{{...}}` vivo, la forja se estampó a
  medias y el runner ejecutaría instrucciones incompletas sin notarlo: el doctor lo reporta como
  FALLO, no como aviso.

  DOS PROPIEDADES QUE NO SE PUEDEN PERDER AL EDITAR ESTE MOLDE:

  1. NO ES UNA SKILL REGISTRADA. Vive fuera de `.claude/skills/`, así que el entorno no la descubre
     y no se invoca por su nombre: es un archivo de DATOS que el runner lee y ejecuta. Eso permite
     tener N playbooks vivos sin contaminar el espacio de nombres de comandos.
  2. ES AUTOSUFICIENTE. Lleva dentro lo que necesita para ejecutarse. Un item reabierto dentro de
     seis meses debe poder correr leyendo su propia carpeta, aunque el catálogo de skills haya
     cambiado. Por eso los gates van INLINE aquí y no como una referencia a otro archivo.

  Y una que sí se delega: los PARÁMETROS del proyecto se CITAN (`config §N`), no se copian. Copiarlos
  garantiza que el playbook quede desfasado en cuanto cambie un comando.
-->

## Identidad

| | |
|---|---|
| **Item** | `{{WORKSPACE}}/{{ITEM}}` |
| **Tipo** | `{{TIPO}}` · **Complejidad** {{COMPLEJIDAD}} · **Plantilla** {{PLANTILLA}} · **Modo rápido** {{RAPIDO}} |
| **Repos** | {{REPOS}} |
| **Rama** | `{{RAMA}}` desde `{{BASE}}` |
| **Autonomía** | {{AUTONOMIA}} |

**Resumen:** {{RESUMEN}}

## Anclas de verdad

- Requisitos: {{RUTAS_REQUISITOS}} — **son el denominador del porcentaje**
- Prevalidación: `validacion-requisitos.md` ({{VEREDICTO_PREVALIDACION}})
- Contexto técnico: `contexto-tecnico.md`
- Casos de prueba: `casos-prueba.md` — **no hay verificación sin casos**
- Parámetros: `.claude/config-proyecto.md` (se citan, no se copian)
- Estado: `progreso.md`

## Rol

{{ROL}}

<!-- Qué perfil asume quien ejecuta: qué conoce, qué prioriza, qué defiende. Sale de `config §4`.
     No es decoración: es lo que hace que el agente rechace un atajo que contradice un patrón. -->

## Patrones que gobiernan este item

{{PATRONES}}

<!-- Tabla `Patrón | Documento | Por qué aplica | Anclas`, copiada del contexto técnico. Va aquí
     para que el playbook sea autosuficiente. -->

## Orden de trabajo

{{ORDEN_TRABAJO}}

<!-- Los clusters y su secuencia, si el item tiene varios requisitos acoplados. Cada cluster recorre
     las cinco fases. En un item de un solo requisito: «un solo bloque». -->

## Fases

{{FASES}}

<!--
  LAS FASES SE ESPECIALIZAN POR TIPO. Es lo que hace que el playbook sirva de algo; un esqueleto
  genérico de cinco fases no aporta nada que el runner no sepa ya.

  feature → Fase 1: requisitos, criterios y arquitectura de componentes.
            Fase 2: plan + CONTRATO ENTRE CAPAS campo a campo + pruebas que FALLAN.
  change  → Fase 1: estado actual → estado objetivo, no-regresión, compatibilidad.
            Fase 2: diseño archivo por archivo (actual vs nuevo) + reversión;
                    las pruebas nuevas fallan y las existentes siguen pasando.
  fix     → Fase 1: causa raíz CON EVIDENCIA `archivo:línea` + impacto (¿el mismo defecto en otros
                    sitios? medirlo aunque quede fuera de alcance).
            Fase 2: fix mínimo elegido entre ≥2 alternativas + prueba que CAPTURA el defecto
                    (falla antes del fix).

  Fases 3, 4 y 5 son iguales para los tres tipos.
-->

## Gates que aplican en todas las fases

<!-- INLINE a propósito: son lo que hace autosuficiente al playbook. -->

- **Pruebas primero.** En diseño deben **fallar**, citando la salida; en implementación, pasar.
- **Evidencia.** Nunca afirmar «pasa» sin correr el comando real (`config §3`) y **citar la línea**.
- **Guarda de alcance.** Al terminar la implementación, contrastar `git diff --name-only` con los
  archivos del plan. Lo que sobre: se justifica por escrito o se revierte.
- **Cobertura del 100 % de los casos** en verificación, con reporte
  `total | ejecutados | verdes | rojos | no ejecutados (motivo)`. Un caso no corrido es un hueco.
- **Integridad de la prueba.** Un verde cuenta solo si se pone rojo al revertir el cambio **por el
  camino real** y no tiene aserciones que no puedan fallar.
- **Verificación binaria por criterio:** `CUMPLE` o `NO`. No existe «casi».
- **Reutilización.** Antes de crear algo, mirar si otro item o el código ya lo tienen.
- **Paralelizar** con ≥3 pasos independientes; **esperar** lo que produce evidencia.
- **Criterio técnico** (`config §17`). Si el requisito contradice un patrón, **se refuta con la cita
  antes de construir**. No se implementa una contradicción por obediencia ni se resuelve por cuenta
  propia: se expone.
- **Autorevisión del diff** antes del commit, con ojo de revisor **y no de criterio**.
- **Cierre** con commit según `config §5` y aprendizaje según `config §9`.

## Reglas propias de este proyecto

{{REGLAS_PROYECTO}}

<!-- Las invariantes que este item debe respetar y que no están en ningún patrón: reglas de negocio,
     restricciones de datos, consumidores externos que no se pueden romper.
     SI NO HAY NINGUNA, SE DEJA VACÍO. Un bloque heredado de otro proyecto es la forma más silenciosa
     de aplicar reglas ajenas con total seguridad. -->
