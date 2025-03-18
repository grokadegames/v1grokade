const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getXAccounts() {
  try {
    // Find all games with non-null xaccount field
    const games = await prisma.game.findMany({
      where: {
        xaccount: {
          not: null
        }
      },
      select: {
        xaccount: true
      }
    });
    
    // Format the xaccount values to extract just the username part with @ symbol
    const formattedAccounts = games.map(game => {
      const account = game.xaccount;
      if (!account) return null;
      
      // Remove any URLs and just keep the username with @ symbol
      if (account.includes('https://x.com/') || account.includes('https://twitter.com/')) {
        const parts = account.split('/');
        return '@' + parts[parts.length - 1].trim();
      }
      
      // If already starts with @, just return as is
      if (account.startsWith('@')) {
        return account.trim();
      }
      
      // Otherwise add @ if missing
      return '@' + account.trim();
    }).filter(Boolean); // Remove any null values
    
    // Remove duplicates by using a Set
    const uniqueAccounts = [...new Set(formattedAccounts)];
    
    // Print only the list of handles with no other text
    console.log(uniqueAccounts.join('\n'));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getXAccounts();
