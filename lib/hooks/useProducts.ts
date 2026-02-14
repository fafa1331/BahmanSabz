/**
 * React Query hooks for DummyJSON Products API
 *
 * Uses @tanstack/react-query for efficient data fetching,
 * caching, and optimistic pagination.
 */
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getProducts,
  searchProducts,
  getProductById,
  getCategories,
  getProductsByCategory,
} from "@/lib/api/dummyjson";
import type {
  ProductsResponse,
  Product,
  ProductCategory,
  ProductQueryParams,
} from "@/lib/types/dummyjson";

// ---- Query Keys ----

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params: ProductQueryParams & { search?: string; category?: string }) =>
    [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  categories: () => [...productKeys.all, "categories"] as const,
};

// ---- Hooks ----

/** Fetch paginated list of products with filters, search, and category */
export function useProductsList(params: {
  page: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}) {
  const { page, limit = 12, search, category, sortBy, order } = params;
  const skip = page * limit;

  return useQuery<ProductsResponse>({
    queryKey: productKeys.list({ search, category, limit, skip, sortBy, order }),
    queryFn: () => {
      if (search) {
        return searchProducts(search, { limit, skip, sortBy, order });
      }
      if (category) {
        return getProductsByCategory(category, { limit, skip, sortBy, order });
      }
      return getProducts({ limit, skip, sortBy, order });
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
}

/** Fetch a single product by ID */
export function useProductById(id: number) {
  return useQuery<Product>({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: !isNaN(id) && id > 0,
    staleTime: 1000 * 60 * 10,
  });
}

/** Fetch all product categories */
export function useCategories() {
  return useQuery<ProductCategory[]>({
    queryKey: productKeys.categories(),
    queryFn: () => getCategories(),
    staleTime: 1000 * 60 * 30, // categories rarely change
  });
}
