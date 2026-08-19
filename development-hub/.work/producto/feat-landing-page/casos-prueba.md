# Casos de Prueba — feat-landing-page

## Suite de verificación

### CA-1 · Hero Section

| # | Caso | Tipo | Plataforma | Automatizable |
|---|------|------|------------|---------------|
| 1.1 | La página carga y muestra el hero a pantalla completa | Happy path | Desktop | Playwright |
| 1.2 | El hero muestra imagen de fondo | Happy path | Desktop | Playwright |
| 1.3 | El hero muestra el título principal | Happy path | Desktop | Playwright |
| 1.4 | El hero muestra el subtítulo | Happy path | Desktop | Playwright |
| 1.5 | El botón CTA existe y es clickeable | Happy path | Desktop | Playwright |
| 1.6 | Click en CTA hace scroll a portafolio | Happy path | Desktop | Playwright |

### CA-2 · Navegación Sticky

| # | Caso | Tipo | Plataforma | Automatizable |
|---|------|------|------------|---------------|
| 2.1 | Nav no es visible al cargar (está bajo el hero) | Happy path | Desktop | Playwright |
| 2.2 | Nav aparece al hacer scroll después del hero | Happy path | Desktop | Playwright |
| 2.3 | Nav tiene logo, enlaces y botón CTA | Happy path | Desktop | Playwright |
| 2.4 | Nav es sticky (se queda fijo al hacer scroll) | Happy path | Desktop | Playwright |
| 2.5 | Click en enlaces hace scroll a la sección correcta | Happy path | Desktop | Playwright |
| 2.6 | Botón "Cotizar" lleva al wizard (/ ) | Happy path | Desktop | Playwright |

### CA-3 · Sección Portafolio

| # | Caso | Tipo | Plataforma | Automatizable |
|---|------|------|------------|---------------|
| 3.1 | Sección portafolio existe y es visible | Happy path | Desktop | Playwright |
| 3.2 | Grid muestra proyectos con imagen y nombre | Happy path | Desktop | Playwright |
| 3.3 | Hover en proyecto muestra efecto visual | Borde | Desktop | Playwright |
| 3.4 | Grid es responsive (2-3 cols desktop, 1 mobile) | Happy path | Multi | Playwright |

### CA-4 · Sección Servicios

| # | Caso | Tipo | Plataforma | Automatizable |
|---|------|------|------------|---------------|
| 4.1 | Sección servicios existe y es visible | Happy path | Desktop | Playwright |
| 4.2 | Muestra 4 servicios con ícono, título y descripción | Happy path | Desktop | Playwright |
| 4.3 | Grid es responsive (2x2 desktop, 1 col mobile) | Happy path | Multi | Playwright |

### CA-5 · Sección Sobre Mí

| # | Caso | Tipo | Plataforma | Automatizable |
|---|------|------|------------|---------------|
| 5.1 | Sección sobre mí existe | Happy path | Desktop | Playwright |
| 5.2 | Muestra imagen del fundador | Happy path | Desktop | Playwright |
| 5.3 | Muestra nombre, título y biografía | Happy path | Desktop | Playwright |
| 5.4 | Layout responsive (lado a lado desktop, apilado mobile) | Happy path | Multi | Playwright |

### CA-6 · Sección Contacto

| # | Caso | Tipo | Plataforma | Automatizable |
|---|------|------|------------|---------------|
| 6.1 | Sección contacto existe | Happy path | Desktop | Playwright |
| 6.2 | Formulario tiene campos: Nombre, Email, Teléfono, Mensaje | Happy path | Desktop | Playwright |
| 6.3 | Botón "Enviar Mensaje" existe | Happy path | Desktop | Playwright |
| 6.4 | Datos de contacto son visibles | Happy path | Desktop | Playwright |
| 6.5 | Formulario muestra validación de campos requeridos | Negativo | Desktop | Playwright |

### CA-7 · Footer

| # | Caso | Tipo | Plataforma | Automatizable |
|---|------|------|------------|---------------|
| 7.1 | Footer existe y muestra copyright | Happy path | Desktop | Playwright |
| 7.2 | Footer muestra enlaces a redes sociales | Happy path | Desktop | Playwright |

### CA-8 · Diseño Visual

| # | Caso | Tipo | Plataforma | Automatizable |
|---|------|------|------------|---------------|
| 8.1 | Fondos usan colores de marca (#0E2B1D, #1A1A1A) | Happy path | Desktop | Visual |
| 8.2 | CTAs usan dorado (#DEA71A) | Happy path | Desktop | Visual |
| 8.3 | Texto principal es blanco sobre oscuro | Happy path | Desktop | Visual |

### CA-9 · Responsive

| # | Caso | Tipo | Plataforma | Automatizable |
|---|------|------|------------|---------------|
| 9.1 | Desktop (>1024px): layout completo | Happy path | Desktop | Playwright |
| 9.2 | Tablet (768-1024px): grid de 2 columnas | Happy path | Tablet | Playwright |
| 9.3 | Móvil (<768px): layout apilado, menú hamburguesa | Happy path | Mobile | Playwright |

### CA-10 · Performance

| # | Caso | Tipo | Plataforma | Automatizable |
|---|------|------|------------|---------------|
| 10.1 | LCP < 2.5s | Happy path | Desktop | Lighthouse |
| 10.2 | Imágenes tienen lazy loading | Borde | Desktop | Playwright |

## Resumen

- **Total de casos:** 38
- **Automatizables:** 36 (Playwright)
- **Manuales:** 2 (Visual)
