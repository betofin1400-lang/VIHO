---
name: viho-centro-instalar
description: Deja las skills del centro disponibles desde cualquier directorio de trabajo (enlaces simbólicos), resuelve dónde vive el código en esta máquina y lo persiste en el override local gitignored, y verifica la estructura. Idempotente. Correr una vez por máquina y tras añadir o renombrar una skill.
---

# centro-instalar

> **STUB — rellenar.** El contrato está escrito; falta el procedimiento.

## El problema que resuelve

El entorno descubre skills en `.claude/skills/` **del directorio de trabajo y sus ancestros**. Si el
centro vive en un subdirectorio que no es ancestro de donde se trabaja (lo normal cuando el centro es
un repositorio hermano del código), **sus skills no se cargan**. Y el fallo es desconcertante porque
*a veces funciona*: trabajando dentro del propio centro sí aparecen.

**Si el centro vive dentro del repositorio de código y siempre se trabaja desde su raíz, esta skill
no hace falta.** Borra el directorio y quítala de `doctor.skills_requeridas`.

## La regla que hay que aplicar antes de enlazar nada

> **`~/.claude/skills/` es un espacio PLANO y COMPARTIDO por todos los proyectos de esta máquina.**
> El nombre de la skill es su clave. Dos centros que llamen `desarrollar` a su runner no caben: el
> segundo que instale **pisa al primero**, y ese proyecto se queda sin método —o corriendo el
> nuestro— **sin un error, sin traza y sin forma fácil de notarlo**.

Por eso **todas las skills de un centro llevan el prefijo del proyecto**: `<proyecto>-centro`,
`<proyecto>-forjar-skill`, `<proyecto>-desarrollar`… El esqueleto las trae con nombres genéricos
porque el prefijo depende del proyecto: **renombrarlas es un paso del montaje**, no una mejora
posterior (guía 02 §P4.a). Y se hace **también** si hoy esta máquina solo tiene un centro: el segundo
llega sin avisar y el daño lo sufre el primero.

## Pasos

1. **Localizar el centro** por el marcador (`centro_lib.py`). Nunca asumir el nombre del directorio.
   Si hay varios candidatos, se distingue por el campo `centro` del marcador; si sigue habiendo
   ambigüedad, **se pregunta. No se inventa.**
2. **Gate de prefijo — antes de crear un solo enlace.** Derivar la lista del directorio (todo
   subdirectorio de `<HUB>/.claude/skills/` con un `SKILL.md`; eso deja fuera `_lib/`). Si alguna
   **no** empieza por el prefijo del proyecto: **PARAR y reportar**. Se renombra en el centro y se
   vuelve a empezar. Un enlace ya creado es daño hecho en el centro de otro.
3. **Enlazar** cada `<HUB>/.claude/skills/<nombre>/` en `~/.claude/skills/<nombre>` con **ruta
   absoluta** (una relativa no resuelve desde ahí). Política de colisión, tres ramas, y **ninguna
   pisa nada ajeno**:
   - ya apunta a **este mismo centro** → nada que hacer (idempotencia);
   - **apunta a otro sitio → avisar y SALTAR. Nunca reemplazar**: ese enlace es de otro centro y
     romperlo deja a ese proyecto sin método, en silencio;
   - **es un directorio real (una skill ajena) → avisar y saltar. Nunca sobrescribir.**

   `readlink -f ~/.claude/skills/<nombre>` dice a dónde apunta uno existente: si empieza por `<HUB>`,
   es nuestro. Los **playbooks de item** (`.work/*/*/skills/`) **no se enlazan jamás**: son datos, no
   comandos.
4. **Resolver el layout de código de esta máquina**: detectar los repos declarados; si no aparecen o
   hay ambigüedad, **preguntar**. Persistir en `.centro-desarrollo.local.json` **solo lo que difiera**
   del marcador, y asegurar la línea en `.gitignore` **antes** de crear el archivo.
5. **Verificar** que existen índice, arquitectura, configuración y los repos resueltos.
6. **Resumen — y LO SALTADO.** No es cortesía: una colisión no produce ninguna salida por sí sola, así
   que este informe es lo único que la revela. Por cada entrada saltada, **a dónde apunta y de qué
   centro es**. Si algo se saltó, el nombre está mal elegido: **se renombra en el centro, no se
   fuerza la instalación.**

## La trampa que hay que enseñar explícitamente

Los enlaces apuntan al **árbol de trabajo** del centro, no a una copia. Por tanto: **la rama en la
que esté el centro decide qué método se ejecuta.** Si el centro es un repositorio aparte, eso obliga
a dos mecanismos más —una guardia de rama del centro y un aviso cuando su rama principal avanza en
skills, configuración o patrones—, y ambos son *advisory*: **nunca fusionar automáticamente**.

*(Con el centro dentro del repositorio de código, nada de esto hace falta. Es la razón principal
para preferir esa topología cuando se puede.)*

## Alternativa sin tocar `~/.claude`

Añadir el directorio del centro a la sesión del agente. Funciona, pero **hay que repetirlo en cada
sesión**: sirve para probar, no para trabajar a diario.

## TODO al montar

- [ ] Decidir si hace falta (ver arriba) antes de escribir una sola línea.
- [ ] **Renombrar las once skills con el prefijo del proyecto** y propagarlo a `name:` de cada
      frontmatter, a `doctor.skills_requeridas` del marcador y a las invocaciones cruzadas.
      Comprobación: `grep -rn "skills/" <HUB> --include='*.md'` sin rutas sin prefijar.
- [ ] **Derivar la lista de skills a enlazar** del directorio, no escribirla.
- [ ] Escribir la detección del layout con los repos **de tu proyecto**, y qué preguntar cuando falle.
- [ ] Probar el override local **de verdad** una vez: mover un repo a otra ruta, declararlo en el
      `.local.json` y comprobar que el centro sigue funcionando. *(En el centro de referencia este
      camino está documentado pero nunca ejercitado, y esas son las cosas que fallan el día que se
      necesitan.)*
