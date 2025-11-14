# Deploying to Render

## Common Build Error Fix

If you get the error: "Couldn't find any `pages` or `app` directory"

### Solution 1: Verify Git Repository

Make sure all files are committed to git:

```bash
git add .
git commit -m "Initial commit"
git push
```

### Solution 2: Check Render Build Settings

In Render dashboard:
1. Go to your service settings
2. Under "Build Command", use: `npm install && npm run build`
3. Under "Start Command", use: `npm start`
4. Make sure "Root Directory" is set to `/` (root of repo)

### Solution 3: Verify File Structure

Ensure these files exist in your repository:
- `app/layout.tsx`
- `app/page.tsx`
- `package.json`
- `next.config.js`
- `tsconfig.json`

### Solution 4: Check Environment Variables

Set these in Render:
- `NODE_ENV=production`
- `JWT_SECRET` (generate a secure random string)
- `DAILY_FREE_SWIPES=50`
- `NEXT_PUBLIC_APP_URL` (your Render app URL)

### Solution 5: Manual Build Test

Test locally first:
```bash
npm install
npm run build
npm start
```

If this works locally, the issue is likely with Render's build configuration.

## Render Configuration

### Build Command
```
npm install && npm run build
```

### Start Command
```
npm start
```

### Environment Variables Needed

Required:
- `JWT_SECRET` - Random secure string for JWT tokens
- `NODE_ENV=production`

Optional (for database):
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_PORT`

Optional (for Stripe):
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

Optional (for Supabase):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Troubleshooting

1. **Build fails**: Check build logs in Render dashboard
2. **App won't start**: Check start command and environment variables
3. **Database connection fails**: Verify database credentials
4. **404 errors**: Ensure `app` directory structure is correct

