# HU-01 · Landing Page VIHO Arquitectura

> **Fuente:** Brief del cliente + referencias visuales (mdvarquitectura.com, ariassernasaravia.com.co)
> **Prioridad:** Alta · **Módulo:** Frontend (Next.js)

## Historia

Como **potencial cliente de VIHO Arquitectura** quiero **encontrar información clara sobre los servicios, el portafolio del estudio y una forma de contacto** para **evaluar si es el estudio indicado para mi proyecto**.

## Contexto

VIHO Arquitectura es un estudio boutique de arquitectura interior especializado en **cocinas, baños, estudios y closets**, liderado por Sebastián Vizcaíno Hoyos. El sistema actual solo tiene el wizard de pre-cotización. Esta landing page es la puerta de entrada: debe transmitir **exclusividad, elegancia y confianza**.

**Decisiones del cliente:**
- Estilo visual: **oscuro / elegante** (fondos negros/grises oscuros con dorado como acento)
- Enfoque: **PC / Tablet first** (responsive, pero la experiencia principal es desktop)
- Estructura: **One-page** (scroll continuo, no múltiples páginas)
- Las secciones son: Portafolio, Servicios, Contacto, Sobre mí

**Referencias visuales analizadas:**
1. **mdvarquitectura.com**: Slider hero a pantalla completa, grid de proyectos por categoría, sección de servicios con iconos, CTA con "¿Deseas hacer tu proyecto con nosotros?", footer con redes sociales y datos de contacto.
2. **ariassernasaravia.com.co**: Minimalismo elegante, botón flotante de contacto, menú sticky, tipografía limpia, uso de video/imagen de fondo.

## Criterios de aceptación

**CA-1 · Hero Section**
- **Dado** que un usuario llega a la landing
- **Cuando** carga la página
- **Entonces** ve una sección hero a pantalla completa con:
  - Imagen de fondo (cocina de alto impacto, oscurecida)
  - Logo de VIHO Arquitectura centrado
  - Título principal: **"Diseñamos espacios que transforman tu hogar"**
  - Subtítulo: **"Estudio de arquitectura especializado en cocinas, baños, estudios y closets en Cali"**
  - Botón CTA: **"Conoce nuestro trabajo"** (scroll a portafolio)

**CA-2 · Navegación Sticky**
- **Dado** que el usuario hace scroll
- **Cuando** supera la sección hero
- **Entonces** aparece una barra de navegación fija (sticky) con:
  - Logo pequeño a la izquierda
  - Enlaces: Inicio | Portafolio | Servicios | Sobre mí | Contacto
  - Botón de WhatsApp o "Cotizar" a la derecha (color dorado `#DEA71A`)
  - Fondo: negro semitransparente con blur

**CA-3 · Sección Portafolio**
- **Dado** que el usuario quiere ver trabajos realizados
- **Cuando** llega a la sección Portafolio
- **Entonces** ve:
  - Título: **"Nuestros Proyectos"**
  - Grid de imágenes (2-3 columnas en desktop, 1 en móvil)
  - Cada proyecto muestra: imagen + nombre del proyecto + ubicación
  - Hover: efecto de zoom suave + overlay con nombre
  - ⚠ **PENDIENTE POR DEFINIR:** ¿Cuántos proyectos mostrar? ¿Filtrar por categoría? (El cliente tiene cotizaciones reales: ALFA CALI, KAREN Y CESAR)

**CA-4 · Sección Servicios**
- **Dado** que el usuario quiere entender qué ofrece VIHO
- **Cuando** llega a la sección Servicios
- **Entonces** ve:
  - Título: **"Nuestros Servicios"**
  - Grid de 4 servicios (2x2 en desktop, 1 columna en móvil):
    1. **Cocinas** — Icono de pintura + descripción
    2. **Baños** — Icono de baño + descripción
    3. **Estudios** — Icono de libro + descripción
    4. **Closets** — Icono de archive + descripción
  - Cada servicio: ícono dorado + título + descripción corta

**CA-5 · Sección Sobre Mí**
- **Dado** que el usuario quiere conocer al fundador
- **Cuando** llega a la sección Sobre mí
- **Entonces** ve:
  - Layout: imagen a la izquierda, texto a la derecha (stack en móvil)
  - Foto de perfil de Sebastián Vizcaíno ⚠ **PENDIENTE POR DEFINIR:** ¿El cliente tiene foto profesional?
  - Nombre: **"Sebastián Vizcaíno Hoyos"**
  - Título: **"Arquitecto y Fundador"**
  - Biografía breve: 2-3 líneas sobre su experiencia y enfoque
  - ⚠ **PENDIENTE POR DEFINIR:** Texto exacto de la biografía (borrador abajo)

