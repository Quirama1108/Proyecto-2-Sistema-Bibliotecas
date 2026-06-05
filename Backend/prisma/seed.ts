import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL
  })
});

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@biblioteca.test" },
    update: {},
    create: {
      name: "Administrador Biblioteca",
      email: "admin@biblioteca.test",
      passwordHash: hashPassword("Admin12345"),
      role: "ADMIN"
    }
  });

  await prisma.user.upsert({
    where: { email: "usuario@biblioteca.test" },
    update: {},
    create: {
      name: "Usuario Biblioteca",
      email: "usuario@biblioteca.test",
      passwordHash: hashPassword("User12345"),
      role: "USER"
    }
  });

  const books = [
    {
      name: "Cien anos de soledad",
      author: "Gabriel Garcia Marquez",
      isbn: "9780307474728",
      description: "Novela latinoamericana para prestamos generales.",
      stock: 8
    },
    {
      name: "Clean Code",
      author: "Robert C. Martin",
      isbn: "9780132350884",
      description: "Libro tecnico de buenas practicas de programacion.",
      stock: 5
    },
    {
      name: "El principito",
      author: "Antoine de Saint-Exupery",
      isbn: "9780156012195",
      description: "Lectura corta para coleccion general.",
      stock: 12
    }
  ];

  for (const bookData of books) {
    const book = await prisma.book.upsert({
      where: { isbn: bookData.isbn },
      update: {},
      create: {
        ...bookData,
        createdById: admin.id
      }
    });

    const movementCount = await prisma.inventoryMovement.count({
      where: { bookId: book.id }
    });

    if (movementCount === 0 && book.stock > 0) {
      await prisma.inventoryMovement.create({
        data: {
          bookId: book.id,
          responsibleId: admin.id,
          type: "ENTRADA",
          quantity: book.stock,
          previousStock: 0,
          resultingStock: book.stock,
          note: "Saldo inicial"
        }
      });
    }
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
