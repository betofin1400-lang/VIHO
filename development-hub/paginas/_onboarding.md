# Cómo usar el centro

<!--
  PLANTILLA · Es la página más importante del sitio: la única que explica el método completo a
  quien llega, persona o agente. Rellénala ANTES que las otras tres.

  Los tokens en MAYÚSCULAS ({{PROYECTO}}, {{WORKSPACE}}, {{SLICE_1}}, {{SLICE_2}},
  {{RAMA_PRINCIPAL}}) se sustituyen de una pasada con el resto del esqueleto. Los tokens en
  minúscula NO se sustituyen: se piensan y se escriben con lo que pasa de verdad en tu proyecto.
  Borra un párrafo entero antes que dejarlo con un hueco relleno de humo.

  Los nombres de skill van SIN prefijo (`forjar-skill`, `desarrollar`, …). Si tu proyecto les puso
  uno porque comparte `~/.claude/skills/` con otro centro, añádeselo aquí también, en las nueve
  filas y en las rutas de los scripts.

  Todo lo que está dentro de un bloque como este NO se publica: el render elimina los comentarios
  HTML. Úsalo para dejarte notas a ti mismo.
-->

## Qué es esto, y qué no es

Este centro es **el método de trabajo de {{PROYECTO}} hecho archivos**. No es un wiki ni un tablero
de gestión: es la maquinaria que convierte un requisito en código verificado, y el registro de lo
que esa maquinaria ha hecho. Todo lo que ves en este sitio está **generado** a partir de dos cosas
que viven fuera de él, y la distinción entre esas dos es lo primero que hay que tener claro porque
es donde se equivoca todo el mundo:

| | `docs/` — **el insumo** | `.work/` — **el trabajo en curso** |
|---|---|---|
| Qué contiene | La biblioteca de patrones técnicos del proyecto, el mapa de arquitectura, las lecciones y los ADR | Un directorio por item (`feat-…`, `change-…`, `fix-…`) con sus requisitos, su playbook, su estado y sus artefactos de fase |
| Cuánto dura | **Permanente.** Crece despacio y con aprobación | **Efímero.** Nace al forjar un item y se cierra al terminarlo |
| Quién escribe | Una persona, o el agente **proponiendo** un borrador que alguien aprueba (`config §9`) | El agente, fase por fase, sin pedir permiso para cada línea |
| Para qué sirve | Que el agente sepa **cómo se escribe código aquí** antes de escribir la primera línea | Que el item recuerde su propio método, su estado y su evidencia |

**El error típico es meter en `docs/` lo que pertenece a un item, o buscar en `.work/` cómo se hace
algo en este proyecto.** Un patrón describe una técnica reutilizable del repositorio; el análisis de
una funcionalidad concreta no lo es y no entra a la biblioteca. Al revés: si al cerrar un item salió
una técnica que servirá para el siguiente, entonces —y solo entonces— se propone como patrón.

Y una regla dura que no es estética: **el HTML del sitio es salida, no fuente.** El generador borra
y regenera el sitio entero en cada pasada. Un retoque directo al HTML se pierde sin avisar. La
fuente de esta página concreta es `paginas/onboarding.md`; la de las páginas de avances, los
`progreso.md` de cada item.

## El flujo de un item, de principio a fin

Esto es el corazón del centro. Siete pasos, cada uno con una salida concreta y un sitio donde queda.
Ninguno es opcional, pero varios se encadenan solos.

| # | Paso | Se invoca | Produce | Dónde queda |
|---|---|---|---|---|
| 1 | Abrir el item y traer los requisitos | `centro nuevo` | el directorio del item y su `docs/` | `.work/{{WORKSPACE}}/<item>/docs/` |
| 2 | Trocear el documento en historias | `particionar-hu` | una HU por archivo, con sus criterios **literales** | `.work/{{WORKSPACE}}/<item>/docs/HU-NN-*.md` |
| 3 | Prevalidar los requisitos | `validar-requisitos` | el veredicto y los hallazgos | `validacion-requisitos.md` |
| 4 | Forjar el playbook del item | `forjar-skill` | playbook, contexto, casos y estado inicial | `skills/SKILL.md`, `contexto-tecnico.md`, `casos-prueba.md`, `progreso.md` |
| 5 | Desarrollar, fase por fase | `desarrollar` | los artefactos de las cinco fases | `analisis.md`\|`diagnostico.md`, `plan.md`, `resultado.md`, `verificacion.md` |
| 6 | Cerrar y aprender | (lo hace la fase 5 del runner) | patrón **propuesto** y lección **anexada** | `docs/<slice>/` (con aprobación) y `docs/lecciones.md` |
| 7 | Versionar | `commit` | el commit, en su rama de trabajo | el repositorio; el PR va **contra `{{RAMA_PRINCIPAL}}`** |

