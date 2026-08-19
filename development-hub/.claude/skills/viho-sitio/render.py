#!/usr/bin/env python3
"""
render — generador ÚNICO del sitio del centro de desarrollo.
Biblioteca estándar, sin dependencias, sin red, sin modelo. **Nada cableado a ningún
proyecto**: el nombre, los workspaces y los conteos salen del marcador y del disco.

    python3 render.py [ruta-al-centro]      # un comando regenera TODO el sitio


LA DECISIÓN QUE DOCUMENTA ESTE ARCHIVO
--------------------------------------
En el centro donde se estrenó esta plantilla llegó a haber **dos generadores que no se
conocían**: un `render.py` reducido (index/patrones/skills y una página plana por workspace,
con su propio kit `estilo.css` + `tabla.js`) y un `bitacora_render.py` traído de otro centro
(páginas de avances con detalle desplegable, gemelos `.md`, con `css/styles.css` +
`js/nav.js` + `js/bitacora.js`). **Los dos escribían el mismo `avances-<ws>.html`**: el
último en correr ganaba, y el sitio quedaba con dos kits visuales distintos según qué página
se abriera.

**Se fusionaron con `render.py` como orquestador y `bitacora_render` degradado a biblioteca.**
El reparto es:

  · `render.py` (aquí) — resuelve el centro, DERIVA la navegación, arma el envoltorio común de
    toda página (`<head>`, sidebar, footer, scripts), genera las páginas derivadas del disco
    (portada, patrones, skills), publica las páginas narrativas que existan, escribe el kit y
    el `js/nav-data.js`, y borra y reescribe el sitio entero.
  · `bitacora_render` — solo el CUERPO de las páginas de avances (panorama + una por
    workspace) en sus dos formas gemelas, `.html` y `.md`. Ya no escribe archivos ni conoce
    el nombre del centro. Ejecutarlo directamente falla con un mensaje que apunta aquí.

El kit visual quedó uno solo: `css/styles.css` + `js/nav.js` + `js/bitacora.js`. `estilo.css`
y `tabla.js` se eliminaron; conservarlos habría dejado la puerta abierta a que el sitio
volviera a partirse en dos.


LAS REGLAS QUE IMPLEMENTA
-------------------------
1. **Nada cableado.** Los workspaces salen del marcador; los conteos de patrones, de skills y
   de items salen del disco. Ni una lista escrita a mano: el nav que se portó traía dentro,
   literales, los workspaces del centro de origen y un «14 skills» escrito a mano, y eso es
   exactamente la clase de dato que se queda viejo sin que nadie se entere.
2. **Todo se genera; ninguna página se escribe a mano.** Las explicativas se derivan de sus
   fuentes (los patrones del índice; las skills de sus frontmatter).
3. **La fuente vive fuera de la salida.** El sitio se BORRA entero y se regenera, así que no
   quedan huérfanos de workspaces, items o páginas que ya no existen.
4. **Determinista, no generativo.** Misma entrada, misma salida. Cero tokens, sub-segundo.
5. **Datos y narrativa separados.** Las tablas salen del estado; el texto editorial se inyecta
   verbatim desde `_intro.md` y las páginas de `paginas/`.
6. **El generador no inventa.** Si un dato no está en el estado, no aparece en la página.
7. **Ningún enlace roto, nunca.** Una página narrativa que todavía no existe no produce una
   entrada de menú muerta: simplemente no se emite (ver PAGINAS_NARRATIVAS).
8. **La navegación viaja en un `.js`, no en un `.json`. A PROPÓSITO.** El sitio se abre con
   `file://`, y ahí CORS bloquea `fetch()` de un JSON local: el menú saldría vacío al abrir
   la página con doble clic. `js/nav-data.js` es un script que asigna `window.CENTRO_NAV`, y
   funciona sin servidor. **No lo conviertas a JSON**, por muy limpio que se vea.


LAS PÁGINAS NARRATIVAS (las escriben otros; esto solo las publica)
------------------------------------------------------------------
`onboarding`, `metodologia`, `arquitectura` y `e2e` se publican **si y solo si** existe su
markdown fuente. Fuente = `<HUB>/<paths.paginas>/<id>.md`, con un respaldo declarado en el
marcador para las que ya tienen un documento canónico (hoy: `arquitectura` → `paths.arquitectura`).
Si el `.md` no está, la página no se genera y su entrada desaparece del menú. Nunca un `href`
a un archivo inexistente.


EL PORCENTAJE
-------------
`% = criterios de aceptación en CUMPLE / total`, contado por `bitacora_render` de las tablas
con columna «Veredicto» del `progreso.md`. **Se deriva, no se lee.**
"""

