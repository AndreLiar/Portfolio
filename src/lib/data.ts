import { Code, Cloud, Database, BrainCircuit, BotMessageSquare, Type } from 'lucide-react';

export const data = {
  name: "ktayl",
  fullName: "kanmegne laurel",
  title: "Fullstack Software Engineer | Cloud-Native & AI-Powered Systems",
  location: "Paris, France",
  resumeUrl: "/resume.pdf",
  contact: {
    email: {
      address: "your.email@example.com",
    },
    phone: {
      number: "+33000000000",
    },
    github: {
      url: "https://github.com/yourhandle",
    },
    linkedin: {
      url: "https://linkedin.com/in/yourhandle",
    },
    portfolio: {
        url: "https://portfolio.site"
    }
  },
  summary:
    "Multidisciplinary fullstack software engineer with a unique blend of skills across AI/ML integration, DevOps, cloud-native deployments, real-time data systems, and enterprise platform extension (SAP/Salesforce). Experienced in designing and delivering scalable, intelligent SaaS solutions that combine performance, automation, and business impact.",
  skills: [
    {
      title: "Languages & Backend",
      Icon: Code,
      skills: ["TypeScript", "Python", "JavaScript", "Java", "Spring Boot", "C#/.NET", "Go", "Bash", "SQL", "Node.js", "Express", "NestJS"],
    },
    {
      title: "Web Stack",
      Icon: BotMessageSquare,
      skills: ["React", "Next.js", "Tailwind CSS", "Vite", "Bootstrap", "REST", "GraphQL", "Angular"],
    },
    {
      title: "Cloud & DevOps",
      Icon: Cloud,
      skills: ["Azure", "Kubernetes", "Terraform", "GitHub Actions", "GitLab CI", "Jenkins", "Docker", "CI/CD"],
    },
    {
      title: "AI/ML",
      Icon: BrainCircuit,
      skills: ["OpenAI API", "LangChain", "HuggingFace", "MLflow", "Transformers", "scikit-learn", "Azure ML Studio"],
    },
    {
      title: "Data & Analytics",
      Icon: Database,
      skills: ["PostgreSQL", "MySQL", "Redis", "Snowflake", "dbt", "SQL Server", "Power BI", "Streamlit"],
    },
    {
      title: "Enterprise & Others",
      Icon: Type,
      skills: ["Salesforce App Builder", "SAP UI5", "SAP BTP", "OAuth2", "JWT", "SAML", "Playwright", "Postman", "Prometheus", "Grafana", "Firebase", "Supabase"],
    },
  ],
  projects: [
    {
      title: "Étudiant Étranger Facilité",
      purpose: "Simplify and automate administrative tasks for non-EU students in France.",
      stack: ["Next.js", "Firebase", "GPT-4 API", "Supabase"],
      impact: "MVP helped 30+ students generate CAF and Visa documents automatically.",
      role: "Lead developer – handled frontend, backend, AI prompt engineering.",
      features: [
        "Automated document translation (GPT + Deepl API)",
        "Smart form filling from uploaded documents (OCR + LLM)",
        "Step-by-step smart assistant for Préfecture, CVEC, CAF",
      ],
      link: "#",
      repoUrl: "#"
    },
    {
      title: "AI-Powered Content Platform",
      purpose: "A platform to generate and manage marketing content using generative AI.",
      stack: ["Python", "FastAPI", "React", "Docker", "OpenAI"],
      impact: "Reduced content creation time by 50% for the marketing team during beta testing.",
      role: "Fullstack Developer, focused on AI integration and backend services.",
      features: [
        "Text generation for blog posts and social media",
        "Image generation for ad creatives",
        "Content scheduling and analytics dashboard"
      ],
      link: "#",
      repoUrl: "#"
    }
  ],
  workExperience: [
    {
      date: "Sep 2024 - Sep 2027",
      title: "IT Support & Python Development (Apprentice)",
      subtitle: "HDI France, Paris",
      description: `<ul>
        <li>Provide Level 1 & 2 technical support, managing user incidents for hardware, network, and software issues via GLPI.</li>
        <li>Modernize and maintain legacy Python scripts, focusing on performance optimization, bug fixes, and code readability.</li>
        <li>Develop automation scripts to streamline document exports, improving data accessibility and workflow efficiency.</li>
        <li>Manage the IT asset lifecycle, including deployment, configuration, and network administration for user workstations and meeting room hardware (ClickShare).</li>
      </ul>`,
    },
    {
      date: "Jul 2024 - Aug 2024",
      title: "Developer Intern",
      subtitle: "FEDHUBS · Internship",
      description: "Developed a Python-based web scraper using BeautifulSoup to automate data extraction and structuring. Additionally, optimized SEO and performance for a Laravel and React/TypeScript site by improving loading strategies, compressing assets, and enhancing metadata.",
    },
  ],
  education: [
    {
      date: "2022 - 2027",
      title: "Mastère – Expert en Développement Web Fullstack",
      subtitle: "Ynov Campus, Paris",
      description: `<ul>
        <li>Développement Fullstack JavaScript (React, Node.js, Next.js)</li>
        <li>DevOps & Cloud Computing (Docker, Kubernetes, GitHub Actions, AWS, Azure)</li>
        <li>Conception et Architecture Logicielle</li>
        <li>Intégration de systèmes d'entreprise (Salesforce, SAP, Oracle)</li>
        <li>Projets agiles & gestion de version (Scrum, Git)</li>
        <li>Initiation à l’intelligence artificielle et à la data science</li>
        <li>Sécurité applicative et performance web</li>
      </ul>`,
    },
  ],
  recommendations: [
    {
        quote: "ktayl has been a key contributor in our DevOps transition and AI integration efforts. His ability to bridge backend development with platform scalability is rare among junior developers.",
        author: "Lead Engineer",
        title: "B2B SaaS – France"
    },
    {
        quote: "During our collaboration, ktayl delivered robust automation pipelines and insightful AI prototypes that helped us iterate quickly. He’s a future tech lead in the making.",
        author: "Startup Co-Founder",
        title: "Remote Internship 2024"
    }
  ],
  languages: [
    { name: "English", level: "C1" },
    { name: "French", level: "B2" },
    { name: "German", level: "B1" },
  ],
  interests: ["AI in Education", "Startup Tools", "Data Privacy", "Productivity Systems", "Music"]
};
