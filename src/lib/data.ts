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
      title: "HireIQ – AI-powered Recruitment SaaS",
      description: "Built an AI-enhanced candidate profiling engine, integrated Supabase Auth with multi-role dashboards, and set up CI/CD using GitHub Actions for rapid deployment.",
      stack: ["React", "Supabase", "OpenAI", "LangChain", "Tailwind CSS", "GitHub Actions"],
      link: "https://github.com/yourhandle/hireiq"
    },
    {
      title: "FinEduKids (EdTech MVP)",
      description: "Designed gamified financial modules with progress tracking, deployed an analytics dashboard with Chart.js, and integrated adaptive learning logic.",
      stack: ["Next.js", "Supabase", "Firebase", "Chart.js"],
      link: "https://github.com/yourhandle/finedukids"
    },
    {
      title: "Real-Time Business Intelligence Dashboard",
      description: "Built a real-time dashboard for logistics companies with live order tracking. Pulled data from Firebase, transformed it with Python/dbt, and delivered automated reports.",
      stack: ["React", "Python", "Streamlit", "Firebase", "dbt"],
      link: "https://github.com/yourhandle/bi-dashboard"
    },
    {
        title: "Salesforce & SAP Expense Automation",
        description: "Integrated SAP and Salesforce for automated expense claim syncing. Built custom Salesforce flows that triggered SAP Cloud actions, reducing manual work by 60%.",
        stack: ["Salesforce Lightning", "Flow Builder", "Apex", "SAP BTP"],
        link: "https://github.com/yourhandle/salesforce-sap-integration"
    },
  ],
  workExperience: [
    {
      date: "Nov 2024 - Present",
      title: "Junior Fullstack Developer – Alternance",
      subtitle: "Tech Company, Paris",
      description: "Delivered internal HR dashboard with audit trail using Supabase + React. Automated backend data sync with Google Sheets and Firebase. Created internal dev documentation.",
    },
    {
      date: "Apr 2024 - Oct 2024",
      title: "AI/DevOps Intern (Remote)",
      subtitle: "Freelance/Startup Collaboration",
      description: "Assisted in integrating LangChain into an internal search engine. Contributed to Dockerized CI pipeline for a Python microservice architecture. Benchmarked OpenAI vs Cohere.",
    },
  ],
  education: [
    {
      date: "2022 - 2027",
      title: "Master’s – Expert Web Fullstack Development",
      subtitle: "School Name, Paris",
      description: "Key Modules: Fullstack JS, Cloud Platforms, Agile Projects, DevOps with Docker, AI Introduction, Enterprise Integration (SAP/Salesforce).",
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