from __future__ import annotations

import html
import os
import re
import shutil
import sys
from datetime import date

_AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [_AQUI, os.path.join(_AQUI, "..", "_lib")]
from centro_lib import Centro, CentroNoEncontrado          # noqa: E402
import bitacora_render as bit                              # noqa: E402

VERSION = "2.0.0"
FORMATO_ESTADO = "1.0"

AVISOS: list[str] = []

# Recursos del kit visual: origen en `plantillas/`, destino relativo dentro del sitio.
# Es UN kit. Si algún día vuelve a haber dos, el sitio vuelve a partirse en dos.
KIT = [("styles.css", "css/styles.css"),
       ("nav.js", "js/nav.js"),
       ("bitacora.js", "js/bitacora.js")]

# Páginas narrativas: (id, sección, icono, rótulo, clave de respaldo en el marcador).
# El orden es el del menú. Ninguna se emite si no existe su fuente.
PAGINAS_NARRATIVAS = [
    ("onboarding", "General", "&#9873;", "Cómo usar el centro", None),
    ("arquitectura", "Arquitectura y Diseño", "&#9638;", "Arquitectura General", "arquitectura"),
    ("metodologia", "Desarrollo", "&#9881;", "Metodología y Meta-skill", None),
    ("e2e", "Desarrollo", "&#9707;", "Pruebas E2E", None),
]


# ══════════════════════════════════════════════════════════ utilidades de texto

def leer(ruta: str) -> str:
    try:
        with open(ruta, encoding="utf-8", errors="replace") as f:
            return f.read()
    except OSError:
        return ""


def sin_comentarios(texto: str) -> str:
    return re.sub(r"<!--.*?-->", "", texto, flags=re.S)


def sin_frontmatter(texto: str) -> str:
    """Quita el bloque `---` inicial. Sin esto, el YAML de cabecera de un documento del
    repositorio sale impreso como párrafos sueltos en medio de la página."""
    if texto.startswith("---"):
        fin = texto.find("\n---", 3)
        if fin != -1:
            return texto[texto.find("\n", fin + 1) + 1:]
    return texto


def esc(texto: str) -> str:
    return html.escape(texto or "", quote=True)


# ══════════════════════════════════════════════════════════ mini markdown → html

def en_linea(texto: str) -> str:
    t = esc(texto)
    t = re.sub(r"`([^`]+)`", r"<code>\1</code>", t)
    t = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<!\w)\*([^*]+)\*(?!\w)", r"<em>\1</em>", t)
    t = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", _enlace, t)
    return t


def _enlace(m) -> str:
    """Un enlace que sale del sitio (`../`, o a un `.md` del repositorio) sería un 404 en la
    página publicada, que vive en `centro-desarrollo/`. Se degrada a texto: mejor sin enlace
    que con uno roto."""
    texto, url = m.group(1), m.group(2).strip()
    interno = url.startswith(("#", "http://", "https://")) or (
        not url.startswith("../") and "/../" not in url and not url.endswith(".md"))
    return f'<a href="{url}">{texto}</a>' if interno else f"<em>{texto}</em>"


