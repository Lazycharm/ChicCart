# Deployment Checklist

## Pre-Deployment

- [x] All critical bugs fixed
- [x] Build command tested (`npm run build`)
- [x] Environment variables documented
- [x] Database schema ready
- [x] RLS policies configured
- [x] Netlify configuration created

## Git Setup (if not already done)

1. Initialize git repository (if needed):
```bash
git init
```

2. Add all files:
```bash
git add .
```

3. Create initial commit:
```bash
git commit -m "Initial commit: ChicCart e-commerce platform"
```

4. Add remote repository:
```bash
git remote add origin <your-repository-url>
```

5. Push to repository:
```bash
git branch -M main
git push -u origin main
```

## Netlify Setup

1. **Environment Variables** (Required in Netlify Dashboard):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. **Build Settings** (Auto-detected from netlify.toml):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

3. **Database Setup** (In Supabase):
   - Run `database/schema.sql`
   - Run `database/fix_orders_rls.sql`
   - (Optional) Run `database/seed.sql`

## Post-Deployment Testing

- [ ] Home page loads
- [ ] Products display correctly
- [ ] User signup works
- [ ] User login works
- [ ] Session persists on refresh
- [ ] Protected routes work (Orders, Admin)
- [ ] Cart functionality works
- [ ] Checkout process works
- [ ] Orders page shows user's orders
- [ ] Admin routes accessible (if admin user exists)

## Important Notes

- Never commit `.env` file
- Environment variables must be set in Netlify dashboard
- Database migrations must be run manually in Supabase
- All routes should work (SPA routing configured in netlify.toml)

