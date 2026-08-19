# Las skills del centro — estado del esqueleto

> **Leer esto antes que cualquier `SKILL.md` de aquí.**

## Qué trae el esqueleto y qué no

Cada directorio contiene un `SKILL.md` **stub**: frontmatter válido (para que el entorno la
descubra y para que el doctor no la marque ausente) más **el contrato de la skill** — qué recibe,
qué produce, qué gates aplica y qué reglas no puede saltarse. Lo que **no** trae es el procedimiento
paso a paso ya escrito para tu proyecto.

**Esto es deliberado, no un atajo.** Una skill es el sitio donde el método se encuentra con el
stack: los comandos, las rutas, las convenciones de rama y el vocabulario del dominio. Copiar las
skills de otro proyecto tal cual es el error más caro que se puede cometer al montar un centro,
porque produce uno que funciona *casi*: ramifica desde una rama que no existe, cita comandos de otro
lenguaje y aplica reglas de negocio ajenas con total seguridad.

El contrato **sí** es transferible, y es lo que está escrito aquí. Rellenar el procedimiento sobre
él cuesta bastante menos que descubrir seis meses después qué quedó heredado de otro sitio.

## Antes de nada: **prefija los nombres**

`~/.claude/skills/` —donde se instalan— es un espacio **plano y compartido por todos los proyectos
de la máquina**. Dos centros con una skill `desarrollar` no caben: el segundo que instale pisa al
primero **en silencio**, y ese proyecto se queda sin método sin que nadie vea un error.

**Renombra las once con el prefijo del proyecto antes de instalar** (`<proyecto>-centro`,
`<proyecto>-forjar-skill`, …) y propágalo en el mismo cambio a: el `name:` de cada frontmatter,
`doctor.skills_requeridas` del marcador, las invocaciones cruzadas entre skills y las rutas de los
scripts que se citen en la documentación. Aquí van sin prefijo porque el prefijo es tuyo.

Y la política de colisión al instalar, que va con esto: **saltar y avisar, nunca reemplazar**.

## Orden recomendado

| # | Skill | Nivel | Por qué en este orden |
|---|---|---|---|
| 1 | `centro-doctor` | núcleo | Ya funciona: es un script configurable. Te dice qué falta mientras montas. |
| 2 | `forjar-skill` | núcleo | Sin la forja no hay playbook, y sin playbook no hay nada que ejecutar. |
| 3 | `desarrollar` | núcleo | El runner. Con la forja completan el ciclo. |
| 4 | `casos-prueba` | núcleo | El contrato de verificación. Sin él, el porcentaje es una opinión. |
| 5 | `centro` | núcleo | Puerta de entrada. Barata y es lo que hace el centro usable por otra persona. |
| 6 | `validar-requisitos` | recomendada | Gate temprano: barato de escribir, evita items que arrancan rotos. |
| 7 | `commit` | recomendada | La política del equipo, escrita una sola vez. |
| 8 | `centro-instalar` | recomendada | Obligatoria si el centro vive en un subdirectorio. |
| 9 | `particionar-hu` | según entrada | Solo si los requisitos llegan como documento. |
| 10 | `verificar-docs` | a partir de ~10 patrones | Antes no hay deriva que detectar. |
| 11 | `sitio` | opcional-fuerte | **No hay nada que escribir**: trae el generador entero (`render.py` + `bitacora_render.py` + el kit). Solo hay que ajustar la marca y activar las páginas de `paginas/`; ver su `SKILL.md`. |

**Con las cinco de núcleo el centro ya funciona.** Todo lo demás es mejora, y montarlo todo antes de
usar el centro una vez es la forma más eficaz de no usarlo nunca.

## Los seis puntos de acoplamiento

Si adaptas una skill escrita para otro proyecto, repasa estos seis. Saltarse uno produce el centro
que funciona «casi»:

| # | Punto | Qué hacer |
|---|---|---|
| 1 | Listas de workspaces dentro de la skill | Leerlas del marcador. **Nunca duplicar.** |
| 2 | Layout de repos cableado (`<ROOT>/back/<repo>`) | Resolver por `codigo.repos`. Un monorepo es un alias con `ruta: "."`. |
| 3 | Nombres de rama principal y convención | Leer de `git` del marcador. |
| 4 | Comandos de prueba y nombres de runner (`auto:<x>`) | Sustituir por los del stack (`config §3`). La *idea* se conserva. |
| 5 | Ubicación y formato de la fuente de requisitos | Adaptar a dónde viven de verdad (`config §6`). |
| 6 | Reglas de dominio embebidas (checklists mecánicos, invariantes) | **Vaciar y reescribir.** Es lo que más daño hace si se hereda. |

## Reglas para todas

- **Descubrir el centro, nunca asumir su ruta**: `python3 .claude/skills/_lib/centro_lib.py --info`,
  o `from centro_lib import Centro`. Si no aparece, **se pregunta; no se inventa**.
- **Los parámetros se citan (`config §N`), no se copian.** Duplicarlos garantiza que diverjan.
- **Lo determinista es un script, no una skill.** Si un paso se repite varias veces por item y su
  entrada tiene formato (renderizar, chequear, contar), es código: sale más rápido, más barato y no
  deriva. Los dos que ya trae el esqueleto —`_lib/centro_lib.py` y `centro-doctor/doctor.py`— son
  ese caso.
- **Frontmatter obligatorio** con `name` y `description`. Sin él, el entorno no descubre la skill y
  el doctor la reporta.
