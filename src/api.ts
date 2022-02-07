const API_KEY = "0464036979fa3be658654f0ec0c7d2e3";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IContent {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title?: string;
  name?: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  first_air_date?: string;
  release_date?: string;
  original_language: string;
}

export interface IGenre {
  id: number;
  name: string;
}

export interface ICreate {
  name: string;
}

export interface ICompany {
  name: string;
}

export interface IGetDetailResult {
  created_by?: ICreate[];
  genres: IGenre[];
  production_companies: ICompany[];
}

export interface IGetContentsResult {
  page: number;
  results: IContent[];
  total_pages: number;
  total_results: number;
}

export function getResults(contentType: string, itemType: string) {
  return fetch(
    `${BASE_PATH}/${contentType}/${itemType}?api_key=${API_KEY}`
  ).then((response) => response.json());
}

export function getSearch(contentType: string, keyword: string) {
  return fetch(
    `${BASE_PATH}/search/${contentType}?api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json());
}

export function getLatest(contentType: string) {
  return fetch(`${BASE_PATH}/${contentType}/latest?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getDetailResults(contentType: string, contentId: number) {
  return fetch(
    `${BASE_PATH}/${contentType}/${contentId}?api_key=${API_KEY}`
  ).then((response) => response.json());
}
