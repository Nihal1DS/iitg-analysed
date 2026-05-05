# How to Open the Published Frontend

If your deployment succeeded but you still cannot see the UI, use this checklist.

## 1) Confirm where the site URL is

### Vercel
- Open your project in Vercel Dashboard.
- Go to **Deployments** and click the latest deployment.
- Open the generated domain (example: `https://iitg-analysed.vercel.app`).

### Netlify
- Open your site in Netlify Dashboard.
- Go to **Site overview** and open the site URL (example: `https://your-site-name.netlify.app`).

### GitHub Pages
- The URL is usually:
  - `https://<username>.github.io/<repository>/` for project pages
  - `https://<username>.github.io/` for user/org pages

## 2) Ensure publish settings point to frontend output

Use these settings for the default frontend (`world` mode):

- **Build command:** `npm run build`
- **Publish directory:** `dist`

This project's Vite config emits default frontend build artifacts into `dist`.

## 3) If hosting under a subpath, set base path

If your URL is not at domain root (for example `/IITG-analysed/` on GitHub Pages), set:

- `VITE_BASE_PATH=/IITG-analysed/`

Then redeploy.

## 4) Quick blank-page debug in browser

- Open browser dev tools → **Console**.
- If you see 404 errors for JS/CSS files, your publish directory or base path is incorrect.
- Fix publish directory to `dist` and/or set `VITE_BASE_PATH`, then redeploy.

## 5) Local preview of production build

```bash
npm install
npm run build
npm run preview
```

Open the shown URL (typically `http://localhost:4173`) to verify the built frontend before publishing.

## GitHub Pages: exact steps

1. In **GitHub → Settings → Pages** set:
   - **Source:** GitHub Actions
2. Push this repository with `.github/workflows/deploy-pages.yml` to `main`.
3. Wait for the workflow **Deploy to GitHub Pages** to pass.
4. Open your published URL:
   - `https://<username>.github.io/<repository>/`

For this repo name, your URL should look like:
- `https://<username>.github.io/IITG-analysed/`

If you still see a blank page, hard refresh (Ctrl/Cmd+Shift+R) and confirm workflow logs show `VITE_BASE_PATH=/<repository>/`.
