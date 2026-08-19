# Changelog del centro — {{PROYECTO}}

> **Qué se registra aquí:** los cambios del **centro** (skills, configuración, biblioteca de
> patrones, plantillas, tablero), **no** los del producto. El avance del producto vive en
> `.work/<ws>/<item>/progreso.md` y en el tablero.
>
> **Por qué existe.** Un centro no se diseña completo: se sedimenta. Cada gate, cada umbral y cada
> regla nace de un tropiezo concreto, y sin este archivo nadie recuerda **de qué fallo salió** una
> regla — que es justo lo que hace falta para saber si todavía aplica o si se puede quitar. Anotar
> el origen ("nace del item X, que cerró con todos sus criterios y quince comentarios de revisión")
> vale más que anotar el cambio.
>
> Formato: [Keep a Changelog](https://keepachangelog.com/es-ES/) simplificado. Versionado semántico
> del *centro*: MAYOR = cambia un contrato (formato del estado, esquema del marcador, numeración de
> la configuración); MENOR = skill o capacidad nueva; PARCHE = correcciones.

---

## [0.1.0] — {{AAAA-MM-DD}}

Montaje inicial desde el esqueleto estándar.

### Añadido
- Marcador `.centro-desarrollo.json` con {{n}} workspace(s) y {{n}} repositorio(s) declarados.
- `.claude/config-proyecto.md` con las 21 secciones. Rellenadas de verdad: {{§1, §2, §3, §5, §7, §9, §10}}.
  El resto conserva el texto estándar hasta que haga falta.
- Skills del núcleo: {{lista}}.
- `docs/` con el índice, la arquitectura general y las lecciones. {{n}} patrones.
- `.work/` con la convención y el item de ejemplo.
- {{Tablero generado / sin tablero: este centro no publica sitio (`config §10`).}}

### Pendiente
- {{Lo que se sabe que falta. Ser explícito aquí evita que alguien confíe en algo que no existe.}}

---

<!--
  PLANTILLA DE ENTRADA — copiar arriba, la más nueva primero.

  ## [X.Y.Z] — AAAA-MM-DD

  ### Añadido / Cambiado / Corregido / Quitado
  - {qué cambió}. **Origen:** {el item, el fallo o la discusión de la que salió}.

  ### Impacto en contratos
  - {si cambió el formato de `progreso.md`, el esquema del marcador o la numeración de la
    configuración: decirlo aquí y decir qué hay que regenerar. Estos tres rompen cosas EN SILENCIO.}
-->
