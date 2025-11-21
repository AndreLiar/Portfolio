import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { GitHubService, Repository } from '@/lib/github';
import { z } from 'zod';

// Configure Genkit instance
const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_AI_API_KEY,
    }),
  ],
});

// Input schema for blog generation
const BlogGenerationInput = z.object({
  githubUsername: z.string(),
  repositoryName: z.string(),
  tone: z.enum(['technical', 'casual', 'professional', 'storytelling']).default('professional'),
  focus: z.enum(['overview', 'technical-deep-dive', 'learning-journey', 'showcase', 'tutorial']).default('overview'),
  targetAudience: z.enum(['developers', 'business', 'general', 'recruiters', 'students']).default('developers'),
});

// Enhanced output schema
const BlogPostOutput = z.object({
  title: z.string(),
  content: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()),
  estimatedReadTime: z.number(),
  suggestedImages: z.array(z.string()),
  seoKeywords: z.array(z.string()),
  tableOfContents: z.array(z.object({
    title: z.string(),
    level: z.number(),
    anchor: z.string(),
  })),
  codeSnippets: z.array(z.object({
    language: z.string(),
    code: z.string(),
    description: z.string(),
  })),
  projectTimeline: z.string(),
  difficultyLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  architectureSuggestions: z.array(z.string()),
  relatedProjects: z.array(z.string()),
  technologyStack: z.object({
    frontend: z.array(z.string()),
    backend: z.array(z.string()),
    database: z.array(z.string()),
    tools: z.array(z.string()),
    frameworks: z.array(z.string()),
  }),
});

export type BlogGenerationInputType = z.infer<typeof BlogGenerationInput>;
export type BlogPostOutputType = z.infer<typeof BlogPostOutput>;

// Enhanced repository analysis
async function analyzeRepositoryDeep(username: string, repoName: string) {
  try {
    console.log(`🔍 Deep analyzing repository: ${username}/${repoName}`);
    
    // Use the existing GitHubService.analyzeRepository method
    const analysis = await GitHubService.analyzeRepository(username, repoName);
    
    // Extract dependencies from packageJson
    let dependencies: string[] = [];
    let devDependencies: string[] = [];
    
    if (analysis.packageJson) {
      dependencies = Object.keys(analysis.packageJson.dependencies || {});
      devDependencies = Object.keys(analysis.packageJson.devDependencies || {});
    }
    
    // Also check for Python requirements
    const requirements = await GitHubService.getFileContent(username, repoName, 'requirements.txt');
    if (requirements) {
      const reqLines = requirements.content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
      const pythonDeps = reqLines.map(line => line.split('==')[0].split('>=')[0].trim());
      dependencies = [...dependencies, ...pythonDeps];
    }
    
    // Detect technologies and analyze project
    const technologies = detectTechnologies(dependencies, devDependencies, analysis.languages, analysis.keyFiles);
    const projectType = determineProjectType(technologies, dependencies, analysis.repository.description || '');
    const complexity = assessProjectComplexity(technologies, dependencies, analysis.keyFiles, analysis.readme || '');
    
    return {
      repository: analysis.repository,
      readme: analysis.readme || 'No README available',
      dependencies,
      devDependencies,
      languages: analysis.languages,
      keyFiles: analysis.keyFiles,
      technologies,
      projectType,
      complexity,
      description: analysis.repository.description || '',
      topics: analysis.repository.topics || []
    };
  } catch (error) {
    console.error('Error in deep repository analysis:', error);
    throw new Error('Failed to analyze repository');
  }
}

// Helper function to enhance keyFiles detection (already handled by GitHubService)
function enhanceKeyFiles(keyFiles: string[]): string[] {
  // The GitHubService already provides keyFiles, so we just return them
  return keyFiles;
}

