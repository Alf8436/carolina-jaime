// Site content: the shape every page reads, the GROQ query that fills it from
// Sanity, and the fallback copy (the Figma text with local photos) used while Sanity
// is not configured or unreachable.

// hotspot: the focus point marked in Sanity (0–1), kept in view when the frame crops the photo
export interface Pic { src: string; width: number; height: number; alt?: string; hotspot?: { x: number; y: number } }
export interface Link { label: string; href: string }

export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  body: string;          // paragraphs separated by blank lines
  image: Pic;
  icon: Pic;             // small round photo in the accordion header
}

export interface Site {
  phone: string;         // as shown: "992 746 693"
  whatsapp: string;      // wa.me number: 51992746693
  email: string;
  doctoralia: string;
  doctoraliaLabel: string;
  instagram: string;
  instagramHandle: string;
  facebook: string;
  bookingLabel: string;
  whatsappLabel: string; // text of the WhatsApp buttons
  seoTitle: string;
  seoDescription: string;
  shareImage?: Pic;
  // Blocks repeated across pages
  consulta: { title: string; image: Pic };
  instagramFeed: { title: string; posts: { image: Pic; url: string }[] };
}

export interface Home {
  hero: { title: string; text: string; cta: Link; image: Pic; servicesTitle: string; bookTitle: string };
  about: { eyebrow: string; quote: string; name: string; role: string; image: Pic; cta: string };
  ways: { eyebrow: string; title: string; text: string; items: { title: string; text: string; image: Pic }[] };
  steps: { title: string; items: string[] };
  testimonials: { eyebrow: string; title: string };
  blog: { eyebrow: string; title: string; text: string; cta: string };
  contact: { eyebrow: string; title: string; text: string };
}

// Figma "Tarjeta testimonio"; color 'auto' (or empty) follows the design's sequence
export type TestimonialColor = 'auto' | 'white' | 'purple' | 'rose' | 'gold';
export interface Testimonial { quote: string; name: string; relation?: string; photo?: Pic; color?: TestimonialColor }

export interface Category { title: string; slug: string }

export interface PostSummary {
  title: string;
  slug: string;
  date: string;          // ISO
  excerpt: string;
  image: Pic;
  categories: Category[];
}

// eyebrow: the label with a leaf above the title; title: `*…*` goes on its own line in purple
export interface PageHero { eyebrow: string; title: string; text?: string; image: Pic }

export interface About {
  hero: PageHero;
  training: { title: string; image: Pic; body: string; note: string };   // body: paragraphs, _bold_
  experience: { title: string; intro: string; items: string[]; outro: string };
}

export interface Workshop { title: string; text: string; image: Pic; message: string }

export interface Pages {
  services: PageHero & { lead: string; hint: string; hintTouch: string };
  workshops: PageHero;
  blog: PageHero;
  contact: PageHero & { formTitle: string };
}

export interface Content {
  site: Site;
  home: Home;
  about: About;
  pages: Pages;
  services: Service[];
  workshops: Workshop[];
  posts: PostSummary[];
  testimonials: Testimonial[];
}

const local = (src: string, width: number, height: number, alt = ''): Pic => ({ src, width, height, alt });

// ---------- Sanity ----------
// Images come back as { src, width, height, alt } so components don't care where
// a picture lives.
const PIC = `{ "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, alt, "hotspot": hotspot{x, y} }`;

export const POST_SUMMARY = `{
  title, "slug": slug.current, date, excerpt, "image": image${PIC},
  "categories": categories[]->{title, "slug": slug.current}
}`;

export const CONTENT_QUERY = /* groq */ `{
  "site": *[_id == "settings"][0]{
    phone, whatsapp, email, doctoralia, doctoraliaLabel, instagram, instagramHandle, facebook,
    bookingLabel, whatsappLabel, seoTitle, seoDescription, "shareImage": shareImage${PIC},
    "consulta": consulta{title, "image": image${PIC}},
    "instagramFeed": instagramFeed{title, "posts": posts[]{url, "image": image${PIC}}}
  },
  "home": *[_id == "home"][0]{
    "hero": hero{title, text, cta, servicesTitle, bookTitle, "image": image${PIC}},
    "about": about{eyebrow, quote, name, role, cta, "image": image${PIC}},
    "ways": ways{eyebrow, title, text, "items": items[]{title, text, "image": image${PIC}}},
    steps, testimonials, blog, contact
  },
  "about": *[_id == "about"][0]{
    "hero": hero{eyebrow, title, text, "image": image${PIC}},
    "training": training{title, body, note, "image": image${PIC}},
    experience
  },
  "pages": *[_id == "pages"][0]{
    "services": services{eyebrow, title, text, lead, hint, hintTouch, "image": image${PIC}},
    "workshops": workshops{eyebrow, title, text, "image": image${PIC}},
    "blog": blog{eyebrow, title, text, "image": image${PIC}},
    "contact": contact{eyebrow, title, text, formTitle, "image": image${PIC}}
  },
  "workshops": *[_type == "workshop"] | order(order asc){ title, text, message, "image": image${PIC} },
  "services": *[_type == "service"] | order(order asc){
    "slug": slug.current, title, shortTitle, body, "image": image${PIC}, "icon": icon${PIC}
  },
  "posts": *[_type == "post" && defined(slug.current)] | order(date desc)[0...12]${POST_SUMMARY},
  "testimonials": *[_type == "testimonial" && defined(quote) && defined(name)] | order(order asc){
    quote, name, relation, color, "photo": photo${PIC}
  }
}`;

