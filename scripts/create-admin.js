const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = process.argv[2] || 'admin123';
  const username = 'admin';
  
  console.log(`Creating admin user '${username}' with password '${password}'...`);

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash },
    create: {
      username,
      passwordHash,
      role: 'admin',
    },
  });

  console.log('Admin user created/updated:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
