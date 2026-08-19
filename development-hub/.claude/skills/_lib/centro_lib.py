#!/usr/bin/env python3
"""
centro_lib — resolución del centro de desarrollo. Biblioteca estándar, sin dependencias.

POR QUÉ EXISTE
--------------
El algoritmo de descubrimiento del centro (subir por los ancestros buscando el marcador) y la
resolución del override local de layout son lógica que TODAS las skills y scripts necesitan. En el
centro que sirvió de referencia para esta guía, ese algoritmo está copiado literalmente en cinco o
más archivos y la resolución del override en tres: cuando uno cambia, los otros se quedan atrás y el
fallo aparece lejos de la causa.

Este módulo es la fuente única. Las skills lo invocan (por línea de comandos o importándolo) en vez
de reimplementarlo.

USO
---
    python3 centro_lib.py --info            # resuelve desde el cwd y muestra todo
    python3 centro_lib.py --hub             # solo la ruta del centro
    python3 centro_lib.py --repos           # alias -> ruta absoluta de cada repo

    from centro_lib import Centro
    c = Centro.descubrir()                  # o Centro(ruta_al_hub)
    c.hub, c.root, c.repos(), c.workspaces(), c.ruta("docs")
"""

from __future__ import annotations

import json
import os
import sys

MARCADOR = ".centro-desarrollo.json"
MARCADOR_LOCAL = ".centro-desarrollo.local.json"

# Valores por defecto de paths. Existen para que un marcador incompleto no rompa: el centro sigue
# resolviendo con la convención estándar, y el doctor es quien avisa de lo que falta declarar.
PATHS_POR_DEFECTO = {
    "hub": ".",
    "docs": "docs",
    "index": "docs/index.md",
    "arquitectura": "docs/arquitectura-general.md",
    "lecciones": "docs/lecciones.md",
    "decisiones": "docs/decisiones",
    "work": ".work",
    "skills": ".claude/skills",
    "config": ".claude/config-proyecto.md",
    "sitio": "centro-desarrollo",
    "paginas": "paginas",
    "recursos": "resources",
}


class CentroNoEncontrado(Exception):
    pass