// Enhanced technology detection
function detectTechnologies(dependencies: string[], devDependencies: string[], languages: any, keyFiles: string[]): string[] {
  const techMap: { [key: string]: string[] } = {
    'React': ['react', '@types/react', 'react-dom'],
    'Next.js': ['next', 'nextjs'],
    'Vue.js': ['vue', '@vue/cli'],
    'Angular': ['@angular/core', '@angular/cli'],
    'TypeScript': ['typescript', '@types'],
    'Node.js': ['express', 'fastify', 'koa'],
    'Python': ['django', 'flask', 'fastapi'],
    'Streamlit': ['streamlit'],
    'Ollama': ['ollama'],
    'FastAPI': ['fastapi'],
    'Django': ['django'],
    'Flask': ['flask'],
    'Tailwind CSS': ['tailwindcss'],
    'PostgreSQL': ['pg', 'psycopg2'],
    'MongoDB': ['mongodb', 'mongoose'],
    'Redis': ['redis'],
    'Docker': ['docker'],
    'Kubernetes': ['kubernetes']
  };
  
  const allDeps = [...dependencies, ...devDependencies];
  const detected = new Set<string>();
  
  // Check dependencies
  for (const [tech, patterns] of Object.entries(techMap)) {
    if (patterns.some(pattern => allDeps.includes(pattern))) {
      detected.add(tech);
    }
  }
  
  // Check languages
  for (const lang of Object.keys(languages)) {
    detected.add(lang);
  }
  
  // Check key files
  if (keyFiles.some(f => f.includes('docker'))) detected.add('Docker');
  if (keyFiles.some(f => f.includes('.py'))) detected.add('Python');
  if (keyFiles.some(f => f.includes('.ts'))) detected.add('TypeScript');
  
  return Array.from(detected);
}

// Determine project type
function determineProjectType(technologies: string[], dependencies: string[], description: string): string {
  const desc = description.toLowerCase();
  
  if (desc.includes('api') || desc.includes('backend')) return 'Backend API';
  if (desc.includes('web app') || technologies.includes('React') || technologies.includes('Next.js')) return 'Web Application';
  if (desc.includes('mobile') || desc.includes('app')) return 'Mobile Application';
  if (desc.includes('cli') || desc.includes('command')) return 'CLI Tool';
  if (desc.includes('library') || desc.includes('package')) return 'Library/Package';
  if (desc.includes('ai') || desc.includes('ml') || desc.includes('machine learning')) return 'AI/ML Project';
  if (desc.includes('data') || desc.includes('analysis')) return 'Data Analysis Tool';
  if (technologies.includes('Streamlit')) return 'Data Dashboard';
  
  return 'Software Project';
}

// Assess project complexity
function assessProjectComplexity(technologies: string[], dependencies: string[], keyFiles: string[], readme: string): 'Beginner' | 'Intermediate' | 'Advanced' {
  let score = 0;
  
  // Technology complexity
  if (technologies.includes('Kubernetes') || technologies.includes('Docker')) score += 2;
  if (technologies.includes('TypeScript')) score += 1;
  if (technologies.includes('React') || technologies.includes('Next.js')) score += 1;
  if (technologies.includes('AI') || technologies.includes('ML')) score += 2;
  
  // Dependencies count
  if (dependencies.length > 20) score += 2;
  else if (dependencies.length > 10) score += 1;
  
  // Architecture indicators
  if (keyFiles.length > 10) score += 1;
  if (readme.length > 2000) score += 1;
  
  if (score >= 5) return 'Advanced';
  if (score >= 3) return 'Intermediate';
  return 'Beginner';
}

