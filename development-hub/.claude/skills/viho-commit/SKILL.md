---
name: viho-commit
description: Crea commits siguiendo la política de la casa. Usar cuando se pida hacer commit, versionar cambios o cerrar un item.
---

# commit

> **STUB — rellenar.** Es la skill más ligada al equipo y la más fácil de escribir, porque la
> política ya existe: solo hay que ponerla por escrito una vez, aquí, en vez de repetirla en cada
> revisión de código.

## Formato

```
{{tipo}}({{ámbito}}): {{descripción en imperativo}} [{{TICKET}}]
```

- **El identificador de ticket es obligatorio en todos los commits.** Si no se puede determinar,
  **se pregunta; nunca se inventa.** Orden de resolución: argumento explícito → nombre de la rama
  (`<tipo>/<TICKET>-<slug>`) → contexto de la sesión.
- **TODO:** los tipos permitidos y la tabla de ámbitos de tu proyecto.

## Proceso

1. **Recopilar** el estado real: qué cambió, qué está en el índice, qué rama, qué hay sin empujar.
2. **Resolver el ticket.**
3. **Agrupar de forma atómica: un commit = un cambio lógico de un solo ticket.** Si el trabajo tocó
   dos cosas independientes, son dos commits.
4. **Añadir archivos explícitamente.** Nunca `git add .` ni `-A`: es como se cuela un secreto, un
   archivo temporal o el cambio de otra rama.
5. **Si falla un hook:** corregir y hacer un **commit nuevo**. No reescribir el anterior — reescribir
   historia ya empujada rompe el trabajo de quien la tenga.
6. **Empujar no es automático**, y nunca a una rama principal (`git.principales` del marcador).

## Reglas que valen para cualquier equipo

- El mensaje explica **por qué**, no solo qué. El *qué* ya está en el diff; el *por qué* se pierde.
- Un commit que no compila o no pasa las pruebas no se empuja: parte la bisección para todos.
- Un rechazo por no ser avance directo se resuelve **reintegrando la base**, nunca forzando.

## TODO al montar

- [ ] Tipos y ámbitos permitidos.
- [ ] De dónde sale el identificador de ticket (¿de la rama? ¿del gestor?).
- [ ] Política de integración hacia las ramas principales y quién puede hacerlo.
- [ ] Si hay varios ambientes, cómo se propaga un cambio entre ellos **sin ensuciar la rama de
      trabajo** (típicamente, una rama intermedia que absorbe el merge en vez de fusionar la rama
      principal dentro de la de trabajo).
