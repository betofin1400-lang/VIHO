---
titulo: "Flujo de conversación del agente pre-cotizador"
tipo: "patrón"
rol: "desarrollador"
proyecto: "viho"
tags: [agente, conversacion, flujo, ia]
actualizado: "2026-08-19"
fuente: "docs/referencia/Cotización_VIHO.pdf + VIHO_data.xlsx"
---

# Flujo de conversación del agente pre-cotizador

## Fuente de la verdad
- `docs/referencia/Cotización_VIHO.pdf` sección "3. El agente pre-cotizador"
- `VIHO_data.xlsx` hoja "Brief de Configuración" (preguntas del agente)
- `VIHO_data.xlsx` hoja "Reglas de Negocio" (compromisos de entrega)

## Espécimen de referencia
El flujo documentado en la cotización al cliente:

```
1. Tipo de proyecto → cocinas, salas, estudios, baño, varios
2. [Según tipo] Tipología → lineal, en L, con península, en isla
3. Medidas → metros lineales de mesón + área del espacio
4. Materiales → mesón, muebles altos/bajos, acabados (catálogo definido)
5. Herrajes y accesorios → bisagras, correderas, organizadores, iluminación
6. Datos de contacto
```

## El flujo paso a paso

### Fase 1: Bienvenida y tipología
```
Agente: ¡Hola! Soy el asistente de VIHO Arquitectura. ¿Qué tipo de proyecto tienes en mente?
Usuario: [Selecciona: Cocinas, Baños, Estudios, Closets]
```

### Fase 2: Detalles según tipo (ejemplo: Cocina)
```
Agente: ¿Qué tipología de cocina deseas?
        → Lineal | En L | Con Península | En Isla

Agente: ¿Cuál es el área aproximada en m²?

Agente: ¿Qué tendencia arquitectónica te gustaría?

Agente: ¿Cuál es tu presupuesto estimado?
```

### Fase 3: Materiales y acabados
```
Agente: Ahora selecciona los materiales:
        → Mesón (cubierta):选项...
        → Muebles altos:选项...
        → Muebles bajos:选项...
        → Acabados:选项...

Agente: ¿Qué herrajes prefieres?
        → Bisagras | Correderas | Organizadores

Agente: ¿Accesorios adicionales?
        → Iluminación LED | Perfil Gola | Vidrio templado
```

### Fase 4: Cálculo y entrega
```
Agente: [Calcula rango de precio]
        RANGO ESTIMADO: $X.XXX.XXX — $Y.YYY.YYY
        * Cotización referencial. Sujeta a visita técnica.

        ¿Te gustaría agendar una visita técnica con nuestro equipo?
```

### Fase 5: Captura del lead
```
Agente: Para enviarte el detalle, ¿cuál es tu nombre y correo?
        → [Captura + autorización Ley 1581]

Agente: ¡Listo! Te enviamos el estimado a tu correo.
        Compromiso: Visita técnica en máximo 3 días hábiles.
```

## Reglas para el desarrollador

1. **Tono:** cercano y minimalista, como lo define la marca VIHO. No formal, no excesivamente casual.
2. **El agente NUNCA da un precio fijo.** Siempre un rango mín–máx.
3. **El estimado** sale marcado como referencial y sujeto a visita técnica.
4. **Los tipos de proyecto** y tipologías se cargan desde la configuración del cliente (Excel).
5. **El agente debe preguntar** en orden: tipo → tipología → medidas → materiales → herrajes → contacto.
6. **Si la persona se sale del flujo**, el agente redirige suavemente sin perder el contexto.
7. **La captura del lead** incluye autorización de tratamiento de datos (Ley 1581).
8. **El lead se envía** por correo al cliente con todo lo que la persona armó.

## Compromisos de entrega que el agente debe mencionar
- Visita técnica: máximo 3 días hábiles
- Diseño y cotización: máximo 7 días hábiles
- Ajustes: máximo 48 horas hábiles
- Entrega: hasta 40 días calendario

## Dónde NO se cumple
- El agente de IA aún no está implementado. Este patrón define cómo DEBE funcionar.
- Las preguntas actuales del wizard (`page.tsx` paso 3) son una versión simplificada de este flujo.

## Reglas al cierre
- [ ] El flujo respeta el orden: tipo → tipología → medidas → materiales → herrajes → contacto
- [ ] El tono es cercano y minimalista
- [ ] El precio se muestra como rango, nunca fijo
- [ ] La nota de "referencial" aparece siempre
- [ ] Se captura autorización de datos (Ley 1581)
- [ ] El lead se envía por correo al cliente
