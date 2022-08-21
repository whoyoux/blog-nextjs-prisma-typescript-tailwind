const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    name: "whoyoux",
    email: "teczakm@gmail.com",
  });

  await prisma.post.create({
    title: "My first post",
    content:
      "Lorem ipsum content sialala ebebebe diyba defu hayle yhle model selsect query all",
    author: "",
  });
}

main()
  .catch((err) => console.error(err))
  .finally(async () => await prisma.$disconnect());