// Content quality validation
function validateContentQuality(content: string): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check for template language
  const templatePhrases = [
    'addresses modern development challenges',
    'leverages cutting-edge technology',
    'comprehensive solution',
    'modern technology stack',
    'best practices',
    'scalable architecture'
  ];
  
  for (const phrase of templatePhrases) {
    if (content.toLowerCase().includes(phrase.toLowerCase())) {
      issues.push(`Contains template phrase: "${phrase}"`);
    }
  }
  
  // Check content length
  if (content.length < 1000) {
    issues.push('Content too short (less than 1000 characters)');
  }
  
  // Check for specific technical details
  if (!content.includes('```') && !content.includes('`')) {
    issues.push('Missing code examples or technical terms');
  }
  
  // Check for meaningful headings
  const headings = content.match(/#{2,3}\s+(.+)/g) || [];
  if (headings.length < 3) {
    issues.push('Insufficient section structure');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

// Enhanced AI blog generation flow
export const generateEnhancedBlogPost = ai.defineFlow(
  {
    name: 'generateEnhancedBlogPost',
    inputSchema: BlogGenerationInput,
    outputSchema: BlogPostOutput,
  },
  async ({ githubUsername, repositoryName, tone, focus, targetAudience }) => {
    try {
      console.log(`🚀 Starting enhanced blog generation for ${githubUsername}/${repositoryName}`);
      
      // Step 1: Deep repository analysis
      const analysisData = await analyzeRepositoryDeep(githubUsername, repositoryName);
      
      // Step 2: Create enhanced prompt
      const enhancedPrompt = `
You are a senior technical writer who creates publication-ready blog posts. Your content must be specific, detailed, and immediately engaging without any generic template language.

STRICT CONTENT REQUIREMENTS:
- Write 1200-2000 words of substantive, specific technical content
- NO generic phrases like "addresses modern development challenges" or "leverages cutting-edge technology"
- Include concrete technical details and specific implementation insights
- Provide actionable information and real technical value
- Write with authority and expertise about the specific technologies used

PROJECT ANALYSIS:
Repository: ${analysisData.repository.name}
Description: ${analysisData.description}
Project Type: ${analysisData.projectType}
Complexity: ${analysisData.complexity}
Primary Language: ${Object.keys(analysisData.languages)[0] || 'Unknown'}
Technologies: ${analysisData.technologies.join(', ')}
Dependencies: ${analysisData.dependencies.slice(0, 15).join(', ')}
Key Files: ${analysisData.keyFiles.join(', ')}
Stars: ${analysisData.repository.stargazers_count}
README Content: ${analysisData.readme.substring(0, 4000)}

WRITING SPECIFICATIONS:
- Tone: ${tone}
- Focus: ${focus}
- Audience: ${targetAudience}
- Writing Style: ${tone === 'storytelling' ? 'narrative with personal insights' : 
                  tone === 'technical' ? 'precise technical documentation style' :
                  tone === 'casual' ? 'conversational and accessible' : 
                  'professional and authoritative'}

CONTENT STRUCTURE (MANDATORY):
1. **Opening Hook** (2-3 sentences explaining what makes this project unique and valuable)
2. **Technical Architecture** (specific technologies, how they work together, implementation details)
3. **Key Features Deep Dive** (3-4 major features with technical explanations)
4. **Implementation Highlights** (specific coding approaches, algorithms, or design patterns)
5. **Real-World Applications** (concrete use cases and benefits)
6. **Technical Challenges & Solutions** (if focus is learning-journey or technical-deep-dive)
7. **Getting Started** (how to run/use the project)
8. **Conclusion** (value proposition and next steps)

QUALITY EXAMPLES:
✅ GOOD: "LocalAnalyst combines Ollama's local LLM inference engine with Streamlit's reactive web framework to create a privacy-first data analysis environment that processes CSV, JSON, and image files entirely offline using FAISS vector similarity search."

❌ BAD: "This project leverages modern technologies to create a comprehensive solution that addresses today's development challenges."

OUTPUT FORMAT - Return ONLY this JSON structure:
{
  "title": "Specific descriptive title highlighting the main technology or unique aspect",
  "content": "Full markdown blog post (1200+ words) with specific technical details",
  "excerpt": "Compelling 150-word summary highlighting specific technical aspects and value",
  "tags": ["specific-technology-names", "implementation-details", "use-cases"],
  "estimatedReadTime": 7,
  "suggestedImages": ["Specific screenshot descriptions based on actual features"],
  "seoKeywords": ["specific-technical-terms", "framework-names", "implementation-keywords"]
}

MANDATORY: Analyze the actual project and provide specific technical insights. Do not use template language or generic descriptions.
`;

      // Step 3: Generate content with AI
      console.log('🤖 Generating content with enhanced AI prompt...');
      
      const response = await ai.generate({
        model: 'googleai/gemini-2.0-flash',
        prompt: enhancedPrompt,
        config: {
          temperature: 0.3, // Lower for more focused content
          maxOutputTokens: 4000, // Increase for longer content
        },
      });
      
      const responseText = response.text();
      console.log(`📝 AI generated ${responseText.length} characters`);
      
      // Step 4: Parse and validate response
      let blogData: any;
      
      try {
        // Try to extract JSON from response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          blogData = JSON.parse(jsonMatch[0]);
          
          // Validate content quality
          const validation = validateContentQuality(blogData.content || '');
          if (!validation.isValid) {
            console.log('⚠️ Content quality issues detected:', validation.issues);
            // Regenerate if quality is poor
            throw new Error('Content quality validation failed');
          }
          
          console.log('✅ High-quality AI content generated successfully');
        } else {
          throw new Error('Invalid JSON response from AI');
        }
      } catch (parseError) {
        console.log('⚠️ AI response parsing failed, regenerating...');
        throw new Error('Failed to parse AI response');
      }
      
      // Step 5: Enhance with additional metadata
      const enhancedBlogData = {
        ...blogData,
        tableOfContents: generateTableOfContents(blogData.content),
        codeSnippets: extractCodeSnippets(blogData.content),
        projectTimeline: estimateTimeline(analysisData.complexity),
        difficultyLevel: analysisData.complexity,
        architectureSuggestions: generateArchitecturePatterns(analysisData.technologies),
        relatedProjects: generateRelatedProjects(analysisData.technologies, analysisData.projectType),
        technologyStack: categorizeTechnologies(analysisData.technologies),
      };
      
      return BlogPostOutput.parse(enhancedBlogData);
      
    } catch (error: any) {
      console.log('⚠️ AI API unavailable, using intelligent fallback generator');
      
      // Create high-quality content using repository analysis
      const fallbackBlogData = generateIntelligentFallback(analysisData, tone, focus, targetAudience);
      
      return BlogPostOutput.parse(fallbackBlogData);
    }
  }
);

// Intelligent fallback content generator
function generateIntelligentFallback(analysisData: any, tone: string, focus: string, targetAudience: string) {
  const { repository, readme, technologies, projectType, complexity, dependencies } = analysisData;
  
  // Generate a specific, high-quality title
  const title = generateIntelligentTitle(repository, technologies, projectType);
  
  // Generate comprehensive content
  const content = generateIntelligentContent(analysisData, tone, focus, targetAudience);
  
  // Generate compelling excerpt
  const excerpt = generateIntelligentExcerpt(repository, technologies, projectType);
  
  return {
    title,
    content,
    excerpt,
    tags: technologies.slice(0, 8),
    estimatedReadTime: Math.ceil(content.length / 1000 * 4), // More accurate read time
    suggestedImages: generateSpecificImageSuggestions(repository, technologies, projectType),
    seoKeywords: generateSpecificSEOKeywords(repository, technologies, projectType),
    tableOfContents: generateTableOfContents(content),
    codeSnippets: generateRelevantCodeSnippets(technologies, projectType),
    projectTimeline: estimateTimeline(complexity),
    difficultyLevel: complexity,
    architectureSuggestions: generateArchitecturePatterns(technologies),
    relatedProjects: generateRelatedProjects(technologies, projectType),
    technologyStack: categorizeTechnologies(technologies),
  };
}

function generateIntelligentTitle(repository: any, technologies: string[], projectType: string): string {
  const name = repository.name;
  const mainTech = technologies[0] || 'Software';
  
  // Create specific titles based on project analysis
  if (projectType.includes('AI') || projectType.includes('ML')) {
    return `${name}: ${mainTech}-Powered AI Solution for ${projectType.replace('AI/ML Project', 'Machine Learning')}`;
  }
  
  if (projectType.includes('Web Application')) {
    return `Building ${name}: A ${mainTech} Web Application`;
  }
  
  if (projectType.includes('Data')) {
    return `${name}: ${mainTech} Data Analysis Platform`;
  }
  
  if (projectType.includes('API')) {
    return `${name}: ${mainTech} Backend API Implementation`;
  }
  
  return `${name}: ${mainTech} ${projectType} Deep Dive`;
}

function generateIntelligentContent(analysisData: any, tone: string, focus: string, targetAudience: string): string {
  const { repository, readme, technologies, projectType, complexity, dependencies, description } = analysisData;
  
  let content = `# ${generateIntelligentTitle(repository, technologies, projectType)}\n\n`;
  
  // Opening hook with specific details
  content += `## Overview\n\n`;
  content += `${repository.name} is a ${complexity.toLowerCase()}-level ${projectType.toLowerCase()} that demonstrates practical implementation of ${technologies.slice(0, 3).join(', ')}. `;
  
  if (description) {
    content += `${description} `;
  }
  
  content += `This project showcases real-world application of modern development practices and provides valuable insights for ${targetAudience}.\n\n`;
  
  // Technical architecture section
  content += `## Technical Architecture\n\n`;
  content += `The project is built using a modern technology stack centered around **${technologies[0] || 'the primary language'}**`;
  
  if (technologies.length > 1) {
    content += `, with additional technologies including ${technologies.slice(1, 4).join(', ')}`;
  }
  
  content += `. The architecture follows ${complexity === 'Advanced' ? 'enterprise-grade' : complexity === 'Intermediate' ? 'production-ready' : 'clean and maintainable'} design patterns.\n\n`;
  
  // Technology stack breakdown
  if (technologies.length > 0) {
    content += `### Key Technologies\n\n`;
    technologies.slice(0, 6).forEach(tech => {
      content += `- **${tech}**: ${getTechnologyDescription(tech)}\n`;
    });
    content += `\n`;
  }
  
  // Project features (extracted from README if available)
  if (readme && readme.length > 100) {
    content += `## Key Features\n\n`;
    content += extractFeaturesFromReadme(readme);
    content += `\n`;
  }
  
  // Implementation insights
  content += `## Implementation Highlights\n\n`;
  content += generateImplementationInsights(technologies, dependencies, complexity, projectType);
  
  // Getting started section
  if (readme && readme.includes('install')) {
    content += `## Getting Started\n\n`;
    content += extractGettingStartedFromReadme(readme);
  } else {
    content += `## Getting Started\n\n`;
    content += generateGettingStartedInstructions(technologies, repository.name);
  }
  
  // Use cases and applications
  content += `## Real-World Applications\n\n`;
  content += generateUseCases(projectType, technologies, description);
  
  // Conclusion
  content += `## Conclusion\n\n`;
  content += `${repository.name} represents a well-implemented ${projectType.toLowerCase()} that effectively utilizes ${technologies.slice(0, 2).join(' and ')} to deliver practical functionality. `;
  content += `The project demonstrates ${complexity.toLowerCase()}-level development practices and serves as a valuable reference for similar implementations.\n\n`;
  
  content += `**Key Takeaways:**\n`;
  content += `- Effective use of ${technologies[0]} for ${projectType.toLowerCase()} development\n`;
  content += `- ${complexity}-level implementation with clean, maintainable code\n`;
  content += `- Practical application of modern development tools and practices\n\n`;
  
  content += `[View on GitHub](${repository.html_url})\n\n`;
  content += `*This project demonstrates practical software engineering skills and modern development practices.*`;
  
  return content;
}

function generateIntelligentExcerpt(repository: any, technologies: string[], projectType: string): string {
  const description = repository.description || '';
  const mainTech = technologies[0] || 'modern technologies';
  
  return `${repository.name} is a ${projectType.toLowerCase()} built with ${mainTech}${technologies.length > 1 ? ` and ${technologies.slice(1, 3).join(', ')}` : ''}. ${description} This implementation showcases practical development techniques and provides valuable insights into ${mainTech} development. The project demonstrates real-world application of modern software engineering practices and delivers functional solutions for ${projectType.toLowerCase()} development.`;
}

function getTechnologyDescription(tech: string): string {
  const descriptions: { [key: string]: string } = {
    'Python': 'Versatile programming language with extensive ecosystem for data analysis and web development',
    'TypeScript': 'Typed superset of JavaScript providing enhanced developer experience and code safety',
    'React': 'Component-based library for building user interfaces with efficient virtual DOM',
    'Next.js': 'React framework with server-side rendering and static generation capabilities',
    'Node.js': 'JavaScript runtime for building scalable server-side applications',
    'Streamlit': 'Python framework for creating interactive web applications for data science',
    'FastAPI': 'Modern Python framework for building high-performance APIs',
    'Docker': 'Containerization platform for consistent deployment across environments',
    'PostgreSQL': 'Advanced relational database with strong consistency and ACID compliance',
    'MongoDB': 'NoSQL document database for flexible data modeling',
    'Ollama': 'Local large language model inference engine for privacy-focused AI applications',
  };
  
  return descriptions[tech] || `Modern technology for enhanced development capabilities`;
}

function extractFeaturesFromReadme(readme: string): string {
  // Extract bullet points or numbered lists from README
  const lines = readme.split('\n');
  const features: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.match(/^[-*]\s+/) || trimmed.match(/^\d+\.\s+/)) {
      if (trimmed.length > 10 && trimmed.length < 100) {
        features.push(trimmed.replace(/^[-*]\s*/, '- ').replace(/^\d+\.\s*/, '- '));
      }
    }
  }
  
  if (features.length > 0) {
    return features.slice(0, 6).join('\n') + '\n';
  }
  
  // Fallback: extract first few sentences
  const sentences = readme.split(/[.!?]+/).filter(s => s.trim().length > 20);
  return sentences.slice(0, 3).map(s => `- ${s.trim()}`).join('\n') + '\n';
}