def md(texto: str) -> str:
    """Subconjunto de markdown suficiente para narrativa e índices. No pretende ser completo.
    Emite las clases del kit único (`table-scroll`), no las del generador retirado."""
    salida, lineas, i = [], sin_comentarios(sin_frontmatter(texto)).splitlines(), 0
    while i < len(lineas):
        linea = lineas[i]
        if linea.strip().startswith("```"):
            i += 1
            bloque = []
            while i < len(lineas) and not lineas[i].strip().startswith("```"):
                bloque.append(esc(lineas[i]))
                i += 1
            salida.append("<pre><code>" + "\n".join(bloque) + "</code></pre>")
        elif linea.strip().startswith("|"):
            filas = []
            while i < len(lineas) and lineas[i].strip().startswith("|"):
                celdas = [c.strip() for c in lineas[i].strip().strip("|").split("|")]
                if not all(re.fullmatch(r":?-{2,}:?", c) for c in celdas if c):
                    filas.append(celdas)
                i += 1
            i -= 1
            if filas:
                cab = "".join(f"<th>{en_linea(c)}</th>" for c in filas[0])
                cuerpo = "".join(
                    "<tr>" + "".join(f"<td>{en_linea(c)}</td>" for c in fila) + "</tr>"
                    for fila in filas[1:]
                )
                salida.append(f'<div class="table-scroll"><table>'
                              f"<thead><tr>{cab}</tr></thead><tbody>{cuerpo}</tbody></table></div>")
        elif re.match(r"^#{1,6}\s", linea):
            # El `<h1>` de la página lo pinta el header compacto desde el rótulo del menú,
            # así que aquí los niveles arrancan en h2 y `##` conserva el look de sección.
            # Sin esto, un documento del repositorio salía con todas sus secciones
            # degradadas un nivel y sin el subrayado que las separa.
            nivel = max(min(len(linea) - len(linea.lstrip("#")), 6), 2)
            clase = ' class="section-title"' if nivel == 2 else ""
            salida.append(f"<h{nivel}{clase}>{en_linea(linea.lstrip('# ').strip())}</h{nivel}>")
        elif linea.strip().startswith(">"):
            cita = []
            while i < len(lineas) and lineas[i].strip().startswith(">"):
                cita.append(lineas[i].strip().lstrip("> ").strip())
                i += 1
            i -= 1
            salida.append(f"<blockquote>{en_linea(' '.join(cita))}</blockquote>")
        elif re.match(r"^\s*([-*]|\d+\.)\s+", linea):
            puntos = []
            while i < len(lineas):
                if re.match(r"^\s*([-*]|\d+\.)\s+", lineas[i]):
                    puntos.append(re.sub(r"^\s*([-*]|\d+\.)\s+", "", lineas[i]).strip())
                elif puntos and lineas[i].strip() and \
                        not re.match(r"^(#{1,6}\s|\||>|```)", lineas[i].strip()):
                    # Continuación del punto anterior: si no se une, el énfasis que cruza el
                    # salto de línea (`**texto\ntexto**`) se queda sin cerrar.
                    puntos[-1] += " " + lineas[i].strip()
                else:
                    break
                i += 1
            i -= 1
            salida.append("<ul>" + "".join(f"<li>{en_linea(p)}</li>" for p in puntos) + "</ul>")
        elif linea.strip() in ("---", "***"):
            salida.append('<div class="separator"></div>')
        elif linea.strip():
            parrafo = [linea.strip()]
            while i + 1 < len(lineas) and lineas[i + 1].strip() and \
                    not re.match(r"^(#{1,6}\s|\||>|```|\s*([-*]|\d+\.)\s)", lineas[i + 1]):
                i += 1
                parrafo.append(lineas[i].strip())
            salida.append(f"<p>{en_linea(' '.join(parrafo))}</p>")
        i += 1
    return "\n".join(salida)


def md_documento(texto: str) -> str:
    """Un documento del repositorio publicado como página: sin frontmatter y sin su
    `# Título` de cabecera. El header compacto ya escribe el título desde el rótulo del
    menú; dejar el del documento lo imprimía dos veces, una debajo de la otra."""
    limpio = sin_frontmatter(texto)
    return md(re.sub(r"^\s*#\s+.*$\n?", "", limpio, count=1, flags=re.M))


