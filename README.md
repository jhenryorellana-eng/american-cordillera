# American Cordillera — Plataforma

Una sola plataforma con dos almas, construida con nuestra propia marca y contenido:

- **Comunidad** (estructura estilo Silicon Slopes): un hub con barra lateral y "espacios" — Feed, Publicaciones, Eventos (con RSVP), Podcast, Chat (solo miembros), Miembros, Observatorio y Capítulos.
- **Donación** (estructura estilo The Academy): página pública con niveles de donación, y el sistema **Apadrina un capítulo** en 3 pasos (país → capítulo → confirmar) con el panel privado del padrino.

Marca: **navy profundo + terracota + crema**, con un motivo de cordillera. Minimalista, bilingüe (inglés por defecto).

> **Pagos:** Stripe **no está conectado todavía** (aún no hay cuenta). Toda la lógica del sistema funciona; los flujos de donación y apadrinamiento **capturan la intención** y quedan listos para enchufar pagos. Ver _Conectar pagos_ abajo.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | **Next.js 16** (App Router) + **React 19** |
| Estilos | **Tailwind CSS v4** (CSS-first, tokens de marca en `globals.css`) |
| Base de datos | **Prisma 6 + SQLite** (archivo local, migrable a Postgres) |
| Auth | JWT propio en cookie httpOnly (`jose`) + `bcryptjs`, roles |
| Mutaciones | Route Handlers (`/api/**`) + **Server Actions** (admin) |
| i18n | Diccionario EN/ES, toggle con cookie (`en` por defecto) |
| Tiempo real | Chat por polling (cada 3s) |

## Cómo correrlo

Requisitos: Node.js ≥ 18.18 (probado en 22).

```bash
npm install
npx prisma migrate dev     # crea la base SQLite y aplica migraciones
npm run db:seed            # carga datos de demo (Trujillo, eventos, podcast, etc.)
npm run dev                # http://localhost:3000
```

Scripts útiles: `npm run typecheck`, `npm run db:reset` (resetea + re-siembra).

## Cuentas de demo (del seed)

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | `admin@cordillera.org` | `cordillera123` |
| Miembro (joven) | `maria@example.com` | `password123` |
| Mentor | `ana@example.com` | `password123` |
| Padrino | `sponsor@example.com` | `password123` |

- **Admin** → `/admin` (CRUD de eventos, podcast, capítulos, observatorio, publicaciones; lectura de donaciones/apadrinamientos).
- **Miembro** → desbloquea el **Chat**, RSVP a eventos, y publicar/comentar/reaccionar en el feed.
- **Padrino** → `/donate/dashboard` con el progreso de su capítulo.

## Mapa de la plataforma

```
/                         Landing — hero único con dos caminos (Comunidad / Donación)
/login  /signup           Auth

/community                Feed (resumen)
/community/posts          Muro: publicar, comentar, reaccionar
/community/events         Eventos por mes + destacado + RSVP
/community/podcast        Biblioteca de episodios
/community/chat           Chat en vivo (SOLO miembros — pantalla de candado si no)
/community/members        Directorio
/community/observatory    Investigación del equipo profesional
/community/chapters       Cohortes Genesix con progreso (semana X/7)

/donate                   Donación pública (estilo Academy): el porqué, 2 destinos, niveles, cierre
/donate/sponsor           Apadrina un capítulo — flujo de 3 pasos (piloto Perú · Trujillo)
/donate/dashboard         Panel del padrino (privado)

/admin/**                 Panel de administración (rol ADMIN)
```

## i18n

Inglés es el idioma por defecto (los donantes están en EE.UU.). Todas las cadenas de UI viven en
`src/lib/i18n/dictionaries.ts` (`en` / `es`); el toggle EN/ES guarda la preferencia en cookie y el
servidor re-renderiza. Para agregar un idioma: sumar un objeto al diccionario.

## Conectar pagos (más adelante)

El sistema ya registra la **intención**:
- `POST /api/donations` crea un `Donation` con `status = "INTENT"`.
- `POST /api/sponsorships` crea la relación `Sponsorship → Chapter`.

Cuando exista la cuenta de Stripe:
1. Agregar `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` al `.env` y poner `ENABLE_PAYMENTS="true"`.
2. En esos endpoints, crear una **Stripe Checkout Session** (pago único) o **suscripción** (`frequency = "MONTHLY"`) y redirigir.
3. Agregar `POST /api/webhooks/stripe` para marcar `status = "COMPLETED"`.
4. La nota legal y el recibo fiscal se activan con `ENABLE_TAX_RECEIPT_501C3="true"` (tras el 501(c)(3)).

Los montos son **placeholders** (no hay números quemados en el código), según el PRD.

## Estructura

```
prisma/            schema.prisma · migrations · seed.ts
src/app/           landing, (auth), community/**, donate/**, admin/**, api/**
src/components/    ui.tsx, Mountain, SiteHeader/Footer, community/**, donate/**, admin/**
src/lib/           prisma, auth, constants, format, i18n/**
src/proxy.ts       gating de rutas (admin, dashboard del padrino)
```
