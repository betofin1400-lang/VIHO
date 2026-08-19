#!/usr/bin/env python3
"""
doctor — chequeo de integridad del centro de desarrollo. Solo lectura: diagnostica, no repara.

POR QUÉ EXISTE
--------------
Casi todo lo que se rompe en un centro se rompe EN SILENCIO: un patrón que dejó de estar enlazado en
el índice (y por tanto ya no se selecciona nunca), un item sin `progreso.md` (invisible en el
tablero y en los agregados), un playbook con tokens sin resolver, una página generada más vieja que
el estado del que salió. Ninguna de esas cosas produce un error: producen resultados peores sin
avisar. El doctor es lo que las convierte en un mensaje.

POR QUÉ ES UN SCRIPT Y NO UNA SKILL
-----------------------------------
Es determinista, se ejecuta a menudo y su entrada tiene formato: es un script (ver 00 §6). En el
centro de referencia estos chequeos viven como bash+python embebidos dentro de un archivo markdown,
y su propio código lleva un comentario documentando un fallo real por el que una comprobación
"certificaba" páginas sin haber validado ninguna.

CONFIGURACIÓN
-------------
Nada está cableado aquí: la lista de skills exigidas, las secciones de configuración obligatorias y
el mínimo de patrones salen del bloque `doctor` del marcador. Un centro nuevo con la biblioteca
vacía debe salir SIN FALLOS y con avisos explicables; si el doctor está siempre amarillo, en dos
semanas nadie lo lee.

USO
---
    python3 doctor.py [ruta-al-centro]      # sin argumento, descubre desde el cwd
    salida: 0 = sano o con avisos · 1 = hay fallos
"""

from __future__ import annotations

import os
import re
import subprocess
import sys

# `centro_lib` vive en `.claude/skills/_lib/`, pero se admite también junto a este archivo para
# quien prefiera mantener los dos scripts en el mismo directorio.
_AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [_AQUI, os.path.join(_AQUI, "..", "_lib")]
from centro_lib import Centro, CentroNoEncontrado  # noqa: E402

FALLOS = []
AVISOS = []
OK = 0

SECCIONES_PROGRESO = ["## Fases", "## Criterios de aceptación", "## Métricas",
                      "## Registro de actividad"]

# Un token vivo significa "esta plantilla se estampó a medias". Es un error frecuente y silencioso:
# el archivo parece completo y su contenido dice literalmente {{RELLENAR}}.
RE_TOKEN = re.compile(r"\{\{[^}\n]{1,60}\}\}")


def tokens(texto):
    return sorted(set(RE_TOKEN.findall(texto)))


def ck(cond, etiqueta, detalle="", nivel="fail"):
    global OK
    if cond:
        OK += 1
        return True
    (FALLOS if nivel == "fail" else AVISOS).append(f"{etiqueta}" + (f" — {detalle}" if detalle else ""))
    return False


def leer(ruta):
    try:
        with open(ruta, encoding="utf-8", errors="replace") as f:
            return f.read()
    except OSError:
        return ""


def bloque(titulo):
    print(f"\n== {titulo}")


# ---------------------------------------------------------------- A · marcador

def bloque_marcador(c: Centro):
    bloque("A · Marcador")
    m = c.marcador
    ck(bool(m.get("workspaces")), "marcador: `workspaces` vacío o ausente",
       "es el primer nivel de .work/ y del tablero")
    ck(bool(c.codigo.get("repos")), "marcador: `codigo.repos` vacío o ausente",
       "sin repos declarados no hay guardia de rama ni verificación contra el código")
    ck(bool(m.get("formato")), "marcador: falta `formato`",
       "sin versión de esquema no se sabe contra qué contrato se escribió", nivel="warn")
    ck(bool(c.slices()), "marcador: `docs.slices` vacío",
       "los patrones necesitan al menos un slice", nivel="warn")
    for alias, meta in c.repos().items():
        ck(meta["existe"], f"repo `{alias}` no existe en {meta['ruta_abs']}",
           "¿layout distinto? resuélvelo en el override local", nivel="warn")
    print(f"   HUB={c.hub}")
    print(f"   ROOT={c.root}  override_local={'sí' if c.hay_override else 'no'}")


# ---------------------------------------------------------------- B · skills