// ---------- Fallback ----------
export const FALLBACK: Content = {
  site: {
    phone: '992 746 693',
    whatsapp: '51992746693',
    email: 'psicologa@carolinajaime.com',
    doctoralia: 'https://www.doctoralia.pe/carolina-jaime/psicologo/surco',
    doctoraliaLabel: 'doctoralia.pe/carolina-jaime',
    instagram: 'https://www.instagram.com/psico.carojaime/',
    instagramHandle: '@psico.carojaime',
    facebook: 'https://www.facebook.com/psico.caro.jaime',
    bookingLabel: 'Agendar cita',
    whatsappLabel: 'WhatsApp',
    seoTitle: 'Carolina Jaime · Psicóloga y Psicoterapeuta',
    seoDescription: 'Psicoterapia infanto-juvenil, de adultos y programas familiares. Cultivando conciencia y educación emocional en familias. Presencial en Surco, Lima, y virtual.',
    consulta: { title: '¿Tienes una consulta?', image: local('/img/consulta.jpg', 339, 378, 'Carolina Jaime en su consultorio') },
    instagramFeed: {
      title: '¿Me sigues en *instagram?*',
      posts: [
        { image: local('/img/ig-1.jpg', 720, 900, 'La salud mental no significa sentirse bien todo el tiempo'), url: 'https://www.instagram.com/psico.carojaime/' },
        { image: local('/img/ig-2.jpg', 720, 900, '¿Ansiedad o nervios? Mitos y realidades'), url: 'https://www.instagram.com/psico.carojaime/' },
        { image: local('/img/ig-3.jpg', 506, 900, 'Vale la pena quedarte ahí un poco más'), url: 'https://www.instagram.com/psico.carojaime/' },
        { image: local('/img/ig-4.jpg', 720, 900, 'No siempre hay que resolverlo todo ya'), url: 'https://www.instagram.com/psico.carojaime/' },
        { image: local('/img/ig-5.jpg', 507, 900, 'Calma: a veces no necesitamos una técnica'), url: 'https://www.instagram.com/psico.carojaime/' }
      ]
    }
  },
  home: {
    hero: {
      title: 'Cultivando _conciencia_ y *educación emocional* en familias',
      text: 'Si quieres acercarte a una vida de crianza consciente, este espacio es para ti',
      cta: { label: 'Experiencias únicas', href: '/servicios' },
      image: local('/img/hero-carolina.jpg', 733, 1100, 'Carolina Jaime sonriendo'),
      servicesTitle: '¿En qué puedo *acompañarte?*',
      bookTitle: 'Da el primer paso'
    },
    about: {
      eyebrow: 'Sobre mí',
      quote: '"Cada niño nos enseña a conectar con nuestra propia sensibilidad, contágiate de ellos"',
      name: 'M.Sc. Carolina Jaime García',
      role: 'Psicóloga y Psicoterapeuta Infanto Juvenil',
      image: local('/img/sobre-mi-circular.jpg', 675, 900, 'Carolina Jaime'),
      cta: 'Leer más'
    },
    ways: {
      eyebrow: 'Servicios',
      title: '¿Cómo podemos *trabajar juntos?*',
      text: 'Elige la modalidad que mejor se adapte a ti.',
      items: [
        { title: 'Orientación psicológica', text: 'Si tienes dudas sobre un problema puntual o sobre qué servicio tomar para ti o algún familiar, recibirás asesoramiento sobre ello.', image: local('/img/servicio-orientacion.jpg', 220, 220) },
        { title: 'Psicoterapia Presencial', text: 'Si te encuentras en Lima - Perú, podemos programar una cita, me puedes encontrar en Jirón Oscar Chocano en Santiago de Surco.', image: local('/img/servicio-presencial.jpg', 220, 220) },
        { title: 'Psicoterapia Virtual', text: 'Si te encuentras en cualquier parte del mundo, utilizaremos plataformas especializadas para acompañarte en tu proceso terapéutico.', image: local('/img/servicio-virtual.jpg', 220, 220) }
      ]
    },
    steps: {
      title: '6 pasos para lograr *nuestros objetivos*',
      items: [
        'Despertar el autoconocimiento para lograr una _aceptación real_ de nosotros mismos',
        'Identificar y _validar_ nuestras _emociones_ para lograr una mejor gestión emocional',
        'Potenciar la _empatía y comprensión_ hacia uno mismo y los demás',
        'Desarrollar y potenciar nuestras _fortalezas_ y _relaciones sociales_',
        'Construir y expandir nuestra mejor versión a los diferentes _contextos_ donde nos encontramos',
        'Disfruta a plenitud la _vida_ que tanto deseas tener'
      ]
    },
    testimonials: { eyebrow: 'Testimonios', title: 'Lo que dicen *las familias*' },
    blog: { eyebrow: 'Blog', title: 'Mis artículos *y tips*', text: 'Contenidos para cultivar semillas de disciplina consciente y educación emocional en familias.', cta: 'Ver todos los artículos' },
    contact: { eyebrow: 'Contacto', title: '*Conversemos*', text: 'Escríbeme por el formulario o por WhatsApp. Te responderé a la brevedad para coordinar tu primera cita.' }
  },
  about: {
    hero: {
      eyebrow: 'Sobre mí',
      title: 'Hola, soy *Carolina Jaime*',
      text: '_M.Sc._ Psicóloga y Psicoterapeuta Infanto Juvenil',
      image: local('/img/sobre-mi-hero.jpg', 675, 900, 'Carolina Jaime con el libro Disciplina sin lágrimas')
    },
    training: {
      title: 'Psicóloga y *Psicoterapeuta*',
      image: local('/img/sobre-mi-arco.jpg', 540, 522, 'Carolina Jaime sentada en su consultorio'),
      body: 'Soy _Psicóloga Colegiada y Licenciada_ de la _Universidad de Lima_, con un _Máster en Terapias Psicológicas de Tercera Generación_ de la Universidad Internacional de Valencia (VIU) de España.\n\nSoy _Psicoterapeuta infantil_ Certified _Positive Discipline Parent Educator_ en Positive Discipline Association (USA) y _Psicoterapeuta Conductual Cognitiva_ del Instituto Peruano de Terapia Conductual Cognitiva (IPETEC).\n\nCuento con formación en _Terapia Cognitivo Conductual para niños, adolescentes y padres_; así como en el _manejo de problemas emocionales_ del alumno dentro y fuera del aula del Instituto Familiar de Terapia Cognitiva (INFATEC), y con una _diplomatura en Atención a las Diferentes Necesidades del Aprendizaje_ del Instituto del Desarrollo Infantil (ARIE).\n\nAdemás, soy _Psicoterapeuta Contextual en Terapia Dialéctica Conductual (DBT)_ en Contexto, Centro Especializado en Terapias Cognitivo Conductuales de Tercera Generación y Fundación Foro Argentina, DBT Latinoamérica y Behavioral Tech.',
      note: 'En el año 2020 desarrollé un blog profesional, creando una comunidad y espacio para Cultivar Semillas de Disciplina Consciente y Educación Emocional en familias con el objetivo de psicoeducar y promover mayor conciencia de la importancia de las emociones y gestión emocional en nuestras vidas.'
    },
    experience: {
      title: 'Mi experiencia *laboral*',
      intro: 'Mi experiencia laboral se ubica en el ámbito de la psicología clínica atendiendo a población infanto-juvenil, adultos jóvenes y familias en consultorio privado tanto en modalidad presencial como virtual. Dentro de estos brindo:',
      items: [
        'Psicoterapia individual',
        'Asesorías emocionales y de crianza a padres y/o cuidadores',
        'Programas multifamiliares de intervención integral-familiar',
        'Programas familiares con enfoque de psicología y disciplina positiva',
        'Talleres socioemocionales y grupales para niños y adolescentes',
        'Evaluaciones psicológicas'
      ],
      outro: 'Así como, capacitaciones y talleres grupales a centros educativos y empresas donde se realizan conversatorios que promueven temas relacionados a la salud mental dentro del campo laboral y empresarial.'
    }
  },
  pages: {
    services: {
      eyebrow: 'Servicios', title: '¿Cómo podemos *trabajar juntos?*', text: 'Elige la modalidad que mejor se adapte a ti.',
      lead: 'Si no sabes por dónde empezar, *la orientación psicológica* es un buen primer paso.',
      hint: 'Haz clic en un servicio para ver el detalle', hintTouch: 'Toca un servicio para ver el detalle',
      image: local('/img/servicios-hero.jpg', 540, 522, 'Manos escribiendo en un cuaderno junto a una taza de café')
    },
    workshops: {
      eyebrow: 'Talleres', title: 'Aprender juntos *a educar con conciencia*',
      text: 'Talleres grupales para madres, padres, docentes y colegios, con herramientas prácticas de Disciplina Positiva y educación emocional.',
      image: local('/img/taller-padres.jpg', 630, 450, 'Charla para padres de familia en un colegio')
    },
    blog: {
      eyebrow: 'Blog', title: 'Mis artículos *y tips*',
      text: 'Contenidos para cultivar semillas de disciplina consciente y educación emocional en familias.',
      image: local('/img/blog-placeholder.jpg', 683, 450, '')
    },
    contact: {
      eyebrow: 'Contacto', title: '*Conversemos*',
      text: 'Escríbeme por el formulario o por WhatsApp. Te responderé a la brevedad para coordinar tu primera cita.',
      formTitle: '¿Tienes una consulta?', image: local('/img/servicio-adultos.jpg', 540, 522, 'Carolina Jaime en una sesión')
    }
  },
  workshops: [
    { title: 'Charlas dirigidas a padres de familia de inicial, primaria y secundaria', text: 'Escríbeme para conocer sobre las charlas y talleres de Escuela de Padres que realizo en instituciones educativas; así como talleres para alumnos.', image: local('/img/taller-padres.jpg', 630, 450, 'Charla para padres de familia en un colegio'), message: 'Hola Carolina, quiero información sobre las charlas para padres de familia.' },
    { title: 'Charlas dirigidas a empresas dentro y fuera de Lima', text: 'Escríbeme para conocer más de las charlas y talleres que tenemos para tu espacio de trabajo.', image: local('/img/taller-empresas.jpg', 630, 450, 'Grupo de participantes de una charla en empresa'), message: 'Hola Carolina, quiero información sobre las charlas para empresas.' },
    { title: 'Talleres vivenciales', text: 'Si estás interesado en recibir un taller vivencial grupal, familiar, en tu trabajo u otros, escríbeme para enviarte la información de los servicios.', image: local('/img/taller-vivenciales.jpg', 600, 450, 'Taller vivencial grupal'), message: 'Hola Carolina, quiero información sobre los talleres vivenciales.' },
    { title: 'Talleres psicoeducativos a familias dentro y fuera de instituciones educativas', text: 'Contamos con diferentes charlas y talleres que cubren las necesidades actuales de nuestros niños y familia. Escríbeme para recibir más información.', image: local('/img/taller-familias.jpg', 630, 450, 'Taller psicoeducativo para familias en un auditorio'), message: 'Hola Carolina, quiero información sobre los talleres psicoeducativos para familias.' }
  ],
  services: [
    {
      slug: 'orientacion-psicologica', title: 'Orientación Psicológica', shortTitle: 'Orientación psicológica',
      body: 'La sesión de Orientación Psicológica busca asesorar u orientar al consultante en cuál es el servicio de psicología más adecuado para él/ella.\n\nDe la misma manera, busca resolver las dudas que tienen sobre un problema puntual o sobre cuál servicio tomar para algún miembro de su familia.\n\nEn esta sesión recibirás asesoramiento para que puedas tomar la mejor decisión y así logres cumplir tus metas personales.',
      image: local('/img/servicio-orientacion-detalle.jpg', 540, 522), icon: local('/img/servicio-orientacion-detalle.jpg', 540, 522)
    },
    {
      slug: 'psicoterapia-infanto-juvenil', title: 'Psicoterapia infanto-juvenil', shortTitle: 'Psicoterapia infanto juvenil',
      body: 'Esto se da cuando notamos que nuestros hijos e hijas están teniendo dificultades para comprender lo que están sintiendo y experimentando en su interior, esto puede verse reflejado con conductas ambivalentes, irritabilidad, tristeza, aislamiento, ansiedad, entre otros, que generan obstáculos en sus relaciones familiares y sociales. Es importante saber que existen variables del contexto que influyen en el estado emocional de nuestros niños, si crees que esto le está pasando a tu pequeño (a) te recomiendo reservar una sesión de orientación para que puedas detallar lo que está sucediendo actualmente.\n\n*Nota importante:* el servicio de psicoterapia infanto-juvenil incluye asesorías emocionales a los padres de familia y/o cuidadores. Nuestro trabajo es en conjunto, se brindan estrategias basadas en la crianza respetuosa, empatía y educación emocional.',
      image: local('/img/servicio-infanto-juvenil.jpg', 540, 522), icon: local('/img/servicio-infanto-juvenil.jpg', 540, 522)
    },
    {
      slug: 'psicoterapia-adultos', title: 'Psicoterapia en adultos', shortTitle: 'Psicoterapia de adultos',
      body: 'El proceso de psicoterapia es un espacio individual, de confidencialidad, donde no hay juicios, el cual se centra en los valores del respeto, empatía y escucha activa, con el objetivo que el consultante exponga el motivo por el cual busca apoyo psicológico de manera libre y honesta.\n\nMuchas personas consideran que ir al psicólogo implica sólo tener una dificultad crónica, enfermedad o trastorno, sin embargo, es más que eso, uno puede acudir en el momento que siente que lo necesita, excluyendo las etiquetas diagnósticas. Es un espacio personalizado donde se va gestando una colaboración activa entre el terapeuta y el consultante con el objetivo de apoyarlo a cumplir sus metas y pueda experimentar bienestar general.',
      image: local('/img/servicio-adultos.jpg', 540, 522), icon: local('/img/servicio-adultos.jpg', 540, 522)
    },
    {
      slug: 'talleres-grupales', title: 'Talleres Grupales', shortTitle: 'Talleres grupales',
      body: 'Los talleres se realizan con un mínimo de 4 participantes en un aproximado de 8 a 12 sesiones. Dentro de estos se desarrollan y potencian habilidades socio emocionales, para que luego puedan ponerlo en práctica en los diferentes entornos donde se desarrollan (casa-escuela-social).\n\nSi deseas mayor información sobre los talleres que se encuentran activos en este periodo, te invito a escribirme para hacerte llegar la información completa.',
      image: local('/img/servicio-talleres.jpg', 540, 522), icon: local('/img/servicio-talleres.jpg', 540, 522)
    },
    {
      slug: 'programas-familiares', title: 'Programas familiares', shortTitle: 'Programas familiares',
      body: 'Este programa busca promover la comunicación, empatía, fortalecer vínculos y reforzar las relaciones positivas entre los miembros de la familia nuclear, es decir, de las personas con las que vivimos para mejorar la convivencia en el hogar.\n\nEl programa consta de 12 sesiones y se centra en las fortalezas de carácter, junto a actividades vivenciales, recreativas y vinculares.',
      image: local('/img/servicio-programas.jpg', 540, 522), icon: local('/img/servicio-programas.jpg', 540, 522)
    },
    {
      slug: 'charlas-y-talleres', title: 'Charlas y talleres al público en general', shortTitle: 'Charlas y talleres al público',
      body: 'Desarrollo programas socioemocionales, talleres y charlas sobre temas relacionados a promover bienestar a nivel individual, familiar y empresarial. Dentro de los temas existen programas basados en crianza respetuosa y disciplina positiva, cómo fomentar habilidades emocionales en nuestros hijos, pautas para prevenir el uso excesivo de la tecnología, estrategias para mejorar la comunicación en pareja y/o familia, etc.\n\nEstos están dirigidos para padres de familia, empresas, centros educativos y profesionales relacionados a la salud y educación.',
      image: local('/img/servicio-charlas.jpg', 540, 522), icon: local('/img/servicio-charlas.jpg', 540, 522)
    }
  ],
  posts: [
    {
      title: 'Tema 1',
      slug: 'tema-1',
      date: '2023-02-10',
      excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dictum facilisis metus massa nisl ac est. Amet, eget lobortis fames sit adipiscing elementum, nunc neque. Mauris,',
      image: local('/img/blog-placeholder.jpg', 683, 450, ''),
      categories: [{ title: 'Psicoterapia', slug: 'psicoterapia' }, { title: 'Parejas', slug: 'parejas' }]
    }
  ],
  // Real testimonials only: none until they're published in Sanity
  testimonials: []
};

// Fills anything Sanity leaves empty with the fallback, field by field, so a
// half-filled document never breaks a section.
export function withFallback<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined || value === '') return fallback;
  if (Array.isArray(fallback)) return (Array.isArray(value) && value.length ? value : fallback) as T;
  if (typeof fallback === 'object' && fallback && typeof value === 'object') {
    const out: Record<string, unknown> = { ...(value as object) };
    for (const [k, v] of Object.entries(fallback)) out[k] = withFallback((value as Record<string, unknown>)[k], v);
    return out as T;
  }
  return value as T;
}
