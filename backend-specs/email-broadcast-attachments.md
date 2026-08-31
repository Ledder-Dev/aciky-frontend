# Broadcast de emails: aceptar adjuntos y enviarlos por nodemailer

## Estado actual

`POST /api/emails/broadcast` recibe `{ subject_es, subject_en, body_es, body_en, roles }`
y encola el envío vía `emailService.sendBroadcastEmail(user, {...})`, que arma
`mailOptions` para nodemailer sin la clave `attachments`. No hay forma de que
un email de broadcast lleve un archivo adjunto.

El frontend ya sube PDFs a `POST /api/upload/pdf` (endpoint existente,
`requireAuth`, límite 10MB, solo `application/pdf`) y ahora, antes de enviar
el broadcast, adjunta al payload un array `attachments: [{ url, filename }]`
con lo que el usuario haya subido (puede venir vacío u omitido).

## Cambio requerido

- `POST /api/emails/broadcast`: aceptar `attachments` opcional, array de
  `{ url, filename }`. Si viene, validar que cada `url` apunte al propio
  storage de subida del backend (mismo prefijo/host que ya usa
  `/api/upload/pdf` para las URLs que devuelve) — rechazar con 400 cualquier
  URL externa, para no exponer a nodemailer a rutas arbitrarias controladas
  por el request.
- Pasar `attachments` a través de `emailController.broadcast` hasta
  `emailService.sendBroadcastEmail`, y de ahí a `mailOptions.attachments`
  como `attachments.map(a => ({ filename: a.filename, path: a.url }))`
  (formato que nodemailer ya soporta nativamente).
- Sin `attachments` en el request, el comportamiento debe ser idéntico al
  actual (sin la clave, o array vacío).

Respeta las capas Route→Controller→Service ya existentes; no se toca
`routes/upload.js` ni el endpoint de subida.

## Por qué

El usuario admin necesita poder mandar un PDF (ej. boletín, programa,
comprobante) junto con el email de broadcast desde
`pages/admin/email-broadcast.html`. El frontend ya resuelve la subida del
archivo reutilizando `/api/upload/pdf`; falta que el backend use esa URL
para adjuntar el archivo al correo real en vez de solo guardarla sin uso.

## Pendiente de definir con el usuario

Por ahora el frontend solo permite adjuntar PDF (reusa el endpoint existente
sin tocarlo). Si más adelante se necesita adjuntar "otra cosa" (imágenes,
Word, etc.), hay que decidir si se amplía el `fileFilter` de
`/api/upload/pdf` a una whitelist de tipos o si se crea un endpoint de
adjuntos genérico — no implementado todavía por no tener claro el alcance.
