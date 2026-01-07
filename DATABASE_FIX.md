# Fixing Supabase 500 Errors

## Problem
You're seeing 500 errors when trying to fetch data from Supabase:
- `GET /rest/v1/categories?select=*&order=display_order.asc 500`
- `GET /rest/v1/products?select=*&order=created_at.desc&limit=50 500`
- `GET /rest/v1/banners?select=*&is_active=eq.true&position=eq.hero&order=display_order.asc 500`

## Solution Steps

### Step 1: Verify Tables Exist

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to **Table Editor** (left sidebar)
4. Check if these tables exist:
   - `categories`
   - `products`
   - `banners`
   - `orders`
   - `reviews`
   - `coupons`
   - `user_profiles`

**If tables don't exist**, proceed to Step 2.

### Step 2: Run the Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Open `database/schema.sql` from this project
3. Copy the **ENTIRE** file contents
4. Paste into SQL Editor
5. Click **Run** (or press Ctrl+Enter)
6. Wait for "Success. No rows returned" message

### Step 3: Verify RLS Policies

1. In Supabase Dashboard, go to **Authentication** → **Policies**
2. Or check in **Table Editor** → Select a table → **RLS** tab
3. Verify these policies exist for each table:

**For `categories` table:**
- Policy: "Public can view categories" (SELECT, USING: true)

**For `products` table:**
- Policy: "Public can view products" (SELECT, USING: true)

**For `banners` table:**
- Policy: "Public can view active banners" (SELECT, USING: is_active = true)

**For `coupons` table:**
- Policy: "Public can view active coupons" (SELECT, USING: is_active = true)

**For `reviews` table:**
- Policy: "Public can view reviews" (SELECT, USING: true)

### Step 4: Add Sample Data (Optional but Recommended)

1. In SQL Editor, open `database/seed.sql`
2. Copy and paste entire contents
3. Click **Run**
4. This will add sample categories, products, and banners

### Step 5: Test the Connection

1. Refresh your browser (hard refresh: Ctrl+Shift+R)
2. Check browser console for errors
3. If still getting 500 errors, check the Network tab:
   - Click on the failed request
   - Look at the Response tab for the actual error message

### Step 6: Common Issues

#### Issue: "relation does not exist"
**Solution:** Tables weren't created. Re-run `schema.sql` completely.

#### Issue: "permission denied"
**Solution:** RLS policies aren't set up. Re-run the RLS sections of `schema.sql`.

#### Issue: "column does not exist"
**Solution:** Table structure doesn't match. Drop tables and re-run `schema.sql`:
```sql
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS banners CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
```
Then re-run `schema.sql`.

#### Issue: Still getting 500 after all steps
**Solution:** Check Supabase project status:
1. Go to Settings → General
2. Verify project is active
3. Check API URL matches your `.env.local` file
4. Verify API keys are correct

### Quick Test Query

Run this in SQL Editor to test:
```sql
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM banners;
```

If these return numbers (even 0), tables exist and are accessible.

### Still Having Issues?

1. Check Supabase logs: Dashboard → Logs → API Logs
2. Verify environment variables in `.env.local`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Make sure `.env.local` is in the project root (not in `src/`)
4. Restart dev server after changing `.env.local`

