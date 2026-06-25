import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const now = new Date();
const DAY = 86_400_000;
function at(daysFromNow: number, hour = 18, min = 0): Date {
  const d = new Date(now.getTime() + daysFromNow * DAY);
  d.setHours(hour, min, 0, 0);
  return d;
}
const pw = (s: string) => bcrypt.hashSync(s, 10);

// Admin credentials are configurable for production via env vars.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@cordillera.org";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "cordillera123";

async function main() {
  console.log("Resetting database…");
  // delete in dependency order
  await prisma.chapterUpdate.deleteMany();
  await prisma.sponsorship.deleteMany();
  await prisma.message.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.rsvp.deleteMany();
  await prisma.event.deleteMany();
  await prisma.podcastEpisode.deleteMany();
  await prisma.observatoryPost.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.country.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.newsletterSignup.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding users…");
  const admin = await prisma.user.create({
    data: {
      name: "Equipo Cordillera",
      email: ADMIN_EMAIL,
      passwordHash: pw(ADMIN_PASSWORD),
      role: "ADMIN",
      city: "Lehi",
      country: "EE.UU.",
      bio: "Equipo fundador de American Cordillera.",
    },
  });

  const maria = await prisma.user.create({
    data: {
      name: "María Fernanda Ríos",
      email: "maria@example.com",
      passwordHash: pw("password123"),
      role: "MEMBER",
      city: "Trujillo",
      country: "Perú",
      locale: "es",
      bio: "Joven del Capítulo Trujillo. Construyo plantillas digitales.",
    },
  });
  const diego = await prisma.user.create({
    data: {
      name: "Diego Quispe",
      email: "diego@example.com",
      passwordHash: pw("password123"),
      role: "MEMBER",
      city: "Trujillo",
      country: "Perú",
      locale: "es",
      bio: "Aprendiendo a vender en el mercado de EE.UU.",
    },
  });
  const ana = await prisma.user.create({
    data: {
      name: "Ana Lucía Mendoza",
      email: "ana@example.com",
      passwordHash: pw("password123"),
      role: "MENTOR",
      city: "Lima",
      country: "Perú",
      locale: "es",
      bio: "Mentora del programa Genesix. Emprendedora digital.",
    },
  });
  const carlos = await prisma.user.create({
    data: {
      name: "Carlos Huamán",
      email: "carlos@example.com",
      passwordHash: pw("password123"),
      role: "MEMBER",
      city: "Trujillo",
      country: "Perú",
      locale: "es",
    },
  });
  const sponsor = await prisma.user.create({
    data: {
      name: "Robert Thompson",
      email: "sponsor@example.com",
      passwordHash: pw("password123"),
      role: "SPONSOR",
      city: "Salt Lake City",
      country: "EE.UU.",
      locale: "en",
      bio: "Sponsor of Chapter Trujillo.",
    },
  });

  console.log("Seeding countries & chapters…");
  const peru = await prisma.country.create({
    data: { name: "Perú", code: "PE", flag: "🇵🇪" },
  });
  const countries = await Promise.all(
    [
      ["México", "MX", "🇲🇽"],
      ["Bolivia", "BO", "🇧🇴"],
      ["Colombia", "CO", "🇨🇴"],
      ["Guatemala", "GT", "🇬🇹"],
      ["Honduras", "HN", "🇭🇳"],
      ["Ecuador", "EC", "🇪🇨"],
    ].map(([name, code, flag]) =>
      prisma.country.create({ data: { name, code, flag } }),
    ),
  );

  const trujillo = await prisma.chapter.create({
    data: {
      countryId: peru.id,
      city: "Trujillo",
      name: "Capítulo Trujillo",
      slug: "trujillo",
      stake: "Estaca Laureles",
      cohortSize: 30,
      currentWeek: 3,
      status: "ACTIVE",
      mentorName: "Ana Lucía Mendoza",
      startsAt: at(-14),
      story:
        "30 jóvenes de la Estaca Laureles recorriendo las 7 inteligencias. Las primeras ventas ya están llegando.",
    },
  });

  // a couple of recruiting chapters elsewhere so the sponsor browser isn't empty
  await prisma.chapter.create({
    data: {
      countryId: peru.id,
      city: "Arequipa",
      name: "Capítulo Arequipa",
      slug: "arequipa",
      stake: "Estaca Cayma",
      cohortSize: 30,
      currentWeek: 0,
      status: "RECRUITING",
    },
  });
  await prisma.chapter.create({
    data: {
      countryId: countries[0].id, // México
      city: "Monterrey",
      name: "Capítulo Monterrey",
      slug: "monterrey",
      cohortSize: 30,
      currentWeek: 0,
      status: "RECRUITING",
    },
  });

  console.log("Seeding sponsorship + chapter updates…");
  await prisma.sponsorship.create({
    data: {
      chapterId: trujillo.id,
      sponsorId: sponsor.id,
      sponsorName: sponsor.name,
      sponsorEmail: sponsor.email,
      status: "ACTIVE",
      message: "Proud to back these young builders.",
    },
  });

  await prisma.chapterUpdate.createMany({
    data: [
      {
        chapterId: trujillo.id,
        week: 1,
        title: "Semana 1 — Inteligencia Mental",
        body: "Arrancamos. Los 30 jóvenes definieron quiénes son y de qué son capaces. Energía altísima en la primera reunión.",
        photos: "[]",
        createdAt: at(-12),
      },
      {
        chapterId: trujillo.id,
        week: 2,
        title: "Semana 2 — Inteligencia Emocional",
        body: "Trabajamos el manejo de la ansiedad y la comparación. Varios compartieron sus historias por primera vez.",
        photos: "[]",
        createdAt: at(-5),
      },
      {
        chapterId: trujillo.id,
        week: 3,
        title: "Semana 3 — primeras ideas de producto",
        body: "Esta semana cada joven bocetó su primer producto digital. María ya tiene un prototipo de plantillas listo para probar.",
        photos: "[]",
        createdAt: at(-1),
      },
    ],
  });

  console.log("Seeding events…");
  await prisma.event.create({
    data: {
      title: "Reunión semanal de la Comunidad",
      slug: "reunion-semanal-comunidad",
      description:
        "El encuentro abierto y gratuito donde vive el movimiento. Charlamos del modelo Aprende·Construye·Vende y conectamos entre jóvenes.",
      startsAt: at(0, 19),
      endsAt: at(0, 20, 30),
      isOnline: true,
      location: "Zoom · En línea",
      host: "American Cordillera",
      category: "WEEKLY",
      price: "Free",
      status: "LIVE",
      featured: true,
    },
  });
  await prisma.event.createMany({
    data: [
      {
        title: "Taller: Vender en el mercado de Estados Unidos",
        slug: "taller-vender-eeuu",
        description:
          "Un taller práctico sobre cómo empaquetar y vender un producto digital al mercado más grande del mundo.",
        startsAt: at(5, 18),
        endsAt: at(5, 19, 30),
        isOnline: true,
        location: "Zoom · En línea",
        host: "Ana Lucía Mendoza",
        category: "WORKSHOP",
        price: "Free",
        status: "UPCOMING",
      },
      {
        title: "Demo Day — Capítulo Trujillo",
        slug: "demo-day-trujillo",
        description:
          "Los jóvenes del Capítulo Trujillo presentan los productos que construyeron y sus primeras ventas.",
        startsAt: at(10, 17),
        endsAt: at(10, 19),
        isOnline: false,
        location: "Trujillo, Perú · Estaca Laureles",
        host: "American Cordillera",
        category: "CHAPTER",
        price: "Free",
        status: "UPCOMING",
      },
      {
        title: "Reunión semanal de la Comunidad",
        slug: "reunion-semanal-comunidad-2",
        description: "Encuentro abierto y gratuito de la comunidad.",
        startsAt: at(7, 19),
        endsAt: at(7, 20, 30),
        isOnline: true,
        location: "Zoom · En línea",
        host: "American Cordillera",
        category: "WEEKLY",
        price: "Free",
        status: "UPCOMING",
      },
      {
        title: "Kickoff — Capítulo Trujillo",
        slug: "kickoff-trujillo",
        description:
          "El arranque oficial del primer capítulo piloto con 30 jóvenes de la Estaca Laureles.",
        startsAt: at(-14, 17),
        endsAt: at(-14, 19),
        isOnline: false,
        location: "Trujillo, Perú",
        host: "American Cordillera",
        category: "CHAPTER",
        price: "Free",
        status: "PAST",
      },
    ],
  });

  console.log("Seeding podcast…");
  await prisma.podcastEpisode.createMany({
    data: [
      {
        title: "Aprende, Construye, Vende: el modelo en tres palabras",
        slug: "modelo-tres-palabras",
        guest: "Equipo Cordillera",
        description:
          "Abrimos la temporada explicando el corazón de American Cordillera: cada joven aprende quién es, construye algo real y lo vende.",
        duration: "32 min",
        series: "Temporada 1",
        episode: 1,
        publishedAt: at(-20),
      },
      {
        title: "La primera venta lo cambia todo",
        slug: "primera-venta",
        guest: "Ana Lucía Mendoza",
        description:
          "Por qué esa primera venta no es solo dinero: es la prueba de que el joven es capaz.",
        duration: "28 min",
        series: "Temporada 1",
        episode: 2,
        publishedAt: at(-13),
      },
      {
        title: "7 inteligencias para esta generación",
        slug: "siete-inteligencias",
        guest: "Observatorio Cordillera",
        description:
          "Un recorrido por las 7 inteligencias: del ser y del mercado, una por semana.",
        duration: "41 min",
        series: "Temporada 1",
        episode: 3,
        publishedAt: at(-6),
      },
      {
        title: "Padrinos: por qué apadrinar un capítulo entero",
        slug: "apadrinar-capitulo",
        guest: "Robert Thompson",
        description:
          "Conversamos con un padrino sobre qué significa cambiar un lugar entero, no donar a una causa abstracta.",
        duration: "35 min",
        series: "Temporada 1",
        episode: 4,
        publishedAt: at(-2),
      },
    ],
  });

  console.log("Seeding posts…");
  const p1 = await prisma.post.create({
    data: {
      authorId: maria.id,
      title: "¡Cerré mi primera venta a un cliente en Texas! 🎉",
      body: "No lo puedo creer. Vendí mi primer pack de plantillas digitales a un cliente en EE.UU. Gracias a mi mentora y a todo el capítulo por el empujón. Esto recién empieza.",
      category: "VOICE",
      createdAt: at(-1, 10),
    },
  });
  await prisma.comment.createMany({
    data: [
      { postId: p1.id, authorId: ana.id, body: "¡Felicitaciones María! La primera de muchas. 👏", createdAt: at(-1, 11) },
      { postId: p1.id, authorId: diego.id, body: "Enorme. Vamos por la siguiente.", createdAt: at(-1, 12) },
    ],
  });
  await prisma.reaction.createMany({
    data: [
      { postId: p1.id, userId: ana.id, type: "CELEBRATE" },
      { postId: p1.id, userId: diego.id, type: "LIKE" },
      { postId: p1.id, userId: carlos.id, type: "CELEBRATE" },
    ],
  });

  const p2 = await prisma.post.create({
    data: {
      authorId: diego.id,
      title: "¿Qué herramientas de IA usan para crear sus productos?",
      body: "Estoy armando mi primer producto y quiero saber qué están usando ustedes. ¿Recomendaciones para empezar?",
      category: "COMMUNITY",
      createdAt: at(-2, 9),
    },
  });
  await prisma.comment.create({
    data: { postId: p2.id, authorId: ana.id, body: "Arranca simple: una idea, una herramienta. Lo vemos en el taller del viernes.", createdAt: at(-2, 10) },
  });

  await prisma.post.create({
    data: {
      authorId: ana.id,
      title: "Recordatorio: taller de ventas a EE.UU. este viernes",
      body: "Nos vemos el viernes para el taller práctico. Traigan su idea de producto, por más cruda que esté.",
      category: "ANNOUNCEMENT",
      createdAt: at(-3, 8),
    },
  });

  console.log("Seeding observatory…");
  await prisma.observatoryPost.createMany({
    data: [
      {
        title: "La oportunidad de la IA para los jóvenes de Latinoamérica",
        slug: "oportunidad-ia-latam",
        authors: "Dra. Patricia Salas, Ing. Marco Tévez",
        summary:
          "Hoy un adolescente tiene en su bolsillo más poder de creación que una empresa entera hace veinte años. Mapeamos dónde están las oportunidades reales.",
        body: "La inteligencia artificial derribó la barrera de entrada para crear y vender productos digitales. Este informe analiza las categorías donde un joven de LATAM puede competir desde el primer día y por qué la ventana es ahora.",
        category: "OPPORTUNITY",
        publishedAt: at(-9),
      },
      {
        title: "Ansiedad, redes y comparación: lo que de verdad enfrenta esta generación",
        slug: "ansiedad-redes-comparacion",
        authors: "Psic. Daniela Ortega",
        summary:
          "Las redes llenan de ansiedad y comparación. Estudiamos el impacto y qué herramientas emocionales marcan la diferencia.",
        body: "A partir de entrevistas con jóvenes de los capítulos, identificamos los principales factores de estrés y las prácticas que ayudan a sostener la inteligencia emocional durante el programa.",
        category: "EMOTIONAL",
        publishedAt: at(-4),
      },
      {
        title: "Educación financiera desde la primera venta",
        slug: "educacion-financiera-primera-venta",
        authors: "Econ. Luis Paredes",
        summary:
          "Cuando un joven genera su primer ingreso real, la educación financiera deja de ser teoría. Cómo aprovechar ese momento.",
        body: "Documentamos cómo la primera venta se convierte en el mejor momento para enseñar gestión de ingresos, reinversión y aporte al hogar.",
        category: "FINANCIAL",
        publishedAt: at(-1),
      },
    ],
  });

  console.log("Seeding chat channels & messages…");
  const general = await prisma.channel.create({
    data: { name: "General", slug: "general", description: "Conversación abierta de la comunidad.", isPrivate: true, position: 0 },
  });
  await prisma.channel.create({
    data: { name: "Capítulo Trujillo", slug: "trujillo", description: "Canal del piloto Trujillo.", isPrivate: true, position: 1 },
  });
  await prisma.channel.create({
    data: { name: "Mentores", slug: "mentores", description: "Espacio de mentores.", isPrivate: true, position: 2 },
  });
  await prisma.message.createMany({
    data: [
      { channelId: general.id, userId: ana.id, body: "¡Bienvenidos al chat de la comunidad! 🏔️", createdAt: at(-2, 9) },
      { channelId: general.id, userId: maria.id, body: "Holaaa, feliz de estar acá.", createdAt: at(-2, 9, 5) },
      { channelId: general.id, userId: diego.id, body: "¿Alguien para repasar la idea de producto?", createdAt: at(-1, 16) },
    ],
  });

  console.log("Done. Admin: admin@cordillera.org / cordillera123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
