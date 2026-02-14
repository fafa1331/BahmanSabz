// =============================================
// DummyJSON API Client
// Docs: https://dummyjson.com/docs
// =============================================

import type {
  AuthResponse,
  LoginRequest,
  UsersResponse,
  User,
  ProductsResponse,
  Product,
  ProductCategory,
  CartsResponse,
  PaginationParams,
  ProductQueryParams,
} from "@/lib/types/dummyjson";
import { getAccessToken } from "./auth";

const BASE_URL = "https://dummyjson.com";

// ---- Helper ----

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `API Error: ${res.status}`);
  }

  return res.json();
}

// ---- Auth ----

/** Authenticate user with username & password */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

/** Get current authenticated user profile */
export async function getAuthUser(): Promise<User> {
  return apiFetch<User>("/auth/me");
}

// ---- Users ----

/** Fetch paginated list of users */
export async function getUsers(params?: PaginationParams): Promise<UsersResponse> {
  const query = buildQuery(params);
  return apiFetch<UsersResponse>(`/users${query}`);
}

/** Search users by query string */
export async function searchUsers(q: string, params?: PaginationParams): Promise<UsersResponse> {
  const query = buildQuery({ ...params });
  return apiFetch<UsersResponse>(`/users/search?q=${encodeURIComponent(q)}${query.replace("?", "&")}`);
}

/** Get a single user by ID */
export async function getUserById(id: number): Promise<User> {
  return apiFetch<User>(`/users/${id}`);
}

// ---- Products ----

/** Fetch paginated list of products */
export async function getProducts(params?: ProductQueryParams): Promise<ProductsResponse> {
  const query = buildQuery(params);
  return apiFetch<ProductsResponse>(`/products${query}`);
}

/** Search products by query string */
export async function searchProducts(q: string, params?: ProductQueryParams): Promise<ProductsResponse> {
  const query = buildQuery({ ...params });
  return apiFetch<ProductsResponse>(`/products/search?q=${encodeURIComponent(q)}${query.replace("?", "&")}`);
}

/** Get a single product by ID */
export async function getProductById(id: number): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`);
}

/** Get all product categories */
export async function getCategories(): Promise<ProductCategory[]> {
  return apiFetch<ProductCategory[]>("/products/categories");
}

/** Get products by category */
export async function getProductsByCategory(
  category: string,
  params?: ProductQueryParams
): Promise<ProductsResponse> {
  const query = buildQuery(params);
  return apiFetch<ProductsResponse>(`/products/category/${encodeURIComponent(category)}${query}`);
}

// ---- Carts ----

/** Fetch all carts (for dashboard stats) */
export async function getCarts(): Promise<CartsResponse> {
  return apiFetch<CartsResponse>("/carts?limit=0");
}

// ---- Utility ----

/** Build URL query string from params object */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildQuery(params?: any): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  if (entries.length === 0) return "";
  return "?" + entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&");
}