### El mismo camino, con un item de verdad

<!--
  ESTA SUBSECCIÓN ES LA QUE HACE QUE EL MÉTODO SE ENTIENDA, y la que más se cae por pereza.
  Coge UN item real de tu proyecto —mejor uno ya cerrado, para poder citar lo que pasó de verdad—
  y recorre con él los siete pasos, un párrafo por paso. Lo que tiene que aparecer en cada uno:

    1 · cómo se decide el prefijo del item y por qué el prefijo no es cosmético (decide el playbook)
    2 · cuál es el contrato de entrada de los requisitos (la RUTA del documento, no su contenido)
    3 · un hallazgo de prevalidación PLAUSIBLE en ese item, y por qué bloquea
    4 · qué patrones seleccionó la forja para ese item y con qué trigger emparejaron
    5 · qué produce cada una de las cinco fases en ESE item, con sus gates
    6 · qué lección salió y qué patrón se propuso (o por qué no se propuso ninguno)
    7 · cómo quedó el mensaje de commit y qué necesitó OK humano

  Si todavía no hay ningún item cerrado, BORRA esta subsección entera y vuelve a ella después.
  Un ejemplo inventado es peor que ningún ejemplo: se cita como si hubiera pasado.
-->

Supón {{el item real que vas a usar de hilo — una frase describiéndolo}}. Así se recorre entero:

**1 · Se abre el item.** {{Cómo se decide el tipo y el nombre del directorio, y por qué el prefijo
manda: es lo que decide qué playbook estampa la forja (`config §7`). Dónde va el identificador del
ticket — en la rama, no en el nombre de la carpeta.}}

**2 · Entran los requisitos.** El contrato de entrada es **la ruta del documento**, no su contenido
pegado ni un resumen (`config §6`). {{Qué formato llegan los requisitos aquí y qué hace con ellos
`particionar-hu`; qué significa preservar los criterios literales: el texto exacto contra el que se
comparará después, carácter por carácter.}}

**3 · Se prevalida.** `validar-requisitos` audita y escribe `validacion-requisitos.md`. {{Un
hallazgo concreto que saltaría en este item y por qué: casi siempre un criterio no testable —dice
qué pasa, no cómo se comprueba—. Un hallazgo bloqueante para y pregunta; sale más barato preguntar
ahora que perder el item en la verificación (`config §18`).}}

**4 · Se forja el playbook.** `forjar-skill {{WORKSPACE}}/<item>` comprueba la rama —y si estás en
`{{RAMA_PRINCIPAL}}` **para y pregunta**—, clasifica tipo y complejidad, **selecciona el contexto
técnico** por los triggers del índice, delega los casos de prueba y estampa el playbook. {{Qué
patrones entraron en este item y con qué trigger emparejó cada uno.}} Todo eso queda en
`contexto-tecnico.md`, junto con la sección **«Descartados y por qué»** —{{el candidato cercano que
NO entró, y el disparador negativo que lo excluyó}}—, que es la que evita que la próxima forja
repita el mismo análisis. Y `casos-prueba.md` descompone cada criterio en casos clasificados por
plataforma y automatizabilidad.

