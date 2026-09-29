# Movie Explorer

Discover your favorite films. A React web app that searches movies, shows trending titles and full movie details, and saves favorites, using live data from the TMDb API.

**Live demo:** _https://movie-explorer-lemon-psi.vercel.app_
**Repository:** _https://github.com/AKdieoo/movie-explorer_
**Demo login:** username `demo`, password `movie123`

## Screenshots
_Add screenshots here (login, home, search, details, favorites, dark mode, mobile)._

## Features
**Required**
- Login page (username + password, local demo session) with protected pages and logout
- Search bar with results grid: poster, title, release year and rating
- Infinite scrolling for search results
- Trending movies section (Today / This Week)
- Movie details page: overview, genres, rating, runtime, cast and trailer
- Light / dark mode
- Friendly error messages, loading skeletons and empty states
- State managed with the React Context API
- Last search saved in localStorage (restored on the next visit)
- Favorites list saved in localStorage
- Mobile-first responsive layout, React Router navigation (Home, Movie Details, Favorites)

**Bonus**
- Filter by genre, year and minimum rating (Search page and Home trending)
- Trailer plays in a YouTube pop-up (video comes from TMDb's video list)
- "Load more results" button when filters need more pages checked

**Extras**
- Page not found page, offline warning banner, page titles, keyboard-friendly (skip link, focus outlines), reduced-motion support, TMDb attribution footer

## Tech stack
React 18 (Create React App), Material UI 5, React Router 6, Axios, Context API, TMDb API, browser localStorage.

## Getting started
```bash
npm install
cp .env.example .env     # then paste your TMDb key into .env
npm start                # http://localhost:3000
```
Other commands: `npm run build` (production build).

### TMDb API setup
1. Create a free account at https://www.themoviedb.org and request an API key (Settings > API).
2. Put the key in `.env` as `REACT_APP_TMDB_API_KEY`. A v3 API key or a v4 "Read Access Token" both work.
3. Restart `npm start` (Create React App reads `.env` only at startup).

### Environment variables
| Variable | Purpose |
|----------|---------|
| REACT_APP_TMDB_API_KEY | Your TMDb key (never commit it; `.env` is in `.gitignore`) |
| REACT_APP_TMDB_BASE_URL | `https://api.themoviedb.org/3` |
| REACT_APP_TMDB_IMAGE_BASE_URL | `https://image.tmdb.org/t/p` |

## Routes
| Path | Page | Needs login |
|------|------|-------------|
| /login | Login | No |
| / | Home: search box, trending, filters | Yes |
| /search | Search results, filters, infinite scroll | Yes |
| /movie/:id | Movie details | Yes |
| /favorites | Saved favorites | Yes |
| * | Page not found | Yes |

## API usage
All requests go through one Axios instance (`src/services/apiConfig.js`) and are wrapped in `src/services/tmdbApi.js`, so components never call Axios directly. Errors are converted into friendly messages in one place.

| Feature | TMDb endpoint |
|---------|---------------|
| Trending | `GET /trending/movie/{time_window}` (day or week) |
| Search | `GET /search/movie` (optional `primary_release_year`) |
| Browse by filters | `GET /discover/movie` (`with_genres`, `primary_release_year`, `vote_average.gte`) |
| Details | `GET /movie/{id}` |
| Cast | `GET /movie/{id}/credits` |
| Trailer | `GET /movie/{id}/videos` |
| Genre list | `GET /genre/movie/list` |

## State management
Three React contexts (in `src/context/`), each with a small hook:
- **MovieContext** (`useMovies`): trending, search (pages, loading, errors), filters, genres, favorites
- **ThemeContext** (`useThemeMode`): light / dark mode and the Material UI theme
- **AuthContext** (`useAuth`): demo login session

## Local storage
| Key | Content |
|-----|---------|
| movieExplorer.lastSearch | Last searched title |
| movieExplorer.favorites | Saved favorites (id, title, poster, date, rating) |
| movieExplorer.theme | `light` or `dark` |
| movieExplorer.session | Signed-in demo user |

All reads and writes are wrapped in try/catch (`src/utils/localStorage.js`), so blocked or corrupted storage never crashes the app.

## Error handling
- Every request has a 10 second timeout and turns failures (no internet, bad key, rate limit, server error, not found) into readable messages with a "Try again" button
- Empty results, missing posters / cast / trailers and unknown movies each have their own fallback
- A banner appears when the device goes offline

## Responsive design
Mobile-first with Material UI breakpoints. The poster grid uses 2 columns on phones, 3-4 on tablets and 5-6 on desktops. The navbar shows icons only on phones.

## Project structure
```
src/
  App.css
  App.js
  index.css
  index.js
  assets/
    icons/
    images/
  components/
    CastList/  CastList.jsx
    EmptyState/  EmptyState.jsx
    ErrorMessage/  ErrorMessage.jsx
    FavoriteButton/  FavoriteButton.jsx
    FilterBar/  FilterBar.jsx
    Footer/  Footer.jsx
    Loading/  Loading.jsx
    MovieCard/  MovieCard.jsx
    MovieDetails/  MovieDetails.jsx, MovieDetailsSkeleton.jsx
    MovieGrid/  MovieGrid.jsx
    Navbar/  Navbar.jsx
    OfflineBanner/  OfflineBanner.jsx
    ProtectedRoute/  ProtectedRoute.jsx
    ScrollToTop/  ScrollToTop.jsx
    SearchBar/  SearchBar.jsx
    ThemeToggle/  ThemeToggle.jsx
    TrailerDialog/  TrailerDialog.jsx
    TrendingSection/  TrendingSection.jsx
  context/  AuthContext.jsx, MovieContext.jsx, ThemeContext.jsx
  hooks/  useAuth.js, useInfiniteScroll.js, useMovieDetails.js, useMovies.js, useOnlineStatus.js, usePageTitle.js, useThemeMode.js
  pages/
    Favorites/  Favorites.jsx
    Home/  Home.jsx
    Login/  Login.jsx
    MovieDetails/  MovieDetailsPage.jsx
    NotFound/  NotFound.jsx
    Search/  Search.jsx
  routes/  AppRoutes.jsx
  services/  apiConfig.js, tmdbApi.js
  theme/  theme.js
  utils/  constants.js, filterHelpers.js, localStorage.js, movieHelpers.js
```

## Deployment
Deployed on Vercel (or Netlify) from the GitLab repository. Step by step guide: `docs/DEPLOYMENT.md`. Manual test checklist: `docs/TESTING.md`.

## Notes
- Login is a front-end demo only (there is no backend), so it is not real security.
- Genre and rating cannot be sent to TMDb together with a title search, so they are applied to the loaded results in the browser.
- This product uses the TMDb API but is not endorsed or certified by TMDb.

