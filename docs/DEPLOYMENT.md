# Deployment guide (GitLab + Vercel)

## 1. Check the production build locally
```bash
# macOS / Linux / Git Bash
CI=true npm run build

# Windows PowerShell
$env:CI="true"; npm run build
```
It must finish without errors. Fix anything it reports before continuing.

## 2. Push to GitLab
1. On gitlab.com: **New project -> Create blank project**, name it `movie-explorer`, keep it empty (no README).
2. In the project folder:
```bash
git init                      # skip if the folder is already a Git repository
git add .
git commit -m "Prepare production deployment"
git branch -M main
git remote add origin https://gitlab.com/<your-username>/movie-explorer.git
git push -u origin main
```
3. Check on GitLab that `.env` is NOT in the repository (it is in `.gitignore`).

## 3. Deploy on Vercel
1. Go to vercel.com and sign up / log in **with GitLab**.
2. **Add New -> Project**, pick the `movie-explorer` repository.
3. Framework preset: **Create React App** (auto-detected). Build command `npm run build`, output `build`.
4. Open **Environment Variables** and add:

| Name | Value |
|------|-------|
| REACT_APP_TMDB_API_KEY | your TMDb key |
| REACT_APP_TMDB_BASE_URL | https://api.themoviedb.org/3 |
| REACT_APP_TMDB_IMAGE_BASE_URL | https://image.tmdb.org/t/p |

5. Click **Deploy**. Every later `git push` redeploys automatically.
6. If the build fails only because of ESLint warnings, add the variable `CI` = `false` and redeploy (better: fix the warning).

## 4. Netlify instead (optional)
Import the same repository. `netlify.toml` already sets the build, the SPA redirect and Node 20. Add the same three environment variables under **Site configuration -> Environment variables**.

## 5. Test the live site
Run `docs/TESTING.md` on the live link. Pay special attention to:
- Refreshing on `/favorites` and `/movie/27205` (needs the redirect rule in `vercel.json` / `netlify.toml`)
- Movies actually loading (if not: environment variables missing, then redeploy)

## 6. Finish
Put the live link and GitLab link into `README.md` (Live Demo and Repository sections), commit and push.

## Note on the API key
Create React App puts `REACT_APP_*` values into the browser bundle, so the TMDb key is visible to anyone who inspects the site. This is normal for a frontend-only project and TMDb keys are free, but never reuse a key for anything sensitive.
