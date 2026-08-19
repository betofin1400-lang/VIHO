# {{HU-NN}} · {{Título de la historia}}

<!--
  Los requisitos son el ÚNICO artefacto enteramente humano del item, y el que más determina el
  resultado: son el denominador del porcentaje. Un criterio útil dice QUÉ SE OBSERVA, con el texto
  literal si hay mensajes de por medio, y cubre la ruta feliz Y la de error.
  Si esta historia se derivó de un documento, la partición NO resume ni reinterpreta: preserva los
  criterios y los textos literales, y cita la fuente.
-->

> **Fuente:** {{documento, sección/página · o ticket}} · **Prioridad:** {{}} · **Módulo:** {{}}

## Historia

Como **{{rol}}** quiero **{{acción}}** para **{{valor}}**.

## Contexto

{{Lo que hace falta saber para entender la historia y que no cabe en el criterio: por qué se pide,
qué existe hoy, qué cambia. El contexto de negocio compartido por varias historias va en
`_contexto-negocio.md`, no aquí duplicado.}}

## Criterios de aceptación

<!-- Numerados y estables: son la unidad del porcentaje y se citan desde los casos de prueba, el
     plan y la verificación. No se renumeran. -->

**CA-1 · {{título del criterio}}**
- **Dado** {{precondición observable}}
- **Cuando** {{acción}}
- **Entonces** {{resultado esperado, LITERAL si es un mensaje o un valor}}

**CA-2 · {{ruta de error}}**
- **Dado** {{}}
- **Cuando** {{}}
- **Entonces** {{mensaje exacto entre comillas, código de error, estado resultante}}

## Reglas de negocio

1. {{Regla que aplica a varios criterios y no es un criterio en sí.}}

## Fuera de alcance

- {{Lo que explícitamente NO entra. Evita el crecimiento silencioso del alcance.}}

## Preguntas abiertas

- [ ] {{Lo que falta decidir. Si bloquea, la prevalidación lo marcará y el flujo parará.}}
