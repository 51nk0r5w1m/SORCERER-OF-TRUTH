---
description: Build and deploy presentation deck and Observable Framework dashboard to GitHub Pages
---

# Deploy to GitHub Pages Workflow

Follow these steps to deploy the presentation deck (`index.html`) and built Observable Framework dashboard (`dashboard/dist`) via GitHub Actions CI/CD pipeline.

// turbo
1. Ensure git status is clean and all modifications are committed:
```powershell
wsl -e bash -c "cd /home/51nk0r5w1m/talks/defcon34 && git status"
```

2. Inspect GitHub Pages workflow configuration at `.github/workflows/pages.yml`.

// turbo
3. Push changes to `main` branch to trigger automated GitHub Actions deployment:
```powershell
wsl -e bash -c "cd /home/51nk0r5w1m/talks/defcon34 && git push origin main"
```