# ══════════════════════════════════════════════════════════ marca y navegación

def partir_marca(nombre: str) -> tuple:
    """Parte el nombre del centro en (prefijo, acento) para el logotipo del sidebar.

    Se DERIVA del marcador, no se escribe: un nombre camelCase parte por la mayúscula
    interior (`miProducto` → `mi` + `Producto`); uno con espacios, por el último espacio
    (`Centro Alfa` → `Centro ` + `Alfa`). Si no hay por dónde partir, todo el nombre es el
    acento. Cambiar `centro` en el marcador re-marca el sidebar entero.
    """
    m = re.match(r"^([a-z0-9]+)([A-Z].*)$", nombre)
    if m:
        return m.group(1), m.group(2)
    if " " in nombre.strip():
        cabeza, _, cola = nombre.strip().rpartition(" ")
        return cabeza + " ", cola
    return "", nombre


def plural(n: int, singular: str, plural_: str) -> str:
    """«1 patrón», no «1 patrones». Es cosmético, pero un centro recién montado tiene casi
    todos los conteos en 1 y esa es justo la primera impresión."""
    return f"{n} {singular if n == 1 else plural_}"


def contar_patrones(c: Centro) -> int:
    total = 0
    for sl in c.slices():
        d = os.path.join(c.ruta("docs"), sl)
        if os.path.isdir(d):
            total += len([f for f in os.listdir(d)
                          if f.endswith(".md") and not f.startswith("_")])
    return total


def listar_skills(c: Centro) -> list:
    """[(nombre, descripción, es_stub)] leído de los frontmatter. Un catálogo escrito a mano
    diverge en la primera semana."""
    dir_skills = c.ruta("skills")
    filas = []
    if not os.path.isdir(dir_skills):
        return filas
    for nom in sorted(os.listdir(dir_skills)):
        ruta = os.path.join(dir_skills, nom, "SKILL.md")
        if not os.path.isfile(ruta):
            continue
        texto = leer(ruta)
        n = re.search(r"^name:\s*(.+)$", texto, re.M)
        desc = re.search(r"^description:\s*(.+)$", texto, re.M)
        filas.append((n.group(1).strip() if n else nom,
                      desc.group(1).strip() if desc else "—",
                      bool(re.search(r"\*\*STUB", texto))))
    return filas


def fuente_narrativa(c: Centro, pid: str, respaldo: str | None) -> str:
    """Ruta del markdown de una página narrativa, o '' si todavía no existe."""
    dir_paginas = os.path.join(c.hub, c.paths.get("paginas", "paginas"))
    propia = os.path.join(dir_paginas, f"{pid}.md")
    if os.path.isfile(propia):
        return propia
    if respaldo:
        try:
            ruta = c.ruta(respaldo)
        except KeyError:
            return ""
        if os.path.isfile(ruta):
            return ruta
    return ""


def construir_nav(c: Centro, disponibles: dict, workspaces: dict) -> list:
    """El menú entero, DERIVADO. Cada entrada existe porque su página se va a escribir.

    `disponibles` = {id: ruta_fuente} de las narrativas que sí tienen markdown.
    Una entrada de sección se emite solo si algo la sigue: una cabecera sola es ruido.
    """
    n_pat, n_sk = contar_patrones(c), len(listar_skills(c))
    n_ws = len(workspaces)

    entradas = [
        ("General", "index", "&#9673;", "Inicio", ["portada"]),
    ]
    for pid, seccion, icono, rotulo, _ in PAGINAS_NARRATIVAS:
        if pid in disponibles:
            entradas.append((seccion, pid, icono, rotulo, []))
    entradas.append(("Arquitectura y Diseño", "patrones", "&#9776;",
                     "Biblioteca de Patrones", [plural(n_pat, "patrón", "patrones")]))
    entradas.append(("Desarrollo", "skills", "&#10070;", "Skills del centro",
                     [plural(n_sk, "skill", "skills")]))
    entradas.append(("Desarrollo", "avances", "&#9745;", "Bitácora / Avances",
                     [plural(n_ws, "workspace", "workspaces")]))

    orden = ["General", "Arquitectura y Diseño", "Desarrollo"]
    nav, seccion_previa = [], None
    for seccion in orden:
        for s, pid, icono, rotulo, tags in entradas:
            if s != seccion:
                continue
            if seccion != seccion_previa:
                nav.append({"section": seccion})
                seccion_previa = seccion
            nav.append({"id": pid, "icon": icono, "label": rotulo, "tags": tags})
            if pid == "avances":
                # Un sub-item por workspace, DERIVADO del marcador. El rótulo es la CLAVE del
                # workspace, no su `desc`: la clave es el identificador que se usa en
                # `.work/<ws>/` y en el nombre del archivo, mientras que `desc` es una frase
                # que no cabe en un menú de 240 px. La descripción ya se lee en el panorama.
                for ws in workspaces:
                    nav.append({"id": f"avances-{ws}", "icon": "&#9702;",
                                "label": ws, "sub": True})
    return nav


