---
name: viho-centro
description: Puerta de entrada del centro de desarrollo. Sin argumentos muestra el mapa, el estado y el siguiente paso sugerido. Con "nuevo" guía la creación de una funcionalidad y encadena las skills. Usar cuando alguien no sabe por dónde empezar.
---

# centro

> **STUB — rellenar.** El contrato está escrito; falta el procedimiento con los datos de tu centro.

## Para qué existe

Es lo único que alguien necesita recordar. Un centro sin puerta de entrada obliga a leer un README de
trescientas líneas antes de hacer nada, y la mayoría de la gente no lo hace: usa el centro a medias
o no lo usa.

**Regla propia: orienta y encadena; el trabajo real lo hacen las skills que invoca.** La ayuda se
mantiene corta y accionable, o deja de leerse.

## Modos

| Argumento | Qué hace |
|---|---|
| *(vacío)* o `ayuda` | **Mapa + estado**: qué es cada pieza, qué skills hay, cuántos items vivos y en qué fase, y **el siguiente paso sugerido**. |
| `nuevo` | **Flujo guiado**: elige workspace, pregunta si los requisitos son un documento o están escritos, crea `.work/<ws>/<item>/docs/` y encadena partición + forja. |
| `doctor` | Remite al chequeo de integridad. |

## Entradas

- El marcador (workspaces, skills declaradas en `doctor.skills_requeridas`).
- El recuento de items: recorrer `.work/<ws>/<item>/` y leer el `siguiente paso` de cada `progreso.md`.
- **No escribe archivos**, salvo el directorio del item en el modo guiado.

## TODO al montar

- [ ] **Derivar la lista de skills**, no escribirla. Leer los frontmatter `name` + `description` de
      `.claude/skills/*/SKILL.md`. *(En el centro que sirvió de referencia esta lista está escrita a
      mano en cuatro archivos distintos y los cuatro ya divergen: uno anuncia doce skills, otro
      trece, y hay catorce.)*
- [ ] **Derivar los workspaces del marcador.** Nunca enumerarlos aquí.
- [ ] Redactar el texto del mapa: cuatro piezas, una línea cada una.
- [ ] Escribir el flujo guiado con las preguntas reales de tu equipo (¿qué workspace? ¿documento o
      historias ya escritas? ¿feat, change o fix?).
- [ ] Definir el criterio del «siguiente paso sugerido»: item en curso más antiguo, o item sin forjar.