**CA-6 · Sección Contacto**
- **Dado** que el usuario quiere comunicarse
- **Cuando** llega a la sección Contacto
- **Entonces** ve:
  - Título: **"¿Listo para tu proyecto?"**
  - Formulario simple: Nombre, Email, Teléfono, Mensaje
  - Botón "Enviar Mensaje" (dorado)
  - Datos de contacto a la derecha:
    - Dirección ⚠ **PENDIENTE POR DEFINIR** (Cali, pero dirección exacta no conocida)
    - Teléfono ⚠ **PENDIENTE POR DEFINIR**
    - Email: sebastianvizcaino@vihoarquitectura.co
    - Redes sociales: Instagram, Facebook

**CA-7 · Footer**
- **Dado** que el usuario llega al final de la página
- **Cuando** hace scroll hasta el footer
- **Entonces** ve:
  - Logo de VIHO
  - Copyright: © 2026 VIHO Arquitectura. Todos los derechos reservados.
  - Enlaces: Política de Privacidad | Términos
  - Redes sociales

**CA-8 · Diseño Visual (Estilo Oscuro/Elegante)**
- **Dado** que el estilo es oscuro y elegante
- **Cuando** se implementa cualquier sección
- **Entonces** se respetan:
  - Fondos: `#0E2B1D` (verde oscuro), `#1A1A1A` (negro), `#2A2A2A` (gris oscuro)
  - Texto principal: `#FFFFFF` (blanco)
  - Texto secundario: `#CCCBCD` (gris)
  - Acentos: `#DEA71A` (dorado) para CTAs, bordes, iconos
  - Hover: `#E1CB82` (arena) para transiciones suaves
  - Tipografía: sans-serif moderna (Inter, Montserrat o similar)

**CA-9 · Responsive (PC/Tablet First)**
- **Dado** que el enfoque es PC/Tablet
- **Cuando** se visualiza en diferentes tamaños
- **Entonces**:
  - Desktop (>1024px): layout completo, grid de 2-3 columnas
  - Tablet (768-1024px): layout adaptado, grid de 2 columnas
  - Móvil (<768px): layout apilado, 1 columna, menú hamburguesa

**CA-10 · Performance**
- **Dado** que la página debe cargar rápido
- **Cuando** se visita desde cualquier dispositivo
- **Entonces**:
  - LCP < 2.5s
  - Imágenes optimizadas (WebP donde sea posible)
  - Lazy loading en imágenes below the fold

## Reglas de negocio

1. El estilo **siempre** es oscuro/elegante. No hay modo claro.
2. El dorado `#DEA71A` es el color de acción. Todos los CTAs usan este color.
3. La landing es one-page: no hay rutas internas, solo scroll.
4. El wizard de pre-cotización (page.tsx actual) se mantiene intacto.
5. El botón "Cotizar" en el nav lleva a la sección de contacto (#contacto).
6. Los 4 tipos de proyecto son: **Cocinas, Baños, Estudios, Closets** (definidos por el cliente).

## Fuera de alcance

- Blog o sección de noticias
- Panel de administración
- Integración con CRM
- Sistema de reservas de citas
- Multidioma (solo español por ahora)

## Decisiones del cliente (2026-08-19)

1. **Tipos de proyecto:** Cocinas, Baños, Estudios, Closets. Landing refleja los 4 tipos en Hero, Servicios y Portafolio.
2. **Portafolio:** Mix de proyectos variados (2 cocinas, 2 baños, 1 estudio, 1 closet). Modal de detalle reutilizable con badge de categoría.
3. **Fotos de proyectos:** Usar imágenes mock hasta que el cliente provea fotos reales.
4. **Foto de Sebastián:** PENDIENTE IMAGEN DEL CLIENTE. Usar placeholder con texto "Imagen del cliente".
5. **Dirección:** PENDIENTE. Usar iframe de mapa con ubicación temporal (Cali).
6. **Teléfono:** PENDIENTE. No incluir por ahora.
7. **Redes sociales:** Sí, configurar iconos y links. Vincular después.
8. **Formulario:** Documentar como envío de email, pero PENDIENTE de definición funcional.
9. **Video:** Puede haber en el futuro, no incluir por ahora.

---

### Textos borrador (actualizados según cotización del cliente)

#### Servicios (4 tipos de proyecto)

**1. Cocinas**
Diseño y construcción de cocinas personalizadas. Lineales, en L, con península o en isla — cada cocina es única, diseñada a medida de tus necesidades y estilo de vida.

**2. Baños**
Transformamos baños en espacios funcionales y elegantes. Diseño integral con acabados de alta calidad que combinan estética y confort.

**3. Estudios**
Creamos espacios de trabajo y estudio optimizados. Diseño que potencia la productividad con soluciones de almacenamiento e iluminación inteligente.

**4. Closets**
Closets y Walk-in closets diseñados al milímetro. Soluciones de almacenamiento que aprovechan cada centímetro con acabados premium.

#### Sobre Mí (borrador)

**Sebastián Vizcaíno Hoyos**
Arquitecto y Fundador de VIHO Arquitectura.

Con experiencia en diseño de interiores y arquitectura, fundé VIHO con la visión de crear espacios que no solo sean hermosos, sino que transformen la experiencia de habitar un hogar — cocinas, baños, estudios y closets. Mi enfoque combina diseño contemporáneo con materiales de alta calidad y un servicio integral.