**5 · Se desarrolla.** `desarrollar {{WORKSPACE}}/<item>` ejecuta **una fase por invocación** y
guarda el punto exacto donde quedó, así que se puede parar y retomar días después. Las cinco fases:
**entendimiento** (`analisis.md`; en un fix, `diagnostico.md` con la causa raíz anclada a
`archivo:línea`), **diseño** (`plan.md`, y las pruebas se escriben aquí y **deben fallar**, con la
salida citada: una prueba que pasa antes del cambio no prueba nada), **implementación**
(`resultado.md`, y al terminar un `git diff --name-only` contra los archivos del plan: lo que sobre
se justifica por escrito o se revierte), **verificación** (`verificacion.md`, con veredicto binario
`CUMPLE`/`NO` por criterio y el 100 % de los casos ejecutados) y **cierre**. Al terminar cada fase
se actualiza `progreso.md` y se regenera este sitio.

**6 · Se cierra y se aprende.** Dos barras deliberadamente distintas (`config §9`): la **lección** se
anexa sola a `docs/lecciones.md` —barra baja, para que la memoria crezca a diario—; el **patrón** se
redacta como borrador y **se presenta para aprobación**, y si entra, entra con su fila en
`docs/index.md` en el mismo cambio, porque un patrón sin trigger es invisible y no se carga nunca.
Antes del commit va la **autorevisión del diff con ojo de revisor, no de criterio**: cerrar los
criterios no basta, porque un criterio describe el requisito y no el sistema (`config §21`).

**7 · Se versiona.** `commit` aplica la política: {{formato del mensaje de commit de la casa, con un
ejemplo real}}, un commit por cambio lógico, archivos añadidos **explícitamente** y nunca con
`git add .`. **Empujar la rama y abrir el PR requieren un OK explícito cada vez**; no se hereda del
item anterior.

> El porcentaje que verás en la bitácora sale de aquí y **se deriva, no se declara**: es criterios en
> `CUMPLE` sobre el total. No son tareas cerradas y no es cobertura —la cobertura es una señal
> secundaria—. Sin evidencia ejecutada y citada, un criterio no es `CUMPLE`.

## Cómo se lee la biblioteca

`docs/index.md` **no es un catálogo para hojear: es un selector.** Cada patrón trae una columna
«Cargar cuando…» que habla de lo que el desarrollador **va a hacer** —un símbolo, un archivo, una
pantalla, un síntoma de depuración—, no de lo que el documento trata. Se usa así:

- **Primero la navegación rápida por objetivo** (§1 del índice). Si tu tarea empareja una fila, esa
  **secuencia manda** sobre la tabla: ya viene ordenada y filtrada, y no hace falta barrer nada más.
- **Si no empareja, se barren las columnas «Cargar cuando…»** de cada slice, quedándose solo con los
  triggers que emparejan de verdad.
- **Tres patrones que aplican valen más que diez «por si acaso».** Cada documento cargado de más
  entra al contexto con el mismo peso que los que sí importan y compite con el código real que hay
  que leer después. Peor aún: un patrón que no viene a cuento **no se ignora solo**, se aplica igual
  y con total seguridad.
- **Los disparadores negativos están escritos para poder decir que no.** Si dos filas emparejan con
  lo mismo, releerlos: una de las dos sobra.
- **Cruza la costura.** Si la tarea toca `{{SLICE_1}}` y `{{SLICE_2}}` a la vez —{{qué clase de
  cambio cruza la costura en este proyecto: un campo nuevo, un estado nuevo, un error que el usuario
  ve}}—, se carga el par completo y se anota cuál de los dos es la autoridad. Cargar un solo lado es diseñar la mitad del contrato y descubrir la otra
  mitad en producción.
- **Calibra a entre tres y ocho documentos.** Si salen más de ocho, casi siempre el problema no es la
  selección: es que el item está mal cortado y hay que partirlo.
- **Un patrón no es la autoridad final.** Cada uno abre con su bloque «Fuente de la verdad»: esas
  rutas son las anclas de código que hay que abrir. Cuando un documento y el código se contradicen,
  **gana el código**, y el documento tiene deriva.

## Los comandos que funcionan hoy

