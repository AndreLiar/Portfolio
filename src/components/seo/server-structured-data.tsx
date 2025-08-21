// Server-side structured data component to avoid hydration issues
interface PersonSchema {
  "@context": string;
  "@type": string;
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  image?: string;
  sameAs: string[];
  address: {
    "@type": string;
    addressLocality: string;
    addressCountry: string;
  };
  email: string;
  knowsAbout: string[];
}

interface ProjectSchema {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  creator: {
    "@type": string;
    name: string;
  };
  dateCreated: string;
  programmingLanguage?: string[];
  runtimePlatform?: string[];
  applicationCategory: string;
  operatingSystem?: string;
  url?: string;
  codeRepository?: string;
}

interface CollectionPageSchema {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  author: {
    "@type": string;
    name: string;
  };
  mainEntity: {
    "@type": string;
    numberOfItems: number;
    itemListElement: {
      "@type": string;
      position: number;
      item: {
        "@type": string;
        name: string;
        description: string;
      };
    }[];
  };
}

interface BreadcrumbSchema {
  "@context": string;
  "@type": string;
  itemListElement: {
    "@type": string;
    position: number;
    name: string;
    item: string;
  }[];
}

interface ServerStructuredDataProps {
  data: any;
  locale: string;
  baseUrl: string;
}

export function ServerStructuredData({ data, locale, baseUrl }: ServerStructuredDataProps) {
  // Person Schema for the main profile
  const personSchema: PersonSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.fullName,
    jobTitle: "Fullstack Software Engineer",
    description: data.summary.replace(/\*\*/g, '').replace(/\*/g, '').replace(/•/g, '-').replace(/🚀|🤖|☁️|💡|⚡/g, ''),
    url: `${baseUrl}/${locale}`,
    image: `${baseUrl}/images/profile-photo.jpg`,
    sameAs: [
      data.contact.github,
      data.contact.linkedin,
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: data.location.split(',')[0].trim(),
      addressCountry: data.location.includes('France') ? 'France' : 'DE',
    },
    email: data.contact.email,
    knowsAbout: [
      "Fullstack Development",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "Cloud Computing",
      "Azure",
      "AI/ML Integration",
      "DevOps",
      "Kubernetes",
      "Software Architecture",
      "Web Development",
      "Backend Development",
      "Frontend Development"
    ],
  };

  // Project Schemas for portfolio projects
  const projectSchemas: ProjectSchema[] = data.projects.map((project: any, index: number) => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.purpose,
    creator: {
      "@type": "Person",
      name: data.fullName,
    },
    dateCreated: "2024",
    programmingLanguage: project.stack.filter((tech: string) => 
      ['TypeScript', 'JavaScript', 'Python', 'Java', 'C#', 'Go', 'SQL'].includes(tech)
    ),
    runtimePlatform: project.stack.filter((tech: string) => 
      ['Node.js', 'React', 'Next.js', '.NET', 'Spring Boot'].includes(tech)
    ),
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Cross-platform",
    url: project.link || `${baseUrl}/${locale}#projects`,
    codeRepository: project.repoUrl,
  }));

  // Collection Page Schema for the portfolio
  const collectionPageSchema: CollectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${data.fullName} - Portfolio`,
    description: "Portfolio showcasing fullstack development projects and technical expertise",
    author: {
      "@type": "Person",
      name: data.fullName,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: data.projects.length,
      itemListElement: data.projects.map((project: any, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "SoftwareApplication",
          name: project.title,
          description: project.purpose,
        },
      })),
    },
  };

  // Breadcrumb Schema
  const breadcrumbSchema: BreadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${baseUrl}/${locale}`,
      },
    ],
  };

  return (
    <>
      {/* Person Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema, null, 0),
        }}
      />
      
      {/* Collection Page Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema, null, 0),
        }}
      />
      
      {/* Project Schemas */}
      {projectSchemas.map((schema, index) => (
        <script
          key={`project-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0),
          }}
        />
      ))}
      
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema, null, 0),
        }}
      />
    </>
  );
}