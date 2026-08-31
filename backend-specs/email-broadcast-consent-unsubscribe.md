# Broadcast de emails: consentimiento y unsubscribe

## Estado actual

`emailController.broadcast` arma destinatarios con
`userRepository.findVerifiedByRoles(roles)` — cualquier usuario verificado
del rol elegido recibe el correo, sin haber dado consentimiento explícito
para comunicaciones masivas ni forma de darse de baja.

## Cambio requerido

### Consentimiento
- Agregar columna `email_broadcast_consent` (boolean, default `false`) y
  `email_broadcast_consent_at` (timestamp, nullable) a la tabla de usuarios.
- En el flujo de registro (o en preferencias de cuenta, lo que ya exista de
  perfil), exponer un toggle explícito para este consentimiento —
  independiente de los correos transaccionales (verificación, reset de
  contraseña, confirmaciones de reserva), que NUNCA deben depender de este
  flag.
- `findVerifiedByRoles` (o el punto donde `emailController.broadcast` arma
  la lista) debe filtrar además por `email_broadcast_consent = true`.

### Unsubscribe
- Agregar columna `email_unsubscribe_token` (string único, generado al
  crear el usuario o al primer envío) para no requerir login al darse de
  baja.
- Nuevo endpoint público `GET /api/emails/unsubscribe/:token`: si el token
  es válido, pone `email_broadcast_consent = false` y responde página/JSON
  de confirmación. Sin autenticación — el link va directo en el email.
- `emailService.sendBroadcastEmail` debe incluir en el HTML (footer, junto
  al bloque de contacto que ya existe con WhatsApp/dirección) un link
  `{FRONTEND_BASE o API_BASE}/api/emails/unsubscribe/{token}` propio de
  cada destinatario.
- El unsubscribe debe aplicarse antes del próximo envío — no encolar a
  alguien que ya se dio de baja aunque el broadcast se haya armado antes
  (verificar consent en el momento de `sendMail`, no solo al construir la
  lista, si hay delay entre encolar y enviar).

## Por qué

Enviar correos masivos sin opt-in explícito y sin forma de baja expone a
que el proveedor de email (Gmail, en este caso, ver `emailService.js`)
marque la cuenta como spam y a reclamos de usuarios. Es requisito mínimo de
buenas prácticas de email marketing, más allá de si aplica o no una ley
específica en Cuba.
