---
description: Export 3D deck and dashboard to static standalone offline artifacts for presentation delivery
---

# Export Presentation Workflow

Follow these steps to build standalone offline assets for stage presentation at DEF CON 34.

// turbo
1. Build the production deck bundle:
```powershell
wsl -e bash -c "cd /home/51nk0r5w1m/talks/defcon34 && npm run build"
```

// turbo
2. Build the Observable Framework dashboard into `/dist`:
```powershell
wsl -e bash -c "cd /home/51nk0r5w1m/talks/defcon34/dashboard && npm run build"
```

3. Launch local presentation server for offline playback:
```powershell
wsl -e bash -c "cd /home/51nk0r5w1m/talks/defcon34 && npm start"
```