def js_literal(valor) -> str:
    """Serializa a JS sin `json`: entidades como `&#9673;` deben viajar tal cual.

    Y el destino es un `.js`, no un `.json`, por la regla 8: con `file://`, CORS bloquea
    `fetch()` de un JSON local y el menú saldría vacío.
    """
    if isinstance(valor, bool):
        return "true" if valor else "false"
    if isinstance(valor, (int, float)):
        return str(valor)
    if isinstance(valor, list):
        return "[" + ", ".join(js_literal(v) for v in valor) + "]"
    if isinstance(valor, dict):
        return "{" + ", ".join(f"{k}: {js_literal(v)}" for k, v in valor.items()) + "}"
    s = str(valor).replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ")
    return f"'{s}'"


def nav_data_js(nombre: str, nav: list) -> str:
    pre, acento = partir_marca(nombre)
    lineas = [
        "/* GENERADO por render.py — no editar a mano; el próximo render lo pisa.",
        "   Los workspaces salen del marcador y los conteos del disco: aquí no se",
        "   escribe ni un dato a mano. */",
        "window.CENTRO_NAV = {",
        "  marca: %s," % js_literal({"pre": pre, "acento": acento,
                                     "sub": "Centro de desarrollo"}),
        "  version: %s," % js_literal("v" + VERSION),
        "  anio: %s," % js_literal(str(date.today().year)),
        "  pages: [",
    ]
    lineas += ["    %s," % js_literal(p) for p in nav]
    lineas += ["  ]", "};", ""]
    return "\n".join(lineas)


# ══════════════════════════════════════════════════════════ envoltorio de página

def pagina(titulo: str, nombre_centro: str, cuerpo: str) -> str:
    """El ÚNICO envoltorio de página del sitio. Toda página pasa por aquí, así que el kit,
    los scripts y el pie no pueden divergir entre secciones."""
    return f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{esc(titulo)} &mdash; {esc(nombre_centro)}</title>
<link rel="stylesheet" href="css/styles.css">
</head>
<body class="with-sidebar">
<main class="main-content">
<div class="container">

{cuerpo}

