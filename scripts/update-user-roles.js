// Script to update all users with REGULAR role to BASIC
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateRegularUsersToBasic() {
  console.log('🔄 Migrating all REGULAR role users to BASIC...');
  
  try {
    // First update the main role on users
    const updatedUsers = await prisma.user.updateMany({
      where: {
        role: 'REGULAR'
      },
      data: {
        role: 'BASIC'
      }
    });
    
    console.log(`✅ Updated ${updatedUsers.count} users from REGULAR to BASIC`);
    
    // Then update any UserRoles entries
    const updatedRoles = await prisma.userRoles.updateMany({
      where: {
        role: 'REGULAR'
      },
      data: {
        role: 'BASIC'
      }
    });
    
    console.log(`✅ Updated ${updatedRoles.count} role entries from REGULAR to BASIC`);
    
    console.log('✅ Migration completed successfully');
  } catch (error) {
    console.error('❌ Error during migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateRegularUsersToBasic(); 