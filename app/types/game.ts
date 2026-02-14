export interface Game {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  released: string;
}

export interface GamesResponse {
  results: Game[];
  count: number;
}

