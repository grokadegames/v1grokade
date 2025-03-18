// Script to assign all roles to an admin user
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function giveAdminAllRoles() {
  console.log('🔄 Finding admin user...');
  
  try {
    // Find the admin user
    const adminUser = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    });
    
    if (!adminUser) {
      console.log('❌ No admin user found. Please create an admin user first.');
      return;
    }
    
    console.log(`✅ Found admin user: ${adminUser.username} (${adminUser.id})`);
    
    // Get all available roles from the UserRole enum
    const allRoles = ['BASIC', 'ADMIN', 'AUTHOR', 'SPONSOR', 'EMPLOYER', 'APPLICANT'];
    
    // Track success count
    let successCount = 0;
    
    // Add each role to the admin user
    for (const role of allRoles) {
      try {
        // Use upsert to avoid duplicates (if the role already exists, it won't create a duplicate)
        await prisma.userRoles.upsert({
          where: { 
            userId_role: { 
              userId: adminUser.id, 
              role 
            } 
          },
          update: {}, // No updates needed if it exists
          create: {
            userId: adminUser.id,
            role
          }
        });
        
        console.log(`✅ Added role: ${role}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to add role ${role}:`, error.message);
      }
    }
    
    console.log(`✅ Successfully added ${successCount} roles to admin user ${adminUser.username}`);
  } catch (error) {
    console.error('❌ Error giving admin all roles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
giveAdminAllRoles(); 