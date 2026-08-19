---
name: viho-particionar-hu
description: Particiona un documento de requisitos (.md, .pdf, .docx) en una historia de usuario por archivo dentro de .work/<ws>/<item>/docs/. Preserva criterios y textos literales, no resume ni reinterpreta. La invoca la forja cuando la entrada es un único documento.
---

# particionar-hu

> **STUB — rellenar.** Es la skill más portable del conjunto: casi todo su mecanismo es agnóstico del
> proyecto. Lo que cambia es el formato en el que llegan los documentos y los campos de la ficha.

**Solo hace falta si los requisitos llegan como documento.** Si tu equipo escribe historias
directamente en `.work/<ws>/<item>/docs/`, borra este directorio y quítalo del marcador.

## Regla central

**No inventa, no resume, no reinterpreta.** Preserva los criterios, las reglas y los mensajes
**literales**, y referencia la fuente (documento + página o sección). Un requisito parafraseado
pierde justo lo que hace verificable un criterio: el texto exacto que hay que comparar.

## Pasos

1. **Ingerir** según el tipo: markdown/texto directo; PDF por rangos de páginas; documentos
   ofimáticos con una conversión que **preserve encabezados y tablas** (una tabla aplanada a texto
   corrido destruye la mitad de los criterios). Los archivos temporales van a un directorio de paso,
   **nunca dentro de `.work/`**.
2. **Segmentar.** Señales de límite: identificadores explícitos (`HU-01`, `RF-07`), encabezados por
   funcionalidad, o el patrón «como *rol* quiero *acción* para *valor*». Si el documento no viene
   como historias, **segmentar por funcionalidad coherente y avisarlo**: quien lea las historias debe
   saber que fueron derivadas y no dictadas.
3. **Escribir una historia por archivo** (`HU-NN-<slug>.md`) con la plantilla del centro
   (`.work/_plantilla-HU.md`) + un índice.
4. **Extraer el contexto de negocio** a `_contexto-negocio.md`: glosario, marco normativo, reglas
   transversales, actores, supuestos. Regla precisa: **lo que ya se asignó a una historia no se
   duplica aquí**.
5. **Ante ambigüedad de dónde corta una historia, preguntar.** Una partición mal cortada produce
   items que no cierran nunca porque su criterio depende de otro item.

## Modo re-versión

Cuando llega una versión nueva del documento: **leer la partición previa antes de sobrescribirla** y
escribir `_cambios-v<n>.md` con cuatro secciones:

| Sección | Efecto sobre el estado |
|---|---|
| **Añadido** | arranca pendiente |
| **Modificado** | **revoca** el `CUMPLE` previo de esos criterios |
| **Eliminado** | se archiva |
| **Sin cambio** | **conserva** su veredicto |

Y una regla que evita el desastre silencioso: **mapear por contenido, no por posición**. Si el
documento nuevo intercala una historia, mapear por número renombra todo y revoca criterios que nadie
tocó.

## TODO al montar

- [ ] Declarar los formatos que llegan de verdad y con qué herramienta se convierte cada uno.
- [ ] Ajustar los campos de la ficha de historia (prioridad, módulo, épica: usa los de tu equipo,
      no los de nadie más).
- [ ] Decidir el criterio de corte cuando el documento no viene segmentado.
