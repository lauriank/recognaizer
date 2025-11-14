# phpMyAdmin Setup Instructions

## Step 1: Create Database

1. Open phpMyAdmin
2. Click on "New" to create a new database
3. Name it `recognaizer` (or your preferred name)
4. Choose `utf8mb4_unicode_ci` as the collation
5. Click "Create"

## Step 2: Run Schema

1. Select your database from the left sidebar
2. Click on the "SQL" tab
3. Copy the entire contents of `database/schema_mysql.sql`
4. Paste it into the SQL textarea
5. Click "Go" to execute

## Step 3: Seed Data (Optional)

1. Stay in the same database
2. Click on the "SQL" tab again
3. Copy the entire contents of `database/seed_mysql.sql`
4. Paste it into the SQL textarea
5. Click "Go" to execute

## Step 4: Verify Tables

You should now see these tables:
- `users`
- `content_items`
- `swipes`
- `badges`

## Step 5: Update Environment Variables

In your `.env` file or Render environment variables, update:

```env
# If using MySQL directly (not Supabase)
DATABASE_URL=mysql://username:password@host:port/database_name
# OR use individual connection details
DB_HOST=your_host
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=recognaizer
DB_PORT=3306
```

## Notes

- The schema uses `VARCHAR(36)` for IDs (UUID format)
- MySQL 8.0+ supports `UUID()` function natively
- For older MySQL versions, you may need to generate UUIDs differently
- All tables use `utf8mb4_unicode_ci` collation for proper Unicode support

