---
titulo: "Estructura de cotización y motor de cálculo"
tipo: "patrón"
rol: "desarrollador"
proyecto: "viho"
tags: [cotizacion, motor-calculo, pricing, reglas-negocio]
actualizado: "2026-08-19"
fuente: "docs/referencia/ALFA CALI MAURICIO FORERO .pdf + VIHO_data.xlsx"
---

# Estructura de cotización y motor de cálculo

## Fuente de la verdad
- `docs/referencia/ALFA CALI MAURICIO FORERO .pdf` (cotización real de $12.7M COP)
- `VIHO_data.xlsx` hoja "Reglas de Negocio"
- `docs/referencia/Cotización_VIHO.pdf` sección "Cómo calcula"

## Espécimen de referencia
La cotización de Mauricio Forero (`ALFA CALI MAURICIO FORERO .pdf`) es el ejemplo real que el motor debe replicar:

```
MOBILIARIO ARQUITECTONICO
├── Muebles: Duratex 15mm Cinza + Verde Olivo
├── Herrajes: Blum (bisagras Unihopper, correderas, cajones)
├── Perfilería: Gola + vidrio templado humo
├── Mesón: Piedra sinterizada Altea Calcattra Royale 12mm
├── LED: 110V luz cálida
└── Total: $12.741.360 COP
```

## Estructura de datos del motor (extraída de cotizaciones reales)

> **Fuentes:** `docs/referencia/ALFA_CALI_MAURICIO_FORERO.md` ($12.7M + IVA = $45.2M) y
> `docs/referencia/KAREN_Y_CESAR_COCINA.md` ($13.8M + IVA = $34.1M)

### Categorías de la cotización

La cotización se estructura en **4 grandes rubros**, cada uno con sub-rubros:

| # | Rubro | Sub-rubros |
|---|-------|------------|
| 1 | **Mobiliario arquitectónico** | Muebles (Duratex 15mm Cinza + Verde Olivo) |
| 2 | **Herrajes** | Bisagras (Unihopper), cajones (900/760/800mm), condimentero, carrito, cubrientero, basurero, organizador, pulsadores Blum, brazos hidráulicos |
| 3 | **Accesorios / Perfilería** | Perfil Gola, unión, ventana, escuadra, zócalo, patas, abrazaderas, esquineros, vidrio templado 6mm, vidrio crudo humo 4mm, LED 110V luz cálida |
| 4 | **Mesón cubierta** | Piedra sinterizada Altea Calcattra Royale 12mm |

### Estructura por ítem

| Campo | Tipo | Ejemplo | Obligatorio |
|-------|------|---------|-------------|
| `item` | string | "Bisagra Unihopper" | Sí |
| `categoria` | enum | "herrajes" | Sí |
| `unidad` | enum | "UND", "ML", "M2" | Sí |
| `valor_unitario` | number | 305325 | Sí |
| `cantidad` | number | 8 | Sí |
| `total` | number | (valor × cantidad) | Calculado |
| `material` | string | "Duratex 15mm" | Sí (para muebles) |

### Tabla de precios unitarios reales (extraída de ambas cotizaciones)

| Ítem | Unidad | Precio Unit. |
|------|--------|-------------|
| Bisagra Unihopper | UND | $305.325 |
| Cajón 900mm | UND | $275.828 |
| Cajón 760mm | UND | $275.828 |
| Cajón vidrio 800mm | UND | $508.473 |
| Condimentero 300mm | UND | $29.498 |
| Carrito 400mm | UND | $29.498 |
| Cubrientero 900mm negro | UND | $104.248 |
| Basurero doble 400mm | UND | $440.048 |
| Organizador platero negro | UND | $344.253 |
| Mueble riel Nuomi | UND | $2.579.560 |
| Pulsadores Blum | UND | $29.498 |
| Brazos hidráulicos Unihopper | UND | $59.973 |
| Perfil Gola | ML | $27.229 |
| Accesorio unión perfil Gola | UND | $5.625 |
| Perfil para ventana | ML | $38.750 |
| Escuadra x4 | UND | $14.000 |
| Perfil zócalo base negro | UND | $31.250 |
| Patas plásticas elevadas 100mm | UND | $3.125 |
| Abrazadera negra | UND | $938 |
| Esquinero negro | UND | $2.625 |
| Vidrio templado entrepaño 6mm | M2 | $375.975 |
| Vidrio crudo humo 4mm | M2 | $225.975 |
| Perfil LED 110V luz cálida | ML | $69.400 |
| Mesón cubierta (Altea) | M2 | $4.286.800 |