function generateImplementationInsights(technologies: string[], dependencies: string[], complexity: string, projectType: string): string {
  let insights = '';
  
  if (technologies.includes('TypeScript')) {
    insights += `The project leverages TypeScript for enhanced code safety and developer experience, providing compile-time error checking and improved IDE support.\n\n`;
  }
  
  if (technologies.includes('React')) {
    insights += `React components are structured using modern patterns with functional components and hooks for state management and lifecycle handling.\n\n`;
  }
  
  if (technologies.includes('Python')) {
    insights += `Python implementation follows PEP 8 style guidelines and utilizes the language's extensive standard library for efficient development.\n\n`;
  }
  
  if (complexity === 'Advanced') {
    insights += `The advanced complexity indicates sophisticated architectural patterns, potentially including microservices, advanced algorithms, or complex data processing pipelines.\n\n`;
  }
  
  if (dependencies.length > 10) {
    insights += `The project utilizes ${dependencies.length} dependencies, indicating a comprehensive approach to leveraging existing libraries and frameworks for enhanced functionality.\n\n`;
  }
  
  return insights || `The implementation demonstrates clean code principles and modern development practices appropriate for ${projectType.toLowerCase()} development.\n\n`;
}

function extractGettingStartedFromReadme(readme: string): string {
  const lines = readme.split('\n');
  let inInstallSection = false;
  const instructions: string[] = [];
  
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes('install') || lower.includes('getting started') || lower.includes('setup')) {
      inInstallSection = true;
      continue;
    }
    
    if (inInstallSection) {
      if (line.trim().startsWith('#') && !lower.includes('install')) {
        break;
      }
      if (line.trim()) {
        instructions.push(line);
      }
    }
  }
  
  return instructions.slice(0, 10).join('\n') + '\n\n';
}

