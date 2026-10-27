# Poster Searcher

Search and download posters, backdrops and logos of movies, TV shows and anime (data from [TMDB](https://www.themoviedb.org)).

## Features

- Trending, popular, top rated, upcoming and anime rows on the home page
- Search across movies, TV shows and people; Discover with genre / sort / anime filters
- Details: posters, backgrounds, logos, season posters, trailers, cast, collection, recommendations
- Image language filter and "highest quality" sort
- Select several images (checkbox, "Select all", Shift+click for a range) and download them as one ZIP
- Saved list and recently viewed (stored in the browser), share button, `/` to focus search

## Setup

```bash
yarn
cp .env.example .env.local   # or create it by hand, see below
yarn dev                      # http://localhost:4000
```

`.env.local`:

```
VITE_APP_BASE_API_URL=https://api.themoviedb.org/3
VITE_APP_BASE_API_TOKEN=<TMDB API Read Access Token>
```

## Downloads

`image.tmdb.org` sends `Access-Control-Allow-Origin: *`, so images are fetched directly from the browser — no paid CORS proxy is needed. If a direct fetch fails, the app falls back to `/tmdb-image/*`, a same-origin rewrite (`vercel.json` in production, Vite proxy in development).
