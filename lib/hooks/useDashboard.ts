/**
 * React Query hooks for Dashboard statistics
 *
 * Aggregates data from DummyJSON for the dashboard overview.
 */
import { useQuery } from "@tanstack/react-query";
import { getUsers, getProducts, getCarts } from "@/lib/api/dummyjson";
import type { UsersResponse, ProductsResponse, CartsResponse } from "@/lib/types/dummyjson";

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalCarts: number;
  totalRevenue: number;
}

/** Fetch dashboard summary statistics */
export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const [usersData, productsData, cartsData] = await Promise.all([
        getUsers({ limit: 0 }),
        getProducts({ limit: 0 }),
        getCarts(),
      ]);

      const totalRevenue = cartsData.carts.reduce(
        (sum, cart) => sum + cart.discountedTotal,
        0
      );

      return {
        totalUsers: usersData.total,
        totalProducts: productsData.total,
        totalCarts: cartsData.total,
        totalRevenue,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
}

/** Fetch recent users for dashboard */
export function useRecentUsers(limit = 5) {
  return useQuery<UsersResponse>({
    queryKey: ["dashboard", "recentUsers", limit],
    queryFn: () => getUsers({ limit }),
    staleTime: 1000 * 60 * 5,
  });
}

/** Fetch recent products for dashboard */
export function useRecentProducts(limit = 5) {
  return useQuery<ProductsResponse>({
    queryKey: ["dashboard", "recentProducts", limit],
    queryFn: () => getProducts({ limit }),
    staleTime: 1000 * 60 * 5,
  });
}
