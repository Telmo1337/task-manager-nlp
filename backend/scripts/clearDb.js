const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.taskHistory.deleteMany();
    console.log('TaskHistory deleted');
    
    await prisma.task.deleteMany();
    console.log('Tasks deleted');
    
    await prisma.user.deleteMany();
    console.log('Users deleted');
    
    console.log('All data cleared successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
