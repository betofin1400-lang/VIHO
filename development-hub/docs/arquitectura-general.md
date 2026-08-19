# Arquitectura General — VIHO Arquitectura

> **Propósito:** mapa del sistema para que cualquier persona o agente se ubique en una sentada.
> Único documento que se lee completo. Lo demás se carga selectivamente vía `index.md`.
>
> **Autoridad:** este documento gana ante cualquier otra documentación previa del repositorio,
> porque sus afirmaciones están ancladas a rutas de código verificadas contra `main`.

---

## 1. Qué es VIHO Arquitectura

Un **agente pre-cotizador de IA** que vive dentro de una página web y cotiza proyectos de
arquitectura (cocinas, baños, estudios, closets) automáticamente, 24 horas al día.

La persona entra, arma su proyecto y sale con un estimado de precio. El cliente (Sebastián Vizcaíno)
recibe el contacto con todo el detalle, sin haber invertido un minuto.

**Producto actual:** formulario de onboarding de 5 pasos que captura la configuración del cliente
y genera un espacio de trabajo en Google Drive (Sheets + carpeta).

**Producto futuro:** landing page completa + agente de IA embebido + motor de cálculo de cotizaciones.

---

## 2. Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.3.0 |
| **UI** | React | 19.2.8 |
| **Estilos** | Tailwind CSS | 4.x |
| **Lenguaje** | TypeScript | 5.x |
| **Iconos** | Lucide React | 1.31.0 |
| **APIs externas** | Google Drive API, Google Sheets API | googleapis@174.0.1 |
| **Despliegue** | Vercel (configurado) | - |
| **Runtime** | Node.js | - |

---

## 3. Paleta de marca VIHO

> **Fuente:** `docs/referencia/VIHO_Arquitectura_Libro_de_Marca.pdf` + `docs/referencia/Cotización_VIHO.pdf`
> **Estado:** verificada contra el código (`src/app/page.tsx` usa estos colores exactos)

| Color | Código | Uso | Token en código |
|-------|--------|-----|-----------------|
| **Verde oscuro** | `#0E2B1D` | Base, fondos, títulos, headers | `[#0E2B1D]` |
| **Dorado** | `#DEA71A` | Acentos, CTAs, bordes activos, progreso | `[#DEA71A]` |
| **Arena** | `#E1CB82` | Detalles, resaltados suaves, bordes | `[#E1CB82]` |
| **Salvia** | `#ADC2AF` | Fondos secundarios, líneas, acentos suaves | `[#ADC2AF]` |
| **Gris** | `#CCCBCD` | Texto de apoyo, bordes inactivos, placeholders | `[#CCCBCD]` |
| **Blanco** | `#FAFAFA` | Fondo principal de la app | `[#FAFAFA]` |

### Reglas de uso de la paleta

1. **Nunca hardcodear colores** en componentes. Definir tokens en `globals.css` o en un archivo de constantes.
2. ** Verde oscuro** = estructura (headers, footers, fondos de sección).
3. ** Dorado** = acción (botones primarios, indicadores de progreso, links activos).
4. ** Arena** = énfasis suave (borders hover, fondos de cards alternas).
5. ** Salvia** = secundario (badges, iconos secundarios, divisiones).
6. ** Gris** = texto de soporte, labels, placeholders.

---

## 4. Arquitectura del sistema

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│                                                      │
│  src/app/page.tsx      ← Wizard onboarding 5 pasos  │
│  src/app/layout.tsx    ← Layout global               │
│  src/app/globals.css   ← Estilos + paleta            │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  Paso 1: Datos generales (nombre, correo)    │   │
│  │  Paso 2: Diseño web (estructura, secciones)  │   │
│  │  Paso 3: Config agente (tipos, reglas)       │   │
│  │  Paso 4: Accesos técnicos (dominio, hosting) │   │
│  │  Paso 5: Éxito (links a Drive)               │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  Estado: localStorage con expiración de 24h          │
└──────────────────────┬──────────────────────────────┘
                       │ fetch()
                       ▼
┌─────────────────────────────────────────────────────┐
│                   API ROUTES                         │
│                                                      │
│  src/app/api/check-status/route.ts                  │
│    → GET: verifica si ya se generó el espacio        │
│                                                      │
│  src/app/api/generate-workspace/route.ts            │
│    → POST: crea carpeta + hoja en Google Drive       │
│                                                      │
└──────────────────────┬──────────────────────────────┘
                       │ Google API
                       ▼