def bloque_skills(c: Centro):
    bloque("B · Skills")
    dir_skills = c.ruta("skills")
    for nombre in c.doctor_cfg()["skills_requeridas"]:
        ruta = os.path.join(dir_skills, nombre, "SKILL.md")
        if not ck(os.path.isfile(ruta), f"falta la skill `{nombre}`", ruta, nivel="warn"):
            continue
        ck(re.search(r"^name:", leer(ruta), re.M) is not None,
           f"skill `{nombre}`: sin `name:` en el frontmatter",
           "sin frontmatter el entorno no la descubre", nivel="warn")

    # Playbooks generados: ningún token sin resolver. Un {{TOKEN}} vivo significa que la forja
    # dejó el playbook a medias, y el runner ejecutaría instrucciones incompletas sin notarlo.
    for ws, item, ruta in c.items():
        pb = os.path.join(ruta, "skills", "SKILL.md")
        if os.path.isfile(pb):
            sueltos = tokens(leer(pb))
            ck(not sueltos, f"playbook {ws}/{item}: tokens sin resolver",
               ", ".join(sueltos[:5]))


# ---------------------------------------------------------------- C · configuración

def bloque_config(c: Centro):
    bloque("C · config-proyecto")
    ruta = c.ruta("config")
    if not ck(os.path.isfile(ruta), "falta config-proyecto.md", ruta):
        return
    txt = leer(ruta)
    for n in c.doctor_cfg()["config_secciones"]:
        ck(re.search(rf"^##\s*{n}\.", txt, re.M) is not None,
           f"config: falta la sección §{n}",
           "las skills la citan por número; la numeración es API")
    sueltos = tokens(txt)
    ck(not sueltos, f"config: {len(sueltos)} token(s) de plantilla sin resolver",
       ", ".join(sueltos[:5]) + " …", nivel="warn")


# ---------------------------------------------------------------- D · insumo

def bloque_docs(c: Centro):
    bloque("D · Biblioteca de patrones")
    idx = c.ruta("index")
    ck(os.path.isfile(idx), "falta docs/index.md", "sin dispatcher no hay selección de contexto")
    ck(os.path.isfile(c.ruta("arquitectura")), "falta la arquitectura general",
       "es la puerta de entrada del insumo")
    ck(os.path.isfile(c.ruta("lecciones")), "falta lecciones.md",
       "es la capa que más rápido se llena", nivel="warn")

    docs_dir = c.ruta("docs")
    texto_idx = leer(idx)
    total = 0
    for sl in c.slices():
        d = os.path.join(docs_dir, sl)
        if not os.path.isdir(d):
            AVISOS.append(f"slice `{sl}`: no existe {d}")
            continue
        archivos = sorted(f for f in os.listdir(d) if f.endswith(".md"))
        total += len(archivos)
        print(f"   slice {sl}: {len(archivos)} patrones")
        # Todo patrón debe estar enlazado en el índice: uno sin fila es INVISIBLE para la selección.
        for f in archivos:
            ck(f"{sl}/{f}" in texto_idx, f"patrón {sl}/{f} no está enlazado en index.md",
               "un patrón sin trigger no se carga nunca")

    sueltos_idx = tokens(texto_idx)
    ck(not sueltos_idx, f"index.md: {len(sueltos_idx)} token(s) de plantilla sin resolver",
       "el dispatcher se estampó a medias", nivel="warn")

    # Y a la inversa: ningún enlace del índice debe estar roto.
    for rel in re.findall(r"\]\(([^)]+\.md)\)", texto_idx):
        if rel.startswith("http") or "{{" in rel:
            continue
        destino = os.path.normpath(os.path.join(os.path.dirname(idx), rel))
        ck(os.path.isfile(destino), f"index.md: enlace roto -> {rel}")

    minimo = c.doctor_cfg()["min_patrones"]
    ck(total >= minimo, f"hay {total} patrones, menos del mínimo declarado ({minimo})",
       "normal en un centro recién montado", nivel="warn")


# ---------------------------------------------------------------- E · trabajo

def bloque_work(c: Centro):
    bloque("E · Espacio de trabajo")
    work = c.ruta("work")
    if not ck(os.path.isdir(work), "falta .work/", work):
        return
    ck(os.path.isfile(os.path.join(work, "README.md")), ".work/README.md ausente",
       "la convención se lee donde se usa", nivel="warn")

    validos = set(c.workspaces())
    for ws, item, ruta in c.items():
        ck(ws in validos, f"workspace `{ws}` no declarado en el marcador",
           "sus items no aparecerán en el tablero", nivel="warn")
        prog = os.path.join(ruta, "progreso.md")
        # El descubrimiento del renderer es por presencia de progreso.md: sin él, el item es
        # invisible en el tablero Y en los agregados, sin ningún error.
        if not ck(os.path.isfile(prog), f"item {ws}/{item}: sin progreso.md",
                  "invisible en el tablero y en los agregados"):
            continue
        txt = leer(prog)
        faltan = [s for s in SECCIONES_PROGRESO if s not in txt]
        ck(not faltan, f"item {ws}/{item}: progreso.md fuera de formato",
           "faltan " + ", ".join(faltan) + " — el renderer las ignora en silencio")
        sueltos = tokens(txt)
        ck(not sueltos, f"item {ws}/{item}: progreso.md con {len(sueltos)} token(s) sin resolver",
           "el estado se inicializó a medias", nivel="warn")


