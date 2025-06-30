# VibeLoop - Full-Stack Music Library

A modern, full-stack music library application built with Next.js, Supabase, and BetterAuth. Upload, manage, and play your music collection with a beautiful, responsive interface.

## Features

- 🎵 **Music Management**: Upload, edit, and delete songs
- 🔐 **Authentication**: Secure email/password authentication with BetterAuth
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **Mobile Friendly**: Fully responsive design
- 🎧 **Audio Player**: Built-in audio player with progress controls
- 📊 **File Management**: Automatic file size validation and storage
- 🔍 **Pagination**: Efficient loading with pagination support

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Authentication**: BetterAuth
- **State Management**: TanStack Query (React Query)
- **UI Components**: Radix UI + shadcn/ui
- **Deployment**: Vercel

## Quick Start

### 1. Clone and Install

\`\`\`bash
git clone <your-repo>
cd music-app
npm install
\`\`\`

### 2. Environment Setup

Copy `.env.example` to `.env.local` and fill in your values:

\`\`\`bash
cp .env.example .env.local
\`\`\`

### 3. Database Setup

1. Create a Supabase project
2. Run the SQL script in `scripts/setup-database.sql` in your Supabase SQL editor
3. Create a storage bucket named "media" in Supabase Storage
4. Set up Row Level Security policies (included in the SQL script)

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see your app!

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The app is optimized for Vercel deployment with proper configuration files included.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `NEXT_PUBLIC_STORAGE_BUCKET` | Storage bucket name | Yes |
| `NEXT_PUBLIC_MAX_FILE_SIZE` | Max file size in bytes | Yes |
| `BETTER_AUTH_SECRET` | Secret for BetterAuth | Yes |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | App URL for auth | Yes |

## File Structure

\`\`\`
music-app/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   └── profile/           # User profile
├── components/            # React components
│   ├── auth/              # Authentication components
│   └── ui/                # UI components (shadcn/ui)
├── lib/                   # Utilities and configurations
├── scripts/               # Database setup scripts
└── public/                # Static assets
\`\`\`

## Usage

1. **Sign Up**: Create a new account with email/password
2. **Upload Songs**: Drag & drop or select audio files to upload
3. **Manage Library**: Edit song details, delete songs, organize your collection
4. **Play Music**: Use the built-in audio player with progress controls
5. **Profile**: View your account information and settings

## Features in Detail

### Authentication
- Secure email/password authentication
- Protected routes
- User session management
- Profile management

### Music Management
- File upload with validation (max 5MB)
- Metadata editing (title, artist, genre)
- File storage in Supabase
- Automatic cleanup on deletion

### Audio Player
- Play/pause controls
- Progress bar with seeking
- Volume control
- Duration display

### UI/UX
- Responsive grid layout
- Loading skeletons
- Toast notifications
- Dark/light theme toggle
- Modern gradient design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
