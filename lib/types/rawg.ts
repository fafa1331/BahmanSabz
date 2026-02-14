// =============================================
// RAWG API Type Definitions
// API Docs: https://api.rawg.io/docs
// =============================================

/** Generic paginated response from RAWG */
export interface RawgPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ---- Game Types ----

export interface Game {
  id: number;
  slug: string;
  name: string;
  released: string;
  tba: boolean;
  background_image: string | null;
  rating: number;
  rating_top: number;
  ratings: Rating[];
  ratings_count: number;
  reviews_text_count: number;
  added: number;
  metacritic: number | null;
  playtime: number;
  suggestions_count: number;
  updated: string;
  esrb_rating: EsrbRating | null;
  platforms: PlatformEntry[];
  genres: Genre[];
  stores: StoreEntry[];
  tags: Tag[];
  short_screenshots: Screenshot[];
}

export interface GameDetail extends Game {
  name_original: string;
  description: string;
  description_raw: string;
  metacritic_platforms: MetacriticPlatform[];
  background_image_additional: string | null;
  website: string;
  reactions: Record<string, number>;
  screenshots_count: number;
  movies_count: number;
  creators_count: number;
  achievements_count: number;
  parent_achievements_count: number;
  reddit_url: string;
  reddit_name: string;
  reddit_description: string;
  reddit_logo: string;
  reddit_count: number;
  twitch_count: number;
  youtube_count: number;
  reviews_count: number;
  alternative_names: string[];
  metacritic_url: string;
  parents_count: number;
  additions_count: number;
  game_series_count: number;
  developers: Developer[];
  publishers: Publisher[];
  clip: null;
}

export interface Rating {
  id: number;
  title: string;
  count: number;
  percent: number;
}

export interface EsrbRating {
  id: number;
  name: string;
  slug: string;
}

export interface PlatformEntry {
  platform: Platform;
  released_at: string | null;
  requirements: {
    minimum?: string;
    recommended?: string;
  } | null;
}

export interface Platform {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  year_end: number | null;
  year_start: number | null;
  games_count: number;
  image_background: string;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  language: string;
  games_count: number;
  image_background: string;
}

export interface StoreEntry {
  id: number;
  store: Store;
}

export interface Store {
  id: number;
  name: string;
  slug: string;
  domain: string;
  games_count: number;
  image_background: string;
}

export interface Screenshot {
  id: number;
  image: string;
}

export interface Developer {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string;
}

export interface Publisher {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string;
}

export interface MetacriticPlatform {
  metascore: number;
  url: string;
  platform: {
    platform: number;
    name: string;
    slug: string;
  };
}

// ---- Query Params ----

export interface GamesQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  search_precise?: boolean;
  search_exact?: boolean;
  parent_platforms?: string;
  platforms?: string;
  stores?: string;
  developers?: string;
  publishers?: string;
  genres?: string;
  tags?: string;
  creators?: string;
  dates?: string;
  updated?: string;
  platforms_count?: number;
  metacritic?: string;
  exclude_collection?: number;
  exclude_additions?: boolean;
  exclude_parents?: boolean;
  exclude_game_series?: boolean;
  ordering?: string;
}
