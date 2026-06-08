import { clearSession, getToken } from "@/lib/auth-storage";
import { API_URL } from "@/lib/config";
import type {
  ApiErrorResponse,
  BalancePoint,
  Book,
  Movement,
  MovementType,
  Pagination,
  User,
  UserRole
} from "@/lib/types";

type ApiResponse<T> = { data: T };

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init?.headers || {})
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers
  });

  const payload = (await response.json()) as ApiResponse<T> & ApiErrorResponse;

  if (!response.ok) {
    if (response.status === 401) {
      clearSession();
    }
    throw new ApiClientError(payload.error || "Error en la solicitud", response.status);
  }

  return payload.data;
}

export function login(email: string, password: string) {
  return request<{ token: string; user: User }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export function register(data: {
  name: string;
  email: string;
  password: string;
  image?: string;
}) {
  return request<{ token: string; user: User }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function getMe() {
  return request<{ user: User }>("/api/auth/me");
}

export function getBooks(params?: { page?: number; pageSize?: number; q?: string }) {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.pageSize) search.set("pageSize", String(params.pageSize));
  if (params?.q) search.set("q", params.q);
  const query = search.toString();
  return request<{ books: Book[]; pagination: Pagination }>(
    `/api/books${query ? `?${query}` : ""}`
  );
}

export function getBook(id: string) {
  return request<{ book: Book }>(`/api/books/${id}`);
}

export function createBook(data: {
  name: string;
  author?: string;
  isbn?: string;
  description?: string;
  initialStock: number;
}) {
  return request<{ book: Book }>("/api/books", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateBook(
  id: string,
  data: {
    name?: string;
    author?: string;
    isbn?: string;
    description?: string;
    enabled?: boolean;
  }
) {
  return request<{ book: Book }>(`/api/books/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}

export function deleteBook(id: string) {
  return request<{ book: Book }>(`/api/books/${id}`, {
    method: "DELETE"
  });
}

export function getMovements(bookId: string, params?: { page?: number; pageSize?: number }) {
  const search = new URLSearchParams({ bookId });
  if (params?.page) search.set("page", String(params.page));
  if (params?.pageSize) search.set("pageSize", String(params.pageSize));
  return request<{ movements: Movement[]; pagination: Pagination }>(
    `/api/movements?${search.toString()}`
  );
}

export function createMovement(data: {
  bookId: string;
  type: MovementType;
  quantity: number;
  note?: string;
}) {
  return request<{ movement: Movement; book: { id: string; name: string; stock: number } }>(
    "/api/movements",
    {
      method: "POST",
      body: JSON.stringify(data)
    }
  );
}

export function getMovementSummary(bookId: string) {
  const search = new URLSearchParams({ bookId });
  return request<{
    book: { id: string; name: string; stock: number };
    points: BalancePoint[];
  }>(`/api/movements/summary?${search.toString()}`);
}

export function getUsers(params?: { page?: number; pageSize?: number }) {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.pageSize) search.set("pageSize", String(params.pageSize));
  const query = search.toString();
  return request<{ users: User[]; pagination: Pagination }>(
    `/api/users${query ? `?${query}` : ""}`
  );
}

export function updateUser(id: string, data: { role: UserRole; enabled?: boolean }) {
  return request<{ user: User }>(`/api/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}
