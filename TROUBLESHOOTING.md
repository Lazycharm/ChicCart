# Troubleshooting Guide

## Current Issues: 500 Internal Server Errors

The 500 errors indicate Vite cannot resolve imports. Here's what to check:

### 1. Verify File Structure
```
ChicCart/
├── Components/          ✅ (root level)
├── src/
│   ├── Pages/          ✅
│   ├── services/       ✅ (.ts files)
│   ├── lib/            ✅ (.ts files)
│   └── Layouts.jsx     ✅
└── utils.js            ✅ (root level)
```

### 2. Import Path Resolution

**Current Alias Setup:**
- `@` → root directory (`./`)
- So `@/services/products` → `./services/products` ❌ (doesn't exist)
- Should be: `@/src/services/products` or fix alias

### 3. Fix Options

**Option A: Update all imports to use full paths**
Change `@/services/products` → `@/src/services/products` in all files

**Option B: Fix alias to point services correctly**
Update vite.config.js alias for `@/services` → `./src/services`

### 4. Restart Dev Server
After any config changes:
1. Stop dev server (Ctrl+C)
2. Delete `.vite` cache folder (if exists)
3. Restart: `npm run dev`

### 5. Check Browser Console
Look for specific import errors - they'll tell you exactly which file can't be resolved.

### 6. Verify Environment Variables
Make sure `.env.local` is loaded:
- File exists in root
- Variables start with `VITE_`
- No spaces around `=`
- Restart dev server after changes

### 7. Database Connection
If Supabase errors appear:
- Verify credentials in `.env.local`
- Check Supabase dashboard for project status
- Ensure tables are created (run schema.sql)

