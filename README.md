# 🚀 BeHired - The Tinder for Jobs

<div align="center">
  <img src="public/images/Gemini_Generated_Image_kfiw8akfiw8akfiw.png" width="120" height="120" alt="BeHired Logo">
  <h3>Match. Connect. Get Hired.</h3>
  <p>A modern, swipe-based job matching platform for the next generation of talent and employers.</p>
</div>

---

## ✨ Overview

**BeHired** reimagines the job hunt by replacing tedious forms and cold outreach with a high-intent, mutual-interest swiping experience. Inspired by modern dating apps, it allows job seekers to discover roles and employers to find talent through a seamless interface where conversations only start when both sides say "Yes".

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **State Management**: [TanStack React Query v5](https://tanstack.com/query/latest)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://motion.dev/)
- **Routing**: [Wouter](https://github.com/molefrog/wouter)
- **Icons**: [Lucide React](https://lucide.dev/)
- **UI Components**: Radix UI + Shadcn UI

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express v5](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Firebase Realtime Database](https://firebase.google.com/products/realtime-database)
- **Authentication**: Session-based with `express-session` and `session-file-store`
- **Deployment**: [Vercel](https://vercel.com/) (Serverless Functions)

## 🌟 Key Features

### 👤 For Job Seekers
- **Swipe Discovery**: Browse jobs and internships in a Tinder-style card deck.
- **Mutual Matches**: Get notified immediately when an employer likes you back.
- **Smart History**: Track your "Accepted" and "Rejected" swipes in a dual-tab history view.
- **Profile Customization**: Upload your resume, set your skills, and customize your professional bio.

### 🏢 For Employers
- **Talent Pool Browsing**: Swipe on registered job seekers directly, not just those who apply.
- **Job Listings**: Create and manage job openings with ease.
- **Applicant Tracking**: View detailed profiles and resumes of interested candidates.
- **Direct Matching**: Skip the inbox clutter — only talk to people you've mutually matched with.

### 🍱 General Features
- **Modern SaaS Landing Page**: A premium, animations-heavy introduction to the platform.
- **Light/Dark Mode Toggle**: Persistent theme preference with a clean, high-contrast light mode and a rich "Tinder-dark" mode.
- **Resume Management**: Secure PDF upload and download functionality.
- **Responsive Design**: Fully optimized for both desktop and mobile browsing.

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v9 or v10 recommended)
- A Firebase Project (for Realtime Database)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/AlphaBeta07/BeHired.git
cd BeHired

# Install dependencies
pnpm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following:
```env
# Firebase Configuration
VITE_FIREBASE_DATABASE_URL=your_firebase_rtdb_url
FIREBASE_SERVICE_ACCOUNT_KEY='{"type": "service_account", ...}'

# Session Configuration
SESSION_SECRET=your_long_random_secret

# Server Configuration
PORT=3000
SERVER_PORT=3001
```

### 4. Running Locally
```bash
# Start both frontend and backend concurrently
pnpm dev
```
The app will be available at `http://localhost:3000`.

## 📦 Project Structure

```text
├── api/             # Vercel serverless entry point
├── public/          # Static assets (images, logos)
├── server/          # Backend source code
│   ├── routes/      # Express API routes
│   └── lib/         # Shared utilities (Firebase, etc.)
├── src/             # Frontend source code
│   ├── components/  # Reusable UI components
│   ├── hooks/       # Custom React hooks
│   ├── pages/       # Page components
│   └── lib/         # Frontend utilities
├── tsconfig.json    # TypeScript configuration
└── vite.config.ts   # Vite configuration
```

## 🌐 Deployment

This project is optimized for deployment on **Vercel**.

1. Connect your GitHub repository to Vercel.
2. Set the **Framework Preset** to Vite.
3. Configure the **Build Command** to `pnpm run build`.
4. Add all environment variables from your `.env` to the Vercel Dashboard.
5. Deploy.

---

<div align="center">
  <p>© 2026 BeHired · Swipe your way to success.</p>
</div>
