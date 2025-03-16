const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting sponsor seeding process...');
  
  // Update these URLs with your actual Cloudinary URLs after upload
  const sponsors = [
    {
      name: 'Laravel',
      description: 'Backend framework provider',
      logoUrl: 'https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/laravel-logo.svg',
      website: 'https://laravel.com'
    },
    {
      name: 'React',
      description: 'Frontend library partner',
      logoUrl: 'https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/react-logo.png',
      website: 'https://reactjs.org'
    },
    {
      name: 'Node.js',
      description: 'Server runtime environment',
      logoUrl: 'https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/nodejs-logo.png',
      website: 'https://nodejs.org'
    },
    {
      name: 'AWS',
      description: 'Cloud infrastructure partner',
      logoUrl: 'https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/aws-logo.png',
      website: 'https://aws.amazon.com'
    },
    {
      name: 'DigitalOcean',
      description: 'Hosting services provider',
      logoUrl: 'https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/digitalocean-logo.png',
      website: 'https://digitalocean.com'
    },
    {
      name: 'MongoDB',
      description: 'Database solutions',
      logoUrl: 'https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/mongodb-logo.png',
      website: 'https://mongodb.com'
    },
    {
      name: 'Stripe',
      description: 'Payment processing',
      logoUrl: 'https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/stripe-logo.png',
      website: 'https://stripe.com'
    },
    {
      name: 'Google Cloud',
      description: 'Cloud services partner',
      logoUrl: 'https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/google-logo.png',
      website: 'https://cloud.google.com'
    },
    {
      name: 'GitHub',
      description: 'Development platform',
      logoUrl: 'https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/github-logo.png',
      website: 'https://github.com'
    },
    {
      name: 'Docker',
      description: 'Container platform',
      logoUrl: 'https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/docker-logo.png',
      website: 'https://docker.com'
    },
    {
      name: 'Apple',
      description: 'Developer ecosystem',
      logoUrl: 'https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/apple-logo.png',
      website: 'https://developer.apple.com'
    },
    {
      name: 'npm',
      description: 'Package registry',
      logoUrl: 'https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/npm-logo.png',
      website: 'https://www.npmjs.com'
    },
    {
      name: 'Python',
      description: 'Programming language',
      logoUrl: 'https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/python-logo.png',
      website: 'https://python.org'
    },
    {
      name: 'Ubuntu',
      description: 'Operating system',
      logoUrl: 'https://res.cloudinary.com/dxow1rafl/image/upload/sponsors/ubuntu-logo.png',
      website: 'https://ubuntu.com'
    }
  ];
  
  for (const sponsor of sponsors) {
    try {
      // First check if the sponsor exists by name
      const existingSponsor = await prisma.sponsor.findFirst({
        where: { name: sponsor.name }
      });

      if (existingSponsor) {
        // Update existing sponsor
        const result = await prisma.sponsor.update({
          where: { id: existingSponsor.id },
          data: sponsor
        });
        console.log(`Updated sponsor: ${result.name}`);
      } else {
        // Create new sponsor
        const result = await prisma.sponsor.create({
          data: sponsor
        });
        console.log(`Created sponsor: ${result.name}`);
      }
    } catch (error) {
      console.error(`Error creating/updating sponsor ${sponsor.name}:`, error);
    }
  }
  
  console.log('Sponsor seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 