# Netlify Deployment Guide

## Prerequisites
- Netlify account
- Supabase project set up
- Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Environment Variables

In your Netlify dashboard:
1. Go to Site settings → Environment variables
2. Add the following variables:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Step 2: Build Settings

Netlify will automatically detect:
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18

These are configured in `netlify.toml`.

## Step 3: Database Setup

Before deploying, make sure to:
1. Run `database/schema.sql` in your Supabase SQL Editor
2. Run `database/fix_orders_rls.sql` to fix RLS policies
3. (Optional) Run `database/seed.sql` for sample data

## Step 4: Deploy

### Option A: Connect via Git (Recommended)
1. Push your code to GitHub/GitLab/Bitbucket
2. In Netlify, click "New site from Git"
3. Connect your repository
4. Netlify will auto-detect settings from `netlify.toml`
5. Add environment variables in Netlify dashboard
6. Deploy!

### Option B: Deploy via Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

## Step 5: Post-Deployment

1. Verify your site is accessible
2. Test authentication (signup/login)
3. Test protected routes
4. Verify Supabase connection

## Troubleshooting

### Build Fails
- Check Node version (should be 18+)
- Verify all dependencies are in package.json
- Check build logs in Netlify dashboard

### Environment Variables Not Working
- Ensure variables start with `VITE_` prefix
- Redeploy after adding variables
- Check variable names match exactly

### Routing Issues
- The `netlify.toml` includes a redirect rule for SPA routing
- All routes redirect to `/index.html` with 200 status

## Important Notes

- Never commit `.env` file to git
- Use `.env.example` as a template
- Environment variables must be set in Netlify dashboard
- Database migrations must be run manually in Supabase

