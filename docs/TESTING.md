# Manual test checklist

Run through this on `npm start` before deploying, then again on the live link.
Demo login: `demo` / `movie123`.

## Login
- [ ] Open the site signed out -> redirected to /login
- [ ] Wrong password -> red "Incorrect username or password."
- [ ] Empty form -> "Please enter your username and password."
- [ ] "Use demo account" + Login -> Home
- [ ] Refresh -> still signed in
- [ ] Open /favorites signed out, log in -> lands on /favorites
- [ ] Logout -> back on /login, Back button cannot open protected pages

## Home and trending
- [ ] Trending grid loads (skeletons first)
- [ ] Today / This Week toggle changes the list
- [ ] Each card shows poster, title, year, rating
- [ ] Genre / year / rating filters narrow the trending list, Clear filters resets

## Search
- [ ] Search "Avengers", "Batman", "Inception" -> results appear
- [ ] Search "xyzabc123" -> "No movies found" message
- [ ] Scroll to the bottom -> more results load, no duplicates
- [ ] Reach the end -> "You have reached the end of the results."
- [ ] Refresh the app -> Search page restores the last search
- [ ] Empty box + Genre "Horror" -> browse mode list
- [ ] Title + genre / rating -> list narrows, "Load more results" appears when needed

## Movie details
- [ ] Poster, backdrop, title, rating, runtime, genres, overview
- [ ] Cast row scrolls sideways
- [ ] Watch Trailer opens a video, closing stops it
- [ ] /movie/0 -> "Movie details could not be found"
- [ ] Refresh a details page -> it loads again
- [ ] Back button returns to the previous list

## Favorites
- [ ] Heart on a card -> turns red, navbar badge updates, details page does not open
- [ ] Favorites page lists it, refresh keeps it
- [ ] Remove -> gone, refresh keeps it gone
- [ ] "Add to Favorites" on the details page works
- [ ] Clear all asks for confirmation

## Theme
- [ ] Toggle dark / light, refresh keeps the choice
- [ ] All pages readable in both modes

## Errors
- [ ] Dev tools -> Network -> Offline: yellow banner, friendly error + "Try again"
- [ ] Back online: Try again works
- [ ] Unknown URL (/abc) -> "Page not found"

## Responsive
- [ ] Phone width (about 375px): 2 columns, navbar icons only, no sideways scroll
- [ ] Tablet width (about 768px): 3-4 columns
- [ ] Desktop: 5-6 columns

## Accessibility
- [ ] Tab key reaches every button and link with a visible outline
- [ ] "Skip to main content" appears on first Tab press

## Production build (before every deploy)
- [ ] `CI=true npm run build` finishes with no errors or warnings
