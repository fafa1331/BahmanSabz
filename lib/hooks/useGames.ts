/**
 * React Query hooks for RAWG Games API
 *
 * Uses @tanstack/react-query for caching, deduplication,
 * background refetching, and optimistic pagination.
 */
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getGames,
  getGameById,
  getGameScreenshots,
  getGenres,
  getPlatforms,
} from "@/lib/api/rawg";
import type {
  Game,
  GameDetail,
  Genre,
  Platform,
  Screenshot,
  RawgPaginatedResponse,
  GamesQueryParams,
} from "@/lib/types/rawg";

// ---- Query Keys (centralized for cache management) ----

export const gameKeys = {
  all: ["games"] as const,
  lists: () => [...gameKeys.all, "list"] as const,
  list: (params: GamesQueryParams) => [...gameKeys.lists(), params] as const,
  details: () => [...gameKeys.all, "detail"] as const,
  detail: (id: number | string) => [...gameKeys.details(), id] as const,
  screenshots: (id: number | string) => [...gameKeys.all, "screenshots", id] as const,
  genres: () => ["genres"] as const,
  platforms: () => ["platforms"] as const,
};

// ---- Hooks ----

/** Fetch paginated list of games with filters */
export function useGames(params: GamesQueryParams = {}) {
  return useQuery<RawgPaginatedResponse<Game>>({
    queryKey: gameKeys.list(params),
    queryFn: () => getGames(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/** Fetch a single game by ID */
export function useGameById(id: number | string) {
  return useQuery<GameDetail>({
    queryKey: gameKeys.detail(id),
    queryFn: () => getGameById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/** Fetch screenshots for a game */
export function useGameScreenshots(id: number | string) {
  return useQuery<RawgPaginatedResponse<Screenshot>>({
    queryKey: gameKeys.screenshots(id),
    queryFn: () => getGameScreenshots(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
}

/** Fetch all available genres */
export function useGenres() {
  return useQuery<RawgPaginatedResponse<Genre>>({
    queryKey: gameKeys.genres(),
    queryFn: () => getGenres(),
    staleTime: 1000 * 60 * 30, // 30 minutes (rarely changes)
  });
}

/** Fetch available platforms */
export function usePlatforms() {
  return useQuery<RawgPaginatedResponse<Platform>>({
    queryKey: gameKeys.platforms(),
    queryFn: () => getPlatforms(),
    staleTime: 1000 * 60 * 30,
  });
}
