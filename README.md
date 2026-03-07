# Andre Kanmegne - Professional Portfolio & CV

A modern, high-performance portfolio website for a **Fullstack Software & DevOps Engineer**, featuring internationalization (EN, FR, DE), a completely dynamic architecture, and an integrated enterprise-grade CV generation engine.

Live Preview: [https://devandre.sbs](https://devandre.sbs)

## ✨ Core Features

- **Enterprise CV Generator:** Fully automated, 1-page CV generation tailored for Applicant Tracking Systems (ATS), powered by native browser PDF formatting (`window.print()`).
- **Internationalization (i18n):** Complete content translation in 3 languages (English, French, German).
- **Server-Side Rendering (SSR):** Built with Next.js 15 App Router for blistering fast load times and optimized Core Web Vitals.
- **Dynamic Content:** All content (skills, projects, work experience, bio) is managed entirely via central locale JSON files, separating code from content.
- **Modern UI/UX:** Clean, accessible styling powered by Tailwind CSS and ShadCN UI components.
- **Cloud/DevOps Focus:** The content schema is specifically engineered to highlight heavy cloud infrastructure, CI/CD, and Fullstack architecture skills.

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (React 18)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [ShadCN UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Deployment:** [Vercel](https://vercel.com/) (CI/CD Automated Integration)

## 🛠️ Getting Started

### Prerequisites
- Node.js `v18+` (or `v20+` recommended)
- `npm`

### Installation
1. Clone the repository:
```bash
git clone https://github.com/AndreLiar/Portfolio.git
```
2. Navigate to the directory:
```bash
cd Portfolio
```
3. Install dependencies:
```bash
npm install
```

### Running Locally
To spin up the development server, run:
```bash
npm run dev
```
Open [http://localhost:9009](http://localhost:9009) in your browser. The localized versions are available at `/en`, `/fr`, and `/de`.

## 📁 Content Management

No code changes are required to update the portfolio. Everything is purely data-driven.
To update your projects, skills, and summary, edit the corresponding localized JSON files:
- `src/locales/en.json` (English)
- `src/locales/fr.json` (French)
- `src/locales/de.json` (German)

---
*Designed & Build for Enterprise Scale.*
