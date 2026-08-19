# `paginas/` — el markdown fuente de las páginas narrativas del sitio

Aquí vive el **contenido escrito por personas** que el sitio publica. Todo lo demás se deriva solo
(el marcador, `docs/`, `.work/`, los frontmatter de las skills); esto es la excepción, y por eso
está **fuera** de la salida: `centro-desarrollo/` **se borra entero** en cada render, así que un
markdown guardado ahí dentro se perdería en la primera pasada.

## Cómo funciona

`render.py` busca `paginas/<id>.md`. Si existe, escribe `<sitio>/<id>.html` y añade su entrada al
menú lateral. **Si no existe, no pasa nada**: ni página, ni entrada, ni enlace roto. Nunca hay un
`href` a un archivo que no está. Mientras falte, el render lo dice por consola:
`aviso  página 'onboarding': sin markdown fuente — no se publica`.

| `<id>` | Entra en la sección | Rótulo en el menú | Respaldo si no existe aquí |
|---|---|---|---|
| `onboarding` | General | Cómo usar el centro | — |
| `arquitectura` | Arquitectura y Diseño | Arquitectura General | `docs/arquitectura-general.md` |
| `metodologia` | Desarrollo | Metodología y Meta-skill | — |
| `e2e` | Desarrollo | Pruebas E2E | — |
| `index` | (no es entrada propia) | se inyecta como narrativa en la portada | — |

El **respaldo** es un documento canónico que ya vive en el centro: si `paginas/arquitectura.md` no
está, la página se genera desde `docs/arquitectura-general.md`. Escribir el archivo aquí lo
sustituye, sin tocar código.

Para añadir un `<id>` nuevo se toca **una** lista: `PAGINAS_NARRATIVAS`, en la cabecera de
`.claude/skills/sitio/render.py`.

## Qué trae el esqueleto

Las cuatro páginas están **como plantilla, con tokens, y con el nombre desactivado**:

```
_onboarding.md   _metodologia.md   _arquitectura.md   _e2e.md
```

**El guion bajo es el interruptor.** El render busca `<id>.md` exacto, así que mientras el archivo
se llame `_onboarding.md` la página no se publica y no aparece en el menú. Se activa quitándoselo:

```bash
mv paginas/_onboarding.md paginas/onboarding.md      # y se escribe
```

Es deliberado: **una página publicada llena de huecos sin rellenar es peor que una entrada de menú
menos**. Se activa cuando hay algo que decir, no antes; mientras tanto el render lo recuerda en cada
pasada con un aviso por cada página que falta.

No son documentación de otro proyecto disfrazada: son el índice de lo que cada una tiene que
responder, con la instrucción de qué escribir en cada hueco dentro de un bloque `<!-- ... -->` que
**no se publica** (el render elimina los comentarios HTML antes de convertir).

**La más importante es `onboarding.md`.** Es la única página que le explica a alguien que llega —
persona o agente— qué es esto, cuál es el flujo completo de un item y qué hacer cuando algo falla.
Un centro sin esa página obliga a leer las skills para entender el método, que es exactamente lo
que el centro existe para evitar.

Orden sugerido para rellenarlas: `onboarding` → `metodologia` → `arquitectura` → `e2e`. Las dos
últimas pueden esperar a tener algo que contar; la primera, no.

## Reglas de escritura

- Markdown normal. El render entiende encabezados, párrafos, listas, tablas, citas, bloques de
  código y énfasis en línea. El frontmatter `---` inicial y los comentarios `<!-- -->` se ignoran.
- El `# Título` de la primera línea **no se publica**: el header de la página ya lo escribe desde
  el rótulo del menú. Ponlo igualmente, para que el archivo se lea bien suelto.
- **Nada de enlaces que salgan del sitio.** Un `[x](../docs/algo.md)` sería un 404 en la página
  publicada, que vive en el directorio del sitio; el render lo degrada a texto plano en vez de
  emitir un enlace roto. Si hace falta citar un archivo del centro, cítalo en `código`. Entre
  páginas del propio sitio sí se enlaza: `[Patrones](patrones.html)`.
- **Sin cifras que ya estén en una tabla generada.** Un conteo escrito a mano se contradice con la
  tabla que sale dos centímetros más abajo, y entonces el lector deja de saber a cuál creerle.
- **Ningún token `{{...}}` sobrevive.** Un token vivo en una página publicada es un centro montado
  a medias, a la vista de todo el mundo; el chequeo de integridad reporta los que están en
  MAYÚSCULAS.
- Nunca edites los `.html` del sitio: son salida, y el próximo render los pisa.
