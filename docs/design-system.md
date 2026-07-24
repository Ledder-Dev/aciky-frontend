# Design System — yoga-v2
> Claude Design lee este archivo al apuntar la carpeta del mundo.
> Mantenerlo actualizado garantiza coherencia visual entre sesiones.

## Identidad
- Proyecto: ACIKY — centro de Kundalini Yoga (Cuba)
- Audiencia: B2C — practicantes de yoga, comunidad bilingüe ES/EN
- Tono visual: cálido, natural, espiritual pero profesional. Verde como color ancla.

## Paleta de colores
| Token              | Valor   | Uso                              |
|--------------------|---------|-----------------------------------|
| --color-primary        | #708558 | Verde principal de marca         |
| --color-primary-dark   | #5c6c4a | Botones CTA, headings (SIEMPRE en CTAs principales) |
| --color-primary-light  | #a3be84 | Highlights, acentos               |
| --color-accent-teal    | #5AACCC | Badge de instructor                |
| --color-accent-terracotta | #E8A090 | Advertencias, eliminar          |
| --color-accent-rose    | #E87A9A | Badge de admin                     |

Regla dura: colores de acento (terracotta/rose/teal) SOLO para badges y elementos
secundarios, NUNCA para CTAs principales — esos siempre van en primary-dark.

## Tipografía
- Semántica HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- Iconos: Material Symbols exclusivamente, NUNCA emojis
- Idioma: `lang="es"` en `<html>`, tildes y ñ correctas en todo texto (ES/EN vía i18n)

## Espaciado
- Mobile-first: `px-4 md:px-8 lg:px-16`
- Hero section: card-style `h-[420px] rounded-3xl` (NO full-width)
- Quote section: `p-8 bg-white rounded-2xl shadow-sm border-l-4 border-primary`

## Componentes clave
- Botón CTA primario: `bg-primary-dark text-white hover:bg-primary`
- Cards: fondo blanco, sombra sutil, `rounded-2xl`/`rounded-3xl`
- Carousels horizontales: `flex overflow-x-auto gap-5 px-6 pb-4 hide-scrollbar`
- Ver detalle completo de patrones en `docs/CONVENTIONS.md` (page structure patterns, iconos comunes)

## Exports y handoffs
Ver docs/design/ para los bundles recibidos desde Claude Design.
