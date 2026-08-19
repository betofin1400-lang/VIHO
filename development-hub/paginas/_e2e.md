# Pruebas E2E

<!--
  PLANTILLA · Esta página documenta DOS cosas que casi nunca están en el mismo estado, y por eso van
  separadas:

    1. LA REGLA y CÓMO SE CORRE — lo que el proyecto exige y los comandos exactos. Estable.
    2. EL ESTADO REAL DE LA SUITE — qué cubre de verdad hoy, cuándo se corrió por última vez y qué
       no cumple. Esto envejece rápido y es lo primero que se omite. NO lo omitas: una suite que se
       cita como aval sin haberse corrido es peor que no tener suite.

  Regla de honestidad: cada afirmación de la sección 2 se escribe MIRANDO el repositorio, con la
  fecha en que se miró. Lo que no verifiques, márcalo «PENDIENTE: no verificado».

  Si el proyecto no tiene pruebas de extremo a extremo y no va a tenerlas pronto, BORRA este
  archivo: el render deja de publicar la página y de ponerla en el menú, sin dejar enlace roto. Una
  página que promete una suite que no existe hace más daño que una entrada de menú menos.
-->

> Fuente de verdad legible de esta sección. La versión visual la genera el render desde este
> archivo.

| | |
|---|---|
| **Sección del sitio** | Desarrollo |
| **Insumos** | `.claude/config-proyecto.md` §16 · {{los archivos reales: configuración del runner, scripts del gestor de paquetes, directorio de las pruebas, pipeline de CI}} |
| **Actualizado** | {{aaaa-mm-dd}} |

## Resumen

El runner es **{{herramienta}}**, y las pruebas viven en `{{ruta}}`. Se corren desde `{{directorio}}`.
Y por encima de cualquier detalle hay **una regla dura**: {{enúnciala en una frase}}.

## La regla dura

**Toda interfaz se valida en pantalla real antes de cerrar un ciclo.** Que pasen los unitarios y el
chequeo de tipos **no basta**. No es una preferencia de estilo: es que esas dos herramientas, por
construcción, no ven la clase de fallo que rompe una pantalla. No ven **un componente que no monta**,
ni **un diálogo que se cierra solo**, ni **una tabla que queda vacía** porque la consulta se armó con
un filtro que el servidor no entiende. Compilan y pasan igual. **Si el item tocó interfaz y no hay
evidencia de la suite, el item no cierra.**

{{Qué corre la integración continua, exactamente. Si el pipeline NO ejecuta la suite E2E, dilo aquí
con todas las letras: un pipeline en verde no es evidencia de pantalla, y quien no lo sepa la citará
como si lo fuera.}}

Las otras reglas duras que llegan desde la arquitectura y valen aquí sin matices:

- {{Contra qué NO se escribe nunca desde una prueba —un sistema externo que es producción de otro,
  un servicio de pago, un buzón real— y con qué se sustituye. Nombra el doble y su archivo, y di qué
  pasa si no se inyecta: casi siempre no es un error claro, es una llamada de verdad.}}
- **Credenciales y datos salen de variables de entorno, nunca del repositorio.** Las de producción no
  se escriben en un archivo de prueba ni se pegan en un prompt.

## Cómo se corre

Todos los comandos se ejecutan desde `{{directorio}}`.

| Qué quieres | Comando |
|---|---|
| La suite completa | `{{comando}}` |
| Verla correr en un navegador visible | `{{comando}}` |
| Depurar paso a paso | `{{comando}}` |
| Reabrir el último informe | `{{comando}}` |
| **Un solo archivo** | `{{comando}}` |
| **Un solo caso** | `{{comando}}` |
| Un solo navegador, mientras iteras | `{{comando}}` |

{{Si la configuración declara varios proyectos o navegadores, dilo: la suite completa multiplica los
casos por ese número, y para iterar sobre un cambio se usa un archivo y un proyecto.}}

### Contra qué entorno corre

{{Cómo está escrita la configuración para que **nunca apunte a producción por accidente**: qué URL
base usa por defecto, qué variable la cambia, si el runner levanta él mismo el servidor de
desarrollo o espera encontrarlo, y qué captura al fallar (traza, captura de pantalla, vídeo) con sus
tiempos límite.}}

{{Y lo que hace falta ADEMÁS del frontend para que la prueba tenga con qué trabajar: el backend
levantado y con datos, la sesión, la siembra. Sin eso, la suite entera cae en la primera pantalla y
el diagnóstico se pierde media hora.}}

## El estado real de la suite

<!--
  Una afirmación por párrafo, cada una con su evidencia. Preguntas que hay que responder:
    · ¿cuándo se corrió entera por última vez, y qué ha cambiado en el producto desde entonces?
    · ¿el último informe conservado ejecutó casos, o los omitió todos? (un runner reporta ÉXITO
      cuando todo se omite: total N, ejecutados 0, ok)
    · ¿los selectores están atados al texto visible o a identificadores de prueba estables?
    · ¿hay algo compartido entre archivos —sesión, fixtures— o cada uno vuelve a inventarlo?
    · ¿hay casos omitidos incondicionalmente, que se saltan siempre y en silencio?
    · ¿las credenciales salen del entorno, como dice la regla, o están escritas en los archivos?
  Si no lo has mirado, escribe «PENDIENTE: no verificado» y sigue. No lo rellenes de memoria.
-->

Lo que sigue se verificó leyendo el repositorio el {{aaaa-mm-dd}}.

{{Cada hallazgo, en su propio párrafo, empezando por la afirmación en negrita y siguiendo con la
evidencia que la sostiene.}}

### Qué hacer con esto hoy

**La regla dura sigue en pie tal cual**: si tocaste interfaz, la validas en pantalla real antes de
cerrar. Lo que cambia es de dónde sale esa evidencia. Mientras la suite esté sin revalidar, **no la
cites como si fuera un aval**: corre a mano el flujo que tocaste, deja la captura o la traza, y si el
archivo de pruebas que cubre ese flujo falla, decide y anota si falló el producto o falló la prueba.
Arreglar el archivo en el mismo item es lo barato; dejarlo roto es lo que convierte una suite en
decoración.
