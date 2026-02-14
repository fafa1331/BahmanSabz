const BASE_URL = 'https://api.rawg.io/api';

export const getGames = async (
  page = 1,
  pageSize = 12,
  genre?: string,
  rating?: number
) => {
  const params = new URLSearchParams({
    key: process.env.NEXT_PUBLIC_RAWG_API_KEY!,
    page: String(page),
    page_size: String(pageSize),
  });

  if (genre) params.append('genres', genre);
  if (rating) params.append('metacritic', String(rating));

  const res = await fetch(`${BASE_URL}/games?${params}`);

  if (!res.ok) throw new Error('Failed to fetch games');

  return res.json();
};

export const getGame = async (id: string) => {
  const res = await fetch(
    `${BASE_URL}/games/${id}?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`
  );

  if (!res.ok) throw new Error('Failed to fetch game');

  return res.json();
};
