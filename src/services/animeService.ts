import { Anime } from '../types';

const BASE_URL = 'https://api.jikan.moe/v4';

export const animeService = {
  getTopAnime: async (page = 1): Promise<Anime[]> => {
    const res = await fetch(`${BASE_URL}/top/anime?page=${page}&limit=20`);
    const data = await res.json();
    return data.data;
  },
  
  getSeasonalAnime: async (page = 1): Promise<Anime[]> => {
    const res = await fetch(`${BASE_URL}/seasons/now?page=${page}&limit=20`);
    const data = await res.json();
    return data.data;
  },
  
  searchAnime: async (query: string, page = 1): Promise<Anime[]> => {
    const res = await fetch(`${BASE_URL}/anime?q=${query}&page=${page}&limit=20`);
    const data = await res.json();
    return data.data;
  },
  
  getAnimeById: async (id: number): Promise<Anime> => {
    const res = await fetch(`${BASE_URL}/anime/${id}/full`);
    const data = await res.json();
    return data.data;
  }
};
