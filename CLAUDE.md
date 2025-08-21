# Portfolio Project - Claude Memory

## Project Overview
This is a **multilingual portfolio website** for Laurel Kanmegne, a Fullstack Software Engineer, built with **Next.js 15.3.3**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui** components. The site features internationalization support (English, French, German) and AI-powered resume analysis capabilities.

## Architecture & Tech Stack

### Core Framework
- **Next.js 15.3.3** with App Router and React Server Components
- **TypeScript** with strict configuration
- **Tailwind CSS** with custom design tokens and typography
- **Framer Motion** for smooth animations and page transitions

### Key Dependencies
- **shadcn/ui** component library with Radix UI primitives
- **Google Genkit AI** for resume analysis features
- **Resend** for contact form email handling
- **Lucide React** for consistent iconography
- **React Hook Form + Zod** for form validation
- **Firebase** integration for hosting and services

## Project Structure

### Core App Structure
```
src/
├── app/
│   ├── [lang]/          # Internationalized routes
│   │   ├── layout.tsx   # Language-specific layout & metadata
│   │   └── page.tsx     # Main portfolio page
│   ├── layout.tsx       # Root layout with fonts & toaster
│   ├── globals.css      # Global styles & design system
│   └── actions.ts       # Server actions
├── components/
│   ├── portfolio/       # Portfolio-specific components
│   └── ui/             # shadcn/ui components
├── lib/
│   ├── dictionaries.ts  # i18n dictionary loader
│   ├── utils.ts        # Utility functions
│   └── data.ts         # Legacy data file (deprecated)
├── ai/                  # Genkit AI configuration
└── middleware.ts        # Locale detection & redirection
```

### Key Portfolio Components
- **MainContent**: Main portfolio layout with sections
- **Header**: Navigation with language selector
- **Hero**: Introduction section with social links
- **ProjectList/ProjectCard**: Project showcase with load more
- **SkillCard**: Technical skills categorization
- **TimelineItem**: Work experience & education timeline
- **Contact/ContactForm**: Contact section with form
- **Footer**: Site footer with social links

## Internationalization (i18n)

### Implementation
- **Middleware-based routing**: Automatic locale detection and redirection
- **Supported locales**: `en` (default), `fr`, `de`
- **Message files**: `messages/[locale].json` contains all translations
- **Dynamic metadata**: Language-specific SEO titles and descriptions

### Usage Pattern
```typescript
const dictionary = await getDictionary(lang);
// Access translations: dictionary.Page.projects.title
```

## Styling & Design System

### Color Scheme
- **CSS Variables**: HSL color tokens for light/dark themes
- **Primary**: Blue (#3b82f6) with golden accent (#f59e0b) in dark mode
- **Typography**: Inter (body) + Playfair Display (headings)

### Design Tokens
- **Responsive typography**: clamp() functions for fluid scaling
- **Enhanced readability**: Optimized line-heights and letter-spacing
- **Component variants**: Consistent spacing and border radius

### Animation System
- **Framer Motion**: Staggered animations for lists and sections
- **Intersection Observer**: Scroll-triggered animations
- **Performance**: `once: true` to prevent re-animations

## AI Features

### Resume Analyzer
- **Google Genkit**: Powered by Gemini 2.0 Flash model
- **Flow-based**: Structured AI processing pipeline
- **Client component**: Interactive resume upload and analysis

## Development Scripts

### Available Commands
```bash
npm run dev          # Development server on port 9002 with Turbopack
npm run build        # Production build
npm run lint         # ESLint code quality checks
npm run typecheck    # TypeScript type checking
npm run genkit:dev   # Start Genkit AI development server
npm run genkit:watch # Watch mode for AI development
```

### Build Configuration
- **TypeScript**: Ignores build errors (configured in next.config.ts)
- **ESLint**: Disabled during builds for faster CI/CD
- **Images**: Configured for placehold.co remote patterns

## Content Management

### Data Structure
All portfolio content is stored in `messages/[locale].json` files with this structure:
- `Metadata`: SEO titles and descriptions
- `Header`: Navigation labels
- `Hero`: CTA buttons and social links
- `Page`: Section titles and subtitles
- `data`: Portfolio content (projects, skills, experience, etc.)

### Content Types
- **Projects**: Role, impact, features, tech stack
- **Skills**: Categorized technical skills with Lucide icons
- **Work Experience**: Timeline with company, role, duration
- **Education**: Academic background and achievements
- **Soft Skills**: Professional competencies list
- **Languages**: Proficiency levels
- **Interests**: Personal hobbies and activities

## Key File Locations

### Configuration
- `tailwind.config.ts`: Design system configuration
- `next.config.ts`: Next.js settings with image domains
- `components.json`: shadcn/ui configuration
- `tsconfig.json`: TypeScript compiler options

### Content
- `messages/`: All internationalized content
- `src/components/portfolio/`: Portfolio-specific UI components
- `src/app/[lang]/`: Internationalized routes and pages

### Git Status
Current working files have modifications in:
- Layout and page components
- Global styles
- Portfolio components (header, hero, main-content, project-card, timeline-item)
- Tailwind configuration

## Development Guidelines

### Code Style
- **TypeScript**: Strict mode enabled
- **Components**: Functional components with proper typing
- **Styling**: Tailwind utility classes with design tokens
- **Animations**: Framer Motion with performance optimizations

### Performance
- **Server Components**: Default for better performance
- **Client Components**: Only when necessary for interactivity
- **Image Optimization**: Next.js Image component usage
- **Font Loading**: Google Fonts with preconnect optimization

### Accessibility
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Keyboard Navigation**: Tab-accessible interactive elements
- **Screen Readers**: Appropriate ARIA labels and descriptions
- **Color Contrast**: WCAG compliant color combinations

This portfolio showcases modern web development practices with excellent performance, accessibility, and user experience across multiple languages.