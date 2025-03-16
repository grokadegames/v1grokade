/**
 * This script helps extract SVG files from the React Icons library
 * for uploading to Cloudinary.
 * 
 * To use this script:
 * 1. Install the required packages: npm install react-icons fs
 * 2. Run: node extract-sponsor-icons.js
 * 3. Check the /sponsor-icons directory for generated SVG files
 */

const fs = require('fs');
const path = require('path');
const { 
  FaLaravel, 
  FaReact, 
  FaNodeJs, 
  FaAws, 
  FaDigitalOcean, 
  FaDatabase, 
  FaStripe, 
  FaGoogle, 
  FaGithub, 
  FaDocker, 
  FaApple, 
  FaNpm, 
  FaPython, 
  FaUbuntu 
} = require('react-icons/fa');

// Directory to save the SVG files
const outputDir = path.join(__dirname, '../../sponsor-icons');

// Create the directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Sponsor info with icon components
const sponsors = [
  { name: 'Laravel', icon: FaLaravel, color: '#FF2D20' },
  { name: 'React', icon: FaReact, color: '#61DAFB' },
  { name: 'NodeJS', icon: FaNodeJs, color: '#339933' },
  { name: 'AWS', icon: FaAws, color: '#FF9900' },
  { name: 'DigitalOcean', icon: FaDigitalOcean, color: '#0080FF' },
  { name: 'MongoDB', icon: FaDatabase, color: '#47A248' },
  { name: 'Stripe', icon: FaStripe, color: '#6772E5' },
  { name: 'Google', icon: FaGoogle, color: '#4285F4' },
  { name: 'GitHub', icon: FaGithub, color: '#FFFFFF' },
  { name: 'Docker', icon: FaDocker, color: '#2496ED' },
  { name: 'Apple', icon: FaApple, color: '#FFFFFF' },
  { name: 'NPM', icon: FaNpm, color: '#CB3837' },
  { name: 'Python', icon: FaPython, color: '#FFD43B' },
  { name: 'Ubuntu', icon: FaUbuntu, color: '#E95420' }
];

/**
 * Function to extract SVG content from a React Icon
 * Note: This is a simplified approach and may need adjustments based on
 * the exact structure of the icons in react-icons.
 */
function extractSvgContent(IconComponent) {
  try {
    // Get the render method of the icon component
    const renderFunc = IconComponent.render || IconComponent;
    
    // Call the render function to get the React element
    const element = renderFunc();
    
    // Extract the SVG props
    const { children, ...svgProps } = element.props;
    
    // Create a basic SVG string from the extracted data
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512"`;
    
    // Add any other SVG props
    Object.entries(svgProps).forEach(([key, value]) => {
      if (key !== 'children') {
        svgContent += ` ${key}="${value}"`;
      }
    });
    
    svgContent += '>\n';
    
    // Unfortunately, this simplified approach doesn't extract the actual paths
    // For demonstration purposes, we're adding a note
    svgContent += '  <!-- This is a placeholder. The actual SVG content needs to be manually extracted or exported -->\n';
    svgContent += '  <!-- You may need to use browser devtools to inspect the actual SVG content -->\n';
    svgContent += '</svg>';
    
    return svgContent;
  } catch (error) {
    console.error('Failed to extract SVG content:', error);
    return null;
  }
}

// Generate SVG files
sponsors.forEach(sponsor => {
  try {
    const svgContent = extractSvgContent(sponsor.icon);
    if (svgContent) {
      const filename = `${sponsor.name.toLowerCase()}-logo.svg`;
      const filepath = path.join(outputDir, filename);
      
      fs.writeFileSync(filepath, svgContent);
      console.log(`Created ${filepath}`);
    }
  } catch (error) {
    console.error(`Failed to create SVG for ${sponsor.name}:`, error);
  }
});

// Print instructions for uploading to Cloudinary
console.log('\n=== Next Steps ===');
console.log('1. Check the generated SVG files in the sponsor-icons directory');
console.log('2. Since the SVG extraction is simplified, you may need to manually adjust the files or export the icons directly');
console.log('3. Upload these files to Cloudinary using their dashboard or API');
console.log('4. Update the sponsor data in your database with the Cloudinary URLs');
console.log('\nAlternatively, you can download these icons directly from their sources:');
console.log('- Laravel: https://laravel.com/img/logomark.min.svg');
console.log('- React: https://reactjs.org/favicon.ico');
console.log('- Node.js: https://nodejs.org/static/images/logo.svg');
console.log('(... and so on for each sponsor)');