┌─────────────────────────────────────────────────────┐
│                GOOGLE DRIVE API                      │
│                                                      │
│  1. Crear carpeta del cliente                        │
│  2. Crear Google Sheet (Brief + Reglas de Negocio)   │
│  3. Devolver links al frontend                       │
│                                                      │
│  Credenciales: google-credentials.json (service acc) │
└─────────────────────────────────────────────────────┘
```

---

## 5. Tabla de costuras (autoridad de datos)

| Frontera | Dato | Autoridad | Notas |
|----------|------|-----------|-------|
| Front → API | formData del wizard | **Frontend** (`page.tsx`) | El wizard es la fuente |
| API → Google Drive | Estructura de carpeta | **API** (`generate-workspace/route.ts`) | Define qué carpetas crea |
| API → Google Sheets | Contenido del Sheet | **API** (`generate-workspace/route.ts`) | Brief + Reglas |
| Google Drive → App | Links de acceso | **Google Drive API** | Devueltos al frontend |
| Cliente → App | Configuración | **Excel del cliente** (`VIHO_data.xlsx`) | Fuente de reglas de negocio |
| Marca → App | Colores, tipografía | **Libro de Marca** (`docs/referencia/`) | Verificada en código |

---

## 6. Datos del cliente (brief real — primer caso)

> **Fuente:** `VIHO_data.xlsx` hoja "Brief de Configuración"

| Campo | Valor |
|-------|-------|
| Contacto | Sebastián Vizcaíno Hoyos |
| Correo | sebastianvizcaino@vihoarquitectura.co |
| Empresa | BUHO ARQUITECTOS S.A.S (NIT 901428571) |
| Dominio | vihoarquitectura.com |
| Hosting | WorkSpace (paquete con dominio de correos) |
| Estructura web | Landing Page (One-page) |
| Enfoque diseño | PC / Tablet First |
| Secciones | Portafolio, Servicios, Contacto, Sobre mí |
| Estilo visual | Oscuro / elegante |
| Referencias | mdvarquitectura.com, ariassernasaravia.com.co |
| Tipos de proyecto | Cocinas, Baños, Estudios, Closets |
| Tipologías cocina | Lineal, En L, Con Península, En Isla, Todas |

---

## 7. Reglas de negocio del agente

> **Fuente:** `VIHO_data.xlsx` hoja "Reglas de Negocio"

### 7.1 Transporte (fijo por ciudad)
| Ciudad | Valor |
|--------|-------|
| Cali | $350.000 |
| Popayán | $850.000 |
| Eje Cafetero | $900.000 |
| Pasto | $1.600.000 |

### 7.2 Costos obligatorios (visita + diseño + render)
| Ciudad | Valor |
|--------|-------|
| Cali | $450.000 |
| Popayán, Eje Cafetero, Pasto | $650.000 |

### 7.3 Siempre incluir en toda cotización
- Muebles
- Herrajes
- Accesorios
- Mesones
- Electrodomésticos

### 7.4 Compromisos de entrega
- Visita técnica: máximo 3 días hábiles
- Diseño y cotización: máximo 7 días hábiles
- Ajustes: máximo 48 horas hábiles
- Entrega: hasta 40 días calendario (tras aprobación + anticipo)

---

## 8. Ejemplo real de cotización

> **Fuente:** `docs/referencia/ALFA CALI MAURICIO FORERO .pdf`

Cocina para Mauricio Forero en Cali — **$12.741.360 COP**:

| Componente | Detalle | Valor |
|------------|---------|-------|
| Muebles | Duratex 15mm Cinza + Verde Olivo | Incluido |
| Herrajes | Blum (bisagras Unihopper, correderas) | $2.579.560 |
| Perfilería | Gola + vidrio templado humo | Variable |
| Mesón | Piedra sinterizada Altea Calcattra Royale 12mm | Variable |
| LED | 110V luz cálida | Variable |

**Este es el tipo de estructura que el motor de cálculo debe replicar.**

---

## 9. Espacios de nombres

| Espacio | Descripción |
|---------|-------------|
| `src/app/` | Next.js App Router (páginas y layouts) |
| `src/app/api/` | API Routes (serverless functions) |
| `docs/` | Documentación técnica del proyecto (patrones) |
| `docs/referencia/` | Documentos originales del cliente (PDFs, imágenes) |
| `.work/` | Items de trabajo en curso |
| `development-hub/` | Centro de desarrollo |

---

## 10. ¿Dónde vive mi cambio?

| Si vas a cambiar… | Empieza por… |
|--------------------|--------------|
| El wizard de onboarding (pasos, campos, diseño) | `src/app/page.tsx` |
| La integración con Google Drive | `src/app/api/generate-workspace/route.ts` |
| La verificación de estado | `src/app/api/check-status/route.ts` |
| Los colores de la marca | `src/app/globals.css` + tokens de Tailwind |
| Las reglas de negocio del agente | API route del motor de cálculo (futuro) |
| El flujo de conversación del agente | Componente del agente embebido (futuro) |
| La landing page completa | Nuevas páginas en `src/app/` |

---

## 11. Documentos de referencia

| Archivo | Contenido | Ubicación |
|---------|-----------|-----------|
| Libro de Marca VIHO | Colores, tipografía, logo, aplicaciones | `docs/referencia/VIHO_Arquitectura_Libro_de_Marca.pdf` |
| Cotización VIHO | Propuesta comercial al cliente | `docs/referencia/Cotización_VIHO.pdf` |
| Cotización Mauricio Forero | Ejemplo real de cocina cotizada | `docs/referencia/ALFA CALI MAURICIO FORERO .pdf` |
| Formulario Página Web | Formulario de captura de datos | `docs/referencia/Formulario-PaginaWeb.pdf` |
| Imágenes marca | 6 imágenes del libro de marca | `docs/referencia/VIHO_marca_0*.png` |
| Datos del cliente | Excel con brief + reglas de negocio | `VIHO_data.xlsx` (raíz del repo) |
| Materiales presu_costo | Lista de 200+ materiales con precios | `docs/materiales_presucosto_completo.xlsx` |
