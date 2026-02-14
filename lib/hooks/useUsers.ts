/**
 * React Query hooks for DummyJSON Users API
 *
 * Uses @tanstack/react-query for efficient data fetching
 * with caching and pagination support.
 */
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getUsers, searchUsers, getUserById } from "@/lib/api/dummyjson";
import type { UsersResponse, User, PaginationParams } from "@/lib/types/dummyjson";

// ---- Query Keys ----

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: { search?: string } & PaginationParams) =>
    [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

// ---- Hooks ----

/** Fetch paginated list of users with optional search */
export function useUsers(params: {
  page: number;
  limit?: number;
  search?: string;
}) {
  const { page, limit = 12, search } = params;
  const skip = page * limit;

  return useQuery<UsersResponse>({
    queryKey: userKeys.list({ search, limit, skip }),
    queryFn: () =>
      search
        ? searchUsers(search, { limit, skip })
        : getUsers({ limit, skip }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });
}

/** Fetch a single user by ID */
export function useUserById(id: number) {
  return useQuery<User>({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: !isNaN(id) && id > 0,
    staleTime: 1000 * 60 * 10,
  });
}
