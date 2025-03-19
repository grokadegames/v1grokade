const { PrismaClient } = require('@prisma/client');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configure Cloudinary with the provided credentials
cloudinary.config({
  cloud_name: 'dxow1rafl',
  api_key: '189369456186199',
  api_secret: '31EANFqVf28WcdN3p7IE2_q-wtw'
});

// Make sure we have a directory to save images
const createImageDir = () => {
  const dir = path.join(__dirname, '..', 'grokade-review');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

const prisma = new PrismaClient();

async function downloadImage(url, filepath) {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    });
    
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error downloading image: ${error.message}`);
    return null;
  }
}

async function createGameReview(numGames = 10) {
  try {
    // Create directory for saving images if it doesn't exist
    const imageDir = createImageDir();
    
    // First, count the total number of games with images
    const totalGames = await prisma.game.count({
      where: {
        imageUrl: {
          not: null
        }
      }
    });
    
    // If we have more games than we need, select randomly
    let games = [];
    if (totalGames > numGames) {
      // Get all games with images
      const allGames = await prisma.game.findMany({
        where: {
          imageUrl: {
            not: null
          }
        },
        select: {
          id: true,
          title: true,
          imageUrl: true,
          xaccount: true, // Game's X account
          author: {
            select: {
              username: true,
              displayName: true
            }
          }
        }
      });
      
      // Shuffle the array and take the first numGames
      const shuffled = [...allGames].sort(() => 0.5 - Math.random());
      games = shuffled.slice(0, numGames);
      
      console.log(`Randomly selected ${games.length} games from a total of ${allGames.length}`);
    } else {
      // If we don't have enough games, just get all of them
      games = await prisma.game.findMany({
        where: {
          imageUrl: {
            not: null
          }
        },
        select: {
          id: true,
          title: true,
          imageUrl: true,
          xaccount: true, // Game's X account
          author: {
            select: {
              username: true,
              displayName: true
            }
          }
        },
        take: numGames
      });
      
      console.log(`Using all available ${games.length} games with images`);
    }

    if (games.length === 0) {
      console.log('No games with images found in the database');
      return null;
    }

    console.log(`Working with ${games.length} games`);
    
    // Create timestamp for unique filenames
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reviewDir = path.join(imageDir, `review-${timestamp}`);
    fs.mkdirSync(reviewDir, { recursive: true });
    
    // Array to store downloaded image paths
    const downloadedImages = [];
    
    // Download each game's image
    for (let i = 0; i < games.length; i++) {
      const game = games[i];
      
      // Extract file extension from image URL or use jpg as default
      let extension = 'jpg';
      if (game.imageUrl) {
        const matches = game.imageUrl.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
        if (matches && matches[1]) {
          extension = matches[1];
        }
      }
      
      // Create filename for this game's image
      const gameFilename = `game-${i+1}-${game.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.${extension}`;
      const imagePath = path.join(reviewDir, gameFilename);
      
      // Download the image if it exists
      if (game.imageUrl) {
        console.log(`Downloading image for ${game.title}...`);
        try {
          await downloadImage(game.imageUrl, imagePath);
          console.log(`  Saved to: ${imagePath}`);
          
          // Only add if file exists and is a valid image
          if (fs.existsSync(imagePath) && fs.statSync(imagePath).size > 0) {
            downloadedImages.push({
              path: imagePath,
              title: game.title,
              filename: gameFilename
            });
          }
        } catch (error) {
          console.error(`  Failed to download: ${error.message}`);
        }
      }
    }
    
    // Create details for the X post
    let postContent = `📊 Today's Grokade Game Review 🎮\n\nDiscover ${games.length} incredible indie web games:\n\n`;
    
    // Add images information
    if (downloadedImages.length > 0) {
      postContent += `🖼️ Game screenshots available in: ${reviewDir}\n\n`;
      
      // List downloaded images
      postContent += "Images downloaded:\n";
      downloadedImages.forEach((img, idx) => {
        postContent += `${idx+1}. ${img.title} - ${img.filename}\n`;
      });
      postContent += "\n";
    } else {
      postContent += "⚠️ No game images could be downloaded.\n\n";
    }
    
    // Add game details
    games.forEach((game, index) => {
      // Generate a 5-word positive description
      const descriptions = [
        "Addictive gameplay, incredible visual style",
        "Innovative mechanics, stunning artistic design",
        "Creative challenges, beautiful responsive interface",
        "Engaging storyline, vibrant graphic style",
        "Mind-bending puzzles, immersive experience",
        "Captivating adventure, unique game mechanics",
        "Fast-paced action, gorgeous visual effects",
        "Strategic gameplay, delightful artistic touch",
        "Challenging levels, amazing sound design",
        "Thoughtful design, extremely fun gameplay"
      ];
      
      const emoji = ["🔥", "🚀", "🎮", "🏆", "🎯", "🧩", "🎲", "🎪", "🎭", "🎨"][index % 10];
      const description = descriptions[index % descriptions.length];
      
      // Get author's X account or use username if not available
      let xAccount = game.xaccount || game.author?.username || "unknown";
      
      // Clean up X account format if it's a URL
      if (xAccount.includes('https://x.com/') || xAccount.includes('https://twitter.com/')) {
        xAccount = xAccount.split('/').pop();
      }
      
      postContent += `${emoji} ${game.title} - ${description}\n`;
      postContent += `🔗 grokade.com/game/${game.id}\n`;
      postContent += `👤 @${xAccount.replace(/^@/, '')}\n\n`;
    });
    
    postContent += `Discover these and more at grokade.com! #IndieGames #WebGames #GameDev`;
    
    // Save the post content to a file as well for easy access
    const postPath = path.join(reviewDir, `grokade-game-review.txt`);
    fs.writeFileSync(postPath, postContent);
    
    // Create a simple HTML page with the images in a grid
    const htmlPath = path.join(reviewDir, 'collage.html');
    let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Grokade Game Review Collage</title>
      <style>
        body { background: #121212; margin: 0; padding: 0; }
        .collage { 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: 0; 
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }
        .game-card { 
          aspect-ratio: 1/1;
          overflow: hidden;
        }
        .game-card img { 
          width: 100%; 
          height: 100%; 
          object-fit: cover;
          display: block;
        }
      </style>
    </head>
    <body>
      <div class="collage">
    `;
    
    downloadedImages.forEach(img => {
      const relativePath = path.relative(reviewDir, img.path).replace(/\\/g, '/');
      htmlContent += `
        <div class="game-card">
          <img src="${relativePath}" alt="${img.title}">
        </div>
      `;
    });
    
    htmlContent += `
      </div>
    </body>
    </html>
    `;
    
    fs.writeFileSync(htmlPath, htmlContent);
    
    console.log("\nPost Content for X (saved to file):");
    console.log(postContent);
    console.log(`\nPost content saved to: ${postPath}`);
    console.log(`\nHTML collage page created at: ${htmlPath}`);
    console.log(`\nAll game images and post content saved to: ${reviewDir}`);
    
    return { reviewDir, htmlPath, postContent, postPath, games, downloadedImages };
  } catch (error) {
    console.error('Error creating game review:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the function
createGameReview().then(() => {
  console.log('\nDone! You can copy the post content from the console or the saved text file.');
}); 