class Centro:
    def __init__(self, hub: str):
        self.hub = os.path.abspath(hub)
        marcador = os.path.join(self.hub, MARCADOR)
        if not os.path.isfile(marcador):
            raise CentroNoEncontrado(f"No hay {MARCADOR} en {self.hub}")
        with open(marcador, encoding="utf-8") as f:
            self.marcador = json.load(f)

    # ---------------------------------------------------------------- descubrimiento

    @classmethod
    def descubrir(cls, desde: str | None = None) -> "Centro":
        """Sube por los ancestros; si no aparece, busca en hijas y hermanas hasta profundidad 2.

        Nunca asume el NOMBRE de la carpeta del centro: eso es justo lo que el marcador resuelve, y
        asumirlo rompe en cuanto alguien renombra o mueve el centro.
        """
        actual = os.path.abspath(desde or os.getcwd())

        # 1) hacia arriba
        camino = actual
        while True:
            if os.path.isfile(os.path.join(camino, MARCADOR)):
                return cls(camino)
            padre = os.path.dirname(camino)
            if padre == camino:
                break
            camino = padre

        # 2) hijas y hermanas, profundidad 2
        for base in (actual, os.path.dirname(actual)):
            for raiz, dirs, archivos in os.walk(base):
                profundidad = raiz[len(base):].count(os.sep)
                if profundidad >= 2:
                    dirs[:] = []
                    continue
                # no perder el tiempo dentro de lo que nunca contiene un centro
                dirs[:] = [d for d in dirs if d not in
                           (".git", "node_modules", "__pycache__", ".venv", "venv", "dist", "build")]
                if MARCADOR in archivos:
                    return cls(raiz)

        raise CentroNoEncontrado(
            "No se encontró el marcador del centro. No lo inventes: pregunta la ruta al usuario."
        )

    # ---------------------------------------------------------------- rutas

    @property
    def paths(self) -> dict:
        p = dict(PATHS_POR_DEFECTO)
        p.update(self.marcador.get("paths", {}))
        return p

    def ruta(self, clave: str) -> str:
        """Ruta absoluta de una clave de `paths`. Si `paths` no la declara, usa la convención."""
        rel = self.paths.get(clave)
        if rel is None:
            raise KeyError(f"El marcador no declara paths.{clave}")
        return os.path.normpath(os.path.join(self.hub, rel))

    @property
    def root(self) -> str:
        return os.path.normpath(os.path.join(self.hub, self.codigo.get("root_rel", "..")))

    # ---------------------------------------------------------------- código y repos

    @property
    def codigo(self) -> dict:
        """`codigo` del marcador, con el override local por encima.

        El marcador está versionado y es compartido; dónde vive el código en el disco cambia por
        equipo y por máquina. Por eso el override local MANDA y solo declara lo que difiere.
        """
        codigo = dict(self.marcador.get("codigo", {}))
        local = os.path.join(self.hub, MARCADOR_LOCAL)
        if os.path.isfile(local):
            with open(local, encoding="utf-8") as f:
                codigo.update(json.load(f).get("codigo", {}))
        return codigo

    @property
    def hay_override(self) -> bool:
        return os.path.isfile(os.path.join(self.hub, MARCADOR_LOCAL))

    def repos(self) -> dict:
        """alias -> {ruta_abs, slice, desc, existe}.

        Un monorepo se declara con un único alias de `ruta: "."`: el esquema no distingue entre
        "un repositorio" y "un directorio del monorepo", y no necesita distinguirlo.
        """
        salida = {}
        for alias, meta in (self.codigo.get("repos") or {}).items():
            rel = meta.get("ruta", ".")
            abs_ = os.path.normpath(os.path.join(self.root, rel))
            salida[alias] = {
                "ruta_abs": abs_,
                "slice": meta.get("slice"),
                "desc": meta.get("desc", alias),
                "existe": os.path.isdir(abs_),
            }
        return salida

    # ---------------------------------------------------------------- trabajo

    def workspaces(self) -> dict:
        return self.marcador.get("workspaces", {}) or {}

    def slices(self) -> list:
        return (self.marcador.get("docs") or {}).get("slices", []) or []

    def items(self) -> list:
        """[(workspace, item, ruta_abs)] de todo lo que hay en .work/, ignorando lo que empieza por _.

        Devuelve TODAS las carpetas de item, tengan o no `progreso.md`. El descubrimiento por
        presencia de `progreso.md` (que es lo que hace el renderer del sitio) falla en silencio: no
        distingue "esto no es un item" de "esto es un item mal formado". Aquí se devuelve todo para
        que el doctor pueda reportar la diferencia.
        """
        work = self.ruta("work")
        salida = []
        if not os.path.isdir(work):
            return salida
        for ws in sorted(os.listdir(work)):
            dws = os.path.join(work, ws)
            if not os.path.isdir(dws) or ws.startswith("_") or ws.startswith("."):
                continue
            for item in sorted(os.listdir(dws)):
                dit = os.path.join(dws, item)
                if os.path.isdir(dit) and not item.startswith("_") and not item.startswith("."):
                    salida.append((ws, item, dit))
        return salida

    def git(self) -> dict:
        g = {"principales": ["main"], "base_por_defecto": "main",
             "convencion_rama": "<tipo>/<TICKET>-<slug>"}
        g.update(self.marcador.get("git", {}) or {})
        return g

    def doctor_cfg(self) -> dict:
        d = {"skills_requeridas": [], "config_secciones": [], "min_patrones": 0}
        d.update(self.marcador.get("doctor", {}) or {})
        return d


# -------------------------------------------------------------------- CLI

def _main(argv):
    try:
        c = Centro.descubrir()
    except CentroNoEncontrado as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 2

    modo = argv[1] if len(argv) > 1 else "--info"
    if modo == "--hub":
        print(c.hub)
    elif modo == "--root":
        print(c.root)
    elif modo == "--repos":
        for alias, meta in c.repos().items():
            marca = "ok " if meta["existe"] else "NO "
            print(f"{marca} {alias:12} {meta['ruta_abs']}")
    else:
        print(f"centro       : {c.marcador.get('centro', '(sin nombre)')}")
        print(f"formato      : {c.marcador.get('formato', '(sin declarar)')}")
        print(f"HUB          : {c.hub}")
        print(f"ROOT         : {c.root}")
        print(f"override     : {'sí' if c.hay_override else 'no'}")
        print(f"slices       : {', '.join(c.slices()) or '(ninguno)'}")
        print(f"workspaces   : {', '.join(c.workspaces()) or '(ninguno)'}")
        print(f"ramas princ. : {', '.join(c.git()['principales'])}")
        print("repos:")
        for alias, meta in c.repos().items():
            marca = "ok" if meta["existe"] else "NO EXISTE"
            print(f"  - {alias:12} {meta['ruta_abs']}  [{marca}]")
        print("rutas:")
        for k in ("docs", "index", "arquitectura", "lecciones", "work", "skills", "config", "sitio",
                  "paginas"):
            r = c.ruta(k)
            print(f"  - {k:13} {r}  [{'ok' if os.path.exists(r) else 'falta'}]")
        items = c.items()
        print(f"items en .work: {len(items)}")
    return 0


if __name__ == "__main__":
    sys.exit(_main(sys.argv))
