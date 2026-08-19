#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
bitacora_render — BIBLIOTECA del motor de la bitácora. **No es un punto de entrada.**

Proyecta los `progreso.md` de `.work/<ws>/*/` al CUERPO de las páginas de avances
(`avances-<ws>` y el panorama `avances`), en sus dos formas gemelas: markdown legible
y HTML. Cero tokens de LLM, cero deriva: lo que sale es exactamente lo que dicen los
`progreso.md`. La NARRATIVA editorial (que no vive en `progreso.md`) se inyecta
VERBATIM desde un `_intro.md` opcional:

  - `.work/<ws>/_intro.md`  → narrativa de la página del workspace
  - `.work/_intro.md`       → narrativa del panorama

QUIÉN LO LLAMA
--------------
`render.py`, y solo él. Este módulo devuelve el **contenido** (el interior del
`<div class="container">` y el `.md` gemelo); el envoltorio de página — `<head>`,
marca, sidebar, footer, scripts — lo pone `render.py`, que es el único que sabe
cómo se llama el centro. Ese reparto es deliberado: mientras este archivo también
escribía páginas completas, existían dos generadores que se pisaban el mismo
`avances-<ws>.html` y estampaban dos kits visuales distintos.

El renderer NO inventa: si un dato no está en `progreso.md`, no aparece.
"""
import os
import re
import sys

# ---------------------------------------------------------------- utilidades

_ENT = {
    'á': '&aacute;', 'é': '&eacute;', 'í': '&iacute;', 'ó': '&oacute;', 'ú': '&uacute;',
    'Á': '&Aacute;', 'É': '&Eacute;', 'Í': '&Iacute;', 'Ó': '&Oacute;', 'Ú': '&Uacute;',
    'ñ': '&ntilde;', 'Ñ': '&Ntilde;', 'ü': '&uuml;', 'Ü': '&Uuml;',
    '—': '&mdash;', '–': '&ndash;', '·': '&middot;', '→': '&rarr;', '←': '&larr;',
    '§': '&sect;', '“': '&ldquo;', '”': '&rdquo;', '‘': '&lsquo;', '’': '&rsquo;',
    '≡': '&equiv;', '≥': '&ge;', '≤': '&le;', '×': '&times;', '…': '&hellip;',
    '¿': '&iquest;', '¡': '&iexcl;', '°': '&deg;', '»': '&raquo;', '«': '&laquo;',
}


def ent(s):
    """Escapa &<>\"' y convierte acentos/símbolos a entidades HTML (regla del kit).
    Escapa comillas porque la salida se usa también en contexto de atributo."""
    if s is None:
        return ''
    s = (s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
          .replace('"', '&quot;').replace("'", '&#39;'))
    return ''.join(_ENT.get(c, c) for c in s)


_INLINE = re.compile(
    r'`([^`]+)`'                       # 1 code
    r'|\*\*([^*]+)\*\*'                # 2 bold
    r'|\[([^\]]+)\]\(([^)]+)\)'        # 3,4 link
    r'|(?<![\w*])\*([^*\n]+)\*(?![\w*])'   # 5 em con *
    r'|(?<![\w_])_([^_\n]+)_(?![\w_])'     # 6 em con _
)


def _codeify(s):
    """Entidad-encoding con spans de código (`x` → <code>x</code>). Sin otro marcado."""
    out, pos = [], 0
    for mm in re.finditer(r'`([^`]+)`', s):
        out.append(ent(s[pos:mm.start()]))
        out.append('<code>' + ent(mm.group(1)) + '</code>')
        pos = mm.end()
    out.append(ent(s[pos:]))
    return ''.join(out)


def md_inline(s):
    """Convierte marcado inline (code/bold/em/link) + entidades. Sin anidamiento."""
    if s is None:
        return ''
    out, pos = [], 0
    for m in _INLINE.finditer(s):
        out.append(ent(s[pos:m.start()]))
        if m.group(1) is not None:
            out.append('<code>' + ent(m.group(1)) + '</code>')
        elif m.group(2) is not None:
            out.append('<strong>' + md_inline(m.group(2)) + '</strong>')  # code/em anidados
        elif m.group(3) is not None:
            url = m.group(4).strip()
            # Un link que escapa del sitio (`../`) o que apunta a un `.md` del centro es un
            # enlace roto en la página publicada, que vive en el directorio del sitio: se deja
            # solo el texto. La regla incluye el `.md` porque el caso real no fue un `../`:
            # un `progreso.md` citaba a su hermano `[validacion-requisitos.md](…)`, ruta
            # perfectamente válida DENTRO del item y un 404 una vez publicada. Es la misma
            # regla que aplica `render.py` a las páginas narrativas; tenerla en un solo lado
            # dejaba el agujero justo en las páginas que más enlaces traen.
            interno_roto = (url.startswith('../') or '/../' in url
                            or (url.endswith('.md') and not url.startswith(('http://', 'https://'))))
            if interno_roto:
                out.append(_codeify(m.group(3)))
            else:
                out.append('<a href="' + ent(url) + '">' + _codeify(m.group(3)) + '</a>')
        elif m.group(5) is not None:
            out.append('<em>' + md_inline(m.group(5)) + '</em>')
        elif m.group(6) is not None:
            out.append('<em>' + md_inline(m.group(6)) + '</em>')
        pos = m.end()
    out.append(ent(s[pos:]))
    return ''.join(out)


# ---------------------------------------------------------------- parseo md

def split_sections(md):
    """Devuelve (preamble_lines, [(title, [body_lines]), ...]) partiendo por '## '."""
    lines = md.splitlines()
    preamble, sections, cur_title, cur_body = [], [], None, []
    for ln in lines:
        m = re.match(r'^##\s+(.*)$', ln)
        if m:
            if cur_title is None:
                pass
            else:
                sections.append((cur_title, cur_body))
            cur_title, cur_body = m.group(1).strip(), []
        elif cur_title is None:
            preamble.append(ln)
        else:
            cur_body.append(ln)
    if cur_title is not None:
        sections.append((cur_title, cur_body))
    return preamble, sections


def find_section(sections, *keywords):
    """Primera sección cuyo título contiene ALGUNO de los keywords (case-insensitive)."""
    for title, body in sections:
        low = title.lower()
        if any(k.lower() in low for k in keywords):
            return title, body
    return None, None


def parse_tables(body_lines):
    """Extrae todas las tablas markdown de un bloque. Devuelve [(headers, rows)].

    Delega en `split_blocks` para que exista UN solo escáner de tablas: mantener dos
    copias del mismo reconocimiento hacía que afinar una (una fila con `|` dentro de un
    bloque de código, un separador con alineación) dejara a la otra atrás, y el mismo
    markdown se renderizara distinto según por qué rama entrara.
    """
    return [data for kind, data in split_blocks(body_lines) if kind == 'table']


def split_blocks(body_lines):
    """Divide un bloque en prosa y tablas EN ORDEN.

    `parse_tables` solo devuelve las tablas, así que quien la usaba para decidir qué emitir
    descartaba silenciosamente toda la prosa de la sección. Devuelve una lista de
    ('text', [lineas]) | ('table', (headers, rows)).
    """
    bloques, buf, i, n = [], [], 0, len(body_lines)

    def flush():
        if any(l.strip() for l in buf):
            bloques.append(('text', list(buf)))
        buf.clear()

    while i < n:
        ln = body_lines[i].strip()
        if ln.startswith('|') and i + 1 < n and re.match(r'^\|[\s:|-]+\|?\s*$', body_lines[i + 1].strip()):
            flush()
            headers = [c.strip() for c in ln.strip('|').split('|')]
            i += 2
            rows = []
            while i < n and body_lines[i].strip().startswith('|'):
                rows.append([c.strip() for c in body_lines[i].strip().strip('|').split('|')])
                i += 1
            bloques.append(('table', (headers, rows)))
        else:
            buf.append(body_lines[i])
            i += 1
    flush()
    return bloques


def prose_lines(data, quitar_vineta=False):
    """Líneas de prosa listas para emitir, con los encabezados degradados a negrita.

    Un `### Título` dentro del cuerpo de una sección saldría con los `###` literales, y en
    el markdown generado ese nivel colisiona con el que el sitio reserva para los items:
    partiría el índice en secciones falsas. Normalizarlo es común a las dos rutas.

    Quitar la viñeta, en cambio, es propio del HTML, donde cada línea acaba en su propio
    `<p>`. En markdown hay que conservarla: sin el `- ` inicial, y sin líneas en blanco
    entre medias, las líneas consecutivas se funden en un solo párrafo y la lista
    desaparece.
    """
    salida = []
    for l in data:
        if not l.strip():
            continue
        m = re.match(r'^\s*#{1,6}\s+(.*)$', l)
        if m:
            salida.append('**%s**' % m.group(1).strip())
        else:
            salida.append(re.sub(r'^\s*-\s*', '', l) if quitar_vineta else l)
    return salida


def parse_tables_raw(raw):
    return parse_tables(raw.splitlines())


def count_cas(raw):
    """Cuenta CAs únicos (por id `CA-N`) en TODAS las tablas con 'Veredicto' del doc.
    Dedup por id — así una re-verificación (mismo CA en otra tabla) no duplica, y un CA
    en una sub-sección (h3) o en otra sección (Clusters/REV) sí cuenta. CUMPLE si el
    veredicto empieza por CUMPLE. Devuelve (cumple, total)."""
    verdicts = {}
    for headers, rows in parse_tables_raw(raw):
        low = [h.lower() for h in headers]
        if not any('veredicto' in h for h in low):
            continue
        vidx = next(k for k, h in enumerate(low) if 'veredicto' in h)
        for r in rows:
            if not r:
                continue
            m = re.search(r'CA[-\s]?(\d+)', r[0])
            if not m:
                continue
            cid = int(m.group(1))
            verdict = re.sub(r'[*`_()]', '', r[vidx] if vidx < len(r) else '').strip().upper()
            verdicts[cid] = verdict.startswith('CUMPLE')
    total = len(verdicts)
    cumple = sum(1 for v in verdicts.values() if v)
    return cumple, total


def ca_tables_of(raw):
    """Todas las tablas de CA (con 'Veredicto' y filas `CA-N`) del documento, en orden."""
    out = []
    for headers, rows in parse_tables_raw(raw):
        if 'veredicto' not in ' '.join(headers).lower():
            continue
        if any(re.search(r'CA[-\s]?\d', (r[0] if r else '')) for r in rows):
            out.append((headers, rows))
    return out


def parse_ca_count(mbody):
    """Extrae (cumple, total) de la métrica del item: `% = CAs CUMPLE / total`.
    Acepta '13/13 CAs', '(20/20 CAs`CUMPLE`)' y la tabla '(16/16)'."""
    text = ' '.join(mbody)
    m = re.search(r'(\d+)\s*/\s*(\d+)\s*CAs?', text)
    if not m:
        m = re.search(r'\((\d+)\s*/\s*(\d+)\)', text)
    if m:
        return int(m.group(1)), int(m.group(2))
    return None


def pick_fase_table(tables):
    """De varias tablas, la de fases (cabecera `Fase | Artefacto | …`), no la de clusters/CA."""
    for headers, rows in tables:
        low = [h.lower() for h in headers]
        if low and low[0].startswith('fase') and any(('artefacto' in h or 'estado' in h) for h in low):
            return (headers, rows)
    return tables[0] if tables else None


_KEY_ALIAS = {
    'fecha de forja': 'forjado', 'forjado': 'forjado', 'rápido': 'rapido',
    'autonomía': 'autonomia', 'prevalidación': 'prevalidacion',
    'modelo/esfuerzo': 'modelo', 'modelo y esfuerzo': 'modelo',
}


def _norm_key(k):
    k = re.sub(r'[*`]', '', k).strip().lower().rstrip(':').rstrip('.')
    return _KEY_ALIAS.get(k, k)


def parse_header_fields(preamble):
    """Parser TOLERANTE de la cabecera del `progreso.md`. Entiende las tres formas
    presentes en `.work/`: (a) bullets `- **clave:** valor` con varios pares
    `·`-separados por línea; (b) tabla `| Campo | Valor |`; (c) párrafo `**Resumen.** …`.
    Claves case-insensitive con alias. Devuelve (fields, sub-bullets de modelo/esfuerzo)."""
    fields, sub, last = {}, [], None
    i, n = 0, len(preamble)
    while i < n:
        ln = preamble[i]
        s = ln.strip()
        # (b) fila de tabla | clave | valor |  (ignora separadores y la fila de encabezado)
        mt = re.match(r'^\|\s*(.+?)\s*\|\s*(.*?)\s*\|\s*$', s)
        if mt and not re.match(r'^\|[\s:|-]+\|?\s*$', s):
            key = _norm_key(mt.group(1))
            if key not in ('campo', 'valor', 'clave') and mt.group(2).strip():
                fields[key] = mt.group(2).strip()
                last = key
            i += 1
            continue
        # sub-bullet de modelo/esfuerzo: «  - analyze → Opus · high»
        msub = re.match(r'^\s+-\s+(.*)$', ln)
        if msub and last == 'modelo':
            sub.append(msub.group(1).strip())
            i += 1
            continue
        # (a)/(c) bullet o párrafo con uno o varios pares **clave:** valor
        if s.startswith('-') or re.match(r'^\*\*[^*]+\*\*', s):
            body = re.sub(r'^-\s*', '', s)
            for frag in re.split(r'\s+·\s+', body):
                mp = re.match(r'^\*\*(.+?):?\*\*[:.]?\s*(.*)$', frag)
                if mp:
                    last = _norm_key(mp.group(1))
                    fields[last] = mp.group(2).strip()
                elif last:  # fragmento sin clave → parte del valor anterior (`·` en el valor)
                    fields[last] = (fields[last] + ' · ' + frag).strip(' ·')
            i += 1
            continue
        # continuación (wrap) del último campo
        if s and last and not re.match(r'^\s*([-*|]|\d+\.)\s', ln):
            fields[last] = (fields[last] + ' ' + s).strip()
        i += 1
    return fields, sub


# ---------------------------------------------------------------- modelo item

class Item:
    def __init__(self, ws, item_id, path):
        self.ws = ws
        self.id = item_id
        self.path = path
        self.raw = ''
        self.fields = {}
        self.modelo = []          # sub-bullets de modelo/esfuerzo
        self.resumen = ''
        self.autor = ''
        self.autor_email = ''
        self.tipo = ''
        self.complejidad = ''
        self.plantilla = ''
        self.rapido = ''
        self.forjado = ''
        self.autonomia = ''
        self.prevalidacion = ''
        self.ramas = None         # (headers, rows) o None
        self.modelo_tbl = None
        self.fases = None
        self.ca_total = 0
        self.ca_cumple = 0
        self.fase_n = 0
        self.fase_label = ''
        self.estado = 'en-curso'
        self.confianza = 'auto'
        self.retrabajo = ''
        self.metricas = None      # (headers, rows) o lista de bullets
        self.metricas_body = []
        self.siguiente = []
        self.registro = []        # filas del log
        self.extra = []           # (title, body) de secciones no reconocidas

    # -- derivados legibles --
    @property
    def pct(self):
        return 0 if self.ca_total == 0 else round(100 * self.ca_cumple / self.ca_total)


def load_item(ws, item_id, progreso_path):
    it = Item(ws, item_id, progreso_path)
    with open(progreso_path, encoding='utf-8') as f:
        it.raw = f.read()
    preamble, sections = split_sections(it.raw)
    fields, sub = parse_header_fields(preamble)
    it.fields = fields
    it.modelo = sub

    it.tipo = fields.get('tipo', '')
    it.complejidad = re.sub(r'[*`]', '', fields.get('complejidad', '')).strip()
    # plantilla y rápido pueden venir juntos en una celda ("MÍNIMA · Rápido: no")
    plant = fields.get('plantilla', '')
    it.plantilla = re.sub(r'[*`]', '', plant).split('·')[0].split('(')[0].strip()
    it.rapido = fields.get('rapido', '')
    if not it.rapido:
        mr = re.search(r'r[áa]pido:?\s*(\w+)', plant, re.I)
        it.rapido = mr.group(1) if mr else ''
    it.forjado = fields.get('forjado', '')
    it.autonomia = fields.get('autonomia', '')
    it.prevalidacion = fields.get('prevalidacion', '')
    it.resumen = fields.get('resumen', '')

    # autor: normaliza `<...>` y su forma ya escapada `&lt;...&gt;`
    autor = fields.get('autor', '').replace('&lt;', '<').replace('&gt;', '>')
    ma = re.match(r'(.+?)\s*<(.+?)>', autor)
    if ma:
        it.autor = re.sub(r'[*`]', '', ma.group(1)).strip()
        it.autor_email = ma.group(2).strip()
    else:
        it.autor = re.sub(r'[*`]', '', autor).strip()

    # ramas
    _, rbody = find_section(sections, 'Ramas de trabajo')
    if rbody:
        t = parse_tables(rbody)
        it.ramas = t[0] if t else None

    # modelo/esfuerzo como tabla (de los sub-bullets `fase → Modelo · esf`)
    it.modelo_tbl = parse_modelo(it.modelo)

    # fases / clusters — elige la tabla de fases aunque la sección traiga varias tablas
    ftitle, fbody = find_section(sections, 'Fases', 'Clusters', 'Unidad única', 'Unidad unica')
    if fbody:
        it.fases = pick_fase_table(parse_tables(fbody))
        compute_fase(it)

    # métricas → estado / confianza / retrabajo (tolera bullets y tabla)
    _, mbody = find_section(sections, 'Métricas', 'Metricas')
    if mbody:
        it.metricas_body = mbody
        t = parse_tables(mbody)
        it.metricas = t[0] if t else None
        parse_metricas(it, mbody)

    # criterios de aceptación → CUMPLE/total. La MÉTRICA es la fuente autoritativa
    # (`% = CAs CUMPLE / total`, la calcula el runner); dedup-scan solo de respaldo.
    mc = parse_ca_count(mbody) if mbody else None
    it.ca_cumple, it.ca_total = mc if mc else count_cas(it.raw)

    # fallback de fase: un item completado sin tabla de fases legible = 5/5
    if it.fase_n == 0 and it.estado == 'completado':
        it.fase_n = 5
        if not it.fase_label:
            it.fase_label = 'Close'

    # siguiente paso
    _, sbody = find_section(sections, 'Siguiente')
    if sbody:
        it.siguiente = [l for l in sbody if l.strip()]

    # registro de actividad → log
    _, rgbody = find_section(sections, 'Registro de actividad', 'Registro')
    if rgbody:
        for headers, rows in parse_tables(rgbody):
            for r in rows:
                it.registro.append(r)

    # secciones no reconocidas → detalle genérico (PRs de integración, Rondas, etc.)
    known = ('ramas', 'fases', 'clusters', 'criterios', 'métricas', 'metricas',
             'siguiente', 'registro', 'decisiones')
    for title, body in sections:
        low = title.lower()
        if not any(k in low for k in known):
            it.extra.append((title, body))

    return it


def parse_modelo(sub):
    """['analyze → Opus · high', ...] o ['analyze → **Opus · high** (nota)'] → (headers, rows)."""
    rows = []
    for s in sub:
        m = re.match(r'(\w+)\s*(?:→|->)\s*(.*)$', s)
        if not m:
            continue
        fase = m.group(1)
        rest = m.group(2).strip()
        # separa "Modelo · esfuerzo" y nota opcional tras "—" o "("
        nota = ''
        mm = re.split(r'\s+—\s+|\s+\(', rest, maxsplit=1)
        core = mm[0].strip()
        if len(mm) > 1:
            nota = mm[1].rstrip(')').strip()
        parts = re.split(r'\s*·\s*', core)
        modelo = parts[0].strip() if parts else ''
        esf = parts[1].strip() if len(parts) > 1 else ''
        rows.append([fase, modelo, esf, nota])
    return (['Fase', 'Modelo', 'Esfuerzo', 'Nota (§19)'], rows) if rows else None


def compute_fase(it):
    """De la tabla de Fases: n = fases numeradas 1-5 con estado 'hecho'."""
    if not it.fases:
        return
    _, rows = it.fases
    done = set()
    last = ''
    for r in rows:
        fase_cell = r[0] if r else ''
        # el estado sale de la columna Estado, NO de toda la fila (si no, «rehecho»
        # en la columna Fecha marcaría hecha una fase con Estado pendiente)
        estado_cell = r[2] if len(r) > 2 else (r[-1] if r else '')
        num = re.match(r'\s*(\d)', fase_cell)
        is_done = 'hecho' in estado_cell.lower()
        if num and is_done:
            done.add(int(num.group(1)))
            last = fase_cell
    it.fase_n = len([d for d in done if 1 <= d <= 5])
    # el label ya trae el número («5 · Close»); se le quita para no duplicarlo con «n/5»
    it.fase_label = re.sub(r'^\s*\d+\s*·\s*', '', re.sub(r'\s+', ' ', last).strip())


def parse_metricas(it, mbody):
    text = ' '.join(mbody)
    # separador tolerante: solo símbolos (|, =, *, `, :, —, ., -, espacio) — nunca cruza palabras
    sep = r'[\s*|=:`>._,\-—]*?'
    # incluye los estados reabiertos del contrato §15 (chip status-reopened)
    m = re.search(r'estado' + sep + r'(reabierto-qa|reabierto-spec|reabierto|completado|en-curso|pendiente)',
                  text, re.I)
    if m:
        it.estado = m.group(1).lower()
    m = re.search(r'confianza' + sep + r'(auto|confirmado)', text, re.I)
    if m:
        it.confianza = m.group(1).lower()
    m = re.search(r'retrabajo' + sep + r'(\d+)', text, re.I)
    if m:
        it.retrabajo = m.group(1)
    # fallback de estado: 100% + confirmado → completado
    if it.estado == 'en-curso' and it.pct == 100 and it.confianza == 'confirmado':
        it.estado = 'completado'


# ---------------------------------------------------------------- descubrir

def discover_items(hub, ws):
    base = os.path.join(hub, '.work', ws)
    items = []
    if not os.path.isdir(base):
        return items
    for name in sorted(os.listdir(base)):
        p = os.path.join(base, name, 'progreso.md')
        if os.path.isfile(p):
            items.append(load_item(ws, name, p))
    return items


def read_intro(path):
    """Narrativa editorial de un `_intro.md`, SIN sus comentarios HTML.

    Los `_intro.md` del centro empiezan con un bloque `<!-- ... -->` que explica al humano
    qué escribir ahí y con qué reglas. Sin este filtro, ese bloque se publicaba como prosa
    visible en la página: la instrucción de cómo redactar la narrativa aparecía impresa
    encima de la narrativa.
    """
    if not os.path.isfile(path):
        return ''
    with open(path, encoding='utf-8') as f:
        return re.sub(r'<!--.*?-->', '', f.read(), flags=re.S).strip()


# ---------------------------------------------------------------- md → html (intro)

def _group_list_items(lines, marker):
    """Agrupa ítems de lista uniendo líneas de continuación (wrap) al ítem previo."""
    items, cur = [], None
    for l in lines:
        if not l.strip():
            continue
        if re.match(marker, l):
            if cur is not None:
                items.append(cur)
            cur = re.sub(marker, '', l).strip()
        else:
            cur = (cur + ' ' + l.strip()) if cur else l.strip()
    if cur is not None:
        items.append(cur)
    return items


def intro_to_html(md):
    """Convierte el _intro.md (subconjunto markdown) a HTML dentro de un info-box."""
    if not md:
        return ''
    blocks = re.split(r'\n\s*\n', md.strip())
    html = ['    <div class="info-box success">']
    for b in blocks:
        lines = b.splitlines()
        first = next((l for l in lines if l.strip()), '')
        if re.match(r'^\s*\d+\.\s+', first):
            html.append('        <ol>')
            for item in _group_list_items(lines, r'^\s*\d+\.\s+'):
                html.append('            <li>' + md_inline(item) + '</li>')
            html.append('        </ol>')
        elif re.match(r'^\s*[-*]\s+', first):
            html.append('        <ul>')
            for item in _group_list_items(lines, r'^\s*[-*]\s+'):
                html.append('            <li>' + md_inline(item) + '</li>')
            html.append('        </ul>')
        elif first.lstrip().startswith('#'):
            html.append('        <p><strong>' + md_inline(re.sub(r'^#+\s*', '', first)) + '</strong></p>')
        else:
            body = ' '.join(l.strip().lstrip('>').strip() for l in lines)
            html.append('        <p>' + md_inline(body) + '</p>')
    html.append('    </div>')
    return '\n'.join(html)


# ---------------------------------------------------------------- html helpers

def html_table(headers, rows, indent='                        '):
    out = ['<div class="table-scroll">',
           '    <table>',
           '        <thead><tr>' + ''.join('<th>' + md_inline(h) + '</th>' for h in headers) + '</tr></thead>',
           '        <tbody>']
    for r in rows:
        out.append('            <tr>' + ''.join('<td>' + md_inline(c) + '</td>' for c in r) + '</tr>')
    out.append('        </tbody>')
    out.append('    </table>')
    out.append('</div>')
    return '\n'.join(indent + l for l in out)


def status_span(text, kind):
    return '<span class="status status-%s">%s</span>' % (kind, ent(text))


def stat_grid(tarjetas):
    """Rejilla de stat-cards. `tarjetas` = [(clase_borde, cifra, rotulo_html), ...].

    Existe para que las dos páginas emitan la MISMA marcación: mientras cada una
    escribía su propia rejilla, una usaba `<h3>/<p>` — que el kit no estiliza — y la
    otra podía divergir sin que nada avisara. El kit espera `.num` y `.lbl`.
    """
    L = ['    <div class="grid-%d">' % len(tarjetas)]
    for clase, cifra, rotulo in tarjetas:
        L.append('        <div class="stat-card %s"><div class="num">%s</div>'
                 '<div class="lbl">%s</div></div>' % (clase, cifra, rotulo))
    L.append('    </div>')
    return '\n'.join(L)


def vacio_html(titulo, explicacion):
    """Estado vacío explicado. Un tablero recién montado sale vacío por definición;
    lo que no puede es *parecer roto*. Se dice qué falta y qué lo llena."""
    return ('    <div class="info-box warning"><strong>%s</strong> %s</div>'
            % (titulo, explicacion))


def md_table(headers, rows):
    """Tabla markdown (celdas con `|` escapado)."""
    out = ['| ' + ' | '.join(headers) + ' |', '|' + '|'.join(['---'] * len(headers)) + '|']
    for r in rows:
        out.append('| ' + ' | '.join(c.replace('|', r'\|') for c in r) + ' |')
    return out


def md_item_detail(it):
    """Detalle del item en markdown (gemelo legible del panel HTML): meta, resumen,
    ramas, modelo/esfuerzo, fases, CA con veredicto, métricas, secciones extra, siguiente."""
    L = ['### `%s`' % it.id, '']
    meta = []
    if it.autor:
        meta.append('**Autor:** %s%s' % (it.autor, ' <%s>' % it.autor_email if it.autor_email else ''))
    if it.complejidad:
        meta.append('**Complejidad:** %s' % it.complejidad)
    if it.autonomia:
        meta.append('**Autonomía:** %s' % it.autonomia)
    if it.retrabajo:
        meta.append('**Retrabajo:** %s' % it.retrabajo)
    if it.forjado:
        meta.append('**Forjado:** %s' % it.forjado)
    if meta:
        L += [' · '.join(meta), '']
    if it.resumen:
        L += ['_%s_' % it.resumen, '']
    if it.ramas:
        L += ['**Ramas de trabajo**', ''] + md_table(*it.ramas) + ['']
    if it.modelo_tbl:
        L += ['**Modelo y esfuerzo (§19)**', ''] + md_table(*it.modelo_tbl) + ['']
    if it.fases:
        L += ['**Fases — timeline**', ''] + md_table(*it.fases) + ['']
    ca_tbls = ca_tables_of(it.raw)
    if ca_tbls:
        L += ['**Criterios de aceptación (%d) — veredicto y evidencia**' % it.ca_total, '']
        for h, r in ca_tbls:
            L += md_table(h, r) + ['']
    if it.metricas:
        L += ['**Métricas del item**', ''] + md_table(*it.metricas) + ['']
    for title, body in it.extra:
        L += ['**%s**' % title, '']
        for kind, data in split_blocks(body):
            if kind == 'table':
                L += md_table(*data) + ['']
            else:
                L += [l.strip() for l in prose_lines(data)] + ['']
    if it.siguiente:
        L += ['**Siguiente paso:** ' + ' '.join(l.strip().lstrip('->').strip() for l in it.siguiente), '']
    return L


CONF_KIND = {'confirmado': 'done', 'auto': 'progress'}
ESTADO_KIND = {
    'completado': 'done', 'en-curso': 'warning', 'pendiente': 'pending',
    'reabierto': 'reopened', 'reabierto-qa': 'reopened', 'reabierto-spec': 'reopened',
}


# ---------------------------------------------------------------- item detail

def render_item_detail_html(it):
    L = []
    L.append('            <tr class="item-detail" data-detail-for="%s">' % ent(it.id))
    L.append('                <td colspan="9">')
    L.append('                    <div class="detail-panel">')
    # dp-meta
    L.append('                        <div class="dp-meta">')
    if it.autor:
        email = ' &lt;%s&gt;' % ent(it.autor_email) if it.autor_email else ''
        L.append('                            <span><strong>Autor:</strong> %s%s</span>' % (ent(it.autor), email))
    if it.complejidad:
        extra = []
        if it.plantilla:
            extra.append('plantilla ' + it.plantilla)
        if it.rapido:
            extra.append('r&aacute;pido: ' + it.rapido)
        suf = (' (' + ent(' · '.join(extra)) + ')') if extra else ''
        L.append('                            <span><strong>Complejidad:</strong> %s%s</span>' % (ent(it.complejidad), suf))
    if it.autonomia:
        L.append('                            <span><strong>Autonom&iacute;a:</strong> %s</span>' % md_inline(it.autonomia))
    if it.retrabajo:
        L.append('                            <span><strong>Retrabajo:</strong> %s</span>' % ent(it.retrabajo))
    if it.forjado:
        L.append('                            <span><strong>Forjado:</strong> %s</span>' % ent(it.forjado))
    if it.prevalidacion:
        L.append('                            <span><strong>Prevalidaci&oacute;n:</strong> %s</span>' % md_inline(it.prevalidacion))
    L.append('                        </div>')
    # resumen (verbatim)
    if it.resumen:
        L.append('                        <p class="resumen">%s</p>' % md_inline(it.resumen))
    # ramas
    if it.ramas:
        L.append('                        <p><strong>Ramas de trabajo</strong></p>')
        L.append(html_table(it.ramas[0], it.ramas[1]))
    # modelo/esfuerzo
    if it.modelo_tbl:
        L.append('                        <p><strong>Modelo y esfuerzo recomendado (&sect;19)</strong></p>')
        L.append(html_table(it.modelo_tbl[0], it.modelo_tbl[1]))
    # fases
    if it.fases:
        L.append('                        <p><strong>Fases &mdash; timeline</strong></p>')
        L.append(html_table(it.fases[0], it.fases[1]))
    # CA — todas las tablas de veredicto del documento (CAMBIO-01/02, REV, h3, …)
    ca_tbls = ca_tables_of(it.raw)
    if ca_tbls:
        L.append('                        <p><strong>Criterios de aceptaci&oacute;n (%d) &mdash; veredicto y evidencia</strong></p>' % it.ca_total)
        for headers, rows in ca_tbls:
            L.append(html_table(headers, rows))
    # métricas
    if it.metricas:
        L.append('                        <p><strong>M&eacute;tricas del item</strong></p>')
        L.append(html_table(it.metricas[0], it.metricas[1]))
    elif it.metricas_body:
        for l in it.metricas_body:
            if l.strip().startswith('-'):
                L.append('                        <p>%s</p>' % md_inline(re.sub(r'^\s*-\s*', '', l)))
    # secciones extra (PRs de integración, rondas, etc.)
    for title, body in it.extra:
        L.append('                        <p><strong>%s</strong></p>' % md_inline(title))
        for kind, data in split_blocks(body):
            if kind == 'table':
                L.append(html_table(*data))
            else:
                for l in prose_lines(data, quitar_vineta=True):
                    L.append('                        <p>%s</p>' % md_inline(l))
    # siguiente paso
    if it.siguiente:
        txt = ' '.join(l.strip().lstrip('->').strip() for l in it.siguiente)
        L.append('                        <p><strong>Siguiente paso:</strong> %s</p>' % md_inline(txt))
    L.append('                    </div>')
    L.append('                </td>')
    L.append('            </tr>')
    return '\n'.join(L)


# ---------------------------------------------------------------- page: ws

def render_ws(hub, ws, ws_meta):
    items = discover_items(hub, ws)
    desc = ws_meta.get('desc', ws)
    intro = read_intro(os.path.join(hub, '.work', ws, '_intro.md'))

    n = len(items)
    completadas = sum(1 for it in items if it.estado == 'completado')
    pend = sum(1 for it in items if it.estado == 'pendiente')
    encurso = n - completadas - pend
    ca_cumple = sum(it.ca_cumple for it in items)
    ca_total = sum(it.ca_total for it in items)
    pct = 0 if ca_total == 0 else round(100 * ca_cumple / ca_total)

    # ---- HTML (solo el CONTENIDO; el envoltorio lo pone render.py) ----
    H = []
    H.append('    <div class="info-box">')
    H.append('        <strong>Bit&aacute;cora del workspace <code>%s</code></strong> &mdash; %s. El' % (ent(ws), ent(desc)))
    H.append('        <strong>%</strong> es real: cuenta los <strong>CA verificados con evidencia</strong>')
    H.append('        (<code>CUMPLE</code>/total), no fases ni cobertura. <code>Confianza</code>: <code>auto</code>')
    H.append('        (todo por test) o <code>confirmado</code> (validado por el dev). &nbsp;<a href="avances.html">&larr; Panorama</a>')
    H.append('    </div>')
    H.append('')
    if intro:
        H.append(intro_to_html(intro))
        H.append('')
    H.append(stat_grid([
        ('border-blue', str(n), 'Funcionalidades'),
        ('border-info', str(pend), 'Pendientes'),
        ('border-warning', str(encurso), 'En curso'),
        ('border-success', str(completadas), 'Completadas'),
        ('border-teal', '%d%%' % pct, 'Avance (CAs) &middot; %d/%d' % (ca_cumple, ca_total)),
    ]))
    H.append('')
    H.append('    <h2 class="section-title">Estado de funcionalidades</h2>')
    if not items:
        # Un workspace sin items NO es un error: es el estado normal de un centro recien
        # montado. Se dice con todas las letras y se explica que lo llena, en vez de dejar
        # una tabla con cabecera y nada debajo (que se lee como algo roto).
        H.append(vacio_html(
            'Todav&iacute;a no hay funcionalidades en este workspace.',
            'Un item aparece aqu&iacute; en cuanto existe '
            '<code>.work/%s/&lt;item&gt;/progreso.md</code>. El descubrimiento es por '
            'presencia de ese archivo: sin &eacute;l, el item es invisible aqu&iacute; y en '
            'los agregados.' % ent(ws)))
    else:
        H.append('    <p>Click en una fila para ver su <strong>detalle</strong> (ramas, modelo/esfuerzo, fases,')
        H.append('    veredicto por CA); el bot&oacute;n <strong>Log</strong> filtra el log de abajo por esa funcionalidad.</p>')
        H.append('    <div class="table-scroll">')
        H.append('    <table class="data-table" data-table="func" data-filters="tipo:Tipo,estado:Estado,autor:Autor" data-page-size="10">')
        H.append('        <thead>')
        H.append('            <tr><th>Item</th><th>Tipo</th><th>Autor</th><th>Fase</th><th>CAs</th><th>%</th><th>Confianza</th><th>Estado</th><th>Acciones</th></tr>')
        H.append('        </thead>')
        H.append('        <tbody>')
        for it in items:
            H.append(render_item_row_html(it))
            H.append(render_item_detail_html(it))
        H.append('        </tbody>')
        H.append('    </table>')
        H.append('    </div>')
    H.append('')
    # log — solo tiene sentido si hay de donde sacarlo
    any_log = any(it.registro for it in items)
    if any_log:
        H.append('    <h2 class="section-title">Log de implementaci&oacute;n</h2>')
        H.append('    <p><strong>Agrupado por funcionalidad</strong> (del <code>## Registro de actividad</code> de cada')
        H.append('    <code>progreso.md</code>): una fila por hito ejecutado. Usa el bot&oacute;n <strong>Log</strong> o el')
        H.append('    filtro <em>Funcionalidad</em> para aislar una sola.</p>')
        H.append('    <div class="table-scroll">')
        H.append('    <table class="data-table" data-table="log" data-filters="item:Funcionalidad" data-page-size="10">')
        H.append('        <thead>')
        H.append('            <tr><th>Fecha</th><th>Funcionalidad</th><th>Fase</th><th>Qu&eacute; se ejecut&oacute;</th><th>Evidencia</th><th>Archivos</th></tr>')
        H.append('        </thead>')
        H.append('        <tbody>')
        for it in items:
            for r in it.registro:
                cells = (r + [''] * 5)[:5]  # fecha|fase|qué|evidencia|archivos
                H.append('            <tr class="log-row" data-item="%s">' % ent(it.id))
                H.append('                <td>%s</td>' % md_inline(cells[0]))
                H.append('                <td><code>%s</code></td>' % ent(it.id))
                H.append('                <td>%s</td>' % md_inline(cells[1]))
                H.append('                <td>%s</td>' % md_inline(cells[2]))
                H.append('                <td>%s</td>' % md_inline(cells[3]))
                H.append('                <td>%s</td>' % md_inline(cells[4]))
                H.append('            </tr>')
        H.append('        </tbody>')
        H.append('    </table>')
        H.append('    </div>')
    elif items:
        H.append('    <h2 class="section-title">Log de implementaci&oacute;n</h2>')
        H.append(vacio_html(
            'Sin registro de actividad todav&iacute;a.',
            'Se alimenta de la secci&oacute;n <code>## Registro de actividad</code> de cada '
            '<code>progreso.md</code>.'))
    H.append('')

    # ---- MD (gemelo legible del .html: mismo estado + detalle por item + log) ----
    M = []
    M.append('# Bitácora — `%s`' % ws)
    M.append('')
    M.append('**Área:** %s' % desc)
    M.append('')
    M.append('> Proyección legible de `.work/%s/*/progreso.md`. **Generada por `render.py`**' % ws)
    M.append('> (no editar a mano; el próximo render la pisa). Versión visual: `avances-%s.html`.' % ws)
    M.append('')
    M.append('**Insumos:** `.work/%s/*/progreso.md`%s' % (ws, ' + `_intro.md`' if intro else ''))
    M.append('')
    M.append('Volver al [Panorama de avances](avances.html).')
    M.append('')
    if intro:
        M.append('## Resumen')
        M.append('')
        M.append(intro)
        M.append('')
    M.append('## Estado de funcionalidades')
    M.append('')
    M.append('| Items | Pendientes | En curso | Completadas | Avance % (CAs) |')
    M.append('|-------|------------|----------|-------------|----------------|')
    M.append('| %d | %d | %d | %d | %d%% (%d/%d) |' % (n, pend, encurso, completadas, pct, ca_cumple, ca_total))
    M.append('')
    if not items:
        M.append('_Todavía no hay funcionalidades en este workspace: un item aparece aquí en cuanto')
        M.append('existe `.work/%s/<item>/progreso.md`._' % ws)
        M.append('')
    else:
        M.append('| Item | Tipo | Autor | Fase | CAs | % | Confianza | Estado |')
        M.append('|------|------|-------|------|-----|---|-----------|--------|')
        for it in items:
            M.append('| `%s` | %s | %s | %s | %d/%d | %d%% | %s | %s |' % (
                it.id, it.tipo, it.autor, fase_txt(it), it.ca_cumple, it.ca_total, it.pct, it.confianza, it.estado))
        M.append('')
    if items:
        M.append('## Detalle por funcionalidad')
        M.append('')
        for it in items:
            M += md_item_detail(it)
        M.append('## Log de implementación')
        M.append('')
        log_rows = [list((r + [''] * 5)[:2]) + [it.id] + list((r + [''] * 5)[2:5])
                    for it in items for r in it.registro]
        if log_rows:
            M += md_table(['Fecha', 'Fase', 'Funcionalidad', 'Qué se ejecutó', 'Evidencia', 'Archivos'], log_rows)
        else:
            M.append('_Sin registro de actividad todavía._')
        M.append('')

    return dict(ws=ws, desc=desc, n=n, pend=pend, encurso=encurso,
                completadas=completadas, ca_cumple=ca_cumple, ca_total=ca_total, pct=pct,
                items=items, archivo='avances-%s' % ws,
                # El título es la CLAVE del workspace, no su `desc`: `desc` es una frase
                # entera y acababa entera en el <title> de la pestaña del navegador.
                titulo='Bitácora — %s' % ws,
                md='\n'.join(M) + '\n', html='\n'.join(H) + '\n')


def fase_txt(it):
    lbl = (' · ' + re.sub(r'[*`]', '', it.fase_label)) if it.fase_label else ''
    return '%d/5%s' % (it.fase_n, lbl)


def render_item_row_html(it):
    conf_kind = CONF_KIND.get(it.confianza, 'progress')
    est_kind = ESTADO_KIND.get(it.estado, 'warning')
    email_title = (' title="%s"' % ent(it.autor_email)) if it.autor_email else ''
    fase_label = re.sub(r'[*`]', '', it.fase_label)
    L = []
    L.append('            <tr class="item-row" data-item="%s" data-tipo="%s" data-estado="%s" data-autor="%s">' % (
        ent(it.id), ent(it.tipo), ent(it.estado), ent(it.autor)))
    L.append('                <td><code>%s</code></td>' % ent(it.id))
    L.append('                <td>%s</td>' % ent(it.tipo))
    L.append('                <td%s>%s</td>' % (email_title, ent(it.autor)))
    L.append('                <td>%d/5%s</td>' % (it.fase_n, (' &middot; ' + ent(fase_label)) if fase_label else ''))
    L.append('                <td>%d/%d</td>' % (it.ca_cumple, it.ca_total))
    L.append('                <td>%d%%</td>' % it.pct)
    L.append('                <td>%s</td>' % status_span(it.confianza, conf_kind))
    L.append('                <td>%s</td>' % status_span(it.estado, est_kind))
    L.append('                <td class="col-actions"><button class="btn-log" data-log-item="%s">Log</button></td>' % ent(it.id))
    L.append('            </tr>')
    return '\n'.join(L)


# ---------------------------------------------------------------- page: panorama

def render_panorama(hub, marker, ws_summaries):
    workspaces = marker['workspaces']
    intro = read_intro(os.path.join(hub, '.work', '_intro.md'))

    by_ws = {s['ws']: s for s in ws_summaries}
    rows = []
    tot_items = tot_pend = tot_curso = tot_comp = tot_ca_c = tot_ca_t = 0
    for ws, meta in workspaces.items():
        s = by_ws.get(ws)
        if s is None:
            s = dict(ws=ws, desc=meta.get('desc', ws), n=0, pend=0, encurso=0,
                     completadas=0, ca_cumple=0, ca_total=0, pct=0)
        rows.append(s)
        tot_items += s['n']; tot_pend += s['pend']; tot_curso += s['encurso']
        tot_comp += s['completadas']; tot_ca_c += s['ca_cumple']; tot_ca_t += s['ca_total']
    tot_pct = 0 if tot_ca_t == 0 else round(100 * tot_ca_c / tot_ca_t)

    H = []
    H.append('    <div class="info-box">')
    H.append('        <strong>Panorama de avances</strong> &mdash; vista agregada por workspace. El detalle de cada')
    H.append('        &aacute;rea vive en su propia p&aacute;gina (submen&uacute; <em>Bit&aacute;cora</em>). El estado lo escribe')
    H.append('        <code>/desarrollar</code> en <code>.work/&lt;ws&gt;/&lt;item&gt;/progreso.md</code>; esta bit&aacute;cora solo lo')
    H.append('        <strong>renderiza</strong> (100% est&aacute;tico, sin base de datos).')
    H.append('    </div>')
    H.append('')
    if intro:
        H.append(intro_to_html(intro))
        H.append('')
    H.append(stat_grid([
        ('border-blue', str(tot_items), 'Funcionalidades'),
        ('border-info', str(tot_pend), 'Pendientes'),
        ('border-warning', str(tot_curso), 'En curso'),
        ('border-success', str(tot_comp), 'Completadas'),
        ('border-teal', '%d%%' % tot_pct, 'Avance (CAs) &middot; %d/%d' % (tot_ca_c, tot_ca_t)),
    ]))
    H.append('')
    H.append('    <h2 class="section-title">Panorama por workspace</h2>')
    H.append('    <div class="table-scroll">')
    H.append('    <table class="data-table" data-table="ws" data-page-size="20">')
    H.append('        <thead>')
    H.append('            <tr><th>Workspace</th><th>&Aacute;rea</th><th>Items</th><th>Pendientes</th><th>En curso</th><th>Completadas</th><th>Avance % (CAs)</th><th>Detalle</th></tr>')
    H.append('        </thead>')
    H.append('        <tbody>')
    for s in rows:
        av = ('%d%% <small>(%d/%d)</small>' % (s['pct'], s['ca_cumple'], s['ca_total'])) if s['n'] else '&mdash;'
        H.append('            <tr><td><code>%s</code></td><td>%s</td><td>%d</td><td>%d</td><td>%d</td><td>%d</td><td>%s</td><td><a href="avances-%s.html">Abrir</a></td></tr>' % (
            ent(s['ws']), ent(s['desc']), s['n'], s['pend'], s['encurso'], s['completadas'], av, ent(s['ws'])))
    H.append('            <tr><td><strong>Total</strong></td><td></td><td><strong>%d</strong></td><td><strong>%d</strong></td><td><strong>%d</strong></td><td><strong>%d</strong></td><td><strong>%d%%</strong> <small>(%d/%d)</small></td><td></td></tr>' % (
        tot_items, tot_pend, tot_curso, tot_comp, tot_pct, tot_ca_c, tot_ca_t))
    H.append('        </tbody>')
    H.append('    </table>')
    H.append('    </div>')
    H.append('')
    # Items completados (todos los workspaces)
    done_items = [(s, it) for s in rows for it in s.get('items', []) if it.estado == 'completado']
    if done_items:
        H.append('    <h2 class="section-title">Items completados</h2>')
        H.append('    <div class="table-scroll">')
        H.append('    <table class="data-table" data-table="done" data-filters="ws:Workspace" data-page-size="20">')
        H.append('        <thead>')
        H.append('            <tr><th>Workspace</th><th>Item</th><th>Tipo</th><th>CAs</th><th>%</th><th>Confianza</th><th>Retrabajo</th></tr>')
        H.append('        </thead>')
        H.append('        <tbody>')
        for s, it in done_items:
            H.append('            <tr data-ws="%s"><td><code>%s</code></td><td><code>%s</code></td><td>%s</td><td>%d/%d</td><td>%d%%</td><td>%s</td><td>%s</td></tr>' % (
                ent(s['ws']), ent(s['ws']), ent(it.id), ent(it.tipo), it.ca_cumple, it.ca_total, it.pct,
                status_span(it.confianza, CONF_KIND.get(it.confianza, 'progress')), ent(it.retrabajo or '0')))
        H.append('        </tbody>')
        H.append('    </table>')
        H.append('    </div>')
        H.append('')

    M = []
    M.append('# Bitácora / Avances — Panorama')
    M.append('')
    M.append('> Proyección legible de `.work/<ws>/<item>/progreso.md`. **Generada por `render.py`**')
    M.append('> (no editar a mano; el próximo render la pisa). Versión visual: `avances.html`.')
    M.append('')
    if intro:
        M.append('## Resumen')
        M.append('')
        M.append(intro)
        M.append('')
    M.append('## Panorama por workspace')
    M.append('')
    M.append('| Workspace | Área | Items | Pendientes | En curso | Completadas | Avance % (CAs) |')
    M.append('|-----------|------|-------|------------|----------|-------------|----------------|')
    for s in rows:
        av = ('%d%% (%d/%d)' % (s['pct'], s['ca_cumple'], s['ca_total'])) if s['n'] else '—'
        M.append('| `%s` | %s | %d | %d | %d | %d | %s |' % (s['ws'], s['desc'], s['n'], s['pend'], s['encurso'], s['completadas'], av))
    M.append('| **Total** | | **%d** | **%d** | **%d** | **%d** | **%d%% (%d/%d)** |' % (
        tot_items, tot_pend, tot_curso, tot_comp, tot_pct, tot_ca_c, tot_ca_t))
    M.append('')
    if done_items:
        M.append('## Items completados')
        M.append('')
        M += md_table(['Workspace', 'Item', 'Tipo', 'CAs', '%', 'Confianza', 'Retrabajo'],
                      [[s['ws'], '`%s`' % it.id, it.tipo, '%d/%d' % (it.ca_cumple, it.ca_total),
                        '%d%%' % it.pct, it.confianza, it.retrabajo or '0'] for s, it in done_items])
        M.append('')

    return dict(archivo='avances', titulo='Bitácora / Avances — Panorama',
                n=tot_items, pend=tot_pend, encurso=tot_curso, completadas=tot_comp,
                ca_cumple=tot_ca_c, ca_total=tot_ca_t, pct=tot_pct,
                md='\n'.join(M) + '\n', html='\n'.join(H) + '\n')


def summarize_only(hub, ws, meta):
    """Calcula los agregados de un ws SIN reescribir su página (para el panorama)."""
    items = discover_items(hub, ws)
    n = len(items)
    completadas = sum(1 for it in items if it.estado == 'completado')
    pend = sum(1 for it in items if it.estado == 'pendiente')
    ca_cumple = sum(it.ca_cumple for it in items)
    ca_total = sum(it.ca_total for it in items)
    pct = 0 if ca_total == 0 else round(100 * ca_cumple / ca_total)
    return dict(ws=ws, desc=meta.get('desc', ws), n=n, pend=pend,
                encurso=n - completadas - pend, completadas=completadas,
                ca_cumple=ca_cumple, ca_total=ca_total, pct=pct, items=items)


if __name__ == '__main__':
    # Deliberadamente SIN punto de entrada. Este módulo tuvo uno y produjo el fallo que
    # esta fusión resuelve: dos generadores escribiendo el mismo `avances-<ws>.html` con
    # dos kits visuales distintos, y el último en correr ganaba.
    print('bitacora_render es una biblioteca, no un comando.\n'
          'El sitio entero se regenera con:  python3 render.py [ruta-al-centro]',
          file=sys.stderr)
    sys.exit(2)