# ---------------------------------------------------------------- F · sitio

def bloque_sitio(c: Centro):
    bloque("F · Sitio de seguimiento")
    sitio = c.ruta("sitio")
    if not os.path.isdir(sitio):
        print("   (no hay sitio; si es deliberado, decláralo en config §10)")
        return
    paginas = [f for f in os.listdir(sitio) if f.endswith(".html")]
    ck(bool(paginas), "el sitio no tiene páginas", sitio, nivel="warn")
    for f in paginas:
        txt = leer(os.path.join(sitio, f))
        ck("../" not in txt, f"sitio: {f} usa rutas relativas hacia arriba",
           "el sitio debe poder copiarse a cualquier parte", nivel="warn")
        ck(not re.search(r"\{\{[A-Z0-9_]+\}\}", txt), f"sitio: {f} conserva tokens de plantilla",
           "el kit se estampó a medias", nivel="warn")

    # ¿El tablero está al día? Heurística por fecha: barata y suficiente.
    mas_nuevo = 0.0
    for _ws, _item, ruta in c.items():
        p = os.path.join(ruta, "progreso.md")
        if os.path.isfile(p):
            mas_nuevo = max(mas_nuevo, os.path.getmtime(p))
    if mas_nuevo and paginas:
        pagina_mas_nueva = max(os.path.getmtime(os.path.join(sitio, f)) for f in paginas)
        ck(pagina_mas_nueva + 2 >= mas_nuevo, "el tablero está desactualizado",
           "hay un progreso.md más nuevo que la última página generada: regenera", nivel="warn")


# ---------------------------------------------------------------- G · git

def git(cwd, *args):
    try:
        r = subprocess.run(["git", *args], cwd=cwd, capture_output=True, text=True, timeout=15)
        return r.stdout.strip() if r.returncode == 0 else None
    except (OSError, subprocess.SubprocessError):
        return None


def bloque_git(c: Centro):
    bloque("G · Git")
    toplevel = git(c.hub, "rev-parse", "--show-toplevel")
    if toplevel is None:
        print("   (el centro no está en un repositorio git)")
        return
    dentro_de_codigo = any(
        os.path.commonpath([toplevel, m["ruta_abs"]]) == m["ruta_abs"]
        for m in c.repos().values() if m["existe"]
    ) if c.repos() else False
    print(f"   repo del centro: {toplevel}"
          f"  ({'dentro del repo de código' if dentro_de_codigo else 'repo propio'})")

    rama = git(c.hub, "rev-parse", "--abbrev-ref", "HEAD")
    principales = c.git()["principales"]
    if rama in principales:
        sucio = git(c.hub, "status", "--porcelain") or ""
        pertinente = [l for l in sucio.splitlines()
                      if any(x in l for x in (".work", "docs/", os.path.basename(c.ruta("sitio"))))]
        ck(not pertinente,
           f"el centro está en la rama principal `{rama}` con artefactos sin commitear",
           f"{len(pertinente)} archivo(s): el trabajo del item debió ramificar", nivel="warn")


# ---------------------------------------------------------------- main

def main(argv):
    try:
        c = Centro(argv[1]) if len(argv) > 1 else Centro.descubrir()
    except (CentroNoEncontrado, OSError, ValueError) as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1

    print(f"Doctor del centro: {c.marcador.get('centro', '(sin nombre)')}")
    bloque_marcador(c)
    bloque_skills(c)
    bloque_config(c)
    bloque_docs(c)
    bloque_work(c)
    bloque_sitio(c)
    bloque_git(c)

    print("\n" + "=" * 60)
    for f in FALLOS:
        print(f"  FALLO  {f}")
    for a in AVISOS:
        print(f"  aviso  {a}")
    estado = "CON FALLAS" if FALLOS else ("CON AVISOS" if AVISOS else "SANO")
    print(f"\nCENTRO {estado} — ok={OK} fallos={len(FALLOS)} avisos={len(AVISOS)}")
    if FALLOS:
        print("Los fallos se arreglan ANTES de correr el flujo: rompen cosas en silencio.")
    return 1 if FALLOS else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