function generateGettingStartedInstructions(technologies: string[], projectName: string): string {
  let instructions = `To get started with ${projectName}:\n\n`;
  
  if (technologies.includes('Node.js') || technologies.includes('React') || technologies.includes('Next.js')) {
    instructions += `1. Clone the repository:\n\`\`\`bash\ngit clone <repository-url>\ncd ${projectName}\n\`\`\`\n\n`;
    instructions += `2. Install dependencies:\n\`\`\`bash\nnpm install\n\`\`\`\n\n`;
    instructions += `3. Start the development server:\n\`\`\`bash\nnpm run dev\n\`\`\`\n\n`;
  } else if (technologies.includes('Python')) {
    instructions += `1. Clone the repository:\n\`\`\`bash\ngit clone <repository-url>\ncd ${projectName}\n\`\`\`\n\n`;
    instructions += `2. Create virtual environment:\n\`\`\`bash\npython -m venv venv\nsource venv/bin/activate  # On Windows: venv\\Scripts\\activate\n\`\`\`\n\n`;
    instructions += `3. Install requirements:\n\`\`\`bash\npip install -r requirements.txt\n\`\`\`\n\n`;
  }
  
  return instructions;
}

function generateUseCases(projectType: string, technologies: string[], description: string): string {
  let useCases = '';
  
  if (projectType.includes('AI') || projectType.includes('ML')) {
    useCases += `This AI/ML project can be applied to:\n`;
    useCases += `- Data analysis and pattern recognition tasks\n`;
    useCases += `- Automated decision-making systems\n`;
    useCases += `- Predictive modeling and forecasting\n`;
    useCases += `- Natural language processing applications\n\n`;
  } else if (projectType.includes('Web Application')) {
    useCases += `This web application serves multiple use cases:\n`;
    useCases += `- User interface development and prototyping\n`;
    useCases += `- Business process automation\n`;
    useCases += `- Data visualization and reporting\n`;
    useCases += `- Customer-facing service delivery\n\n`;
  } else if (projectType.includes('Data')) {
    useCases += `This data analysis tool enables:\n`;
    useCases += `- Business intelligence and reporting\n`;
    useCases += `- Data exploration and visualization\n`;
    useCases += `- Statistical analysis and insights\n`;
    useCases += `- Decision support systems\n\n`;
  } else {
    useCases += `This ${projectType.toLowerCase()} provides practical solutions for:\n`;
    useCases += `- Development workflow optimization\n`;
    useCases += `- Code quality and maintainability improvements\n`;
    useCases += `- Team collaboration and productivity\n`;
    useCases += `- Learning and skill development\n\n`;
  }
  
  return useCases;
}

