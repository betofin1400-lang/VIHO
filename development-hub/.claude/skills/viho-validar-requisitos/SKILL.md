---
name: viho-validar-requisitos
description: Prevalidación de requisitos antes de arrancar el flujo. Audita que estén claros, completos, consistentes, testables y coherentes con la arquitectura, y escribe .work/<ws>/<item>/validacion-requisitos.md. Los hallazgos bloqueantes paran y preguntan. La invoca la forja después de particionar y antes del triage.
---

# validar-requisitos

> **STUB — rellenar.** Las seis dimensiones son universales; lo que cambia es dónde vive tu fuente de
> requisitos y quién manda ante divergencia.

## Dónde encaja

```
requisitos escritos → [ validar-requisitos ] → triage → contexto → casos → forja
```

Audita **antes** de invertir en triage, selección de contexto, casos y playbook. Un requisito
ambiguo detectado aquí cuesta una pregunta; detectado en la verificación cuesta el item entero.

## Las seis dimensiones

1. **Completitud** — ¿el criterio dice el resultado esperado **literal**? ¿nombra el rol? ¿cubre la
   ruta feliz **y** la de error? Marcas como «por definir», «TBD» o «(?)» son huecos, no matices.
2. **Consistencia** — criterios que se contradicen; terminología que cambia de nombre a mitad;
   estados o entidades que se usan sin haberse definido.
3. **Testabilidad** — ¿se puede convertir en un caso con **resultado observable**? «Debe ser rápido»
   no lo es; «responde en menos de 400 ms al percentil 95» sí.
4. **Cobertura de la costura** — si cruza capas o sistemas, ¿está definido el comportamiento de
   **ambos lados**? Es donde más huecos aparecen y el que menos se mira.
5. **Coherencia con la arquitectura** — ¿contradice un patrón documentado, la seguridad o la
   integridad de los datos? Si sí, **se refuta antes de construir** (`config §17`).
6. **Trazabilidad con la fuente** — ¿la historia cita su origen y coincide con él? **La fuente manda.**

## Salida

`validacion-requisitos.md` con **veredicto** (`LISTO` / `LISTO CON SUPUESTOS` / `HAY BLOQUEANTES`) +
tabla de hallazgos (`Requisito | Criterio | Hallazgo | Dimensión | Severidad | Pregunta al dev`) +
supuestos registrados + preguntas abiertas.

**Con bloqueantes, el flujo PARA.** Con hallazgos menores, se registran los supuestos —**explícitos,
para que alguien pueda ratificarlos o desmentirlos**— y se continúa.

## Postura

**Adversarial pero justo.** No es un checklist blando: revisa con fundamento y busca lo que falta.
Y no inventa requisitos ni rellena huecos con supuestos silenciosos: **los expone**. Al mismo tiempo,
**no infla hallazgos menores a bloqueantes ni pide detalle que la especificación no necesita** — una
prevalidación que siempre bloquea se desactiva a la semana.

## TODO al montar

- [ ] Indicar dónde vive la fuente de requisitos (`config §6`) y cómo se contrasta.
- [ ] Declarar quién manda ante divergencia entre la fuente y una historia derivada.
- [ ] Ajustar la escala de severidad y **qué severidad bloquea** en tu equipo.
- [ ] Enlazar las secciones de la arquitectura contra las que se contrasta la dimensión 5.
