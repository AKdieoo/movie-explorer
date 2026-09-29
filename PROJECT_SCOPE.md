# PROJECT_SCOPE.md (Phase 0 - Requirement Freeze)

Internal project-control document. Not a submission file.

## Task
Movie Explorer - React app consuming the TMDb API.

## BUILD
- React (Create React App), Axios, Material UI, React Router
- Context API for state (MovieContext, ThemeContext)
- TMDb API: trending, search, details, credits, videos
- LocalStorage: favorites, last search, theme, login session
- Login UI (local demo session), Home + Trending, Search with infinite scroll
- Movie details (genres, cast, trailer), Favorites page
- Dark/light mode, loading + error + empty states, responsive (mobile-first)
- Deployment (Vercel/Netlify), README, GitLab repo

## BUILD ONLY AFTER CORE WORKS (Bonus)
- Genre / year / rating filters
- Improved trailer experience
- "Load More" alternative

## DO NOT BUILD
- Backend, database, JWT, Redux, microservices, Docker, Kubernetes,
  AWS backend, AI/ML/LLM/RAG/agents, Redis, GraphQL, WebSockets

## Routes (final)
/login, / (home), /search, /movie/:id, /favorites

## TMDb endpoints
- GET /trending/movie/{time_window}
- GET /search/movie
- GET /movie/{id}
- GET /movie/{id}/credits
- GET /movie/{id}/videos
- GET /genre/movie/list (bonus)

## Phases
0 Scope | 1 Setup | 2 Skeleton | 3 TMDb API | 4 Trending | 5 Search + infinite scroll
6 Movie details | 7 Favorites | 8 Theme | 9 Login | 10 UX polish | 11 Bonus
12 Testing | 13 Deployment | 14 README
