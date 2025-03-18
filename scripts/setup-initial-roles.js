// Script to set up initial user roles for testing
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setupInitialRoles() {
  console.log('🔄 Setting up initial user roles...');
  
  try {
    // First, get an admin user to grant additional roles
    const adminUser = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    });
    
    if (!adminUser) {
      console.log('❌ No admin user found. Please create an admin user first.');
      return;
    }
    
    console.log(`✅ Found admin user: ${adminUser.username}`);
    
    // Grant the admin user both AUTHOR and SPONSOR roles
    await prisma.userRoles.upsert({
      where: { userId_role: { userId: adminUser.id, role: 'AUTHOR' } },
      update: {},
      create: {
        userId: adminUser.id,
        role: 'AUTHOR'
      }
    });
    
    await prisma.userRoles.upsert({
      where: { userId_role: { userId: adminUser.id, role: 'SPONSOR' } },
      update: {},
      create: {
        userId: adminUser.id,
        role: 'SPONSOR'
      }
    });
    
    console.log(`✅ Added AUTHOR and SPONSOR roles to admin user ${adminUser.username}`);
    
    // Find a basic user to grant an AUTHOR role
    const basicUser = await prisma.user.findFirst({
      where: {
        role: 'BASIC',
        NOT: {
          id: adminUser.id
        }
      }
    });
    
    if (basicUser) {
      await prisma.userRoles.upsert({
        where: { userId_role: { userId: basicUser.id, role: 'AUTHOR' } },
        update: {},
        create: {
          userId: basicUser.id,
          role: 'AUTHOR'
        }
      });
      
      console.log(`✅ Added AUTHOR role to basic user ${basicUser.username}`);
    } else {
      console.log('ℹ️ No basic user found to grant AUTHOR role');
    }
    
    console.log('✅ Initial user roles setup completed successfully');
  } catch (error) {
    console.error('❌ Error setting up initial roles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupInitialRoles(); 