</div>
<footer class="page-footer"><strong>{esc(nombre_centro)}</strong> &mdash; Centro de desarrollo
&bull; generado {date.today().isoformat()} &bull; render {VERSION}</footer>
</main>
<script src="js/nav-data.js"></script>
<script src="js/nav.js"></script>
<script src="js/bitacora.js"></script>
</body>
</html>
"""


# ══════════════════════════════════════════════════════════ páginas derivadas

def cuerpo_portada(c: Centro, nav: list, resumen: dict, fuente_intro: str) -> str:
    n_pat, skills = contar_patrones(c), listar_skills(c)
    stats = bit.stat_grid([
        ("border-blue", str(n_pat), "Patrones t&eacute;cnicos"),
        ("border-info", str(len(skills)), "Skills del centro"),
        ("border-purple", str(resumen["ws"]), "Workspaces"),
        ("border-warning", str(resumen["items"]), "Funcionalidades en curso o cerradas"),
        ("border-teal", "%d%%" % resumen["pct"], "Avance (CAs) &middot; %d/%d"
         % (resumen["cumplen"], resumen["total"])),
    ])

    tarjetas = []
    for p in nav:
        if "id" not in p or p.get("sub") or p["id"] == "index":
            continue
        tarjetas.append(
            '        <a class="module-card" href="%s.html">'
            '<div class="module-icon">%s</div><h3>%s</h3><p>%s</p></a>'
            % (esc(p["id"]), p.get("icon", ""), esc(p["label"]),
               " &middot; ".join(esc(t) for t in p.get("tags", [])) or "&nbsp;"))
    mapa = ('    <div class="grid-3">\n' + "\n".join(tarjetas) + "\n    </div>") if tarjetas else ""

    narrativa = f'<section>{md(leer(fuente_intro))}</section>' if fuente_intro else ""

    return f"""    <div class="info-box">
        <strong>Centro de desarrollo de {esc(c.marcador.get('centro', ''))}.</strong>
        Todas estas p&aacute;ginas est&aacute;n <strong>generadas</strong> desde el marcador,
        <code>docs/</code> y <code>.work/</code>: ninguna se escribe a mano y ning&uacute;n
        conteo se teclea. Si un dato no est&aacute; en la fuente, no aparece aqu&iacute;.
    </div>

