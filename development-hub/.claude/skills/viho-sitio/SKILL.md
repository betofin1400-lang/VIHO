---
name: viho-sitio
description: Genera el sitio completo del centro de desarrollo (portada, patrones, skills, páginas narrativas y bitácora por workspace) a partir del marcador, docs/ y .work/. Determinista, sin dependencias, sin red y sin modelo. Se ejecuta inline tras cada cierre de fase y cuando se quiera refrescar el tablero.
---

# sitio — el generador del centro

> **Ya funciona tal cual**: el trabajo lo hace `render.py`. La skill solo lo ejecuta e
> interpreta su salida. No hay nada que escribir para que el sitio salga.

> **Si el proyecto le pone prefijo a sus skills** —porque comparte `~/.claude/skills/` con otro
> centro— esta se llamará `{{PREFIJO}}-sitio`, y hay que renombrar el directorio, el `name:` del
> frontmatter, la entrada de `doctor.skills_requeridas` en el marcador y las rutas de abajo. El
> prefijo es una decisión del proyecto que monta el centro, no del esqueleto.

## Uso

```bash
python3 <HUB>/.claude/skills/sitio/render.py            # regenera el sitio ENTERO
python3 <HUB>/.claude/skills/sitio/render.py <ruta>     # indicando el centro
```

**Un solo comando y un solo generador.** Escribe en `paths.sitio` del marcador (por defecto
`centro-desarrollo/`), que **borra y regenera** completo: el sitio es 100 % desechable, así que
no quedan huérfanos de workspaces, items o páginas que ya no existen.

Se abre con doble clic (`file://`). **Cero red, cero dependencias, cero servidor, cero tokens.**

## Cómo está partido por dentro

| Archivo | Qué hace |
|---|---|
| `render.py` | **El único punto de entrada.** Resuelve el centro, deriva la navegación, arma el envoltorio común de toda página, genera portada/patrones/skills, publica las narrativas que existan, escribe el kit y `js/nav-data.js`. |
| `bitacora_render.py` | **Biblioteca, no comando.** Solo el cuerpo de las páginas de avances (panorama + una por workspace) en sus dos gemelos `.html` y `.md`. Ejecutarlo directo falla con código 2 y apunta a `render.py`. |
| `plantillas/styles.css` | Kit visual. **Todo el color de marca vive en el bloque `:root` de arriba**; fuera de ahí no hay un solo hex. |
| `plantillas/nav.js` | Motor de pintado del sidebar y del header compacto. **No conoce ni el proyecto, ni las páginas, ni los conteos.** |
| `plantillas/bitacora.js` | Buscador, filtros, paginación y filas de detalle de las tablas. |
| `plantillas/_pagina.md` | Esqueleto para escribir una página narrativa nueva en `paginas/`. |

En el centro donde se estrenó este esqueleto llegó a haber **dos generadores que se pisaban** el
mismo `avances-<ws>.html` con dos kits visuales distintos; ganaba el último en correr. Se
fusionaron, y la decisión con su porqué está en la cabecera de `render.py`. **La regla que queda:
un solo punto de entrada y un solo kit.** Si vuelve a haber dos, el sitio vuelve a partirse en dos.

## Qué páginas genera

| Página | De dónde sale | ¿Siempre? |
|---|---|---|
| `index` | marcador + conteos del disco, con la narrativa de `paginas/index.md` si existe | sí |
| `patrones` | `docs/index.md` + conteo por slice | sí |
| `skills` | frontmatter de cada `.claude/skills/*/SKILL.md` | sí |
| `avances` (panorama) | agregados de todos los workspaces | sí |
| `avances-<ws>` **una por workspace** | `.work/<ws>/*/progreso.md` + `.work/<ws>/_intro.md` | una por workspace del marcador |
| `onboarding` · `arquitectura` · `metodologia` · `e2e` | `paginas/<id>.md` (con respaldo declarado para `arquitectura`) | **solo si existe su markdown** |

Cada página de avances se escribe además como `.md` gemelo, que es la proyección legible que leen
otros agentes sin abrir un navegador.

**El total no es fijo**: son cuatro páginas base + una por workspace + una por narrativa escrita.

## Las reglas del generador

1. **Nada cableado.** Los workspaces salen del marcador; los conteos de patrones, skills e items
   salen del disco. Ni una lista ni un número escritos a mano — es justo lo que se queda viejo
   sin que nadie se entere.
2. **Todo se genera; ninguna página se escribe a mano.** Las explicativas se derivan de sus
   fuentes (los patrones del índice; las skills de sus frontmatter).