// Generate a SQL script to insert sponsor data
const sqlScript = `
-- SQL script to insert sponsor data into the database
-- Run this after uploading the images to Cloudinary

INSERT INTO sponsors (name, description, logo_url, website, created_at, updated_at) VALUES
('Laravel', 'Backend framework provider', 'https://res.cloudinary.com/yourcloudinary/sponsors/laravel-logo.png', 'https://laravel.com', NOW(), NOW()),
('React', 'Frontend library partner', 'https://res.cloudinary.com/yourcloudinary/sponsors/react-logo.png', 'https://reactjs.org', NOW(), NOW()),
('Node.js', 'Server runtime environment', 'https://res.cloudinary.com/yourcloudinary/sponsors/nodejs-logo.png', 'https://nodejs.org', NOW(), NOW()),
('AWS', 'Cloud infrastructure partner', 'https://res.cloudinary.com/yourcloudinary/sponsors/aws-logo.png', 'https://aws.amazon.com', NOW(), NOW()),
('DigitalOcean', 'Hosting services provider', 'https://res.cloudinary.com/yourcloudinary/sponsors/digitalocean-logo.png', 'https://digitalocean.com', NOW(), NOW()),
('MongoDB', 'Database solutions', 'https://res.cloudinary.com/yourcloudinary/sponsors/mongodb-logo.png', 'https://mongodb.com', NOW(), NOW()),
('Stripe', 'Payment processing', 'https://res.cloudinary.com/yourcloudinary/sponsors/stripe-logo.png', 'https://stripe.com', NOW(), NOW()),
('Google Cloud', 'Cloud services partner', 'https://res.cloudinary.com/yourcloudinary/sponsors/google-logo.png', 'https://cloud.google.com', NOW(), NOW()),
('GitHub', 'Development platform', 'https://res.cloudinary.com/yourcloudinary/sponsors/github-logo.png', 'https://github.com', NOW(), NOW()),
('Docker', 'Container platform', 'https://res.cloudinary.com/yourcloudinary/sponsors/docker-logo.png', 'https://docker.com', NOW(), NOW()),
('Apple', 'Developer ecosystem', 'https://res.cloudinary.com/yourcloudinary/sponsors/apple-logo.png', 'https://developer.apple.com', NOW(), NOW()),
('npm', 'Package registry', 'https://res.cloudinary.com/yourcloudinary/sponsors/npm-logo.png', 'https://www.npmjs.com', NOW(), NOW()),
('Python', 'Programming language', 'https://res.cloudinary.com/yourcloudinary/sponsors/python-logo.png', 'https://python.org', NOW(), NOW()),
('Ubuntu', 'Operating system', 'https://res.cloudinary.com/yourcloudinary/sponsors/ubuntu-logo.png', 'https://ubuntu.com', NOW(), NOW());
`;

// Save the SQL script
fs.writeFileSync(path.join(outputDir, 'insert_sponsors.sql'), sqlScript);
console.log('\nGenerated SQL script for inserting sponsor data: sponsor-icons/insert_sponsors.sql');

// Generate a Prisma seeding script
const prismaScript = `
// prisma/seed.js
// Run with: npx prisma db seed

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding sponsors...');
  
  const sponsors = [
    {
      name: 'Laravel',
      description: 'Backend framework provider',
      logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/laravel-logo.png',
      website: 'https://laravel.com'
    },
    {
      name: 'React',
      description: 'Frontend library partner',
      logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/react-logo.png',
      website: 'https://reactjs.org'
    },
    {
      name: 'Node.js',
      description: 'Server runtime environment',
      logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/nodejs-logo.png',
      website: 'https://nodejs.org'
    },
    {
      name: 'AWS',
      description: 'Cloud infrastructure partner',
      logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/aws-logo.png',
      website: 'https://aws.amazon.com'
    },
    {
      name: 'DigitalOcean',
      description: 'Hosting services provider',
      logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/digitalocean-logo.png',
      website: 'https://digitalocean.com'
    },
    {
      name: 'MongoDB',
      description: 'Database solutions',
      logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/mongodb-logo.png',
      website: 'https://mongodb.com'
    },
    {
      name: 'Stripe',
      description: 'Payment processing',
      logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/stripe-logo.png',
      website: 'https://stripe.com'
    },
    {
      name: 'Google Cloud',
      description: 'Cloud services partner',
      logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/google-logo.png',
      website: 'https://cloud.google.com'
    },
    {
      name: 'GitHub',
      description: 'Development platform',
      logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/github-logo.png',
      website: 'https://github.com'
    },
    {
      name: 'Docker',
      description: 'Container platform',
      logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/docker-logo.png',
      website: 'https://docker.com'
    },
    {
      name: 'Apple',
      description: 'Developer ecosystem',
      logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/apple-logo.png',
      website: 'https://developer.apple.com'
    },
    {
      name: 'npm',
      description: 'Package registry',
      logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/npm-logo.png',
      website: 'https://www.npmjs.com'
    },
    {
      name: 'Python',
      description: 'Programming language',
      logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/python-logo.png',
      website: 'https://python.org'
    },
    {
      name: 'Ubuntu',
      description: 'Operating system',
      logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/ubuntu-logo.png',
      website: 'https://ubuntu.com'
    }
  ];
  
  for (const sponsor of sponsors) {
    const result = await prisma.sponsor.upsert({
      where: { name: sponsor.name },
      update: sponsor,
      create: sponsor
    });
    console.log(\`Created sponsor: \${result.name}\`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;

// Save the Prisma script
fs.writeFileSync(path.join(outputDir, 'seed.js'), prismaScript);
console.log('Generated Prisma seeding script: sponsor-icons/seed.js'); 