{stats}

    <h2 class="section-title">Por d&oacute;nde entrar</h2>
{mapa}
{narrativa}"""


def cuerpo_patrones(c: Centro) -> str:
    idx = leer(c.ruta("index"))
    if not idx.strip():
        return bit.vacio_html("Todav&iacute;a no hay biblioteca de patrones.",
                              "Esta p&aacute;gina se deriva de <code>docs/index.md</code>.")
    conteo = []
    for sl in c.slices():
        d = os.path.join(c.ruta("docs"), sl)
        n = len([f for f in os.listdir(d)
                 if f.endswith(".md") and not f.startswith("_")]) if os.path.isdir(d) else 0
        conteo.append(f"{esc(sl)}: {n}")
    cabecera = (f'    <div class="info-box"><strong>Patrones por slice &mdash; '
                f'{" &middot; ".join(conteo) or "sin slices"}.</strong> '
                f'<strong>Los cuenta el generador</strong> recorriendo <code>docs/</code>: '
                f'un conteo escrito a mano se desactualiza siempre.</div>')
    return cabecera + "\n" + md_documento(idx)


def cuerpo_skills(c: Centro) -> str:
    filas = listar_skills(c)
    if not filas:
        return bit.vacio_html("No hay skills en el centro todav&iacute;a.",
                              "Se derivan de los <code>SKILL.md</code> de "
                              "<code>.claude/skills/</code>.")
    marca_stub = '<span class="status status-pending">sin escribir</span>'
    cuerpo = "".join(
        f"<tr><td><code>{esc(n)}</code></td><td>{esc(d)}</td>"
        f"<td>{marca_stub if stub else ''}</td></tr>"
        for n, d, stub in filas)
    return (f'    <div class="info-box"><strong>{len(filas)} skills.</strong> El cat&aacute;logo '
            f'se deriva del frontmatter de cada <code>SKILL.md</code>; el conteo del men&uacute; '
            f'sale de este mismo recorrido.</div>\n'
            f'    <h2 class="section-title">Cat&aacute;logo</h2>\n'
            f'    <div class="table-scroll"><table class="data-table" data-table="skills" '
            f'data-page-size="20"><thead><tr><th>Skill</th><th>Qu&eacute; hace</th><th></th>'
            f"</tr></thead><tbody>{cuerpo}</tbody></table></div>")


def cuerpo_narrativa(ruta: str) -> str:
    return md_documento(leer(ruta))


# ══════════════════════════════════════════════════════════ main

def main(argv):
    try:
        c = Centro(argv[1]) if len(argv) > 1 else Centro.descubrir()
    except (CentroNoEncontrado, OSError, ValueError) as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1

    nombre = c.marcador.get("centro", "Centro de desarrollo")
    workspaces = c.workspaces()
    if "{{" in nombre or any("{{" in ws for ws in workspaces):
        AVISOS.append("el marcador conserva tokens de plantilla sin resolver: el sitio saldrá "
                      "con nombres de relleno")
    if not workspaces:
        AVISOS.append("el marcador no declara workspaces: no habrá páginas de avances")

    # ---- narrativas disponibles (las que NO existen no generan nada, ni entrada de menú)
    disponibles = {}
    for pid, _s, _i, _r, respaldo in PAGINAS_NARRATIVAS:
        ruta = fuente_narrativa(c, pid, respaldo)
        if ruta:
            disponibles[pid] = ruta
        else:
            AVISOS.append(f"página `{pid}`: sin markdown fuente — no se publica y no aparece "
                          f"en el menú (escríbela en {c.paths.get('paginas', 'paginas')}/{pid}.md)")

    nav = construir_nav(c, disponibles, workspaces)

    # ---- bitácora: el cuerpo lo produce la biblioteca; el envoltorio, esta función
    resumenes = [bit.render_ws(c.hub, ws, meta) for ws, meta in workspaces.items()]
    panorama = bit.render_panorama(c.hub, {"workspaces": workspaces}, resumenes)

    # ---- salida: se borra entera (regla 3)
    salida = c.ruta("sitio")
    if os.path.isdir(salida):
        shutil.rmtree(salida)
    for sub in ("", "css", "js"):
        os.makedirs(os.path.join(salida, sub), exist_ok=True)

    kit = os.path.join(_AQUI, "plantillas")
    for origen, destino in KIT:
        shutil.copyfile(os.path.join(kit, origen), os.path.join(salida, destino))
    escribir(os.path.join(salida, "js", "nav-data.js"), nav_data_js(nombre, nav))

    total_cumplen = sum(r["ca_cumple"] for r in resumenes)
    total_ca = sum(r["ca_total"] for r in resumenes)
    resumen = {"ws": len(workspaces), "items": sum(r["n"] for r in resumenes),
               "cumplen": total_cumplen, "total": total_ca,
               "pct": panorama["pct"]}

    paginas = {
        "index.html": pagina("Inicio", nombre,
                             cuerpo_portada(c, nav, resumen,
                                            fuente_narrativa(c, "index", None))),
        "patrones.html": pagina("Biblioteca de patrones", nombre, cuerpo_patrones(c)),
        "skills.html": pagina("Skills del centro", nombre, cuerpo_skills(c)),
    }
    for pid, ruta in disponibles.items():
        rotulo = next(r for p, _s, _i, r, _b in PAGINAS_NARRATIVAS if p == pid)
        paginas[f"{pid}.html"] = pagina(rotulo, nombre, cuerpo_narrativa(ruta))

    # gemelos .md de la bitácora: la proyección legible que leen otros agentes
    for r in [panorama] + resumenes:
        paginas[r["archivo"] + ".html"] = pagina(r["titulo"], nombre, r["html"])
        paginas[r["archivo"] + ".md"] = r["md"]

    for archivo, contenido in paginas.items():
        escribir(os.path.join(salida, archivo), contenido)

    n_html = len([p for p in paginas if p.endswith(".html")])
    print(f"Sitio generado en {salida}")
    print(f"  {n_html} páginas · {len(workspaces)} workspace(s) · {resumen['items']} item(s) · "
          f"{contar_patrones(c)} patrones · {len(listar_skills(c))} skills")
    print(f"  kit único: css/styles.css + js/nav.js + js/bitacora.js + js/nav-data.js (derivado)")
    for a in AVISOS:
        print(f"  aviso  {a}")
    return 0


def escribir(ruta: str, contenido: str) -> None:
    os.makedirs(os.path.dirname(ruta), exist_ok=True)
    with open(ruta, "w", encoding="utf-8") as f:
        f.write(contenido)


if __name__ == "__main__":
    sys.exit(main(sys.argv))