3. **La fuente vive fuera de la salida.** El contenido está en `.work/`, `docs/` y `paginas/`.
4. **Determinista, no generativo.** Misma entrada, misma salida; sub-segundo, cero tokens.
5. **Datos y narrativa separados, y la narrativa sin cifras.** Una narrativa con cifras se
   contradice con la tabla que está dos centímetros más abajo, y el lector deja de saber a cuál
   creerle.
6. **El generador no inventa:** si un dato no está en el estado, no aparece en la página.
7. **Ningún enlace roto, nunca.** Una página narrativa sin markdown fuente no se publica y no
   aparece en el menú; un enlace del markdown que salga del sitio se degrada a texto plano.
8. **`js/nav-data.js` es un `.js`, no un `.json`, a propósito.** El sitio se abre con `file://` y
   ahí CORS bloquea `fetch()` de un JSON local: el menú saldría vacío. Un script que asigna
   `window.CENTRO_NAV` funciona sin servidor. **No lo conviertas a JSON.**

## Las páginas narrativas

`onboarding`, `metodologia`, `arquitectura` y `e2e` se publican **si y solo si** existe
`<HUB>/paginas/<id>.md` (o su respaldo declarado: `arquitectura` cae en
`docs/arquitectura-general.md`). El esqueleto trae las cuatro **como plantilla con tokens y con el
nombre desactivado** —`_onboarding.md`, `_metodologia.md`, `_arquitectura.md`, `_e2e.md`—: se
activan quitándoles el guion bajo, y hasta entonces el render avisa por consola de cuál falta. Una
página publicada llena de huecos sin rellenar es peor que una entrada de menú menos. Ver
`paginas/README.md`.

Para añadir un `<id>` nuevo se toca **una** lista: `PAGINAS_NARRATIVAS`, en la cabecera de
`render.py`. Cada entrada declara `(id, sección, icono, rótulo, clave de respaldo)`.

## Reglas de operación

- **Nunca editar a mano una página generada**: el próximo render la pisa. Lo que se quiera
  cambiar va al estado (datos), a `_intro.md` (narrativa del tablero) o a `paginas/` (páginas).
- **Conflictos de git en páginas generadas → regenerar, no fusionar a mano.**
- El descubrimiento de items es **por presencia de `progreso.md`**. Es barato y falla en
  silencio: no distingue «esto no es un item» de «esto es un item mal formado». Por eso
  `doctor.py` reporta todo directorio de item sin estado — **no quites ese chequeo**.
- **Un workspace vacío no es un fallo.** Sale con su estado vacío explicado, no con una tabla
  con cabecera y nada debajo.
- Si el proyecto **no** va a tener sitio: borra este directorio y **decláralo en `config §10`**, o
  el runner fallará en cada cierre de fase intentando refrescar algo que no existe.

## Cuándo se regenera

**Recomendado: dentro del método, en dos puntos**, que es la vía que se rodó en el primer montaje:

1. **La forja lo ejecuta al crear el item** — así aparece en el tablero desde que existe.
2. **El runner lo ejecuta al cerrar cada fase**, inline (determinista y sub-segundo: no necesita
   subagente ni segundo plano), y con un **gate**: *una fase sin regenerar no se da por cerrada*.

**Su límite, que hay que escribir donde se lea:** lo que se edita **a mano**, fuera del método, no
dispara nada. Corre tú el render.

> **El hook del entorno se evaluó y se descartó.** Vive en la configuración global del agente —así
> que el centro deja de ser autosuficiente—, es **compartida con los demás proyectos de la máquina**
> y **falla en silencio**: un hook que no se ejecutó no se distingue de uno que sí. Si aun así lo
> pones, decláralo aquí; y si no lo pones, **no dejes ninguna casilla ni ninguna frase prometiéndolo**
> — dos archivos del centro diciendo cosas distintas sobre el refresco es peor que cualquiera de las
> dos vías.

## TODO al montar

- [ ] Ajustar la marca: **un solo bloque de color** al principio de `plantillas/styles.css`.
- [ ] Activar y escribir las páginas narrativas de `paginas/` (empezando por `onboarding`): se les
      quita el guion bajo del nombre y se rellenan sus huecos.
- [ ] Escribir `.work/_intro.md` y el `_intro.md` de cada workspace (el sitio funciona sin ellos,
      pero un tablero sin narrativa es una lista de porcentajes que no explica nada).
- [ ] Cablear el render en el método: **la forja al crear el item** y **el runner al cerrar cada
      fase**, este último como gate de cierre de fase. (Si además pones un hook del entorno, decláralo
      arriba; si no, que ningún archivo del centro lo prometa.)
- [ ] Decidir si el sitio se versiona o se ignora en git. Versionarlo permite abrirlo desde el
      repositorio sin ejecutar nada; ignorarlo evita conflictos en cada commit. **Las dos son
      defendibles; lo que no vale es no decidirlo.**