function generateSpecificImageSuggestions(repository: any, technologies: string[], projectType: string): string[] {
  const suggestions = [];
  
  if (projectType.includes('Web')) {
    suggestions.push('Application homepage screenshot');
    suggestions.push('User interface components demo');
    suggestions.push('Responsive design showcase');
  } else if (projectType.includes('Data')) {
    suggestions.push('Data analysis dashboard');
    suggestions.push('Visualization charts and graphs');
    suggestions.push('Data processing workflow');
  } else if (projectType.includes('API')) {
    suggestions.push('API endpoint documentation');
    suggestions.push('Request/response examples');
    suggestions.push('API testing results');
  } else {
    suggestions.push(`${repository.name} main interface`);
    suggestions.push('Feature demonstration');
    suggestions.push('Technical architecture diagram');
  }
  
  suggestions.push('Code structure overview');
  
  return suggestions;
}

function generateSpecificSEOKeywords(repository: any, technologies: string[], projectType: string): string[] {
  const keywords = [
    repository.name.toLowerCase(),
    ...technologies.map(t => t.toLowerCase()),
    projectType.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim(),
    'development',
    'programming',
    'software engineering',
    'open source'
  ];
  
  // Add technology-specific keywords
  if (technologies.includes('React')) {
    keywords.push('react development', 'react components', 'frontend development');
  }
  if (technologies.includes('Python')) {
    keywords.push('python programming', 'python development', 'backend development');
  }
  if (technologies.includes('TypeScript')) {
    keywords.push('typescript programming', 'type safety', 'javascript development');
  }
  
  return [...new Set(keywords)].slice(0, 12);
}

