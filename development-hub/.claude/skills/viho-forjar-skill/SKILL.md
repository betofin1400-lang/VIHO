---
name: viho-forjar-skill
description: Meta-skill. Dado un item de trabajo con sus requisitos en .work/<ws>/<item>/docs/, clasifica tipo y complejidad, prevalida, selecciona los patrones que aplican vía docs/index.md, escribe los casos de prueba y GENERA un playbook autosuficiente en .work/<ws>/<item>/skills/SKILL.md junto con el estado inicial. Usar al arrancar una funcionalidad.
---

# forjar-skill — el meta-skill

> **STUB — rellenar.** Es la pieza más valiosa del centro y la que más se malinterpreta. El contrato
> completo está aquí; el procedimiento con los datos de tu proyecto es lo que falta.

## La tesis

Un método genérico obliga al agente a **re-descubrir en cada funcionalidad qué patrones existen y
dónde**. El meta-skill precarga ese conocimiento por item, usando la columna «Cargar cuando…» de
`docs/index.md`. Menos deriva, más precisión.

**No desarrolla: fabrica el que desarrollará.** Compila tres cosas en un playbook: el esqueleto de
fases (el método), los patrones seleccionados (el contexto) y los parámetros del proyecto (la
configuración). Y el resultado debe ser **autosuficiente**: un item reabierto en seis meses tiene que
poder ejecutarse leyendo su propia carpeta.

## Entradas → salidas

**Entradas:** `<ws>/<item>`; los requisitos en `.work/<ws>/<item>/docs/`; `docs/index.md` y
`docs/arquitectura-general.md`; `.claude/config-proyecto.md`; el marcador; el estado de git de los
repos del workspace.

**Salidas (cinco archivos):** `skills/SKILL.md` (el playbook) · `contexto-tecnico.md` ·
`progreso.md` · `validacion-requisitos.md` (delegado) · `casos-prueba.md` (delegado).

## Los pasos

**0 · Resolver el item.** Triage por prefijo. Cuatro caminos: feature con documento → particionar
primero; feature con requisitos escritos → seguir; change/fix → basta un `.md` corto; **reapertura de
un item cerrado → no re-forjar desde cero**: reutilizar el contexto y abrir un ciclo nuevo. Sin
insumo → **pedir requisitos y detenerse**.

> Matiz que conviene preservar: una reapertura por **defecto encontrado** deja los criterios previos
> en `CUMPLE`; una por **cambio de requisito** *revoca* el cumplimiento de los criterios modificados.
> Son cosas distintas y el tablero debe distinguirlas.

**0.5 · Guardia de rama.** Resolver los repos del workspace desde el marcador → `git fetch` y rama
actual, avisando de lo pendiente **sin perderlo** → si ya se está en una rama de trabajo, usarla → si
se está en una **principal, parar y preguntar**; con autorización, actualizar la base **solo si es
avance directo** (si no lo es, **parar**: hay divergencia y ramificar encima la propaga) y crear la
rama con la convención del marcador → registrar rama y base → **capturar el autor**
(`git config user.name/email`), que alimenta la columna «autor» del tablero.

**1 · Leer.** Requisitos, contexto de negocio, arquitectura e índice.

**1.5 · Prevalidar** → `viho-validar-requisitos`. **Con bloqueantes, para.**

**2 · Triage.** Tipo y complejidad, con árbol de decisión. Trivial habilita el modo rápido; la
complejidad elige plantilla mínima o extendida; **por encima del umbral de criterios (`config §8`),
propone partir el item**.

**2.5 · Orden de trabajo.** Detectar **acoplamiento** (misma entidad, mismo endpoint, misma pantalla,
mismo estado), agrupar en clusters y secuenciarlos marcando los paralelizables. Cada cluster recorre
las cinco fases.

**3 · Seleccionar el contexto** — *la parte inteligente*:
1. Por cada requisito, identificar **qué toca**.
2. Recorrer «Cargar cuando…» y quedarse con los documentos cuyo trigger empareja, **cubriendo ambos
   lados de cada costura**.
3. Abrir cada uno y extraer su bloque «Fuente de la verdad»: esas son las **anclas de código**.
4. Escribir `contexto-tecnico.md`, **incluyendo lo descartado y por qué**.

**Calibración: 3-8 documentos. Mejor 5 que aplican de verdad que 15 «por si acaso».** Si un trigger
no empareja, fuera.

**3.5 · Casos de prueba** → `viho-casos-prueba`.

**4 · Estampar el playbook** desde `plantillas/skill-especializado.md`. Lo que lo hace útil es que
**las fases se especializan por tipo**:

| Tipo | Fase 1 | Fase 2 |
|---|---|---|
| feature | requisitos + criterios + arquitectura de componentes | plan **+ contrato entre capas campo a campo** + pruebas que FALLAN |
| change | estado actual → objetivo + no-regresión + compatibilidad | diseño archivo por archivo + reversión; las nuevas fallan, las existentes pasan |
| fix | causa raíz **con evidencia `archivo:línea`** + impacto | fix mínimo elegido entre ≥2 alternativas + prueba que **captura el defecto** |

**4.5 · Inicializar `progreso.md`** desde `plantillas/progreso.md`.

**5 · Verificar** que **no queda ningún token `{{...}}`**, **regenerar el tablero** —el item debe
aparecer desde que existe, no desde que alguien se acuerda de correr el render— y resumir.

## Reglas de oro

1. El meta-skill **fabrica, no desarrolla**.
2. El contexto sale del **dispatcher**, no de suposiciones.
3. Los parámetros salen de la configuración; el playbook **los referencia, no los duplica**.
4. Re-ejecutar **actualiza, no duplica**.
5. Si los requisitos contradicen la arquitectura, **se refuta antes de forjar**, no después.

## TODO al montar

- [ ] Escribir el árbol de triage con las señales léxicas **de tu backlog**.
- [ ] Ajustar `plantillas/skill-especializado.md`: sus tokens y los gates que tu equipo exige.
- [ ] **Rellenar `config §4` (perfiles) antes de forjar nada**: el bloque `## Rol` de la plantilla
      sale de ahí, y con la sección vacía la forja lo inventa. Vale para cualquier sección que una
      plantilla consuma, aunque la guía la marque «opcional».
- [ ] Concretar la guardia de rama contra `git` del marcador (no cablear nombres de rama aquí).
- [ ] Definir la regla de clusters: qué cuenta como acoplamiento en **tu** arquitectura.
- [ ] Decidir qué hace la reapertura y **cómo se ve en el tablero**.
