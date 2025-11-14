# Recognaizer

A modern, minimalistic premium web application that helps users determine if content is AI-generated or human-created through an intuitive swipe-based interface.

## Features

### Core Features
- **Swipe Interface**: Swipe RIGHT for AI, LEFT for Real/Human content
- **Gamification**: Streaks, levels (Beginner → Expert → Human Detector → AI Master), badges, and leaderboard
- **Authentication**: Email/password signup and login
- **Daily Limits**: Free users get 50 swipes per day (configurable)
- **Responsive Design**: Mobile-first with haptic feedback support

### Premium Features (Recognaizer Pro)
- **DeepScan™**: Advanced AI analysis with confidence percentages
- **Upload Mode**: Analyze your own images, text, or video clips
- **Content History**: Save and review all analyzed content
- **Unlimited Swipes**: No daily limits
- **Advanced Insights**: Detailed reports and analytics

## Design System

Strict adherence to the specified design system:

- **Colors**:
  - Primary (Teal): `#069494`
  - Accent (Dark Brown): `#4C2A20`
  - White: `#F1F1F1`
  - Black/Background: `#101010`

- **Typography**: Clash Display (with system sans-serif fallback)

- **Icons**: Only 🤖 (AI) and 👤 (Human) icons used on cards

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: In-memory mock (replaceable with Supabase/PostgreSQL)
- **Authentication**: JWT-based
- **Payments**: Stripe integration (stub)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- (Optional) Supabase account for production database
- (Optional) Stripe account for payment processing

### Installation

1. Clone the repository:
```bash
cd Recognaizer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
# Database (Supabase - optional for development)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe (optional for development)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# JWT Secret (change in production!)
JWT_SECRET=your_jwt_secret_here

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
DAILY_FREE_SWIPES=50
```

### Running Locally

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. (Optional) Seed the database with sample content:
```bash
npx ts-node database/seed.ts
```

## Configuration

### Changing Daily Free Swipe Limit

The daily free swipe limit is controlled by the `DAILY_FREE_SWIPES` environment variable. Default is 50.

To change it:
1. Update `.env` file: `DAILY_FREE_SWIPES=20` (for example)
2. Restart the development server

The limit is enforced server-side in `/app/api/content/next/route.ts`.

## Database Setup

### Development (In-Memory)

The app uses an in-memory database by default for development. Data is lost on server restart.

### Production (Supabase/PostgreSQL)

1. Create a Supabase project or set up a PostgreSQL database
2. Run the schema:
```bash
psql -U your_user -d your_database -f database/schema.sql
```

3. (Optional) Seed with sample data:
```bash
psql -U your_user -d your_database -f database/seed.sql
```

4. Update `lib/db.ts` to use your actual database client instead of the in-memory implementation.

## Project Structure

```
Recognaizer/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── content/      # Content and swipe endpoints
│   │   ├── payment/      # Stripe payment endpoints
│   │   ├── upload/       # Upload and analysis endpoints
│   │   └── user/         # User profile and history
│   ├── profile/          # User profile page
│   ├── premium/          # Premium subscription page
│   ├── upload/           # Upload mode page (Pro)
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── SwipeGame.tsx     # Main swipe game component
│   ├── SwipeCard.tsx     # Individual swipe card
│   ├── FeedbackOverlay.tsx
│   ├── AuthModal.tsx
│   └── ...
├── lib/                  # Utilities and helpers
│   ├── api.ts            # API client functions
│   ├── auth.ts           # Authentication utilities
│   ├── auth-utils.ts     # Server-side auth helpers
│   ├── db.ts             # Database abstraction layer
│   ├── detection.ts      # AI detection logic (mock)
│   ├── levels.ts         # Level and badge calculations
│   └── userContext.tsx   # User context provider
├── database/             # Database files
│   ├── schema.sql        # Database schema
│   ├── seed.sql          # SQL seed script
│   └── seed.ts           # TypeScript seed script
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/verify` - Verify token

### Content
- `GET /api/content/next` - Get next content item for swiping
- `POST /api/content/swipe` - Submit swipe verdict

### User
- `GET /api/user/profile` - Get user profile
- `GET /api/user/history` - Get swipe history (Pro)
- `GET /api/user/swipes-remaining` - Get remaining daily swipes

### Upload (Pro)
- `POST /api/upload/analyze` - Analyze uploaded content

### Payments
- `POST /api/payment/create-checkout` - Create Stripe checkout session
- `GET /api/payment/success` - Handle successful payment
- `POST /api/payment/webhook` - Stripe webhook handler

### Leaderboard
- `GET /api/leaderboard` - Get top users

## Development Notes

### AI Detection

The current implementation uses mock detection logic in `lib/detection.ts`. In production, replace with:
- Text: Transformer-based detectors (e.g., GPTZero, OpenAI detector)
- Images: Forensic analysis models (e.g., CNNs trained on AI-generated images)
- Video: Frame-by-frame analysis with temporal consistency checks

### Database Migration

To migrate from in-memory to Supabase:
1. Replace `lib/db.ts` with Supabase client calls
2. Update all database operations to use Supabase queries
3. Ensure environment variables are set correctly

### Stripe Integration

The Stripe integration is a stub. To enable:
1. Set up Stripe account and get API keys
2. Create a product and price in Stripe dashboard
3. Update `app/api/payment/create-checkout/route.ts` with your price ID
4. Configure webhook endpoint in Stripe dashboard
5. Update `app/api/payment/webhook/route.ts` to handle subscription events

## Building for Production

```bash
npm run build
npm start
```

## License

This project is proprietary. All rights reserved.

## Support

For issues or questions, please contact the development team.