function generateRelevantCodeSnippets(technologies: string[], projectType: string) {
  const snippets = [];
  
  if (technologies.includes('React')) {
    snippets.push({
      language: 'jsx',
      code: 'const Component = () => {\n  return <div>Hello World</div>;\n};',
      description: 'Basic React component structure'
    });
  }
  
  if (technologies.includes('Python')) {
    snippets.push({
      language: 'python',
      code: 'def main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()',
      description: 'Python application entry point'
    });
  }
  
  if (technologies.includes('TypeScript')) {
    snippets.push({
      language: 'typescript',
      code: 'interface User {\n  name: string;\n  id: number;\n}\n\nconst user: User = { name: "John", id: 1 };',
      description: 'TypeScript interface definition'
    });
  }
  
  return snippets;
}

// Helper functions
function generateTableOfContents(content: string) {
  const headings = content.match(/#{1,4}\s+(.+)/g) || [];
  return headings.map(heading => {
    const level = (heading.match(/#/g) || []).length;
    const title = heading.replace(/^#+\s+/, '');
    const anchor = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return { title, level, anchor };
  });
}

function extractCodeSnippets(content: string) {
  const codeBlocks = content.match(/```(\w+)?\n([\s\S]*?)```/g) || [];
  return codeBlocks.map(block => {
    const match = block.match(/```(\w+)?\n([\s\S]*?)```/);
    return {
      language: match?.[1] || 'text',
      code: match?.[2]?.trim() || '',
      description: 'Code example'
    };
  });
}

function estimateTimeline(complexity: string): string {
  switch (complexity) {
    case 'Beginner': return '1-2 weeks';
    case 'Intermediate': return '1-2 months';
    case 'Advanced': return '3-6 months';
    default: return '1-2 months';
  }
}

function generateArchitecturePatterns(technologies: string[]): string[] {
  const patterns: string[] = [];
  
  if (technologies.includes('React')) patterns.push('Component-Based Architecture');
  if (technologies.includes('Node.js')) patterns.push('RESTful API Design');
  if (technologies.includes('TypeScript')) patterns.push('Type-Safe Development');
  if (technologies.includes('Docker')) patterns.push('Containerization');
  if (technologies.includes('PostgreSQL')) patterns.push('Relational Database Design');
  
  return patterns.length > 0 ? patterns : ['Modular Architecture'];
}

function generateRelatedProjects(technologies: string[], projectType: string): string[] {
  const projects: string[] = [];
  
  if (technologies.includes('React')) projects.push('React Portfolio Website', 'React Dashboard');
  if (technologies.includes('Python')) projects.push('Python CLI Tool', 'Data Analysis Script');
  if (projectType.includes('AI')) projects.push('Machine Learning Pipeline', 'AI Chatbot');
  
  return projects;
}

function categorizeTechnologies(technologies: string[]) {
  const stack = {
    frontend: [] as string[],
    backend: [] as string[],
    database: [] as string[],
    tools: [] as string[],
    frameworks: [] as string[]
  };
  
  const frontendTech = ['React', 'Vue.js', 'Angular', 'Next.js', 'TypeScript', 'JavaScript'];
  const backendTech = ['Node.js', 'Python', 'Java', 'Go', 'PHP'];
  const databaseTech = ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL'];
  const toolsTech = ['Docker', 'Kubernetes', 'Git'];
  const frameworkTech = ['Express', 'Django', 'Flask', 'Streamlit'];
  
  technologies.forEach(tech => {
    if (frontendTech.includes(tech)) stack.frontend.push(tech);
    else if (backendTech.includes(tech)) stack.backend.push(tech);
    else if (databaseTech.includes(tech)) stack.database.push(tech);
    else if (toolsTech.includes(tech)) stack.tools.push(tech);
    else if (frameworkTech.includes(tech)) stack.frameworks.push(tech);
  });
  
  return stack;
}

// Export the enhanced generator as default
export { generateEnhancedBlogPost as generateBlogPost };