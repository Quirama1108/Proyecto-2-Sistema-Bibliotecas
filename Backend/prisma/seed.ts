import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../lib/password";

const DAY_MS = 24 * 60 * 60 * 1000;
const DEMO_NOTE_PREFIX = "Demo biblioteca";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL
  })
});

type DemoMovement = {
  daysAgo: number;
  type: "ENTRADA" | "SALIDA";
  quantity: number;
  note: string;
};

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

  const regularUser = await prisma.user.upsert({
    where: { email: "usuario@biblioteca.test" },
    update: {},
    create: {
      name: "Usuario Biblioteca",
      email: "usuario@biblioteca.test",
      passwordHash: hashPassword("User12345"),
      role: "USER"
    }
  });

  await prisma.book.updateMany({
    where: {
      deleted: false,
      OR: [
        { isbn: { startsWith: "TEST-" } },
        { isbn: { startsWith: "MOVE-" } },
        { name: { startsWith: "Libro prueba" } },
        { name: { startsWith: "Libro movimientos" } }
      ]
    },
    data: {
      deleted: true,
      enabled: false
    }
  });

  const books = [
    {
      name: "Cien años de soledad",
      author: "Gabriel García Márquez",
      isbn: "9780307474728",
      description: "Novela latinoamericana para préstamos generales.",
      stock: 8
    },
    {
      name: "Clean Code",
      author: "Robert C. Martin",
      isbn: "9780132350884",
      description: "Libro técnico de buenas prácticas de programación.",
      stock: 5
    },
    {
      name: "El principito",
      author: "Antoine de Saint-Exupéry",
      isbn: "9780156012195",
      description: "Lectura corta para colección general.",
      stock: 12
    },
    {
      name: "Opio en las nubes",
      author: "Rafael Chaparro Madiedo",
      isbn: "9788496911192",
      description: "Novela urbana colombiana para la colección de literatura nacional.",
      stock: 6
    },
    {
      name: "Ripley en peligro",
      author: "Patricia Highsmith",
      isbn: "9788433970696",
      description: "Novela de suspenso y crimen para la colección internacional.",
      stock: 4
    },
    {
      name: "La vorágine",
      author: "José Eustasio Rivera",
      isbn: "9789583005907",
      description: "Clásico colombiano para consulta y préstamos de literatura.",
      stock: 7
    },
    {
      name: "La casa de los espíritus",
      author: "Isabel Allende",
      isbn: "9780553383805",
      description: "Novela latinoamericana de realismo mágico e historia familiar.",
      stock: 5
    },
    {
      name: "1984",
      author: "George Orwell",
      isbn: "9780451524935",
      description: "Distopía moderna para la colección de literatura universal.",
      stock: 9
    }
  ];

  for (const bookData of books) {
    const { stock, ...bookMetadata } = bookData;
    const book = await prisma.book.upsert({
      where: { isbn: bookData.isbn },
      update: {
        ...bookMetadata,
        enabled: true,
        deleted: false
      },
      create: {
        ...bookMetadata,
        stock,
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
          note: "Saldo inicial",
          createdAt: daysAgo(10)
        }
      });
    }

    await prisma.inventoryMovement.updateMany({
      where: {
        bookId: book.id,
        note: "Saldo inicial"
      },
      data: {
        createdAt: daysAgo(10)
      }
    });

    const demoMovementCount = await prisma.inventoryMovement.count({
      where: {
        bookId: book.id,
        note: {
          startsWith: DEMO_NOTE_PREFIX
        }
      }
    });

    if (demoMovementCount === 0) {
      await createDemoMovements({
        bookId: book.id,
        adminId: admin.id,
        regularUserId: regularUser.id,
        movements: demoMovementsFor(bookData.isbn)
      });
    }
  }
}

function daysAgo(days: number) {
  const date = new Date(Date.now() - days * DAY_MS);
  date.setHours(9 + (days % 7), 15, 0, 0);
  return date;
}

