# Bring My Bite — Website Deployment

## Local

npm install
npm run dev

## Production build

npm run build
npm run preview

## Vercel

Import the repository from GitHub. Build command: `npm run build`. Output directory: `dist`.

Set these Vercel environment variables:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Run `supabase/schema.sql` against the correct Supabase project before testing order/payment workflows.

## Important

Customer/order data that must be shared across devices belongs in Supabase. Do not rely on browser localStorage for central order state.
