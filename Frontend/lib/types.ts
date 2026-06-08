export type UserRole = "ADMIN" | "USER";
export type MovementType = "ENTRADA" | "SALIDA";

export type User = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
  enabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Book = {
  id: string;
  name: string;
  author: string | null;
  isbn: string | null;
  description: string | null;
  stock: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
};

export type Movement = {
  id: string;
  type: MovementType;
  quantity: number;
  previousStock: number;
  resultingStock: number;
  note: string | null;
  createdAt: string;
  responsible: {
    id: string;
    name: string;
    email: string;
  };
  book: {
    id: string;
    name: string;
  };
};

export type Pagination = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type BalancePoint = {
  date: string;
  balance: number;
};

export type ApiErrorResponse = {
  error: string;
  issues?: Array<{ path: string; message: string }>;
};
