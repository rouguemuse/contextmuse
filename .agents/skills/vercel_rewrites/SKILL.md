---
name: vercel_rewrites
description: Cheatsheet for adding and managing Vercel subpath rewrites in vercel.json to isolate proof pages.
---

# Vercel Rewrites Configuration Skill

Use this skill when the user wants to add, modify, or remove Vercel subpath rewrites in the root `vercel.json` file. This configuration maps clean subpaths on the main website (e.g. `/proofs/my-demo/`) to separate standalone projects hosted elsewhere, preserving the privacy boundaries of the main portfolio repository.

---

## 1. File Location
* **Path**: `/vercel.json` (relative to workspace root)

---

## 2. Configuration Structure
Always maintain the following structure inside `/vercel.json`. Ensure `"trailingSlash": true` is preserved at all times:

```json
{
  "trailingSlash": true,
  "rewrites": [
    {
      "source": "/proofs/my-demo-subpath/:path*",
      "destination": "https://my-demo-url.vercel.app/:path*"
    }
  ]
}
```

---

## 3. Workflow Steps for the Agent

When the user asks to add a new rewrite rule (e.g. *"Map /proofs/example to https://example-domain.vercel.app"*):

1. **Read the existing config**: Check if `/vercel.json` exists. If not, initialize it.
2. **Append the new rewrite**:
   * Ensure `rewrites` is defined as a JSON array.
   * Add the mapping mapping `{ "source": "/proofs/example/:path*", "destination": "https://example-domain.vercel.app/:path*" }`.
3. **Validate JSON Syntax**: Verify that the file remains valid JSON.
4. **Run Verification**:
   * Run `node scripts/verify_site.js` to ensure no syntax errors were introduced and that all page link checks still pass.
5. **Confirm and Report**: Output the updated `vercel.json` structure to the user.