function demoMovementsFor(isbn: string): DemoMovement[] {
  const plans: Record<string, DemoMovement[]> = {
    "9780307474728": [
      { daysAgo: 8, type: "SALIDA", quantity: 1, note: "Préstamo para club de lectura" },
      { daysAgo: 6, type: "ENTRADA", quantity: 2, note: "Ingreso por reposición de ejemplares" },
      { daysAgo: 4, type: "SALIDA", quantity: 2, note: "Préstamo a estudiantes" },
      { daysAgo: 1, type: "ENTRADA", quantity: 1, note: "Devolución parcial" }
    ],
    "9780132350884": [
      { daysAgo: 7, type: "SALIDA", quantity: 1, note: "Préstamo para monitoría" },
      { daysAgo: 5, type: "SALIDA", quantity: 1, note: "Préstamo para proyecto final" },
      { daysAgo: 2, type: "ENTRADA", quantity: 1, note: "Devolución de monitoría" }
    ],
    "9780156012195": [
      { daysAgo: 9, type: "SALIDA", quantity: 3, note: "Préstamo a grupo escolar" },
      { daysAgo: 6, type: "ENTRADA", quantity: 1, note: "Devolución de ejemplar" },
      { daysAgo: 3, type: "SALIDA", quantity: 2, note: "Préstamo familiar" },
      { daysAgo: 1, type: "ENTRADA", quantity: 2, note: "Devolución de grupo escolar" }
    ],
    "9788496911192": [
      { daysAgo: 8, type: "SALIDA", quantity: 1, note: "Préstamo literatura colombiana" },
      { daysAgo: 4, type: "SALIDA", quantity: 1, note: "Préstamo colección nacional" },
      { daysAgo: 2, type: "ENTRADA", quantity: 1, note: "Devolución registrada" }
    ],
    "9788433970696": [
      { daysAgo: 7, type: "SALIDA", quantity: 1, note: "Préstamo novela negra" },
      { daysAgo: 5, type: "ENTRADA", quantity: 1, note: "Devolución de préstamo" },
      { daysAgo: 2, type: "SALIDA", quantity: 2, note: "Préstamo a lector frecuente" }
    ],
    "9789583005907": [
      { daysAgo: 8, type: "SALIDA", quantity: 2, note: "Préstamo literatura colombiana" },
      { daysAgo: 6, type: "ENTRADA", quantity: 1, note: "Devolución de ejemplar" },
      { daysAgo: 3, type: "SALIDA", quantity: 1, note: "Préstamo para investigación" }
    ],
    "9780553383805": [
      { daysAgo: 6, type: "SALIDA", quantity: 1, note: "Préstamo novela latinoamericana" },
      { daysAgo: 3, type: "SALIDA", quantity: 1, note: "Préstamo club de lectura" },
      { daysAgo: 1, type: "ENTRADA", quantity: 1, note: "Devolución de club de lectura" }
    ],
    "9780451524935": [
      { daysAgo: 9, type: "SALIDA", quantity: 2, note: "Préstamo literatura universal" },
      { daysAgo: 5, type: "ENTRADA", quantity: 1, note: "Devolución de ejemplar" },
      { daysAgo: 2, type: "SALIDA", quantity: 1, note: "Préstamo individual" },
      { daysAgo: 1, type: "ENTRADA", quantity: 2, note: "Ingreso por reposición" }
    ]
  };

  return plans[isbn] || [];
}

async function createDemoMovements({
  bookId,
  adminId,
  regularUserId,
  movements
}: {
  bookId: string;
  adminId: string;
  regularUserId: string;
  movements: DemoMovement[];
}) {
  if (movements.length === 0) return;

  await prisma.$transaction(async (tx) => {
    const book = await tx.book.findUnique({
      where: { id: bookId },
      select: { stock: true }
    });

    if (!book) return;

    let stock = book.stock;
    const sortedMovements = [...movements].sort((a, b) => b.daysAgo - a.daysAgo);

    for (const [index, movement] of sortedMovements.entries()) {
      const nextStock =
        movement.type === "ENTRADA" ? stock + movement.quantity : stock - movement.quantity;

      if (nextStock < 0) continue;

      await tx.inventoryMovement.create({
        data: {
          bookId,
          responsibleId: index % 2 === 0 ? regularUserId : adminId,
          type: movement.type,
          quantity: movement.quantity,
          previousStock: stock,
          resultingStock: nextStock,
          note: `${DEMO_NOTE_PREFIX}: ${movement.note}`,
          createdAt: daysAgo(movement.daysAgo)
        }
      });

      stock = nextStock;
    }

    await tx.book.update({
      where: { id: bookId },
      data: { stock }
    });
  });
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
