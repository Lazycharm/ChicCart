# Quick Deployment Guide

## ✅ Project is Ready for Deployment!

All necessary files have been created:
- ✅ `netlify.toml` - Netlify configuration
- ✅ `.gitignore` - Updated with proper exclusions
- ✅ `.env.example` - Environment variable template
- ✅ Build tested and working

## 🚀 Quick Start

### Step 1: Set Up Git (if not done)

**Option A: Use the batch script**
```bash
# Run this in PowerShell or Command Prompt
.\setup-git.bat
```

**Option B: Manual setup**
```bash
git init
git add .
git commit -m "Initial commit: ChicCart e-commerce platform"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### Step 2: Connect to Netlify

1. Go to [Netlify](https://app.netlify.com)
2. Click "New site from Git"
3. Connect your repository
4. Netlify will auto-detect settings from `netlify.toml`

### Step 3: Add Environment Variables

In Netlify Dashboard → Site settings → Environment variables:

```
VITE_SUPABASE_URL = your_supabase_url
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
```

### Step 4: Deploy!

Click "Deploy site" - Netlify will:
1. Install dependencies
2. Run `npm run build`
3. Deploy to production

### Step 5: Set Up Database

In Supabase SQL Editor, run:
1. `database/schema.sql`
2. `database/fix_orders_rls.sql` (IMPORTANT!)

## 📝 Important Notes

- **Never commit `.env` file** - it's in `.gitignore`
- **Environment variables** must be set in Netlify dashboard
- **Database setup** must be done manually in Supabase
- **SPA routing** is configured in `netlify.toml` (all routes → index.html)

## 🔍 Verify Deployment

After deployment, test:
- [ ] Home page loads
- [ ] Signup works
- [ ] Login works  
- [ ] Protected routes work
- [ ] Cart and checkout work

## 📚 Full Documentation

- `NETLIFY_DEPLOYMENT.md` - Detailed deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Complete checklist
- `GIT_SETUP.md` - Git setup instructions

