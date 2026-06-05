import assert from "node:assert/strict";
import { test } from "node:test";

const baseUrl = process.env.API_BASE_URL || "http://localhost:3000";
const adminEmail = process.env.TEST_ADMIN_EMAIL || "admin@biblioteca.test";
const adminPassword = process.env.TEST_ADMIN_PASSWORD || "Admin12345";

type ApiResponse<T> = {
  data: T;
  error?: string;
};

async function request<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    }
  });
  const payload = (await response.json()) as ApiResponse<T>;

  assert.equal(
    response.ok,
    true,
    `${init?.method || "GET"} ${path} failed with ${response.status}: ${JSON.stringify(payload)}`
  );

  return payload.data;
}

async function loginAsAdmin() {
  return request<{
    token: string;
    user: {
      email: string;
      role: "ADMIN" | "USER";
    };
  }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: adminEmail,
      password: adminPassword
    })
  });
}

test("login returns an admin JWT", async () => {
  const login = await loginAsAdmin();

  assert.equal(login.user.email, adminEmail);
  assert.equal(login.user.role, "ADMIN");
  assert.ok(login.token.length > 20);
});

test("books endpoint supports pagination and admin can create a book", async () => {
  const login = await loginAsAdmin();
  const suffix = Date.now();
  const created = await request<{
    book: {
      id: string;
      name: string;
      stock: number;
    };
  }>("/api/books", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${login.token}`
    },
    body: JSON.stringify({
      name: `Libro prueba ${suffix}`,
      author: "Test Runner",
      isbn: `TEST-${suffix}`,
      description: "Libro temporal creado por pruebas automatizadas.",
      initialStock: 2
    })
  });
  const books = await request<{
    books: Array<{ id: string; name: string }>;
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  }>("/api/books?page=1&pageSize=5", {
    headers: {
      Authorization: `Bearer ${login.token}`
    }
  });

  assert.equal(created.book.stock, 2);
  assert.equal(books.pagination.page, 1);
  assert.equal(books.pagination.pageSize, 5);
  assert.ok(books.pagination.total >= 1);
  assert.ok(books.books.length <= 5);
});

test("movements endpoint creates and lists inventory movements", async () => {
  const login = await loginAsAdmin();
  const suffix = Date.now();
  const created = await request<{
    book: {
      id: string;
      stock: number;
    };
  }>("/api/books", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${login.token}`
    },
    body: JSON.stringify({
      name: `Libro movimientos ${suffix}`,
      author: "Test Runner",
      isbn: `MOVE-${suffix}`,
      initialStock: 1
    })
  });
  const movement = await request<{
    movement: {
      id: string;
      type: "ENTRADA" | "SALIDA";
      quantity: number;
      resultingStock: number;
    };
    book: {
      id: string;
      stock: number;
    };
  }>("/api/movements", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${login.token}`
    },
    body: JSON.stringify({
      bookId: created.book.id,
      type: "SALIDA",
      quantity: 1,
      note: "Salida creada por prueba automatizada."
    })
  });
  const movements = await request<{
    movements: Array<{ id: string; type: string }>;
    pagination: {
      total: number;
    };
  }>(`/api/movements?bookId=${created.book.id}&page=1&pageSize=10`, {
    headers: {
      Authorization: `Bearer ${login.token}`
    }
  });

  assert.equal(movement.movement.type, "SALIDA");
  assert.equal(movement.book.stock, 0);
  assert.ok(movements.pagination.total >= 2);
  assert.ok(movements.movements.some((item) => item.id === movement.movement.id));
});
