// =============================================
// RAWG API Client
// Docs: https://api.rawg.io/docs
// =============================================

import type {
  RawgPaginatedResponse,
  Game,
  GameDetail,
  Genre,
  Platform,
  Screenshot,
  GamesQueryParams,
} from "@/lib/types/rawg";

const BASE_URL = "https://api.rawg.io/api";

/** Get the RAWG API key from env */
function getApiKey(): string {
  const key = process.env.NEXT_PUBLIC_RAWG_API_KEY;
  if (!key) {
    console.warn("RAWG API key not set. Set NEXT_PUBLIC_RAWG_API_KEY in .env.local");
    return "";
  }
  return key;
}

// ---- Helper ----

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function rawgFetch<T>(endpoint: string, params?: any): Promise<T> {
  const apiKey = getApiKey();
  const allParams: Record<string, string> = { key: apiKey };

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        allParams[k] = String(v);
      }
    });
  }

  const queryString = new URLSearchParams(allParams).toString();
  const url = `${BASE_URL}${endpoint}?${queryString}`;

  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `RAWG API Error: ${res.status}`);
  }

  return res.json();
}

// ---- Games ----

/** Fetch a paginated list of games with optional filters */
export async function getGames(
  params?: GamesQueryParams
): Promise<RawgPaginatedResponse<Game>> {
  return rawgFetch<RawgPaginatedResponse<Game>>("/games", params);
}

/** Get a single game by ID or slug */
export async function getGameById(id: number | string): Promise<GameDetail> {
  return rawgFetch<GameDetail>(`/games/${id}`);
}

/** Get screenshots for a game */
export async function getGameScreenshots(
  id: number | string
): Promise<RawgPaginatedResponse<Screenshot>> {
  return rawgFetch<RawgPaginatedResponse<Screenshot>>(`/games/${id}/screenshots`);
}

// ---- Genres ----

/** Fetch all available genres */
export async function getGenres(): Promise<RawgPaginatedResponse<Genre>> {
  return rawgFetch<RawgPaginatedResponse<Genre>>("/genres", { page_size: 40 });
}

// ---- Platforms ----

/** Fetch all available platforms */
export async function getPlatforms(): Promise<RawgPaginatedResponse<Platform>> {
  return rawgFetch<RawgPaginatedResponse<Platform>>("/platforms", { page_size: 50 });
}
