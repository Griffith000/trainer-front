# TrainerAI Frontend

**Author:** Ghassen Latrach — ING A2, Groupe 4

AI-powered fitness trainer web application. Provides users with personalized workout and diet plans through an interactive AI chat assistant. Powered by [OpenRouter](https://openrouter.ai/).

## Features

- **AI Chat Assistant** — Conversational interface to get fitness advice, workout suggestions, and nutrition tips
- **Personalized Workout Plans** — AI-generated workout routines tailored to user goals and fitness level
- **Diet Plans** — Customized nutrition plans based on dietary preferences and objectives
- **Onboarding Flow** — Initial survey to understand user goals, experience level, and preferences
- **User Profile** — Track progress, manage preferences, and view history
- **Authentication** — Secure login and registration system

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** TailwindCSS 4 + shadcn/ui
- **AI Integration:** Vercel AI SDK 
- **State Management:** React Query, React Hook Form
- **Validation:** Zod
- **Calendar:** FullCalendar

## Getting Started

### Clone the repository

```bash
git clone https://github.com/Griffith000/trainer-front.git
cd trainer-front
```

### Configure environment

Create a `.env` file in the project root with the following variables:

```bash
# OpenRouter API key
OPENROUTER_API_KEY=your_openrouter_key

# Redis connection
REDIS_URL=your_redis_url
```

### Install and run

```bash
pnpm install
pnpm run dev
```

The frontend runs on `http://localhost:3000` by default.

---

**Note:** This frontend requires the backend to be running. See the [TrainerAI Backend](https://github.com/SlamZDank/TrainerAI) for setup instructions.
