/**
 * useProducts Hook
 * Fetches paginated products from DummyJSON using React Query.
 */
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getProducts } from "@/lib/api/dummyjson";
import type { ProductsResponse } from "@/lib/types/dummyjson";

export const useProducts = (page: number, limit = 12) => {
  return useQuery<ProductsResponse>({
    queryKey: ["products", page, limit],
    queryFn: () => getProducts({ limit, skip: page * limit }),
    placeholderData: keepPreviousData,
  });
};
