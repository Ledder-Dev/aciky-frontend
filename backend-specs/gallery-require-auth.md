# Galería (posturas/videos): exigir autenticación

## Estado actual

`GET /api/gallery` (`routes/gallery.js:7`) es público, sin `requireAuth`.
Devuelve `image_url`/`youtube_url`/`thumbnail_url` de todos los items
visibles sin importar si quien pregunta está logueado.

El frontend (`posturas.html`, `videos.html`) ya va a exigir sesión antes de
pintar nada (`requireAuth()` en `posturas.js`/`videos.js`), pero eso no sirve
de nada si alguien pega la URL de la API directo en el navegador o hace
`fetch()` sin pasar por el frontend — hoy le contesta 200 con todo el
contenido igual.

## Cambio requerido

- Agregar `requireAuth` (el mismo middleware que ya usan `/all`, `POST`,
  `PUT`, `DELETE` de esta misma ruta) al `GET /api/gallery` público.
- Sin sesión válida (cookie httpOnly o Bearer, mismo mecanismo que el resto
  del sitio), debe responder 401 — nada de `image_url`/`youtube_url` en el
  body.

No toca `/all` (admin) ni el resto de rutas de este archivo, ya protegidas.

## Nota sobre `/share/:type/:id`

`routes/share.js` arma la vista previa (og:title/og:image) para que
WhatsApp/Facebook generen la tarjeta al compartir un link, y redirige
(meta-refresh) a la página real. Como esa página real (`posturas.html`)
va a exigir login, alguien que pega `api.aciky.org/share/posture/40` en el
navegador termina igual en el login.

Pero el HTML de `/share/:type/:id` en sí sigue siendo público — expone
título, descripción y URL de thumbnail en los meta tags sin pedir sesión,
porque los bots de redes sociales no tienen forma de loguearse. No lo toco
en este spec; si se requiere bloquearlo también, hay que decidir si vale la
pena perder las tarjetas de preview al compartir (trade-off explícito, no
implementado por decisión pendiente).

## Por qué

El usuario pidió que posturas/videos e imágenes no queden visibles sin
autenticarse. El gate del frontend solo cubre el flujo normal de navegación;
la API pública sigue siendo la puerta de atrás mientras no se proteja acá.
