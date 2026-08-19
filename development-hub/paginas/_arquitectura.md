# Arquitectura General

<!--
  PLANTILLA · Esta página NO repite `docs/arquitectura-general.md`: lo ENRUTA. Su único trabajo es
  que quien llega decida en un minuto si tiene que abrir el documento entero, qué parte le toca, y
  qué patrones desarrollan esa parte con el detalle de implementación que el documento deja fuera.

  Si todavía no has escrito `docs/arquitectura-general.md`, BORRA este archivo: el render publica
  el documento canónico como respaldo automático, y una página de enrutamiento que enruta a la nada
  es peor que no tenerla.

  Las dos tablas son el corazón. La primera («¿tienes que abrir el documento entero?») se rellena
  con las secciones REALES de tu documento; la segunda («de la arquitectura a los patrones») con
  las filas reales de `docs/index.md`. Las dos envejecen: revísalas cuando cambie cualquiera de los
  dos archivos, y anota abajo la fecha en que las verificaste.
-->

> Fuente de verdad legible de esta sección. La versión visual la genera el render desde este
> archivo. El documento canónico completo es `docs/arquitectura-general.md`.

| | |
|---|---|
| **Sección del sitio** | Arquitectura y Diseño |
| **Insumo** | `docs/arquitectura-general.md` — verificado contra el código el {{aaaa-mm-dd}} |
| **Actualizado** | {{aaaa-mm-dd}} |

## Resumen

{{Qué es este sistema en cinco líneas: qué problema resuelve, de dónde le entra el trabajo, qué
produce y hacia dónde sale. Nombra las piezas que no se pueden ignorar —los procesos de fondo, las
colas, los sistemas externos— y di por qué no son un extra. Escríbelo para alguien que nunca ha
abierto el repositorio.}}

Todo eso está escrito, con el archivo exacto que ejecuta cada paso, en
`docs/arquitectura-general.md`. **Esta página no lo repite: lo enruta.**

## ¿Tienes que abrir el documento entero?

**Sí, y de principio a fin**, si estás entrando al proyecto, o si el cambio cruza la costura
`{{SLICE_1}}` ↔ `{{SLICE_2}}`, o si vas a tocar {{las zonas sensibles del dominio}}. {{La sección
que el propio documento marca como de lectura obligatoria completa — normalmente el recorrido de un
caso de punta a punta.}}

**No**, si ya lo leíste y solo necesitas confirmar un punto concreto. Para eso está la tabla de
abajo: te lleva a la sección y te ahorra las otras.

| Lo que vas a tocar | Sección del documento | Qué te va a decir |
|---|---|---|
| Entrar al proyecto por primera vez | {{§}} | {{qué resuelve el sistema y el recorrido completo con el archivo que ejecuta cada paso}} |
| {{la entrada de trabajo al sistema}} | {{§}} | {{qué la dispara y qué la deja pasar}} |
| {{las reglas de negocio con más filo}} | {{§}} | {{dónde viven y quién las calcula}} |
| {{el ciclo de vida de la entidad central}} | {{§}} | {{las transiciones válidas y qué se escribe fuera al cerrarla}} |
| Escribir un import nuevo, en cualquier lado | {{§}} | La regla de capas, y si **no es la misma** en cada slice |
| Un dato que los dos slices tienen que compartir | {{§}} | Las costuras verificadas, con la **autoridad** de cada una |
| Cualquier cosa, antes de dar algo por sentado | {{§}} | Lo que el código asume sin escribirlo |

## Las tres cosas que el documento fija

**El recorrido manda sobre el organigrama.** {{La sección del recorrido}} no describe módulos: sigue
un caso de punta a punta y en cada paso nombra el archivo. Es la sección que convierte «no sé por
dónde entra este cambio» en un archivo concreto.

**La regla de capas {{es o no es la misma en los dos slices}}.** {{Escríbelo con la asimetría real,
si la hay: dónde se cumple estrictamente, dónde es laxa por diseño y qué la fuerza —un linter, una
prueba— o si no la fuerza nada y la disciplina es humana. Esta es la trampa que más caro sale a
quien llega de un lado y escribe en el otro con la severidad equivocada.}}

**Las costuras tienen dueño.** {{La sección de costuras}} lista una fila por cada punto donde los
slices tienen que estar de acuerdo, y a cada una le asigna una **autoridad**: quién decide, mientras
el otro lado obedece o presenta. No es burocracia: {{si hay divergencias vivas documentadas —un
catálogo copiado a mano, un comentario que contradice al código, un campo que un lado pinta y el
otro no produce—, nómbralas aquí: la única forma de no tropezar con ellas es saber de quién es la
decisión antes de cambiar un lado}}.

## De la arquitectura a los patrones

El documento explica **cómo está montado el sistema**; los patrones explican **cómo se escribe
código dentro de él**. Esta tabla es el puente: cada sección del documento con los patrones que la
desarrollan. El índice completo, con sus rutas de lectura por objetivo, está en `docs/index.md` y
publicado en [Biblioteca de Patrones](patrones.html).

| Sección del documento | Patrones que la desarrollan |
|---|---|
| {{§}} · {{tema}} | {{`slice NN` título · `slice NN` título}} |
| {{§}} · {{tema}} | {{…}} |

## Lo que el documento admite que no sabe

`docs/arquitectura-general.md` se escribió abriendo archivos, y marca **PENDIENTE: no verificado**
todo lo que no pudo comprobar desde el repositorio —típicamente la base de datos y el entorno de
producción reales—. {{La sección donde recoge esa lista.}} Es una virtud, no un defecto: distingue
lo verificado de lo supuesto, y evita que un supuesto se cite después como si fuera un hecho. **Si
vas a apoyar una decisión en algo marcado PENDIENTE, verifícalo primero y actualiza el documento.**
