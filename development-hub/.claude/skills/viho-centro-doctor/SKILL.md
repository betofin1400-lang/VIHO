---
name: viho-centro-doctor
description: Chequeo de integridad del centro de desarrollo. Verifica marcador, skills, configuración, biblioteca de patrones, espacio de trabajo, tablero y estado de git. Solo lectura. Usar tras cambios estructurales o cuando algo se comporte de forma rara.
---

# centro-doctor

> **Esta skill ya funciona tal cual.** El trabajo real lo hace `doctor.py`, que es determinista y no
> tiene nada cableado a ningún proyecto: sus listas salen del bloque `doctor` del marcador. La skill
> solo lo ejecuta e interpreta.

## Uso

```bash
python3 <HUB>/.claude/skills/centro-doctor/doctor.py           # descubre el centro desde el cwd
python3 <HUB>/.claude/skills/centro-doctor/doctor.py <ruta>    # o se le indica
```

Salida: `0` = sano o con avisos · `1` = hay fallos.

## Qué verifica

| Bloque | Comprueba |
|---|---|
| A · Marcador | JSON válido, `workspaces` y `codigo.repos` no vacíos, slices declarados, y que cada repo **exista en el disco** |
| B · Skills | las de `doctor.skills_requeridas` existen con `name:` en el frontmatter; ningún playbook generado conserva tokens `{{...}}` |
| C · Configuración | existen las secciones de `doctor.config_secciones` (**la numeración es API**) y no quedan tokens |
| D · Insumo | existen índice, arquitectura y lecciones; **todo patrón está enlazado** en el índice y **todo enlace del índice resuelve** |
| E · Trabajo | existe `.work/README.md`; cada workspace está declarado; **cada item tiene `progreso.md`** y con los cuatro encabezados del contrato |
| F · Tablero | páginas presentes, sin rutas `../`, sin tokens, y ninguna más vieja que el `progreso.md` más reciente |
| G · Git | si el centro está en una rama principal con artefactos sin commitear, avisa |

## Cómo se interpreta

- **`fail` = se arregla antes de correr el flujo.** Todos los fallos que detecta rompen algo **en
  silencio**: un patrón no enlazado no se selecciona nunca, un item sin `progreso.md` es invisible
  en el tablero y en todos los agregados, un playbook con tokens sin resolver hace que el runner
  ejecute instrucciones incompletas sin notarlo. Ninguna de esas cosas produce un error por sí sola.
- **`warn` = funciona con pendientes.** Un centro recién montado tiene avisos y es normal: la
  biblioteca vacía, el tablero sin generar, algún repo en otra ruta.
- **Si el doctor está siempre amarillo, en dos semanas nadie lo lee.** O se arregla lo que avisa, o
  se ajusta el umbral en el marcador para que el aviso signifique algo.

## Ajustes al montar

Todo en `doctor` del marcador:

- `skills_requeridas` — **quita las que no vayas a escribir.** Esa lista es tuya, no una herencia.
- `config_secciones` — las secciones que tus skills citen de verdad.
- `min_patrones` — empieza en `0` y súbelo conforme la biblioteca crezca.

## TODO al montar

- [ ] Correrlo una vez recién montado el centro y **anotar en el README qué avisos son esperados** y
      hasta cuándo. Un aviso sin fecha de caducidad se convierte en ruido permanente.
- [ ] Decidir si se ejecuta en el CI del repositorio del centro (cuesta segundos y evita que un
      patrón entre sin su fila en el índice).
- [ ] Si añades chequeos, que sean **deterministas y con causa**: cada uno debe poder explicar qué
      rompe en silencio si no se cumple.
