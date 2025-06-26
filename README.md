# ktayl's Digital Stage - A Personal Portfolio

This is a personal portfolio website for ktayl, a Fullstack Software Engineer. It showcases projects, skills, and professional experience in a clean, modern, and responsive design. The project is built with Next.js and styled with Tailwind CSS and ShadCN UI components.

## ✨ Features

- **Responsive Design**: Looks great on all devices, from mobile phones to desktop screens.
- **Dynamic Content**: All text and portfolio data are managed through a single JSON file (`messages/en.json`) for easy updates.
- **Component-Based Architecture**: Built with reusable React components for maintainability.
- **AI-Powered Resume Analyzer**: An integrated Genkit flow provides AI-driven feedback on resumes.
- **Interactive UI**: Smooth animations and a polished user interface thanks to ShadCN UI and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI**: [Genkit](https://firebase.google.com/docs/genkit)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **Deployment**: Firebase App Hosting

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd <project-directory>
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

To start the development server, run the following command:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## 📁 Project Structure

```
.
├── src
│   ├── app                 # Next.js App Router pages
│   ├── components
│   │   ├── portfolio       # Custom components for the portfolio
│   │   └── ui              # ShadCN UI components
│   ├── ai                  # Genkit AI flows
│   │   └── flows
│   └── lib                 # Utility functions
├── messages
│   └── en.json             # All portfolio data and text content
└── public                  # Static assets (images, fonts)
```

## ✏️ Customization

All the text, project details, skills, and other content displayed on the portfolio can be easily modified by editing the `messages/en.json` file. No code changes are needed for content updates.
