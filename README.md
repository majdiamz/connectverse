# App Name: ConnectVerse

# Core Features:
Unified Inbox: Aggregate messages from WhatsApp, Messenger, Instagram, and TikTok into a single inbox.
Customer Profiles: Create and manage individual customer profiles with customizable details.
User-Specific Dashboards: Provide dashboards tailored to individual users for managing their leads.
Multi-Channel Support: Enable seamless communication across WhatsApp, Messenger, Instagram, and TikTok.

# Style Guidelines:

Primary color: Modern blue (#468B97) to represent trust and connectivity.
Background color: Light gray (#E5E8E8) for a clean, professional backdrop.
Accent color: Teal (#8DD0D6) for highlights and calls to action, providing a sense of calm and reliability.
Body and headline font: 'Inter' for a modern, neutral, and readable experience.
Use minimalist icons for channels and actions.
Clean and intuitive layout for easy navigation.
Subtle animations for a smooth user experience.

# Local Development Setup

Follow these steps to run the application on your local machine.

## 1. Prerequisites

- Node.js (v18 or later recommended)
- npm

## 2. Installation

Install the project dependencies:

```bash
npm install
```

## 3. Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variable. This secret is used for signing authentication tokens.

```
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```

**Important**: For a real production environment, you must use a strong, unique secret and not commit it to version control.

## 4. Running the Development Server

To start the application in development mode with hot-reloading, run:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

The default login credentials are:
- **Email**: `user@example.com`
- **Password**: `password`

## 5. Building and Running for Production

To create an optimized production build and run it, use the following commands:

```bash
# 1. Build the application
npm run build

# 2. Start the production server
npm run start
```

This will start the production server, typically on port 3000 unless configured otherwise.
