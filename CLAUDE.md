# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on port 9009 (http://localhost:9009) with Turbopack
- `npm run build` - Build the application for production
- `npm start` - Start production server
- `npm run lint` - Run Next.js linting
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit AI development server for blog generation flows
- `npm run genkit:watch` - Start Genkit AI server with file watching
- `npm run migrate` - Run Firestore migration script

## Architecture Overview

This is a Next.js 15 portfolio website with an integrated admin CMS and AI-powered blog generation. The application uses the App Router pattern with internationalization support.

### Core Technologies
- **Framework**: Next.js 15 with App Router and Turbopack
- **UI**: Tailwind CSS + ShadCN UI components + Radix UI primitives
- **Database**: Firebase Firestore with Firebase Auth
- **AI**: Google Genkit for blog content generation
- **Internationalization**: Built-in i18n with English, French, and German support

### Key Architectural Patterns

**Internationalized Routing**: The app uses dynamic `[lang]` segments for multilingual support. The middleware redirects non-localized routes to the default English locale (`/` → `/en/`).

**Admin CMS Structure**: Complete admin panel at `/admin/*` with dedicated pages for managing:
- Blog posts with AI generation capabilities
- Portfolio projects, skills, work experience
- Personal information (bio, education, languages, interests)

**Data Management**: 
- Portfolio content stored in JSON locale files (`src/locales/*.json`)
- Blog and dynamic content stored in Firebase Firestore
- Firebase Auth handles admin authentication (currently disabled in middleware)

**AI Integration**: Genkit flows for automated blog content generation using Google AI, with dedicated development server and real-time monitoring.

### Project Structure

```
src/
├── app/
│   ├── [lang]/              # Internationalized routes (en, fr, de)
│   │   ├── blog/            # Blog listing and individual posts
│   │   └── page.tsx         # Portfolio homepage
│   ├── admin/               # CMS admin panel
│   │   ├── blog/            # Blog management with AI generation
│   │   ├── projects/        # Project management
│   │   ├── skills/          # Skills management
│   │   └── [other sections] # Various portfolio sections
│   └── auth/                # Authentication pages
├── components/
│   ├── admin/               # Admin-specific components and forms
│   ├── portfolio/           # Portfolio display components
│   └── ui/                  # ShadCN UI components
├── lib/
│   ├── firebase/            # Firebase config, auth, and Firestore utilities
│   ├── api/                 # API utilities and data fetching
│   └── dictionaries.ts      # i18n dictionary loader
├── ai/
│   ├── dev.ts              # Genkit development server
│   └── blog-generator.ts   # AI blog generation flows
└── locales/                # JSON files for multilingual content
```

### Development Notes

**Firebase Configuration**: Uses production Firebase (not emulators). Configuration is in `src/lib/firebase/config.ts` with environment variable overrides.

**Content Management**: Portfolio static content is managed through locale JSON files, while dynamic content (blog posts, user-generated data) uses Firestore.

**Authentication**: Admin routes are protected by Firebase Auth, with server-side authentication utilities in `src/lib/firebase/server-auth.ts`.

**Styling**: Uses Tailwind CSS with custom fonts (Inter for body, Playfair Display for headings) and ShadCN UI component system for consistent design.

**AI Development**: Use `npm run genkit:dev` to start the AI development server for testing blog generation flows. The server runs independently and provides a web interface for flow testing.