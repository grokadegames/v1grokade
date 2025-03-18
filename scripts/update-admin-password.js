// Script to update admin password
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateAdminPassword() {
  try {
    console.log('Starting admin password update process...');
    
    // Define the admin username - replace with your actual admin username if different
    const adminUsername = 'admin';
    const newPassword = 'Chimmy81!';
    
    // Find the admin user
    const user = await prisma.user.findUnique({
      where: { username: adminUsername },
    });
    
    if (!user) {
      console.error(`User not found: ${adminUsername}`);
      return;
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update the user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
    
    console.log(`Password updated successfully for user: ${adminUsername}`);
  } catch (error) {
    console.error('Error updating admin password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
updateAdminPassword(); 