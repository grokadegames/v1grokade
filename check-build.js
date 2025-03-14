const fs = require('fs');
const path = require('path');

// Check if .next directory exists
if (!fs.existsSync('.next')) {
  console.error('Error: .next directory does not exist!');
  process.exit(1);
}

// Log the structure of the .next directory
function logDirectoryStructure(dir, prefix = '') {
  const items = fs.readdirSync(dir);
  
  items.forEach((item, index) => {
    const itemPath = path.join(dir, item);
    const isLast = index === items.length - 1;
    const stats = fs.statSync(itemPath);
    
    console.log(`${prefix}${isLast ? '└── ' : '├── '}${item}`);
    
    if (stats.isDirectory()) {
      logDirectoryStructure(itemPath, `${prefix}${isLast ? '    ' : '│   '}`);
    }
  });
}

console.log('\n.next directory structure:');
logDirectoryStructure('.next');

// Check for critical Next.js files
const criticalPaths = [
  '.next/server',
  '.next/static',
  '.next/standalone',
];

criticalPaths.forEach(criticalPath => {
  if (!fs.existsSync(criticalPath)) {
    console.warn(`Warning: ${criticalPath} does not exist!`);
  } else {
    console.log(`✓ ${criticalPath} exists`);
  }
});

console.log('\nBuild check complete.'); 