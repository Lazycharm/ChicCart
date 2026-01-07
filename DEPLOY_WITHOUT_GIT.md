# Deploy to Netlify Without Git

## Method 1: Netlify Drag & Drop (Easiest)

1. **Build your project** (already done - `dist` folder exists)
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag and drop the `dist` folder onto the page
4. Your site will be deployed instantly!

**Note:** This creates a temporary site. For permanent deployment with auto-updates, use Git.

## Method 2: Netlify CLI (No Git Required)

1. **Install Netlify CLI:**
```powershell
npm install -g netlify-cli
```

2. **Login to Netlify:**
```powershell
netlify login
```

3. **Deploy:**
```powershell
# Make sure dist folder exists (already built)
netlify deploy --prod --dir=dist
```

4. **Set Environment Variables:**
   - Go to Netlify dashboard
   - Site settings → Environment variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

## Method 3: Install Git (Best for Long-term)

1. Download Git: https://git-scm.com/download/win
2. During installation, check "Add Git to PATH"
3. Restart PowerShell
4. Then follow `GIT_SETUP.md` instructions

## After Deployment

1. **Set up database in Supabase:**
   - Run `database/schema.sql`
   - Run `database/fix_orders_rls.sql`

2. **Add environment variables in Netlify:**
   - Site settings → Environment variables
   - Add your Supabase credentials

3. **Test your site:**
   - Signup/Login
   - Protected routes
   - Cart and checkout