> ⚠ Los precios son de julio 2026 y están sujetos a ajuste.

### Categorías de muebles (Duratex 15mm)
- **Cinza** — usado en ALFA CALI
- **Verde Olivo** — usado en ALFA CALI
- **Genérico (14 módulos)** — usado en KAREN Y CESAR

## Las reglas de negocio del motor

> **Fuente:** `VIHO_data.xlsx` hoja "Reglas de Negocio"

### Transporte fijo por ciudad
| Ciudad | Valor | Se agrega como |
|--------|-------|----------------|
| Cali | $350.000 | Rubro "Transporte" |
| Popayán | $850.000 | Rubro "Transporte" |
| Eje Cafetero | $900.000 | Rubro "Transporte" |
| Pasto | $1.600.000 | Rubro "Transporte" |

### Costos obligatorios (siempre se incluyen)
| Concepto | Cali | Otras ciudades |
|----------|------|----------------|
| Visita + Diseño 3D + Render | $450.000 | $650.000 |

### Estructura de totales (extraída de cotizaciones)
```
COSTO DIRECTO: suma de todos los ítems
IVA 19%: (costo directo × 0.19)
TOTAL CON IVA: costo directo + IVA
```

### Métodos de pago (extraídos de cotizaciones)
- **70% anticipo / 30% contra entrega** (estándar)
- **Alternativa:** 50% / 30% / 20%

### Tiempos de entrega (extraídos de cotizaciones)
- **Producción:** 30 días hábiles
- **Instalación:** 15 días hábiles
- **Total:** 45 días hábiles

### Rubros que siempre deben aparecer
1. Muebles (altos + bajos) — Duratex 15mm con color específico
2. Herrajes — Unihopper / Blum (bisagras, correderas, organizadores)
3. Accesorios — Perfilería Gola, vidrio, LED
4. Mesón — Piedra sinterizada Altea
5. Electrodomésticos (si aplica)

### Formato de salida
```
COSTO DIRECTO: $X.XXX.XXX
IVA 19%: $Y.YYY.YYY
TOTAL: $Z.ZZZ.ZZZ

RANGO ESTIMADO: $Z1.ZZZ.ZZZ — $Z2.ZZZ.ZZZ
* Cotización referencial generada por pre-cotizador. Sujeta a visita técnica.
```

**Importante:** el agente NUNCA da un precio fijo. Siempre un rango mín–máx.

## Reglas para el desarrollador

1. **Los precios viven en el servidor**, nunca en el navegador. Nadie debe poder ver los márgenes inspeccionando la página.
2. **El rango se calcula** con un factor de variación (ej: ±15% o configurable por el cliente).
3. **Cada item** debe traer: categoría, unidad, valor unitario, cantidad estimada.
4. **El transporte** se agrega como rubro separado al final.
5. **Los costos obligatorios** (visita/diseño/render) se suman automáticamente.
6. **Formato de moneda:** siempre COP con punto como separador de miles ($12.741.360).
7. **El estimado** debe incluir la nota: "*Cotización referencial. Sujeta a visita técnica.*"

## Dónde NO se cumple
- El motor de cálculo aún no está implementado. Este patrón define cómo DEBE funcionar.
- Las reglas de negocio están en `VIHO_data.xlsx` y en este patrón. Cuando se implemente el motor, una sola fuente debe ser la autoridad.

## Reglas al cierre
- [ ] El motor de cálculo lee precios del servidor (API route), no del cliente
- [ ] El rango se muestra como mín–máx, nunca precio fijo
- [ ] El transporte se calcula según la ciudad seleccionada
- [ ] Los costos obligatorios se suman automáticamente
- [ ] La nota de "referencial" aparece siempre
- [ ] La moneda se formatea correctamente (COP)
