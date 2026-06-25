// Domain constants for American Cordillera.
// SQLite has no enums; these are the documented allowed values used app-wide.

export const ROLES = {
  VISITOR: "VISITOR",
  MEMBER: "MEMBER",
  MENTOR: "MENTOR",
  SPONSOR: "SPONSOR",
  ADMIN: "ADMIN",
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

// A member is anyone with an account that can use gated community spaces.
export const MEMBER_ROLES: Role[] = [
  ROLES.MEMBER,
  ROLES.MENTOR,
  ROLES.SPONSOR,
  ROLES.ADMIN,
];

// The 7 intelligences — one per week of a Genesix chapter.
export const INTELLIGENCES = [
  { week: 1, key: "mental", en: "Mental", es: "Mental" },
  { week: 2, key: "emotional", en: "Emotional", es: "Emocional" },
  { week: 3, key: "physical", en: "Physical", es: "Física" },
  { week: 4, key: "spiritual", en: "Spiritual", es: "Espiritual" },
  { week: 5, key: "social", en: "Social", es: "Social" },
  { week: 6, key: "financial", en: "Financial", es: "Financiera" },
  { week: 7, key: "tech", en: "Technological", es: "Tecnológica" },
] as const;

// Community spaces (left sidebar). `gated` = members only.
export const COMMUNITY_SPACES = [
  { key: "feed", href: "/community", icon: "home", gated: false },
  { key: "posts", href: "/community/posts", icon: "posts", gated: false },
  { key: "events", href: "/community/events", icon: "events", gated: false },
  { key: "podcast", href: "/community/podcast", icon: "podcast", gated: false },
  { key: "chat", href: "/community/chat", icon: "chat", gated: true },
  { key: "members", href: "/community/members", icon: "members", gated: false },
  { key: "observatory", href: "/community/observatory", icon: "observatory", gated: false },
  { key: "chapters", href: "/community/chapters", icon: "chapters", gated: false },
] as const;

export const POST_CATEGORIES = ["COMMUNITY", "VOICE", "ANNOUNCEMENT"] as const;

export const EVENT_CATEGORIES = ["WEEKLY", "CHAPTER", "WORKSHOP", "SUMMIT"] as const;
export const EVENT_STATUSES = ["UPCOMING", "LIVE", "PAST"] as const;

// Donation tiers (public path). Amounts are placeholders until per-chapter
// costing is defined — never hardcode real numbers.
export const DONATION_TIERS = [
  {
    key: "ONETIME",
    frequency: "ONETIME",
    en: { name: "One-time gift", desc: "Any amount helps. You support the whole movement." },
    es: { name: "Donación única", desc: "Cualquier monto suma. Apoyás el movimiento completo." },
  },
  {
    key: "MONTHLY_MENTOR",
    frequency: "MONTHLY",
    en: { name: "Monthly mentor", desc: "A recurring gift that sustains the training month after month." },
    es: { name: "Mentor mensual", desc: "Un aporte recurrente que sostiene la formación mes a mes." },
  },
  {
    key: "CHAPTER_SPONSOR",
    frequency: "ONETIME",
    en: { name: "Chapter sponsor", desc: "Fund a full chapter of ~30 youth for 7 weeks." },
    es: { name: "Padrino de capítulo", desc: "Financiás un capítulo completo de ~30 jóvenes por 7 semanas." },
  },
  {
    key: "OBSERVATORY",
    frequency: "ONETIME",
    en: { name: "Observatory patron", desc: "Sustain the professional team that studies today's youth." },
    es: { name: "Patrocinador del Observatorio", desc: "Sostenés al equipo profesional que investiga a la juventud." },
  },
  {
    key: "FOUNDING_ALLY",
    frequency: "ONETIME",
    en: { name: "Founding ally", desc: "For companies and major donors building this from the start." },
    es: { name: "Aliado fundador", desc: "Para empresas y donantes mayores que construyen esto desde el inicio." },
  },
] as const;

export const FLAGS = {
  taxReceipt501c3: process.env.ENABLE_TAX_RECEIPT_501C3 === "true",
  payments: process.env.ENABLE_PAYMENTS === "true",
};

export const BRAND = {
  name: "American Cordillera",
  est: "2026",
  base: "Utah, EE.UU.",
  tagline_es: "De las Rocosas a los Andes, una nueva generación se eleva.",
  tagline_en: "From the Rockies to the Andes, a new generation rises.",
};
