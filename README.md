# FinanceFlow

A modern personal finance tracker built with Next.js 14, Supabase, and Tailwind CSS.

## Features

- 📊 **Dashboard** - Financial overview with KPIs and recent transactions
- 💳 **Transaction Management** - Track income and expenses with categories
- 🎯 **Budget Tracking** - Set and monitor budgets by category
- 🔐 **Secure Authentication** - Email/password auth with Supabase
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 🌙 **Dark Mode** - Light/dark theme support
- 📱 **Mobile Responsive** - Works great on all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Tables**: TanStack Table

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account and project

### 1. Clone and Install

```bash
git clone <your-repo>
cd financeflow
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your project URL and anon key

### 3. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and run the contents of `db/sql/001_schema.sql`
4. This will create all necessary tables and Row Level Security policies

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
├── lib/                   # Utilities and configurations
│   ├── supabase/         # Supabase client configurations
│   └── utils.ts          # Helper functions
├── db/sql/               # Database schema and migrations
└── public/               # Static assets
```

## Key Features

### Authentication
- Email/password authentication via Supabase
- Protected routes with middleware
- User session management

### Database
- PostgreSQL via Supabase
- Row Level Security (RLS) enabled
- Optimized indexes for performance

### UI/UX
- Responsive design with mobile-first approach
- Dark/light theme support
- Accessible components
- Loading states and error handling

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Migrations

When you need to update the database schema:

1. Create a new SQL file in `db/sql/`
2. Run it in your Supabase SQL Editor
3. Update TypeScript types if needed

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

This is a standard Next.js app and can be deployed to any platform that supports Node.js.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

If you have any questions or need help:

1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review [Next.js documentation](https://nextjs.org/docs)
3. Open an issue in this repository

---

Built with ❤️ using Next.js and Supabase