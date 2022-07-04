const API_KEY = "b5cda18b188720483a949320c2b578a1";
const BASE_PATH="https://api.themoviedb.org/3";

interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
}

interface ITv {
    backdrop_path: string,
    overview: string,
    id: number,
    popularity: number,
    poster_path: string,
    name: string
}

export interface IGetMoviesResult {
    dates: {
    maximum: string;
    minimum: string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export interface ITvOnTheAir {
    page: number,
    results: ITv[]
}

export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(response => response.json());
}

export function getTv() {
    return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(response => response.json());
}