| Invocación | Para qué |
|---|---|
| `centro-instalar` | Una vez por máquina, y tras añadir o renombrar una skill. Enlaza las skills y resuelve dónde vive el código |
| `centro` | Mapa, estado y **el siguiente paso sugerido**. `centro nuevo` guía la creación de un item |
| `particionar-hu <ws>/<item> <ruta>` | Trocea un documento de requisitos en una HU por archivo |
| `validar-requisitos <ws>/<item>` | Prevalida antes de invertir en forja |
| `casos-prueba <ws>/<item>` | La suite de casos: la autoridad de verificación |
| `forjar-skill <ws>/<item>` | Fabrica el playbook del item y su estado inicial |
| `desarrollar <ws>/<item> [fase]` | Ejecuta el playbook, una fase por invocación |
| `commit` | Aplica la política de commits y ramas |
| `verificar-docs [alcance]` | Detecta deriva entre la biblioteca y el código de `{{RAMA_PRINCIPAL}}` |

Y tres scripts deterministas, sin red ni modelo, que se corren desde el directorio del centro:

```bash
python3 .claude/skills/_lib/centro_lib.py --info      # dónde está el centro, el código y cuántos items hay
python3 .claude/skills/centro-doctor/doctor.py        # salud del centro: 0 = sano o con avisos, 1 = hay fallos
python3 .claude/skills/sitio/render.py                # regenera este sitio entero
```

**El sitio se abre con doble clic** en `index.html` —protocolo `file://`, sin servidor, sin
dependencias y sin coste—. La bitácora por workspace está en el menú lateral, bajo Avances.

Los comandos del código son los de `config §3`, y estos son los que conviene tener a mano:

```bash
{{los comandos REALES de este proyecto: pruebas de cada slice, tipos, build, linter, E2E.
Con la ruta desde la que se ejecutan, que casi nunca es la raíz del repositorio.}}
```

{{Las reglas duras que aplican en cualquier fase que ejecute algo: qué NO se toca nunca desde una
prueba (sistemas externos de producción, servicios de pago, datos reales), y con qué se sustituye.}}

## Cuando algo falla

- **El doctor sale con fallos (`1`).** Se arregla **antes** de correr el flujo, porque todo lo que
  detecta rompe **en silencio**: un patrón sin fila en el índice no se selecciona nunca, un item sin
  `progreso.md` es invisible en el tablero y en todos los agregados, y un playbook con tokens sin
  resolver hace que el runner ejecute instrucciones incompletas sin notarlo. Ninguna de esas cosas
  produce un error por sí sola. Los **avisos** son otra cosa: un centro recién montado los tiene y es
  normal. Eso sí, si el doctor está siempre amarillo, en dos semanas nadie lo lee.
- **Queda un token de plantilla sin resolver en el playbook o en el estado.** Significa forja a
  medias: **se para y se re-forja**, nunca se interpreta el hueco. Se detecta buscando las dobles
  llaves en `.work/<ws>/<item>/skills/SKILL.md`, y el doctor lo reporta como fallo, no como aviso.
- **El sitio muestra datos viejos.** No es un fallo del generador: es que nadie corrió `render.py`
  tras la última fase. Es sub-segundo y determinista.
- **Editaste el HTML del sitio a mano.** Se pierde en el siguiente render, sin avisar. Lo que se
  quiera cambiar va a los datos (`.work/`), a la narrativa del tablero (`_intro.md`) o al markdown de
  la página en `paginas/`.
- **Una skill no aparece al invocarla por su nombre.** No está enlazada donde el entorno las busca.
  Se arregla con `centro-instalar`, no copiando archivos a mano.
- **`items en .work: 0` y tú esperabas items.** Casi siempre están bajo un workspace no declarado en
  el marcador, o les falta `progreso.md`. El doctor nombra las dos cosas.
- **Un paso lo hace una persona, no el agente.** {{Cuáles, en este proyecto: el despliegue, la
  aprobación de un patrón, el OK de empujar o abrir PR, la firma de un criterio pendiente de
  confirmar.}} Se pide y se espera; **no se simula**.
- {{Las trampas propias de este proyecto: el comando que no vuelve porque está en modo watch, el
  filtro de pruebas que sale verde sin ejecutar nada, el gate de cobertura que hace fallar una
  corrida parcial con todo en verde. Una línea por trampa, con el síntoma exacto y el comando real.
  Esta lista se llena con lo que ya le pasó a alguien; no la inventes de golpe.}}
- **No sabes por dónde seguir.** `centro` lo dice con el comando exacto, y sugiere **uno**: una
  lista de cinco opciones no es una sugerencia.
