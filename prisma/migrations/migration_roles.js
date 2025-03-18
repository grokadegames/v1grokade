const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateUserRoles() {
  console.log('Starting user roles migration...');
  
  try {
    // 1. Get all existing users with their roles
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users to migrate`);
    
    // 2. Create the new UserRoles records for each user
    // For each user, we'll keep their current role and add it to the new user_roles table
    let createdCount = 0;
    
    for (const user of users) {
      // Map REGULAR role to BASIC
      const roleToAssign = user.role === 'REGULAR' ? 'BASIC' : user.role;
      
      try {
        await prisma.userRoles.create({
          data: {
            userId: user.id,
            role: roleToAssign,
          }
        });
        createdCount++;
      } catch (error) {
        console.error(`Error creating role for user ${user.id}:`, error);
      }
    }
    
    console.log(`Successfully migrated ${createdCount} user roles`);
    
    // 3. Update all REGULAR users to BASIC
    const regularUsersCount = await prisma.user.count({
      where: { role: 'REGULAR' }
    });
    
    if (regularUsersCount > 0) {
      await prisma.user.updateMany({
        where: { role: 'REGULAR' },
        data: { role: 'BASIC' }
      });
      console.log(`Updated ${regularUsersCount} users from REGULAR to BASIC`);
    }
    
    console.log('User roles migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateUserRoles(); 