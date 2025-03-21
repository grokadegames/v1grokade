const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')

async function main() {
  console.log('Retrieving xaccount data...')
  
  const games = await prisma.game.findMany({
    where: {
      xaccount: {
        not: null
      }
    },
    select: {
      id: true,
      title: true,
      xaccount: true
    }
  })
  
  const talentProfiles = await prisma.talentProfile.findMany({
    where: {
      xaccount: {
        not: null
      }
    },
    select: {
      id: true,
      xaccount: true,
      user: {
        select: {
          displayName: true
        }
      }
    }
  })

  // Generate HTML content
  let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Grokade X Accounts</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #333;
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
    }
    h2 {
      color: #444;
      margin-top: 30px;
    }
    .accounts-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 10px;
    }
    .account-item {
      padding: 8px;
      border-radius: 4px;
      background-color: #f9f9f9;
      margin-bottom: 5px;
    }
    .account-item a {
      color: #1DA1F2;
      text-decoration: none;
    }
    .account-item a:hover {
      text-decoration: underline;
    }
    .game-title {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>Grokade X Accounts</h1>
  
  <h2>Game X Accounts (${games.length})</h2>
  <div class="accounts-list">
    ${games.map(game => {
      const xUrl = game.xaccount.startsWith('@') 
        ? `https://x.com/${game.xaccount.substring(1)}` 
        : game.xaccount;
      const displayHandle = game.xaccount.startsWith('@') 
        ? game.xaccount 
        : game.xaccount.replace('https://x.com/', '@');
      return `<div class="account-item">
        <span class="game-title">${game.title}:</span> 
        <a href="${xUrl}" target="_blank">${displayHandle}</a>
      </div>`;
    }).join('\n    ')}
  </div>
  
  <h2>Talent Profile X Accounts (${talentProfiles.length})</h2>
  <div class="accounts-list">
    ${talentProfiles.map(profile => {
      const xUrl = profile.xaccount.startsWith('@') 
        ? `https://x.com/${profile.xaccount.substring(1)}` 
        : profile.xaccount;
      const displayHandle = profile.xaccount.startsWith('@') 
        ? profile.xaccount 
        : profile.xaccount.replace('https://x.com/', '@');
      return `<div class="account-item">
        <span class="game-title">${profile.user.displayName}:</span> 
        <a href="${xUrl}" target="_blank">${displayHandle}</a>
      </div>`;
    }).join('\n    ')}
  </div>

  <h2>All X Accounts (Combined List)</h2>
  <div class="accounts-list">
    ${[...new Set([
      ...games.map(g => g.xaccount),
      ...talentProfiles.map(p => p.xaccount)
    ])].map(xaccount => {
      const xUrl = xaccount.startsWith('@') 
        ? `https://x.com/${xaccount.substring(1)}` 
        : xaccount;
      const displayHandle = xaccount.startsWith('@') 
        ? xaccount 
        : xaccount.replace('https://x.com/', '@');
      return `<div class="account-item">
        <a href="${xUrl}" target="_blank">${displayHandle}</a>
      </div>`;
    }).join('\n    ')}
  </div>
</body>
</html>`;

  // Write HTML to file
  fs.writeFileSync('xaccounts.html', htmlContent);
  console.log('HTML file with X account hyperlinks generated at xaccounts.html');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 