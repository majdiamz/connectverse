# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
# Development server (runs on port 9002 with Turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint

# Type checking
npm run typecheck

# Genkit AI development server
npm run genkit:dev
npm run genkit:watch  # with file watching
```

## Architecture Overview

ConnectVerse is a Next.js 15 application for unified messaging across WhatsApp, Messenger, Instagram, and TikTok. It uses the App Router with React 19.

### Key Directories

- `src/app/` - Next.js App Router pages and layouts
- `src/app/dashboard/` - Main application pages (inbox, customers, funnel, integrations, etc.)
- `src/components/` - React components
- `src/components/ui/` - shadcn/ui component library (Radix UI primitives)
- `src/lib/` - Utilities and data layer
- `src/ai/` - Genkit AI integration with Google Gemini
- `src/hooks/` - Custom React hooks

### Core Data Types

The application's domain model is defined in `src/lib/data.ts`:
- `Channel` - Communication platform type (whatsapp, messenger, instagram, tiktok)
- `Customer` - Customer profiles with status, tags, and deal history
- `Conversation` - Messages between users and customers
- `CustomerStatus` - Funnel stages (new, contacted, qualified, unqualified, demo, won)
- `Deal` - Sales opportunities with status tracking

### UI Framework

- shadcn/ui components with Radix UI primitives
- Tailwind CSS with CSS variables for theming (configured in `tailwind.config.ts`)
- Lucide React for icons
- Colors defined in `src/app/globals.css` with light/dark mode support

### Style Guidelines

- Primary color: #468B97 (modern blue)
- Background: #E5E8E8 (light gray)
- Accent: #8DD0D6 (teal)
- Font: Inter

### Import Aliases

Configured in `tsconfig.json`:
- `@/components` - Components
- `@/lib` - Library utilities
- `@/hooks` - Custom hooks
- `@/components/ui` - UI primitives
