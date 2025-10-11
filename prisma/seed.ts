import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
import { uuidv7 } from 'uuidv7';

const prisma = new PrismaClient();

const sections = [
  {
    slug: 'programacion',
    order: 1,
    name: { es: 'Programación', en: 'Coding' },
    description: {
      es: 'Asistentes de código para desarrolladores.',
      en: 'Code assistants for developers.',
    },
    agents: [
      'GitHub Copilot',
      'Amazon Q',
      'Gemini Code Assist',
      'ChatGPT',
      'Claude',
      'Codeium',
      'Cursor',
      'Tabnine',
      'Sourcegraph Cody',
      'Replit Ghostwriter',
    ],
  },
  {
    slug: 'textos',
    order: 2,
    name: { es: 'Textos', en: 'Writing' },
    description: {
      es: 'Modelos conversacionales y de redacción.',
      en: 'Conversational and writing models.',
    },
    agents: [
      'ChatGPT',
      'Gemini',
      'Claude',
      'Perplexity',
      'Grok',
      'Meta Llama',
      'Mistral',
      'Cohere',
      'Jasper',
      'Writer',
    ],
  },
  {
    slug: 'imagen',
    order: 3,
    name: { es: 'Imagen', en: 'Image' },
    description: {
      es: 'Generación visual con IA.',
      en: 'Visual generation with AI.',
    },
    agents: [
      'Nano Banana',
      'Seedream',
      'Midjourney',
      'DALL·E',
      'Adobe Firefly',
      'Stable Diffusion',
      'Ideogram',
      'Leonardo',
      'Canva Image Generator',
      'Bing Image Creator',
    ],
  },
  {
    slug: 'video',
    order: 4,
    name: { es: 'Vídeo', en: 'Video' },
    description: {
      es: 'Generación de vídeo con IA.',
      en: 'Video generation with AI.',
    },
    agents: [
      'Sora',
      'Veo',
      'Runway',
      'Pika',
      'Dream Machine',
      'Kling',
      'Hailuo',
      'Stable Video Diffusion',
      'Synthesia',
      'HeyGen',
    ],
  },
  {
    slug: 'musica',
    order: 5,
    name: { es: 'Música', en: 'Music' },
    description: {
      es: 'IA para crear sonido y música.',
      en: 'AI for sound and music creation.',
    },
    agents: [
      'Suno',
      'Udio',
      'AIVA',
      'Amper Music',
      'Mubert',
      'Beatoven',
      'Soundraw',
      'Loudly',
      'Soundful',
      'OpenAI Jukebox',
    ],
  },
];

async function seed() {
  for (const section of sections) {
    const sectionRecord = await prisma.section.upsert({
      where: { slug: section.slug },
      update: {},
      create: {
        id: uuidv7(),
        slug: section.slug,
        order: section.order,
        name_i18n: section.name,
        description_i18n: section.description,
      },
    });

    for (const [index, agentName] of section.agents.entries()) {
      await prisma.agent.upsert({
        where: { slug: `${section.slug}-${agentName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` },
        update: {
          isActive: true,
        },
        create: {
          id: uuidv7(),
          slug: `${section.slug}-${agentName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          sectionId: sectionRecord.id,
          order: index + 1,
          name_i18n: { es: agentName, en: agentName },
          description_i18n: {
            es: `Agente de ${section.name.es} llamado ${agentName}.`,
            en: `${agentName} assistant in ${section.name.en}.`,
          },
          homepageUrl: undefined,
        },
      });
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminUsername || !adminPassword) {
    throw new Error('Missing admin credentials environment variables.');
  }

  const passwordHash = await hash(adminPassword);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      username: adminUsername,
      passwordHash,
      role: 'ADMIN',
    },
    create: {
      id: uuidv7(),
      email: adminEmail,
      username: adminUsername,
      passwordHash,
      role: 'ADMIN',
    },
  });
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
