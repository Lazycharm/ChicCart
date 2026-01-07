# Database Setup Guide

This directory contains SQL scripts to set up your Supabase database for ChicCart.

## Quick Start

1. **Go to your Supabase Dashboard**
   - Navigate to https://app.supabase.com
   - Select your project
   - Go to SQL Editor

2. **Run the Schema**
   - Open `schema.sql`
   - Copy and paste the entire contents into the SQL Editor
   - Click "Run" to execute

3. **Add Sample Data (Optional)**
   - Open `seed.sql`
   - Copy and paste into SQL Editor
   - Click "Run" to populate with test data

## Database Tables

### Core Tables
- **categories** - Product categories
- **products** - Product catalog
- **banners** - Homepage banners and promotions
- **orders** - Customer orders
- **reviews** - Product reviews
- **coupons** - Discount coupons
- **user_profiles** - Extended user information (extends Supabase Auth)

## Row Level Security (RLS)

The schema includes RLS policies for:
- **Public Access**: Anyone can view products, categories, active banners, and reviews
- **User Access**: Users can view and create their own orders
- **Admin Access**: Admins have full CRUD access to all tables

## Setting Up Admin Users

To create an admin user:

1. Sign up a user through your app (or create one in Supabase Auth)
2. Run this SQL to make them an admin:

```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'your-admin@email.com';
```

## Storage Setup (for file uploads)

1. Go to Storage in Supabase Dashboard
2. Create a new bucket named `products`
3. Set it to Public (or configure policies as needed)
4. Update the bucket name in `services/storage.ts` if you use a different name

## Notes

- All tables use UUIDs as primary keys
- Timestamps are automatically managed
- The schema includes indexes for optimal query performance
- RLS policies ensure data security
- A trigger automatically creates user profiles when users sign up

## Troubleshooting

### If you get permission errors:
- Make sure you're running the SQL as a database owner/admin
- Check that RLS policies are correctly set up

### If products don't show:
- Verify the `products` table exists
- Check that RLS policies allow SELECT
- Ensure your Supabase credentials in `.env.local` are correct

### If images don't load:
- Make sure the Storage bucket is created and public
- Verify image URLs in the database are accessible

