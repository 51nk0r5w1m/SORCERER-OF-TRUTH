---
description: Build Observable Framework dashboard, run static deck tests, and validate data contracts
---

# Build and Test Workflow

Follow these steps to build the UAP Pipeline Observatory dashboard, validate the `records.csv` data contract, and execute deck static unit tests.

// turbo
1. Run static unit tests to verify slide structure, unique IDs, and self-contained runtime compliance:
```powershell
wsl -e bash -c "cd /home/51nk0r5w1m/talks/defcon34 && npm run test:static"
```

// turbo
2. Build the Observable Framework control plane dashboard:
```powershell
wsl -e bash -c "cd /home/51nk0r5w1m/talks/defcon34/dashboard && npm run build"
```

3. Verify that the build output directory (`dashboard/dist`) contains:
   - `index.html` (Control Plane)
   - `spatial.html` (Spatial Observatory)
   - `registry.html` (Evidence Registry)
   - `methodology.html` (Methodology)
   - `_observablehq/` (bundled runtime assets and CSS)
