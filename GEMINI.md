# Constraint: Workspace Sandboxing Rules

## 1. Read-Only Directories & Files
The following directories and files are strictly read-only. You (the AI coding assistant) must NOT modify, rename, move, write to, or delete any files or folders inside these paths:

### Sub-Projects & Micro-Apps
- `/gensort/` and `/cxm_gensort/` (GenSort landing page and compiled React app)
- `/twenty-minute-override/` (React utility tool)
- `/dealsignal/` (Vite/React workspace)
- `/tiktok-shop-roi-analyzer/` (ROI calculator tool)
- `/star-gift/` (Interactive visual tool)
- `/istar-map/` (Custom interactive mapping canvas)
- `/inncontrol-v2/` (Intake system version 2)
- `/sixes-and-sevens/` (Venue event codebase)
- `/southern_smoke/` (Hospitality concept layout)

### Visual Assets & Media
- `/assets/images/` (Curated screenshots, mockups, and generated site artwork)
- `/assets/fonts/` (Brand fonts and configurations)

## 2. Rationale
These directories contain compiled build bundles, stable independent applications, or curated media assets. They must remain exactly as-is to preserve live service operations and visual fidelity.

## 3. Exceptions
You are permitted to read files inside these directories if requested by the user for context, but writing changes or creating new files within these paths is strictly prohibited.
