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

// Output schema for generated blog post
const BlogPostOutput = z.object({
  title: z.string(),
  content: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()),
  estimatedReadTime: z.number(),
  suggestedImages: z.array(z.string()),
  seoKeywords: z.array(z.string()),
  // Enhanced features
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

// Enhanced Technology Detection and Analysis
interface TechnologyStack {
  frontend: string[];
  backend: string[];
  database: string[];
  tools: string[];
  frameworks: string[];
}

interface ProjectAnalysis {
  projectType: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  techStack: TechnologyStack;
  estimatedTimeline: string;
  architecturePatterns: string[];
}

const TECHNOLOGY_PATTERNS = {
  frontend: {
    'React': ['react', '@types/react', 'react-dom'],
    'Vue.js': ['vue', '@vue/cli', 'vuejs'],
    'Angular': ['@angular/core', '@angular/cli', 'angular'],
    'Next.js': ['next', 'nextjs'],
    'Svelte': ['svelte', '@sveltejs'],
    'TypeScript': ['typescript', '@types'],
    'Tailwind CSS': ['tailwindcss', '@tailwindcss'],
    'Bootstrap': ['bootstrap', 'react-bootstrap'],
    'Material-UI': ['@mui/material', '@material-ui'],
    'Chakra UI': ['@chakra-ui'],
  },
  backend: {
    'Node.js': ['express', 'fastify', 'koa', 'hapi'],
    'Python': ['django', 'flask', 'fastapi', 'tornado'],
    'Java': ['spring', 'hibernate', 'maven'],
    'C#': ['asp.net', 'entity-framework', 'nuget'],
    'Go': ['gin', 'fiber', 'echo'],
    'Ruby': ['rails', 'sinatra', 'grape'],
    'PHP': ['laravel', 'symfony', 'codeigniter'],
    'Rust': ['actix-web', 'rocket', 'warp'],
  },
  database: {
    'MongoDB': ['mongoose', 'mongodb', 'mongo'],
    'PostgreSQL': ['pg', 'postgres', 'postgresql'],
    'MySQL': ['mysql', 'mysql2'],
    'SQLite': ['sqlite', 'sqlite3'],
    'Redis': ['redis', 'ioredis'],
    'Firebase': ['firebase', '@firebase'],
    'Supabase': ['supabase', '@supabase'],
    'Prisma': ['prisma', '@prisma'],
  },
  tools: {
    'Docker': ['docker', 'dockerfile'],
    'Kubernetes': ['kubectl', 'helm'],
    'GitHub Actions': ['.github/workflows'],
    'Jest': ['jest', '@jest'],
    'Cypress': ['cypress'],
    'ESLint': ['eslint'],
    'Prettier': ['prettier'],
    'Webpack': ['webpack'],
    'Vite': ['vite', '@vitejs'],
  }
};

function analyzeAdvancedTechnologyStack(dependencies: string[], devDependencies: string[], languages: Record<string, number>, keyFiles: string[]): TechnologyStack {
  const allDeps = [...dependencies, ...devDependencies];
  const techStack: TechnologyStack = {
    frontend: [],
    backend: [],
    database: [],
    tools: [],
    frameworks: [],
  };

  // Analyze dependencies
  Object.entries(TECHNOLOGY_PATTERNS).forEach(([category, patterns]) => {
    Object.entries(patterns).forEach(([tech, identifiers]) => {
      const hasMatch = identifiers.some(identifier => 
        allDeps.some(dep => dep.includes(identifier)) ||
        keyFiles.some(file => file.includes(identifier))
      );
      
      if (hasMatch && !techStack[category as keyof TechnologyStack].includes(tech)) {
        techStack[category as keyof TechnologyStack].push(tech);
      }
    });
  });

  // Analyze languages
  Object.keys(languages).forEach(lang => {
    const langLower = lang.toLowerCase();
    if (['javascript', 'typescript'].includes(langLower) && !techStack.frontend.includes('TypeScript') && langLower === 'typescript') {
      techStack.frontend.push('TypeScript');
    }
    if (langLower === 'python' && !techStack.backend.some(b => b.includes('Python'))) {
      techStack.backend.push('Python');
    }
    if (langLower === 'java' && !techStack.backend.some(b => b.includes('Java'))) {
      techStack.backend.push('Java');
    }
    if (langLower === 'go' && !techStack.backend.some(b => b.includes('Go'))) {
      techStack.backend.push('Go');
    }
  });

  return techStack;
}

function determineProjectType(techStack: TechnologyStack, dependencies: string[], description: string): string {
  if (techStack.frontend.length > 0 && techStack.backend.length > 0) {
    return 'Full-Stack Application';
  }
  if (techStack.frontend.length > 0) {
    return 'Frontend Application';
  }
  if (techStack.backend.length > 0) {
    return 'Backend Service';
  }
  if (dependencies.some(dep => dep.includes('react-native') || dep.includes('expo'))) {
    return 'Mobile Application';
  }
  if (dependencies.some(dep => dep.includes('electron'))) {
    return 'Desktop Application';
  }
  if (dependencies.some(dep => dep.includes('cli') || dep.includes('commander'))) {
    return 'Command Line Tool';
  }
  if (description?.toLowerCase().includes('library') || description?.toLowerCase().includes('package')) {
    return 'Library/Package';
  }
  if (description?.toLowerCase().includes('api')) {
    return 'API Service';
  }
  return 'Software Project';
}

function assessComplexity(techStack: TechnologyStack, dependencies: string[], codeFiles: string[]): 'Beginner' | 'Intermediate' | 'Advanced' {
  let complexityScore = 0;
  
  // Technology stack complexity
  const totalTechs = Object.values(techStack).flat().length;
  complexityScore += totalTechs * 2;
  
  // Dependencies count
  complexityScore += Math.min(dependencies.length / 10, 10);
  
  // Advanced patterns
  if (dependencies.some(dep => dep.includes('microservice') || dep.includes('kubernetes'))) {
    complexityScore += 15;
  }
  if (dependencies.some(dep => dep.includes('graphql') || dep.includes('apollo'))) {
    complexityScore += 10;
  }
  if (techStack.database.length > 1) {
    complexityScore += 8;
  }
  if (techStack.tools.some(tool => tool.includes('Docker') || tool.includes('Kubernetes'))) {
    complexityScore += 12;
  }
  
  if (complexityScore >= 25) return 'Advanced';
  if (complexityScore >= 12) return 'Intermediate';
  return 'Beginner';
}

function estimateProjectTimeline(complexity: string, projectType: string, techStack: TechnologyStack): string {
  const baseTimeframes = {
    'Beginner': { min: 1, max: 4 },
    'Intermediate': { min: 2, max: 8 },
    'Advanced': { min: 4, max: 16 }
  };
  
  const typeMultiplier = {
    'Full-Stack Application': 1.5,
    'Frontend Application': 1.0,
    'Backend Service': 1.2,
    'Mobile Application': 1.8,
    'Desktop Application': 1.6,
    'Library/Package': 0.8,
    'Command Line Tool': 0.6,
    'API Service': 1.0,
    'Software Project': 1.0
  };
  
  const base = baseTimeframes[complexity as keyof typeof baseTimeframes];
  const multiplier = typeMultiplier[projectType as keyof typeof typeMultiplier] || 1.0;
  
  const minWeeks = Math.ceil(base.min * multiplier);
  const maxWeeks = Math.ceil(base.max * multiplier);
  
  if (maxWeeks <= 4) {
    return `${minWeeks}-${maxWeeks} weeks`;
  } else if (maxWeeks <= 12) {
    const minMonths = Math.ceil(minWeeks / 4);
    const maxMonths = Math.ceil(maxWeeks / 4);
    return `${minMonths}-${maxMonths} months`;
  } else {
    return `${Math.ceil(minWeeks / 4)}+ months`;
  }
}

function generateArchitecturePatterns(techStack: TechnologyStack, projectType: string): string[] {
  const patterns: string[] = [];
  
  if (techStack.frontend.includes('React')) {
    patterns.push('Component-Based Architecture', 'Virtual DOM Pattern');
  }
  if (techStack.backend.length > 0) {
    patterns.push('RESTful API Design', 'MVC Architecture');
  }
  if (techStack.database.length > 0) {
    patterns.push('Data Access Layer', 'Repository Pattern');
  }
  if (projectType === 'Full-Stack Application') {
    patterns.push('Client-Server Architecture', 'Separation of Concerns');
  }
  if (techStack.tools.includes('Docker')) {
    patterns.push('Containerization', 'Microservices Architecture');
  }
  
  return patterns.slice(0, 5); // Limit to 5 patterns
}

// Dynamic prompt generation based on tone, focus, and audience
function generateDynamicPrompt(tone: string, focus: string, targetAudience: string, repoAnalysis: any, analysisData: any): string {
  const baseInfo = `
## Project Information:
- **Repository**: ${repoAnalysis.repository.name}
- **Description**: ${analysisData.description}
- **Technologies**: ${analysisData.technologies.join(', ')}
- **Dependencies**: ${analysisData.dependencies.slice(0, 10).join(', ')}
- **Topics**: ${analysisData.topics.join(', ')}

## README Content:
${analysisData.readme.substring(0, 3000)}
`;

  // Generate completely different prompts based on combinations
  const promptKey = `${tone}-${focus}-${targetAudience}`;
  
  switch (promptKey) {
    // TECHNICAL TONE VARIATIONS
    case 'technical-technical-deep-dive-developers':
      return `You are a senior software architect writing for experienced developers. Create a comprehensive technical analysis.

${baseInfo}

## Writing Style:
- Use precise technical terminology and architectural patterns
- Include detailed code analysis and implementation strategies
- Focus on performance implications, scalability considerations, and design patterns
- Write in a professional, authoritative tone with deep technical insights

## Required Structure:
1. **Technical Architecture Overview** (200-300 words)
2. **Implementation Deep Dive** with code examples (400-500 words)
3. **Performance & Scalability Analysis** (200-300 words)
4. **Design Patterns & Best Practices** (200-300 words)
5. **Technical Recommendations** (100-200 words)

Generate JSON: {title, content, excerpt, tags, estimatedReadTime, suggestedImages, seoKeywords}`;

    case 'technical-showcase-business':
      return `You are a technical consultant presenting to business stakeholders. Focus on technical capabilities that drive business value.

${baseInfo}

## Writing Style:
- Balance technical accuracy with business-friendly language
- Emphasize ROI, efficiency gains, and competitive advantages
- Use concrete examples and measurable outcomes
- Professional tone with focus on business impact

## Required Structure:
1. **Executive Summary** - Business value proposition (150-200 words)
2. **Technical Capabilities** - What the system can do (300-400 words)
3. **Business Impact** - How it solves problems (250-350 words)
4. **Implementation Benefits** - Time, cost, efficiency gains (200-250 words)
5. **Strategic Recommendations** (100-150 words)

Generate JSON: {title, content, excerpt, tags, estimatedReadTime, suggestedImages, seoKeywords}`;

    // CASUAL TONE VARIATIONS
    case 'casual-learning-journey-students':
      return `You are a coding mentor sharing your learning experience with fellow students. Write like you're explaining to a friend.

${baseInfo}

## Writing Style:
- Conversational, encouraging, and relatable tone
- Share struggles, "aha moments," and learning breakthroughs
- Include beginner-friendly explanations and encouragement
- Use personal anecdotes and informal language

## Required Structure:
1. **My Coding Journey** - Personal introduction (150-200 words)
2. **The Challenge** - What problem I wanted to solve (200-250 words)
3. **Learning & Building** - Step-by-step discoveries (400-500 words)
4. **Mistakes & Breakthroughs** - What went wrong and right (250-300 words)
5. **Lessons Learned** - Key takeaways for other students (150-200 words)

Generate JSON: {title, content, excerpt, tags, estimatedReadTime, suggestedImages, seoKeywords}`;

    case 'casual-tutorial-general':
      return `You are a friendly developer creating an accessible tutorial for anyone interested in technology.

${baseInfo}

## Writing Style:
- Clear, simple language that anyone can understand
- Step-by-step approach with encouraging tone
- Avoid jargon, explain concepts simply
- Enthusiastic and approachable voice

## Required Structure:
1. **What We're Building** - Simple project overview (150-200 words)
2. **What You'll Need** - Prerequisites and tools (100-150 words)
3. **Step-by-Step Guide** - Easy-to-follow instructions (500-600 words)
4. **Testing & Validation** - How to know it works (150-200 words)
5. **Next Steps** - Where to go from here (100-150 words)

Generate JSON: {title, content, excerpt, tags, estimatedReadTime, suggestedImages, seoKeywords}`;

    // PROFESSIONAL TONE VARIATIONS
    case 'professional-overview-recruiters':
      return `You are writing a professional project showcase for recruitment and career purposes.

${baseInfo}

## Writing Style:
- Professional, confident, and achievement-focused
- Highlight technical skills, problem-solving abilities, and impact
- Quantify results where possible
- Structured, scannable format for busy recruiters

## Required Structure:
1. **Project Overview** - Problem solved and impact (150-200 words)
2. **Technical Skills Demonstrated** - Key competencies (200-250 words)
3. **Implementation Process** - Approach and methodology (250-300 words)
4. **Results & Achievements** - Measurable outcomes (150-200 words)
5. **Professional Growth** - Skills gained and career impact (100-150 words)

Generate JSON: {title, content, excerpt, tags, estimatedReadTime, suggestedImages, seoKeywords}`;

    case 'professional-showcase-developers':
      return `You are a professional developer presenting a polished project to peers and potential collaborators.

${baseInfo}

## Writing Style:
- Professional yet approachable technical communication
- Focus on innovative solutions and technical excellence
- Balanced coverage of features, architecture, and implementation
- Confident presentation of technical decisions

## Required Structure:
1. **Project Vision** - Goals and innovative aspects (150-200 words)
2. **Technical Architecture** - System design and key decisions (300-350 words)
3. **Feature Showcase** - Core capabilities and user experience (250-300 words)
4. **Development Process** - Methodology and best practices (200-250 words)
5. **Future Roadmap** - Planned improvements and scaling (100-150 words)

Generate JSON: {title, content, excerpt, tags, estimatedReadTime, suggestedImages, seoKeywords}`;

    // STORYTELLING TONE VARIATIONS
    case 'storytelling-learning-journey-general':
      return `You are a storyteller sharing the narrative of a coding project, making it engaging for everyone.

${baseInfo}

## Writing Style:
- Narrative structure with beginning, middle, and end
- Personal anecdotes and emotional journey
- Accessible language that draws readers in
- Focus on the human side of development

## Required Structure:
1. **The Beginning** - The spark of an idea (200-250 words)
2. **The Challenge** - Obstacles and setbacks (250-300 words)
3. **The Journey** - Learning, building, and discovering (400-450 words)
4. **The Breakthrough** - Key moments of success (200-250 words)
5. **The Reflection** - What this project meant personally (150-200 words)

Generate JSON: {title, content, excerpt, tags, estimatedReadTime, suggestedImages, seoKeywords}`;

    case 'storytelling-showcase-business':
      return `You are crafting a compelling business narrative around a technical solution.

${baseInfo}

## Writing Style:
- Engaging storytelling with business focus
- Narrative arc showing problem → solution → impact
- Accessible to non-technical business audiences
- Emphasis on transformation and value creation

## Required Structure:
1. **The Challenge** - Business problem that needed solving (200-250 words)
2. **The Vision** - Imagining a better solution (150-200 words)
3. **The Solution** - How technology addressed the need (300-350 words)
4. **The Transformation** - Impact and results achieved (200-250 words)
5. **The Future** - Ongoing value and potential (150-200 words)

Generate JSON: {title, content, excerpt, tags, estimatedReadTime, suggestedImages, seoKeywords}`;

    // DEFAULT FALLBACK with enhanced differentiation
    default:
      return generateFallbackPrompt(tone, focus, targetAudience, repoAnalysis, analysisData);
  }
}

function generateFallbackPrompt(tone: string, focus: string, targetAudience: string, repoAnalysis: any, analysisData: any): string {
  const baseInfo = `
## Project Information:
- **Repository**: ${repoAnalysis.repository.name}
- **Description**: ${analysisData.description}
- **Technologies**: ${analysisData.technologies.join(', ')}
- **Dependencies**: ${analysisData.dependencies.slice(0, 10).join(', ')}
- **Topics**: ${analysisData.topics.join(', ')}

## README Content:
${analysisData.readme.substring(0, 3000)}
`;

  // Dynamic tone adaptations
  const toneInstructions = {
    technical: "Use precise technical language, detailed implementation analysis, and architecture-focused content. Write for experienced developers who want deep technical insights.",
    casual: "Write in a conversational, approachable tone. Use simple language, personal anecdotes, and encouraging explanations. Make technical concepts accessible.",
    professional: "Maintain a polished, confident tone. Balance technical depth with clear communication. Focus on results, methodology, and professional impact.",
    storytelling: "Create a narrative structure with emotional engagement. Tell the story of the project's development, challenges overcome, and lessons learned."
  };

  // Dynamic focus adaptations
  const focusInstructions = {
    'technical-deep-dive': "Dive deep into architecture, implementation details, code patterns, performance considerations, and technical decision-making processes.",
    'learning-journey': "Focus on the learning process, challenges faced, skills developed, mistakes made, and insights gained throughout the project development.",
    'showcase': "Highlight features, capabilities, user experience, and impressive aspects of the project. Demonstrate what makes it special and innovative.",
    'tutorial': "Provide step-by-step guidance, practical instructions, and actionable insights that readers can follow to build or understand similar projects.",
    'overview': "Give a comprehensive but balanced view covering purpose, implementation, features, and impact without going too deep into any single aspect."
  };

  // Dynamic audience adaptations
  const audienceInstructions = {
    developers: "Write for technical peers who understand programming concepts. Include code examples, architectural discussions, and implementation details.",
    business: "Focus on business value, ROI, problem-solving capabilities, and strategic impact. Use business-friendly language while maintaining technical credibility.",
    general: "Make content accessible to anyone interested in technology. Explain concepts clearly without assuming technical background.",
    recruiters: "Emphasize skills demonstrated, problem-solving approach, and professional competencies. Structure content for easy scanning and evaluation.",
    students: "Write for learners who want to understand and grow. Include educational content, learning resources, and encouragement for skill development."
  };

  return `You are an expert ${tone} writer creating content for ${targetAudience}.

${baseInfo}

## Writing Instructions:
**Tone**: ${toneInstructions[tone as keyof typeof toneInstructions]}

**Focus**: ${focusInstructions[focus as keyof typeof focusInstructions]}

**Audience**: ${audienceInstructions[targetAudience as keyof typeof audienceInstructions]}

## Content Requirements:
- Write 1000-1500 words with clear structure
- Use appropriate markdown formatting
- Include relevant code examples if applicable
- Create engaging headlines and sections
- Ensure content matches the specified tone, focus, and audience

Generate a JSON object with: title, content, excerpt, tags, estimatedReadTime, suggestedImages, seoKeywords`;
}

// Main blog generation flow
export const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPost',
    inputSchema: BlogGenerationInput,
    outputSchema: BlogPostOutput,
  },
  async (input) => {
    const { githubUsername, repositoryName, tone, focus, targetAudience } = input;

    // Step 1: Analyze the repository
    console.log(`🔍 Analyzing repository: ${githubUsername}/${repositoryName}`);
    
    const repoAnalysis = await GitHubService.analyzeRepository(githubUsername, repositoryName);
    
    if (!repoAnalysis) {
      throw new Error('Failed to analyze repository');
    }

    // Step 2: Extract key information for AI analysis
    const analysisData = {
      repository: repoAnalysis.repository,
      readme: repoAnalysis.readme || 'No README available',
      technologies: Object.keys(repoAnalysis.languages),
      dependencies: repoAnalysis.packageJson?.dependencies ? Object.keys(repoAnalysis.packageJson.dependencies) : [],
      devDependencies: repoAnalysis.packageJson?.devDependencies ? Object.keys(repoAnalysis.packageJson.devDependencies) : [],
      keyFiles: repoAnalysis.keyFiles,
      description: repoAnalysis.repository.description || 'No description available',
      topics: repoAnalysis.repository.topics || [],
    };

    // Step 3: Generate blog post content using AI
    console.log('🤖 Generating blog post content with AI...');
    
    let blogData;
    
    try {
      const blogPrompt = generateDynamicPrompt(tone, focus, targetAudience, repoAnalysis, analysisData);

      const response = await ai.generate({
        model: 'googleai/gemini-2.0-flash',
        prompt: blogPrompt,
        config: {
          temperature: 0.7,
          maxOutputTokens: 3000,
        },
      });

      // Step 4: Parse and validate the AI response
      const responseText = response.text();
      
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        blogData = JSON.parse(jsonMatch[0]);
        console.log('✅ Successfully generated AI blog post');
      } else {
        console.log('⚠️ AI response not in JSON format, using structured fallback');
        // Create structured data from plain text response
        const lines = responseText.split('\n');
        blogData = {
          title: lines.find((l: string) => l.includes('Title:'))?.replace('Title:', '').trim() || 
                 generateDynamicTitle(repoAnalysis, analysisData, tone, focus, targetAudience),
          content: enhanceAIResponse(responseText, repoAnalysis, analysisData),
          excerpt: generateSmartExcerpt(responseText, repoAnalysis, analysisData),
          tags: analysisData.technologies.slice(0, 5),
          estimatedReadTime: Math.max(1, Math.floor(responseText.length / 1000)),
          suggestedImages: [
            'Project overview screenshot',
            'Code architecture diagram',
            'Demo or features showcase'
          ],
          seoKeywords: [...analysisData.technologies, repoAnalysis.repository.name, 'project', 'development']
        };
      }
    } catch (error: any) {
      // Handle specific API errors gracefully
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        console.log('⚠️ AI API quota exceeded, using enhanced fallback generator');
      } else if (error.message?.includes('401') || error.message?.includes('403')) {
        console.log('⚠️ AI API authentication error, using enhanced fallback generator');
      } else {
        console.log('⚠️ AI API error, using enhanced fallback generator:', error.message);
      }
      
      // Enhanced fallback blog post with better content generation
      blogData = generateEnhancedFallbackContent(repoAnalysis, analysisData, tone, focus, targetAudience);
    }

    // Step 5: Validate and return the result
    return BlogPostOutput.parse(blogData);
  }
);

// Enhanced fallback content generator with better intelligence
function generateEnhancedFallbackContent(repoAnalysis: any, analysisData: any, tone: string, focus: string, targetAudience: string): any {
  // Advanced analysis
  const techStack = analyzeAdvancedTechnologyStack(
    analysisData.dependencies, 
    analysisData.devDependencies, 
    repoAnalysis.languages || {}, 
    analysisData.keyFiles
  );
  
  const projectType = determineProjectType(techStack, analysisData.dependencies, analysisData.description);
  const complexity = assessComplexity(techStack, analysisData.dependencies, analysisData.keyFiles);
  const timeline = estimateProjectTimeline(complexity, projectType, techStack);
  const architecturePatterns = generateArchitecturePatterns(techStack, projectType);
  
  const title = generateDynamicTitle(repoAnalysis, analysisData, tone, focus, targetAudience);
  const content = generateSmartContent(repoAnalysis, analysisData, tone, focus, targetAudience, {
    techStack,
    projectType,
    complexity,
    architecturePatterns
  });
  const excerpt = generateSmartExcerpt(content, repoAnalysis, analysisData);
  const tableOfContents = generateTableOfContents(content);
  const codeSnippets = generateCodeSnippets(techStack, projectType, focus);
  
  return {
    title,
    content,
    excerpt,
    tags: generateAdvancedTags(analysisData, repoAnalysis, techStack),
    estimatedReadTime: calculateDynamicReadTime(content, complexity, focus),
    suggestedImages: generateSmartImageSuggestions(repoAnalysis, analysisData, focus),
    seoKeywords: generateAdvancedSEOKeywords(analysisData, repoAnalysis, focus, techStack),
    // Enhanced features
    tableOfContents,
    codeSnippets,
    projectTimeline: timeline,
    difficultyLevel: complexity,
    architectureSuggestions: architecturePatterns,
    relatedProjects: generateRelatedProjects(techStack, projectType),
    technologyStack: techStack,
  };
}

// Generate dynamic titles based on tone, focus, and audience
function generateDynamicTitle(repoAnalysis: any, analysisData: any, tone: string, focus: string, targetAudience: string): string {
  const projectName = repoAnalysis.repository.name;
  const mainTech = analysisData.technologies[0] || 'Development';
  const hasFramework = analysisData.technologies.some((tech: string) => 
    ['React', 'Vue', 'Angular', 'Next.js', 'Express', 'Django', 'Flask'].includes(tech)
  );
  
  // Dynamic title generation based on combinations
  const titleKey = `${tone}-${focus}-${targetAudience}`;
  
  const dynamicTitles: Record<string, string> = {
    // TECHNICAL TONE VARIATIONS
    'technical-technical-deep-dive-developers': `${projectName}: Comprehensive Architecture & Implementation Analysis`,
    'technical-showcase-business': `${projectName}: Technical Capabilities & Business Value Proposition`,
    'technical-overview-developers': `${projectName}: Technical Overview and Stack Analysis`,
    'technical-tutorial-developers': `${projectName}: Implementation Guide & Technical Tutorial`,
    'technical-learning-journey-developers': `${projectName}: Technical Development Process & Lessons`,
    
    // CASUAL TONE VARIATIONS  
    'casual-learning-journey-students': `My Coding Adventure: Building ${projectName} Step by Step`,
    'casual-tutorial-general': `Let's Build ${projectName} Together: A Friendly Guide`,
    'casual-showcase-general': `Check Out ${projectName}: What I Built and How`,
    'casual-overview-students': `Getting Started with ${projectName}: A Beginner's Look`,
    'casual-technical-deep-dive-students': `Diving Deep into ${projectName}: Learning the Hard Parts`,
    
    // PROFESSIONAL TONE VARIATIONS
    'professional-overview-recruiters': `${projectName}: Professional Project Showcase & Technical Skills`,
    'professional-showcase-developers': `${projectName}: Modern ${mainTech} Solution & Best Practices`,
    'professional-tutorial-business': `${projectName}: Implementation Strategy & Development Process`,
    'professional-learning-journey-recruiters': `${projectName}: Project Development & Professional Growth`,
    'professional-technical-deep-dive-business': `${projectName}: Technical Architecture & Strategic Implementation`,
    
    // STORYTELLING TONE VARIATIONS
    'storytelling-learning-journey-general': `The Journey of Building ${projectName}: From Idea to Reality`,
    'storytelling-showcase-business': `${projectName}: A Story of Innovation & Problem-Solving`,
    'storytelling-overview-general': `The Story Behind ${projectName}: How It Came to Life`,
    'storytelling-tutorial-general': `Building ${projectName}: A Step-by-Step Adventure`,
    'storytelling-technical-deep-dive-general': `Inside ${projectName}: The Technical Story Behind the Code`,
    
    // AUDIENCE-SPECIFIC DEFAULTS
    'developers': `${projectName}: Advanced ${mainTech} Implementation`,
    'business': `${projectName}: Technical Solution with Business Impact`,
    'students': `Learning with ${projectName}: A Student's Guide`,
    'recruiters': `${projectName}: Professional Portfolio Project`,
    'general': `Understanding ${projectName}: An Accessible Overview`,
  };
  
  // Try specific combination first, then fallback to audience-specific, then generic
  return dynamicTitles[titleKey] || 
         dynamicTitles[targetAudience] || 
         `${projectName}: ${tone.charAt(0).toUpperCase() + tone.slice(1)} ${focus.replace('-', ' ')} for ${targetAudience.charAt(0).toUpperCase() + targetAudience.slice(1)}`;
}


// Generate smart excerpts
function generateSmartExcerpt(content: string, repoAnalysis: any, analysisData: any): string {
  const description = analysisData.description;
  const mainTech = analysisData.technologies[0] || 'modern technologies';
  
  if (description && description.length > 50) {
    return `${description} Built with ${mainTech}, this project demonstrates practical implementation of modern development practices and showcases key technical capabilities.`;
  }
  
  return `Explore ${repoAnalysis.repository.name}, a ${mainTech} project that showcases modern development practices. This implementation demonstrates practical solutions and technical expertise in building scalable applications.`;
}

// Generate smart tags
function generateSmartTags(analysisData: any, repoAnalysis: any): string[] {
  const baseTags = [...analysisData.technologies.slice(0, 4)];
  const topics = repoAnalysis.repository.topics || [];
  const additionalTags = ['development', 'programming', 'open-source'];
  
  return [...new Set([...baseTags, ...topics.slice(0, 3), ...additionalTags])].slice(0, 7);
}

// Generate smart image suggestions
function generateSmartImageSuggestions(repoAnalysis: any, analysisData: any, focus: string): string[] {
  const suggestions = ['Project overview screenshot'];
  
  if (focus === 'technical-deep-dive') {
    suggestions.push('Architecture diagram', 'Code structure visualization', 'Database schema');
  } else if (focus === 'showcase') {
    suggestions.push('Feature demonstration', 'User interface screenshots', 'Demo video thumbnail');
  } else {
    suggestions.push('Technology stack diagram', 'Key features showcase');
  }
  
  if (analysisData.technologies.includes('React') || analysisData.technologies.includes('Vue')) {
    suggestions.push('Component structure diagram');
  }
  
  return suggestions.slice(0, 4);
}

// Generate smart SEO keywords
function generateSmartSEOKeywords(analysisData: any, repoAnalysis: any, focus: string): string[] {
  const keywords = [
    ...analysisData.technologies,
    repoAnalysis.repository.name.toLowerCase(),
    'project',
    'development',
    'github',
    'open-source'
  ];
  
  if (focus === 'technical-deep-dive') {
    keywords.push('architecture', 'implementation', 'technical-analysis');
  } else if (focus === 'learning-journey') {
    keywords.push('tutorial', 'learning', 'beginner-friendly');
  }
  
  return [...new Set(keywords)].slice(0, 8);
}

// Helper functions for content generation
function getTechDescription(tech: string): string {
  const descriptions: { [key: string]: string } = {
    'JavaScript': 'Core programming language for dynamic functionality',
    'TypeScript': 'Type-safe JavaScript for better development experience',
    'React': 'Modern frontend library for building user interfaces',
    'Next.js': 'Full-stack React framework with SSR capabilities',
    'Node.js': 'JavaScript runtime for server-side development',
    'Express': 'Minimal web framework for Node.js applications',
    'Python': 'Versatile programming language for various applications',
    'Django': 'High-level Python web framework',
    'Flask': 'Lightweight Python web framework',
    'Vue': 'Progressive JavaScript framework for UI development',
    'Angular': 'Comprehensive framework for building web applications',
    'CSS': 'Styling language for web presentation',
    'HTML': 'Markup language for web content structure',
    'MongoDB': 'NoSQL database for flexible data storage',
    'PostgreSQL': 'Advanced relational database system',
    'MySQL': 'Popular relational database management system',
    'Docker': 'Containerization platform for deployment',
    'Git': 'Version control system for code management'
  };
  
  return descriptions[tech] || 'Technology used in this project';
}

// Enhanced focus-based content generators
function generateAdvancedTechnicalContent(repoAnalysis: any, analysisData: any, projectType: string, complexity: string): string {
  return `## Advanced Technical Architecture\n\nThis ${projectType.toLowerCase()} demonstrates ${complexity}-level architectural patterns and technical sophistication. The implementation showcases deep understanding of software engineering principles and modern development practices.\n\n### Architectural Patterns\n\n- **Design Principles**: Follows SOLID principles and clean architecture patterns\n- **Scalability**: Built with horizontal and vertical scaling considerations\n- **Performance**: Optimized for efficiency and resource utilization\n- **Maintainability**: Structured for long-term code maintenance and evolution\n\n### Technical Implementation Details\n\n- **Code Structure**: Modular architecture with clear separation of concerns\n- **Data Flow**: Efficient data processing and state management\n- **Error Handling**: Comprehensive error catching and graceful degradation\n- **Testing Strategy**: Designed with testability and quality assurance in mind\n\n### Engineering Decisions\n\nThe technology choices reflect careful consideration of:\n- Development velocity vs. performance trade-offs\n- Team scalability and developer experience\n- Long-term maintenance and evolution requirements\n- Integration capabilities with existing systems\n\n`;
}

function generateDetailedLearningContent(repoAnalysis: any, analysisData: any, projectType: string, complexity: string): string {
  return `## Comprehensive Learning Journey\n\nBuilding this ${projectType.toLowerCase()} provided extensive hands-on experience with ${analysisData.technologies[0]} development at a ${complexity} level. This project serves as an excellent case study for understanding real-world development challenges and solutions.\n\n### Technical Skills Developed\n\n- **${analysisData.technologies[0]} Mastery**: Deep dive into framework capabilities and best practices\n- **Architecture Design**: Understanding of ${complexity}-level system design patterns\n- **Problem Solving**: Practical approaches to common development challenges\n- **Integration Skills**: Working with multiple technologies in a cohesive system\n\n### Key Learning Outcomes\n\n1. **Real-world Application**: Moving beyond tutorials to practical implementation\n2. **Best Practices**: Learning industry-standard coding patterns and conventions\n3. **Debugging Skills**: Developing systematic approaches to troubleshooting\n4. **Performance Optimization**: Understanding bottlenecks and optimization strategies\n\n### Challenges and Solutions\n\n- **Technical Complexity**: Breaking down complex problems into manageable components\n- **Integration Issues**: Solving compatibility and communication challenges between technologies\n- **Performance Bottlenecks**: Identifying and resolving efficiency issues\n- **Code Organization**: Maintaining clean, readable, and maintainable code structure\n\n### Practical Applications\n\nThe patterns and techniques used in this project are directly applicable to:\n- Enterprise software development\n- Startup product development\n- Open-source contributions\n- Personal project development\n\n`;
}

function generateComprehensiveShowcaseContent(repoAnalysis: any, analysisData: any, projectType: string): string {
  return `## Feature Showcase & Capabilities\n\nThis ${projectType.toLowerCase()} demonstrates a comprehensive range of features and technical capabilities that highlight the practical application of modern development practices.\n\n### Core Functionality\n\n- **User Experience**: Intuitive interface design with modern UX principles\n- **Performance**: Optimized execution and responsive user interactions\n- **Reliability**: Robust error handling and graceful failure recovery\n- **Scalability**: Architecture designed for growth and increased load\n\n### Technical Highlights\n\n- **Modern Stack**: Utilization of ${analysisData.technologies.slice(0, 3).join(', ')} in production-ready implementation\n- **Code Quality**: Clean, well-documented, and maintainable codebase\n- **Best Practices**: Implementation of industry-standard patterns and conventions\n- **Integration**: Seamless communication between different system components\n\n### Innovation & Unique Features\n\n- **Creative Solutions**: Novel approaches to common development challenges\n- **Efficiency Optimization**: Smart algorithms and data structures for performance\n- **User-Centric Design**: Features designed with end-user needs in mind\n- **Future-Proof Architecture**: Built with extensibility and evolution in mind\n\n### Demonstration of Expertise\n\nThis project showcases:\n- Proficiency in ${analysisData.technologies[0]} ecosystem\n- Understanding of software architecture principles\n- Ability to deliver complete, working solutions\n- Knowledge of modern development workflows and tools\n\n`;
}

function generateStepByStepTutorialContent(repoAnalysis: any, analysisData: any, projectType: string, complexity: string): string {
  const projectName = repoAnalysis.repository.name;
  const mainTech = analysisData.technologies[0] || 'development';
  const technologies = analysisData.technologies;
  
  return `## Complete Step-by-Step Tutorial

Learn how to build ${projectName} from scratch! This comprehensive tutorial will guide you through creating your own ${projectType.toLowerCase()} using ${mainTech} and modern development practices.

### 🎯 What You'll Build

By the end of this tutorial, you'll have created a fully functional ${projectType.toLowerCase()} that demonstrates:
- Modern ${mainTech} development techniques
- Industry-standard project structure
- Professional coding practices
- ${complexity.charAt(0).toUpperCase() + complexity.slice(1)}-level implementation patterns

### 📋 Prerequisites

Before we start, make sure you have:

**Required Knowledge:**
- Basic understanding of ${mainTech} fundamentals
- Familiarity with command line operations
- Understanding of ${getPrerequisiteKnowledge(projectType, technologies)}

**Development Environment:**
- ${getEnvironmentSetup(technologies, projectType)}
- Code editor (VS Code, WebStorm, or similar)
- Git for version control

### 🚀 Tutorial Overview

This tutorial is organized into logical steps that build upon each other:

${generateTutorialSteps(projectType, technologies, complexity)}

### 📖 Step 1: Project Setup & Environment Configuration

Let's start by setting up our development environment and creating the project structure.

#### 1.1 Initialize the Project

\`\`\`bash
# Create project directory
mkdir ${projectName.toLowerCase()}
cd ${projectName.toLowerCase()}

# Initialize version control
git init
${getInitializationCommands(technologies, projectType)}
\`\`\`

#### 1.2 Project Structure

Create the following directory structure:
\`\`\`
${projectName.toLowerCase()}/
${generateProjectStructure(projectType, technologies)}
\`\`\`

#### 1.3 Configuration Files

${generateConfigurationSteps(technologies, projectType)}

### 📖 Step 2: Core Implementation

Now let's implement the core functionality of our ${projectType.toLowerCase()}.

#### 2.1 Main Architecture

${generateArchitectureExplanation(projectType, technologies, complexity)}

#### 2.2 Key Components

${generateComponentImplementation(projectType, technologies)}

### 📖 Step 3: Adding Features & Functionality

Let's enhance our project with additional features:

${generateFeatureImplementation(projectType, technologies)}

### 📖 Step 4: Testing & Quality Assurance

Ensure your code is reliable and maintainable:

#### 4.1 Setting Up Tests
\`\`\`bash
${getTestingSetup(technologies)}
\`\`\`

#### 4.2 Writing Test Cases
${generateTestingGuide(projectType, technologies)}

### 📖 Step 5: Deployment & Going Live

Get your ${projectType.toLowerCase()} ready for production:

${generateDeploymentGuide(projectType, technologies)}

### 🐛 Common Issues & Troubleshooting

Here are solutions to problems you might encounter:

${generateTroubleshootingGuide(projectType, technologies)}

### 🚀 Next Steps & Extensions

Take your project further with these enhancements:

${generateExtensionIdeas(projectType, technologies, complexity)}

### 📚 Additional Resources

Continue learning with these helpful resources:
- Official ${mainTech} documentation
- Best practices guides for ${projectType.toLowerCase()} development
- Community forums and support channels
- Advanced ${mainTech} tutorials and courses

### 🎉 Congratulations!

You've successfully built ${projectName}! This tutorial covered:
- ✅ Complete project setup and configuration
- ✅ Core implementation with ${mainTech}
- ✅ Testing and quality assurance
- ✅ Deployment strategies
- ✅ Troubleshooting common issues

**What's Next?** Use this foundation to build more complex projects, contribute to open source, or enhance this project with additional features!

`;
}


function generateTechnicalContent(repoAnalysis: any, analysisData: any): string {
  return `## Architecture & Implementation\n\nThis project follows modern architectural patterns and best practices. The codebase is structured to promote maintainability, scalability, and developer productivity.\n\n### Key Technical Decisions\n\n- **Technology Stack**: Chosen for performance and developer experience\n- **Architecture Pattern**: Implements clean, modular design principles\n- **Code Organization**: Follows industry-standard project structure\n\n`;
}

function generateLearningContent(repoAnalysis: any, analysisData: any): string {
  return `## Learning Journey\n\nBuilding this project provided valuable insights into ${analysisData.technologies[0]} development. Here are the key learning points and challenges encountered:\n\n### What I Learned\n\n- Practical application of ${analysisData.technologies[0]} concepts\n- Integration of multiple technologies in a cohesive project\n- Problem-solving approaches for real-world development challenges\n\n### Challenges Overcome\n\n- Technical implementation details\n- Performance optimization strategies\n- Best practices for code organization and maintainability\n\n`;
}

function generateShowcaseContent(repoAnalysis: any, analysisData: any): string {
  return `## Features & Capabilities\n\nThis project showcases a range of features and technical capabilities that demonstrate practical application of ${analysisData.technologies[0]} development.\n\n### Core Features\n\n- Modern, responsive user interface\n- Efficient data handling and processing\n- Clean, maintainable codebase\n- Production-ready implementation\n\n### Technical Highlights\n\n- Integration of ${analysisData.technologies.slice(0, 3).join(', ')}\n- Optimized performance and user experience\n- Scalable architecture design\n\n`;
}

function generateOverviewContent(repoAnalysis: any, analysisData: any): string {
  return `## Project Overview\n\nThis project provides a comprehensive solution using ${analysisData.technologies[0]} and related technologies. The implementation focuses on creating a robust, maintainable application that addresses real-world requirements.\n\n### Development Approach\n\n- Modern development practices and tools\n- Clean code principles and documentation\n- Performance optimization and scalability considerations\n\n### Project Structure\n\nThe codebase is organized following industry best practices, making it easy to understand, maintain, and extend.\n\n`;
}

// Advanced content generation helper functions

// Infer project type from various signals
function inferProjectType(name: string, technologies: string[], dependencies: string[], topics: string[]): string {
  const nameLower = name.toLowerCase();
  const allText = [nameLower, ...technologies.map(t => t.toLowerCase()), ...dependencies.map(d => d.toLowerCase()), ...topics.map(t => t.toLowerCase())].join(' ');
  
  if (allText.includes('api') || allText.includes('backend') || allText.includes('server') || allText.includes('express') || allText.includes('fastapi')) return 'API/Backend Service';
  if (allText.includes('web') || allText.includes('frontend') || allText.includes('react') || allText.includes('vue') || allText.includes('angular')) return 'Web Application';
  if (allText.includes('mobile') || allText.includes('android') || allText.includes('ios') || allText.includes('flutter') || allText.includes('react-native')) return 'Mobile Application';
  if (allText.includes('data') || allText.includes('analytics') || allText.includes('pipeline') || allText.includes('etl') || allText.includes('ml') || allText.includes('ai')) return 'Data & Analytics';
  if (allText.includes('cli') || allText.includes('tool') || allText.includes('utility') || allText.includes('script')) return 'CLI Tool/Utility';
  if (allText.includes('game') || allText.includes('unity') || allText.includes('pygame')) return 'Game/Interactive';
  if (allText.includes('bot') || allText.includes('discord') || allText.includes('telegram') || allText.includes('automation')) return 'Bot/Automation';
  if (allText.includes('lib') || allText.includes('package') || allText.includes('framework') || allText.includes('sdk')) return 'Library/Framework';
  if (allText.includes('docker') || allText.includes('kubernetes') || allText.includes('deploy') || allText.includes('infra')) return 'Infrastructure/DevOps';
  
  return 'Software Application';
}

// Infer complexity level
function inferComplexityLevel(dependencies: string[], technologies: string[], readme?: string): 'beginner' | 'intermediate' | 'advanced' {
  let complexityScore = 0;
  
  // Dependencies count
  if (dependencies.length > 20) complexityScore += 3;
  else if (dependencies.length > 10) complexityScore += 2;
  else if (dependencies.length > 5) complexityScore += 1;
  
  // Technology diversity
  if (technologies.length > 5) complexityScore += 2;
  else if (technologies.length > 3) complexityScore += 1;
  
  // Advanced technologies
  const advancedTech = ['kubernetes', 'docker', 'tensorflow', 'pytorch', 'rust', 'go', 'microservices', 'graphql'];
  if (technologies.some(tech => advancedTech.some(adv => tech.toLowerCase().includes(adv)))) complexityScore += 2;
  
  // README length indicates documentation effort
  if (readme && readme.length > 2000) complexityScore += 1;
  
  if (complexityScore >= 5) return 'advanced';
  if (complexityScore >= 2) return 'intermediate';
  return 'beginner';
}

// Generate audience-specific introductions
function generateRecruiterIntro(description: string, projectType: string, technologies: string[], complexity: string): string {
  return `## Professional Summary

${description}

This ${projectType.toLowerCase()} demonstrates my expertise in **${technologies.slice(0, 3).join(', ')}** and showcases my ability to deliver ${complexity}-level solutions. The project reflects my proficiency in modern development practices, clean code principles, and practical problem-solving skills that are directly applicable to professional software development environments.

**Key Professional Highlights:**
- Demonstrates practical application of industry-standard technologies
- Shows ability to work with ${complexity} complexity projects
- Reflects understanding of modern software architecture principles
- Indicates experience with professional development workflows

`;
}

function generateStudentIntro(description: string, projectType: string, technologies: string[], complexity: string): string {
  return `## Learning Opportunity

${description}

This ${projectType.toLowerCase()} is an excellent learning resource for students interested in **${technologies[0]}** development. Whether you're just starting your coding journey or looking to expand your skills, this ${complexity}-level project provides practical examples and real-world implementation patterns.

**What You Can Learn:**
- Hands-on experience with ${technologies.slice(0, 3).join(', ')}
- Understanding of ${complexity}-level project structure and organization
- Best practices for ${projectType.toLowerCase()} development
- Practical implementation techniques you can apply to your own projects

`;
}

function generateGeneralIntro(description: string, projectType: string, technologies: string[]): string {
  return `## About This Project

${description}

In today's digital landscape, ${projectType.toLowerCase()}s play a crucial role in solving real-world problems. This project leverages modern technology including **${technologies.slice(0, 2).join(' and ')}** to create an efficient, user-friendly solution.

**Why This Matters:**
- Demonstrates practical application of cutting-edge technology
- Addresses real-world challenges with modern solutions
- Showcases the potential of ${technologies[0]} in practical applications

`;
}

function generateBusinessIntro(description: string, projectType: string, technologies: string[], complexity: string, repoAnalysis: any): string {
  const businessValue = inferBusinessValue(projectType, description, technologies);
  const roi = calculatePotentialROI(projectType, description);
  const projectName = repoAnalysis?.repository?.name || 'This Project';
  
  return `## Executive Summary

${description}

**${projectName}** represents a **proven enterprise-grade solution** designed to transform your business operations and deliver measurable results. This ${projectType.toLowerCase()} leverages cutting-edge ${technologies[0]} technology to solve critical business challenges while providing exceptional return on investment.

### Strategic Business Value

**${businessValue.primary}** - This solution addresses core operational needs that directly impact your organization's performance and profitability.

${businessValue.secondary}

### Investment Justification & ROI Analysis

Our comprehensive analysis reveals compelling financial benefits:

- **📈 Expected ROI**: ${roi.expectedROI}
- **⏱️ Implementation Timeline**: ${roi.implementationTime}
- **💰 Operational Savings**: ${roi.operationalSavings}
- **🎯 Payback Period**: Typically 6-18 months depending on organization size

### Competitive Advantages

- **Market Leadership**: Stay ahead of competitors with modern technology infrastructure
- **Operational Excellence**: Streamline processes and eliminate inefficiencies
- **Scalable Architecture**: Solution grows seamlessly with your business expansion
- **Risk Mitigation**: Reduce operational risks through automation and improved accuracy
- **Cost Optimization**: Significant reduction in manual processes and administrative overhead

### Business Impact Metrics

Based on similar implementations, organizations typically experience:
- **25-45% improvement** in operational efficiency
- **30-50% reduction** in administrative costs
- **15-30% increase** in team productivity
- **40-60% decrease** in processing time for routine tasks

### Why Choose This Solution?

This ${projectType.toLowerCase()} represents more than just software—it's a strategic investment in your organization's future. The combination of proven technology, comprehensive functionality, and business-focused design ensures you'll see immediate benefits while building a foundation for long-term growth.

**Ready to Transform Your Business Operations?** This solution has been proven effective across multiple organizations and industries, delivering consistent results and exceptional value.

`;
}

function generateDeveloperIntro(description: string, projectType: string, technologies: string[], complexity: string): string {
  return `## Technical Overview

${description}

This ${projectType.toLowerCase()} leverages **${technologies.join(', ')}** to create a comprehensive solution that addresses modern development challenges. Built with ${complexity}-level complexity considerations, it demonstrates practical implementation patterns and architectural decisions.

**Technical Highlights:**
- Modern technology stack with ${technologies[0]} at its core
- ${complexity.charAt(0).toUpperCase() + complexity.slice(1)}-level architectural patterns
- Production-ready code structure and organization
- Scalable design principles and best practices

`;
}

// Generate intelligent technology stack analysis
function generateIntelligentTechStack(technologies: string[], dependencies: string[], projectType: string): string {
  let content = `## Technology Stack & Architecture\n\n`;
  
  // Group technologies by category
  const frontend = technologies.filter(tech => ['React', 'Vue', 'Angular', 'HTML', 'CSS', 'JavaScript', 'TypeScript'].includes(tech));
  const backend = technologies.filter(tech => ['Node.js', 'Python', 'Java', 'Go', 'Rust', 'PHP', 'Express', 'Django', 'Flask'].includes(tech));
  const database = technologies.filter(tech => ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQLite'].includes(tech));
  const tools = technologies.filter(tech => ['Docker', 'Git', 'Webpack', 'Babel'].includes(tech));
  
  if (frontend.length > 0) {
    content += `### Frontend Technologies\n`;
    frontend.forEach(tech => {
      content += `- **${tech}**: ${getTechDescription(tech)}\n`;
    });
    content += '\n';
  }
  
  if (backend.length > 0) {
    content += `### Backend Technologies\n`;
    backend.forEach(tech => {
      content += `- **${tech}**: ${getTechDescription(tech)}\n`;
    });
    content += '\n';
  }
  
  if (database.length > 0) {
    content += `### Data Layer\n`;
    database.forEach(tech => {
      content += `- **${tech}**: ${getTechDescription(tech)}\n`;
    });
    content += '\n';
  }
  
  if (tools.length > 0) {
    content += `### Development Tools\n`;
    tools.forEach(tech => {
      content += `- **${tech}**: ${getTechDescription(tech)}\n`;
    });
    content += '\n';
  }
  
  // Add remaining technologies
  const remaining = technologies.filter(tech => 
    !frontend.includes(tech) && !backend.includes(tech) && !database.includes(tech) && !tools.includes(tech)
  );
  
  if (remaining.length > 0) {
    content += `### Additional Technologies\n`;
    remaining.forEach(tech => {
      content += `- **${tech}**: ${getTechDescription(tech)}\n`;
    });
    content += '\n';
  }
  
  // Add architectural insights based on project type
  content += generateArchitecturalInsights(projectType, technologies, dependencies);
  
  return content;
}

function generateArchitecturalInsights(projectType: string, technologies: string[], dependencies: string[]): string {
  let insights = `### Architectural Insights\n\n`;
  
  switch (projectType) {
    case 'Web Application':
      insights += `This web application follows modern frontend architecture patterns. `;
      if (technologies.includes('React')) {
        insights += `The use of React enables component-based development, promoting reusability and maintainability. `;
      }
      if (technologies.includes('TypeScript')) {
        insights += `TypeScript integration provides type safety and enhanced developer experience. `;
      }
      break;
      
    case 'API/Backend Service':
      insights += `This backend service is designed with scalability and performance in mind. `;
      if (technologies.includes('Node.js')) {
        insights += `Node.js enables efficient handling of concurrent requests and real-time operations. `;
      }
      if (technologies.includes('Express')) {
        insights += `Express.js provides a minimal yet powerful framework for building robust APIs. `;
      }
      break;
      
    case 'Data & Analytics':
      insights += `This data project implements modern data processing and analytics capabilities. `;
      if (technologies.includes('Python')) {
        insights += `Python's rich ecosystem makes it ideal for data manipulation, analysis, and machine learning tasks. `;
      }
      break;
      
    case 'CLI Tool/Utility':
      insights += `This command-line tool is built with user experience and efficiency in mind. `;
      if (technologies.includes('Node.js')) {
        insights += `Node.js enables cross-platform compatibility and easy distribution via npm. `;
      }
      break;
      
    default:
      insights += `This ${projectType.toLowerCase()} demonstrates thoughtful technology selection and implementation. `;
  }
  
  insights += `The chosen technology stack balances development efficiency, performance, and maintainability.\n\n`;
  
  return insights;
}

// Extract features from README using intelligent parsing
function extractFeaturesFromReadme(readme: string): string[] {
  const features: string[] = [];
  const lines = readme.split('\n');
  
  // Look for feature sections
  const featurePatterns = [
    /^\s*[-*]\s+(.+)/,  // Bullet points
    /^\s*\d+\.\s+(.+)/, // Numbered lists
    /^#+\s*(.+)/        // Headers that might indicate features
  ];
  
  let inFeatureSection = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Detect feature sections
    if (trimmed.toLowerCase().includes('feature') || 
        trimmed.toLowerCase().includes('functionality') ||
        trimmed.toLowerCase().includes('capabilities')) {
      inFeatureSection = true;
      continue;
    }
    
    // Stop at next major section
    if (trimmed.startsWith('##') && inFeatureSection) {
      break;
    }
    
    // Extract features from bullet points and lists
    for (const pattern of featurePatterns) {
      const match = trimmed.match(pattern);
      if (match && match[1] && match[1].length > 10 && match[1].length < 100) {
        features.push(`- ${match[1]}`);
        if (features.length >= 6) break; // Limit to 6 features
      }
    }
    
    if (features.length >= 6) break;
  }
  
  return features;
}

// Generate features when README is minimal
function generateInferredFeatures(projectType: string, technologies: string[], dependencies: string[]): string {
  let content = `## Inferred Features & Capabilities\n\n`;
  
  const features = [];
  
  switch (projectType) {
    case 'Web Application':
      features.push('Modern, responsive user interface');
      if (technologies.includes('React')) features.push('Component-based architecture with React');
      if (technologies.includes('TypeScript')) features.push('Type-safe development with TypeScript');
      features.push('Cross-browser compatibility');
      features.push('Optimized performance and loading times');
      break;
      
    case 'API/Backend Service':
      features.push('RESTful API design and implementation');
      features.push('Scalable server architecture');
      if (technologies.includes('Express')) features.push('Fast and minimalist web framework');
      features.push('Error handling and validation');
      features.push('Security best practices implementation');
      break;
      
    case 'Data & Analytics':
      features.push('Data processing and transformation capabilities');
      features.push('Analytics and insights generation');
      if (technologies.includes('Python')) features.push('Python-based data manipulation');
      features.push('Visualization and reporting features');
      break;
      
    case 'CLI Tool/Utility':
      features.push('Command-line interface with intuitive commands');
      features.push('Cross-platform compatibility');
      features.push('Automated task execution');
      features.push('Configuration and customization options');
      break;
      
    default:
      features.push('Modern software architecture');
      features.push('Clean and maintainable codebase');
      features.push('Best practices implementation');
      features.push('Scalable and extensible design');
  }
  
  features.forEach(feature => {
    content += `- ${feature}\n`;
  });
  
  content += '\n';
  return content;
}

// Generate enhanced project insights
function generateProjectInsights(repoAnalysis: any, analysisData: any, projectType: string, complexity: string): string {
  let content = `## Project Insights & Metrics\n\n`;
  
  // Repository statistics
  content += `### Repository Statistics\n`;
  content += `- **GitHub Stars**: ${repoAnalysis.repository.stargazers_count} (indicates community interest)\n`;
  content += `- **Forks**: ${repoAnalysis.repository.forks_count} (shows collaboration potential)\n`;
  content += `- **Last Updated**: ${new Date(repoAnalysis.repository.updated_at).toLocaleDateString()} (demonstrates active maintenance)\n`;
  content += `- **Primary Language**: ${repoAnalysis.repository.language || 'Mixed'}\n`;
  
  if (repoAnalysis.repository.size) {
    content += `- **Repository Size**: ${(repoAnalysis.repository.size / 1024).toFixed(1)} MB\n`;
  }
  
  content += '\n';
  
  // Technology insights
  content += `### Technology Analysis\n`;
  content += `- **Project Type**: ${projectType}\n`;
  content += `- **Complexity Level**: ${complexity.charAt(0).toUpperCase() + complexity.slice(1)}\n`;
  content += `- **Technology Count**: ${analysisData.technologies.length} different technologies\n`;
  
  if (analysisData.dependencies.length > 0) {
    content += `- **Dependencies**: ${analysisData.dependencies.length} external packages\n`;
  }
  
  content += '\n';
  
  // Development insights
  content += `### Development Insights\n`;
  content += `- Follows modern ${analysisData.technologies[0]} development patterns\n`;
  content += `- Implements ${complexity}-level software architecture principles\n`;
  content += `- Demonstrates practical application of ${projectType.toLowerCase()} best practices\n`;
  
  if (analysisData.readme && analysisData.readme.length > 500) {
    content += `- Well-documented with comprehensive README (${Math.round(analysisData.readme.length / 100) * 100}+ characters)\n`;
  }
  
  content += '\n';
  
  return content;
}

// Generate intelligent conclusion
function generateIntelligentConclusion(projectName: string, projectType: string, technologies: string[], complexity: string, targetAudience: string): string {
  let content = `## Conclusion\n\n`;
  
  if (targetAudience === 'recruiters') {
    content += `${projectName} demonstrates my ability to deliver ${complexity}-level ${projectType.toLowerCase()}s using modern technology stacks. `;
    content += `The implementation showcases my proficiency in ${technologies[0]} development and my understanding of professional software development practices.\n\n`;
    content += `This project reflects the kind of technical expertise and problem-solving capability I would bring to your development team. `;
    content += `The clean architecture, technology choices, and implementation approach align with industry standards and best practices.\n\n`;
  } else if (targetAudience === 'business') {
    const businessValue = inferBusinessValue(projectType, '', technologies);
    content += `${projectName} represents a **proven business solution** that can transform your operations and drive measurable results. `;
    content += `This ${projectType.toLowerCase()} demonstrates how modern technology can solve real business challenges while delivering strong ROI.\n\n`;
    content += `**Business Impact**: ${businessValue.impact}\n\n`;
    content += `**Next Steps for Your Business:**\n`;
    content += `- **Consultation**: Schedule a discovery call to discuss your specific needs\n`;
    content += `- **Custom Development**: Adapt this solution to your business requirements\n`;
    content += `- **Implementation**: Deploy with minimal business disruption\n`;
    content += `- **Training & Support**: Ensure your team maximizes the solution's value\n\n`;
    content += `**Ready to accelerate your business growth?** Contact us to explore how this solution can be tailored to your specific business needs and objectives.\n\n`;
  } else if (targetAudience === 'students') {
    content += `${projectName} serves as an excellent learning resource for anyone interested in ${technologies[0]} development. `;
    content += `The ${complexity}-level implementation provides practical examples and patterns that you can study and apply to your own projects.\n\n`;
    content += `By exploring this codebase, you'll gain insights into real-world development practices, proper project structure, and effective use of ${technologies.slice(0, 2).join(' and ')}. `;
    content += `Don't hesitate to fork the repository, experiment with the code, and use it as a foundation for your own learning journey.\n\n`;
  } else if (targetAudience === 'general') {
    content += `${projectName} represents the practical application of modern technology to solve real-world problems. `;
    content += `This ${projectType.toLowerCase()} demonstrates how ${technologies[0]} can be leveraged to create effective, user-friendly solutions.\n\n`;
    content += `The project showcases the potential of modern software development to create valuable tools and applications that make a difference in people's daily lives.\n\n`;
  } else {
    content += `${projectName} exemplifies solid ${technologies[0]} development practices and ${complexity}-level architectural thinking. `;
    content += `The implementation demonstrates effective use of ${technologies.slice(0, 3).join(', ')} in building a comprehensive ${projectType.toLowerCase()}.\n\n`;
    content += `The project structure, technology integration, and code organization provide valuable insights for developers working with similar technology stacks. `;
    content += `Whether you're looking for implementation patterns, architectural inspiration, or practical examples, this repository offers concrete value to the development community.\n\n`;
  }
  
  content += `**Ready to explore?** Check out the code, contribute improvements, or use it as inspiration for your own projects.\n\n`;
  content += `[🔗 View Project on GitHub](${projectName ? `https://github.com/${projectName}` : '#'}) | `;
  content += `[⭐ Star this Repository](${projectName ? `https://github.com/${projectName}` : '#'}) | `;
  content += `[🍴 Fork and Contribute](${projectName ? `https://github.com/${projectName}/fork` : '#'})`;
  
  return content;
}

// Business value and ROI calculation functions
function inferBusinessValue(projectType: string, description: string, technologies: string[]): { primary: string; secondary: string; impact: string } {
  const descLower = description.toLowerCase();
  
  switch (projectType) {
    case 'Web Application':
      return {
        primary: 'Enhanced Customer Experience & Engagement',
        secondary: 'Modern web applications improve customer satisfaction, reduce bounce rates, and increase conversion rates. This solution provides a professional online presence that builds trust and drives business growth.',
        impact: 'Potential 25-40% improvement in customer engagement and 15-30% increase in conversion rates through enhanced user experience and modern interface design.'
      };
      
    case 'API/Backend Service':
      return {
        primary: 'Operational Efficiency & System Integration',
        secondary: 'APIs enable seamless data flow between systems, automate manual processes, and reduce operational overhead. This backend solution streamlines business operations and eliminates data silos.',
        impact: 'Typical 30-50% reduction in manual data processing time and 20-35% improvement in operational efficiency through automated workflows.'
      };
      
    case 'Data & Analytics':
      return {
        primary: 'Data-Driven Decision Making',
        secondary: 'Transform raw data into actionable business insights. This analytics solution enables informed decision-making, identifies growth opportunities, and optimizes business performance.',
        impact: 'Organizations see 15-25% improvement in decision-making speed and 20-40% better business outcomes through data-driven strategies.'
      };
      
    case 'CLI Tool/Utility':
      return {
        primary: 'Process Automation & Productivity',
        secondary: 'Automate repetitive tasks and streamline workflows. This tool reduces human error, saves time, and allows your team to focus on high-value activities.',
        impact: 'Typical 40-60% reduction in task completion time and 70-90% decrease in manual errors through automation.'
      };
      
    case 'Mobile Application':
      return {
        primary: 'Mobile-First Customer Engagement',
        secondary: 'Reach customers where they are with a mobile-optimized solution. This app enhances accessibility, improves customer satisfaction, and opens new revenue channels.',
        impact: 'Mobile solutions typically increase customer engagement by 30-50% and create new opportunities for revenue generation.'
      };
      
    default:
      if (descLower.includes('manage') || descLower.includes('management')) {
        return {
          primary: 'Streamlined Business Management',
          secondary: 'Centralize and automate your business operations with this comprehensive management solution. Reduce administrative overhead and improve operational visibility.',
          impact: 'Management systems typically deliver 25-45% improvement in operational efficiency and 30-50% reduction in administrative costs.'
        };
      }
      
      return {
        primary: 'Business Process Optimization',
        secondary: 'This solution addresses specific business challenges with modern technology, improving efficiency and reducing costs through intelligent automation.',
        impact: 'Custom solutions typically deliver 20-40% improvement in relevant business metrics and significant ROI within 6-12 months.'
      };
  }
}

function calculatePotentialROI(projectType: string, description: string): { implementationTime: string; expectedROI: string; operationalSavings: string } {
  const descLower = description.toLowerCase();
  
  // Base ROI calculations
  const baseROI = {
    'Web Application': { time: '2-4 months', roi: '150-300%', savings: '20-35%' },
    'API/Backend Service': { time: '1-3 months', roi: '200-400%', savings: '30-50%' },
    'Data & Analytics': { time: '1-2 months', roi: '250-500%', savings: '15-40%' },
    'CLI Tool/Utility': { time: '2-6 weeks', roi: '300-600%', savings: '40-70%' },
    'Mobile Application': { time: '3-6 months', roi: '180-350%', savings: '25-45%' },
    'Software Application': { time: '2-4 months', roi: '200-400%', savings: '25-50%' }
  };
  
  const projectROI = baseROI[projectType as keyof typeof baseROI] || baseROI['Software Application'];
  
  // Adjust for complexity indicators
  if (descLower.includes('enterprise') || descLower.includes('large')) {
    return {
      implementationTime: projectROI.time + ' (Enterprise scale)',
      expectedROI: projectROI.roi + ' over 18-24 months',
      operationalSavings: projectROI.savings + ' in operational costs annually'
    };
  }
  
  return {
    implementationTime: projectROI.time,
    expectedROI: projectROI.roi + ' within 12-18 months',
    operationalSavings: projectROI.savings + ' reduction in operational costs'
  };
}

// Enhanced business insights generation
function generateBusinessInsights(repoAnalysis: any, analysisData: any, projectType: string, complexity: string): string {
  let content = `## Business Value & Market Opportunity\n\n`;
  
  // Market analysis
  content += `### Market Analysis\n`;
  
  switch (projectType) {
    case 'Web Application':
      content += `The web application market continues to grow, with businesses investing heavily in digital transformation. This solution positions you to:\n`;
      content += `- **Capture Digital Market Share**: Reach the 84% of consumers who research online before purchasing\n`;
      content += `- **Improve Customer Retention**: Web applications increase customer engagement by an average of 35%\n`;
      content += `- **Scale Globally**: Serve customers worldwide without geographical limitations\n\n`;
      break;
      
    case 'API/Backend Service':
      content += `API-driven architectures are becoming essential for modern businesses. This backend solution enables:\n`;
      content += `- **System Modernization**: Connect legacy systems with modern applications\n`;
      content += `- **Partner Integrations**: Enable seamless third-party integrations\n`;
      content += `- **Operational Efficiency**: Automate data flows and reduce manual intervention\n\n`;
      break;
      
    case 'Data & Analytics':
      content += `Data-driven businesses are 6x more likely to be profitable year-over-year. This analytics solution provides:\n`;
      content += `- **Competitive Intelligence**: Make faster, better-informed decisions\n`;
      content += `- **Revenue Optimization**: Identify high-value opportunities and cost savings\n`;
      content += `- **Risk Management**: Predict and mitigate potential business risks\n\n`;
      break;
      
    default:
      content += `This ${projectType.toLowerCase()} addresses critical business needs in today's competitive market:\n`;
      content += `- **Operational Excellence**: Streamline processes and reduce costs\n`;
      content += `- **Competitive Advantage**: Stay ahead with modern technology solutions\n`;
      content += `- **Growth Enablement**: Scale operations efficiently as your business grows\n\n`;
  }
  
  // Investment metrics
  content += `### Investment Metrics\n`;
  content += `- **Project Complexity**: ${complexity.charAt(0).toUpperCase() + complexity.slice(1)}-level implementation\n`;
  content += `- **Technology Maturity**: Built with proven, enterprise-grade technologies\n`;
  content += `- **Risk Assessment**: Low risk with high potential returns\n`;
  content += `- **Scalability Factor**: Designed to grow with your business needs\n\n`;
  
  // Success indicators
  content += `### Success Indicators\n`;
  content += `- **User Adoption**: ${getExpectedAdoption(projectType)}\n`;
  content += `- **Performance Metrics**: ${getPerformanceMetrics(projectType)}\n`;
  content += `- **Business Impact**: ${getBusinessImpact(projectType)}\n`;
  content += `- **ROI Timeline**: ${getROITimeline(complexity)}\n\n`;
  
  return content;
}

function getExpectedAdoption(projectType: string): string {
  switch (projectType) {
    case 'Web Application': return 'Expected 70-85% user adoption within first 3 months';
    case 'API/Backend Service': return 'Immediate integration benefits for all connected systems';
    case 'Data & Analytics': return 'Management team adoption typically 90%+ within first month';
    case 'Mobile Application': return 'Target 60-80% user adoption based on mobile engagement trends';
    default: return 'Expected 65-80% team adoption within first quarter';
  }
}

function getPerformanceMetrics(projectType: string): string {
  switch (projectType) {
    case 'Web Application': return 'Sub-3 second load times, 99.5% uptime, mobile-optimized performance';
    case 'API/Backend Service': return 'High-throughput processing, low-latency responses, 99.9% availability';
    case 'Data & Analytics': return 'Real-time insights, automated reporting, predictive accuracy >90%';
    case 'Mobile Application': return 'Native app performance, offline capabilities, cross-platform compatibility';
    default: return 'Optimized performance, reliable operation, seamless user experience';
  }
}

function getBusinessImpact(projectType: string): string {
  switch (projectType) {
    case 'Web Application': return 'Increased customer acquisition, improved brand presence, higher conversion rates';
    case 'API/Backend Service': return 'Reduced integration costs, faster time-to-market, improved data quality';
    case 'Data & Analytics': return 'Better decision making, identified cost savings, revenue optimization';
    case 'Mobile Application': return 'Enhanced customer engagement, new revenue channels, improved accessibility';
    default: return 'Operational efficiency gains, cost reductions, competitive advantages';
  }
}

function getROITimeline(complexity: string): string {
  switch (complexity) {
    case 'beginner': return 'Positive ROI typically achieved within 3-6 months';
    case 'intermediate': return 'ROI realization expected within 6-12 months';
    case 'advanced': return 'Strategic ROI over 12-18 months with significant long-term value';
    default: return 'ROI expected within 6-12 months of implementation';
  }
}

// Enhanced content generation for business audiences
function generateBusinessFeatures(projectType: string, technologies: string[], description: string): string {
  let content = `## Core Business Features & Capabilities\n\n`;
  
  const businessFeatures = [];
  const descLower = description.toLowerCase();
  
  // Enhanced feature sets based on project type
  switch (projectType) {
    case 'Web Application':
      businessFeatures.push('**🏢 Customer Portal**: Secure, intuitive interface that enhances customer experience and reduces support costs');
      businessFeatures.push('**📊 Real-time Analytics Dashboard**: Live business metrics and KPI tracking for informed decision-making');
      businessFeatures.push('**📱 Mobile-First Design**: Optimized experience across all devices, capturing mobile market share');
      businessFeatures.push('**🔒 Enterprise Security**: Advanced security protocols protecting sensitive business data');
      businessFeatures.push('**⚡ Performance Optimization**: Sub-3 second load times ensuring optimal user engagement');
      businessFeatures.push('**🌐 Global Scalability**: Cloud-ready architecture supporting worldwide operations');
      break;
      
    case 'API/Backend Service':
      businessFeatures.push('**🔗 System Integration Hub**: Seamlessly connect all your business systems and eliminate data silos');
      businessFeatures.push('**🔄 Automated Data Flows**: Real-time synchronization reducing manual data entry by up to 80%');
      businessFeatures.push('**⚙️ Workflow Automation**: Streamline business processes and reduce operational overhead');
      businessFeatures.push('**📈 Scalable Architecture**: Handle growing transaction volumes without performance degradation');
      businessFeatures.push('**🛡️ Enterprise-Grade Security**: Robust API security with authentication and authorization');
      businessFeatures.push('**📋 Comprehensive Logging**: Complete audit trails for compliance and troubleshooting');
      break;
      
    case 'Data & Analytics':
      businessFeatures.push('**📊 Business Intelligence Engine**: Transform raw data into actionable business insights');
      businessFeatures.push('**📈 Predictive Analytics**: Forecast trends and identify opportunities before competitors');
      businessFeatures.push('**📋 Custom Report Builder**: Generate reports tailored to specific business requirements');
      businessFeatures.push('**⏰ Real-time Monitoring**: Track KPIs and performance metrics with instant alerts');
      businessFeatures.push('**🎯 ROI Tracking**: Measure and optimize return on investment across initiatives');
      businessFeatures.push('**💡 Automated Insights**: AI-powered recommendations for business optimization');
      break;
      
    default:
      if (descLower.includes('manage') || descLower.includes('management')) {
        businessFeatures.push('**🎯 Centralized Command Center**: Single platform managing all business operations efficiently');
        businessFeatures.push('**👥 Client Relationship Management**: Comprehensive client tracking improving satisfaction rates');
        businessFeatures.push('**📋 Project Portfolio Management**: Real-time project oversight with resource optimization');
        businessFeatures.push('**👤 Employee Performance Tracking**: Streamlined HR processes and productivity monitoring');
        businessFeatures.push('**📊 Financial Reporting**: Automated financial analysis and budget management');
        businessFeatures.push('**🔐 Role-Based Access Control**: Secure, hierarchical permission system');
        businessFeatures.push('**📱 Mobile Management Interface**: Manage operations remotely with full functionality');
        businessFeatures.push('**🔄 Process Automation**: Eliminate repetitive tasks and reduce human error');
      } else {
        businessFeatures.push('**⚡ Streamlined Operations**: Optimize business processes for maximum efficiency');
        businessFeatures.push('**💰 Cost Reduction Engine**: Minimize operational overhead and administrative costs');
        businessFeatures.push('**📈 Performance Analytics**: Data-driven insights for strategic decision making');
        businessFeatures.push('**🔄 Workflow Automation**: Automate routine tasks and focus on high-value activities');
        businessFeatures.push('**📊 Business Intelligence**: Transform data into competitive advantages');
        businessFeatures.push('**🎯 Goal Tracking**: Monitor and achieve business objectives systematically');
      }
  }
  
  businessFeatures.forEach(feature => {
    content += `${feature}\n\n`;
  });
  
  content += `### 🚀 Implementation & Support Package\n\n`;
  content += `**Phase 1: Rapid Deployment (Weeks 1-2)**\n`;
  content += `- System setup and configuration tailored to your business needs\n`;
  content += `- Data migration and integration with existing systems\n`;
  content += `- Initial user training and onboarding sessions\n\n`;
  
  content += `**Phase 2: Optimization (Weeks 3-4)**\n`;
  content += `- Performance tuning and customization based on usage patterns\n`;
  content += `- Advanced feature configuration and workflow optimization\n`;
  content += `- Comprehensive staff training and documentation delivery\n\n`;
  
  content += `**Phase 3: Growth & Scale (Ongoing)**\n`;
  content += `- Continuous monitoring and performance optimization\n`;
  content += `- Regular feature updates and security enhancements\n`;
  content += `- 24/7 technical support and business consultation\n`;
  content += `- Scalability planning for business growth\n\n`;
  
  content += `### 💼 Business Benefits Summary\n\n`;
  content += `- **Immediate Impact**: See measurable improvements within first month\n`;
  content += `- **Long-term Value**: Solution evolves with your business needs\n`;
  content += `- **Risk Mitigation**: Proven technology with comprehensive support\n`;
  content += `- **Competitive Edge**: Modern technology stack differentiates your business\n`;
  content += `- **Cost Efficiency**: Significant ROI through operational optimization\n\n`;
  
  return content;
}

// Tutorial helper functions
function getPrerequisiteKnowledge(projectType: string, technologies: string[]): string {
  const mainTech = technologies[0] || 'programming';
  
  switch (projectType) {
    case 'Web Application':
      return `HTML/CSS basics, ${mainTech} fundamentals, and web development concepts`;
    case 'API/Backend Service':
      return `HTTP protocols, RESTful services, and ${mainTech} server-side development`;
    case 'Data & Analytics':
      return `Data structures, basic statistics, and ${mainTech} data manipulation libraries`;
    case 'Mobile Application':
      return `Mobile development concepts, ${mainTech} mobile frameworks, and UI/UX principles`;
    default:
      return `${mainTech} programming fundamentals and software development principles`;
  }
}

function getEnvironmentSetup(technologies: string[], projectType: string): string {
  const mainTech = technologies[0] || 'Development';
  
  const setups: { [key: string]: string } = {
    'JavaScript': 'Node.js (v16+), npm or yarn package manager',
    'TypeScript': 'Node.js (v16+), TypeScript compiler, npm or yarn',
    'Python': 'Python (v3.8+), pip package manager, virtual environment tools',
    'C#': '.NET SDK (v6.0+), Visual Studio or VS Code with C# extension',
    'Java': 'JDK (v11+), Maven or Gradle build tools',
    'React': 'Node.js (v16+), Create React App or Vite, npm or yarn',
    'Next.js': 'Node.js (v16+), npm or yarn, Next.js CLI',
    'Vue': 'Node.js (v16+), Vue CLI, npm or yarn',
    'Angular': 'Node.js (v16+), Angular CLI, npm or yarn'
  };
  
  return setups[mainTech] || `${mainTech} development environment and package manager`;
}

function generateTutorialSteps(projectType: string, technologies: string[], complexity: string): string {
  const steps = [
    '1. **Project Setup** - Environment configuration and initial structure',
    '2. **Core Implementation** - Building the main functionality',
    '3. **Feature Development** - Adding advanced features and capabilities',
    '4. **Testing & Quality** - Ensuring reliability and maintainability',
    '5. **Deployment** - Getting your project live and accessible'
  ];
  
  if (complexity === 'advanced') {
    steps.push('6. **Optimization** - Performance tuning and scaling strategies');
  }
  
  return steps.join('\n');
}

function getInitializationCommands(technologies: string[], projectType: string): string {
  const mainTech = technologies[0] || 'development';
  
  const commands: { [key: string]: string } = {
    'JavaScript': 'npm init -y\nnpm install --save-dev eslint prettier',
    'TypeScript': 'npm init -y\nnpm install -D typescript @types/node ts-node\nnpx tsc --init',
    'Python': 'python -m venv venv\nsource venv/bin/activate  # On Windows: venv\\Scripts\\activate\npip install -r requirements.txt',
    'C#': 'dotnet new console\ndotnet restore',
    'React': 'npx create-react-app . --template typescript\nnpm install',
    'Next.js': 'npx create-next-app@latest . --typescript --tailwind --eslint\nnpm install',
    'Vue': 'npm create vue@latest .\nnpm install'
  };
  
  return commands[mainTech] || '# Initialize your project with appropriate tools';
}

function generateProjectStructure(projectType: string, technologies: string[]): string {
  const mainTech = technologies[0] || 'development';
  
  if (mainTech.includes('React') || mainTech.includes('Next') || mainTech.includes('Vue')) {
    return `├── src/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── utils/
├── public/
├── package.json
└── README.md`;
  }
  
  if (mainTech === 'Python') {
    return `├── src/
│   ├── main.py
│   ├── models/
│   ├── services/
│   └── utils/
├── tests/
├── requirements.txt
└── README.md`;
  }
  
  if (mainTech === 'C#') {
    return `├── src/
│   ├── Program.cs
│   ├── Models/
│   ├── Services/
│   └── Utils/
├── Tests/
├── *.csproj
└── README.md`;
  }
  
  return `├── src/
│   ├── main files
│   ├── components/
│   └── utils/
├── tests/
├── config files
└── README.md`;
}

function generateConfigurationSteps(technologies: string[], projectType: string): string {
  const mainTech = technologies[0] || 'development';
  
  if (technologies.includes('TypeScript')) {
    return `Create essential configuration files:

**tsconfig.json** (TypeScript configuration):
\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
\`\`\``;
  }
  
  if (mainTech === 'Python') {
    return `Create configuration files:

**requirements.txt** (Dependencies):
\`\`\`
# Add your project dependencies here
requests>=2.25.0
pytest>=6.0.0
\`\`\``;
  }
  
  return `Create necessary configuration files for your ${mainTech} project including dependencies, build settings, and environment variables.`;
}

function generateArchitectureExplanation(projectType: string, technologies: string[], complexity: string): string {
  const mainTech = technologies[0] || 'development';
  
  return `Our ${projectType.toLowerCase()} follows a ${complexity}-level architecture pattern:

**Core Architecture:**
- **Separation of Concerns**: Each component has a single responsibility
- **Modular Design**: Code is organized into reusable modules
- **${mainTech} Best Practices**: Following established patterns and conventions

**Key Architectural Decisions:**
- Component-based structure for maintainability
- Clear data flow and state management
- Error handling and validation at appropriate layers
- Scalable folder structure supporting future growth`;
}

function generateComponentImplementation(projectType: string, technologies: string[]): string {
  const mainTech = technologies[0] || 'development';
  
  switch (projectType) {
    case 'Web Application':
      return `**Main Components:**
1. **Layout Component** - Overall page structure
2. **Navigation** - User interface navigation
3. **Content Components** - Feature-specific functionality
4. **Utility Functions** - Shared helper functions

**Implementation Order:**
1. Start with basic layout and routing
2. Add core functionality components
3. Integrate state management
4. Style and polish the interface`;

    case 'API/Backend Service':
      return `**Core Components:**
1. **Router Setup** - API endpoints and routing
2. **Controllers** - Request handling logic
3. **Services** - Business logic implementation
4. **Models** - Data structure definitions

**Implementation Steps:**
1. Set up basic server and routing
2. Implement core API endpoints
3. Add middleware for authentication/validation
4. Connect to data storage solutions`;

    default:
      return `**Essential Components:**
1. **Core Module** - Main application logic
2. **Configuration** - Settings and environment setup
3. **Utilities** - Helper functions and tools
4. **Interface Layer** - User or API interaction points

Follow ${mainTech} best practices for structuring and implementing each component.`;
  }
}

function generateFeatureImplementation(projectType: string, technologies: string[]): string {
  const mainTech = technologies[0] || 'development';
  
  return `Now let's add advanced features to enhance our ${projectType.toLowerCase()}:

#### 3.1 Enhanced Functionality
- User authentication and authorization
- Data validation and error handling
- Advanced ${mainTech} features and optimizations
- Integration with external services or APIs

#### 3.2 Performance Optimizations
- Code splitting and lazy loading (where applicable)
- Database query optimization
- Caching strategies
- Bundle size optimization

#### 3.3 User Experience Improvements
- Loading states and error boundaries
- Responsive design considerations
- Accessibility features
- Progressive enhancement`;
}

function getTestingSetup(technologies: string[]): string {
  const mainTech = technologies[0] || 'development';
  
  const testSetups: { [key: string]: string } = {
    'JavaScript': 'npm install --save-dev jest @testing-library/jest-dom',
    'TypeScript': 'npm install --save-dev jest @types/jest ts-jest',
    'Python': 'pip install pytest pytest-cov',
    'C#': 'dotnet add package Microsoft.NET.Test.Sdk\ndotnet add package xunit',
    'React': 'npm install --save-dev @testing-library/react @testing-library/user-event',
    'Next.js': 'npm install --save-dev @testing-library/react @testing-library/jest-dom'
  };
  
  return testSetups[mainTech] || `# Install testing framework for ${mainTech}`;
}

function generateTestingGuide(projectType: string, technologies: string[]): string {
  return `Write comprehensive tests for your ${projectType.toLowerCase()}:

**Test Categories:**
1. **Unit Tests** - Test individual functions and components
2. **Integration Tests** - Test component interactions
3. **End-to-End Tests** - Test complete user workflows

**Testing Best Practices:**
- Write tests before implementing features (TDD approach)
- Aim for high code coverage (80%+ recommended)
- Test both happy paths and error conditions
- Use descriptive test names and clear assertions

**Example Test Structure:**
\`\`\`javascript
describe('${projectType} functionality', () => {
  test('should handle user input correctly', () => {
    // Arrange, Act, Assert pattern
  });
});
\`\`\``;
}

function generateDeploymentGuide(projectType: string, technologies: string[]): string {
  const mainTech = technologies[0] || 'development';
  
  return `Deploy your ${projectType.toLowerCase()} to production:

#### 5.1 Build for Production
\`\`\`bash
${getBuildCommands(mainTech)}
\`\`\`

#### 5.2 Deployment Options
- **Cloud Platforms**: Vercel, Netlify, Heroku, AWS
- **Traditional Hosting**: VPS, shared hosting
- **Containerization**: Docker for consistent environments

#### 5.3 Environment Configuration
- Set up environment variables for production
- Configure database connections
- Set up SSL certificates
- Configure domain and DNS settings

#### 5.4 Monitoring & Maintenance
- Set up error tracking and logging
- Configure performance monitoring
- Plan for regular updates and security patches`;
}

function getBuildCommands(mainTech: string): string {
  const commands: { [key: string]: string } = {
    'JavaScript': 'npm run build',
    'TypeScript': 'npm run build',
    'Python': 'pip freeze > requirements.txt\n# Package your application',
    'C#': 'dotnet publish -c Release',
    'React': 'npm run build',
    'Next.js': 'npm run build\nnpm run export  # For static export',
    'Vue': 'npm run build'
  };
  
  return commands[mainTech] || `# Build your ${mainTech} application for production`;
}

function generateTroubleshootingGuide(projectType: string, technologies: string[]): string {
  const mainTech = technologies[0] || 'development';
  
  return `Common issues and their solutions:

**🚨 Installation Problems**
- **Issue**: Dependencies fail to install
- **Solution**: Clear cache, check Node.js/Python version, try different package manager

**🚨 Build Errors**
- **Issue**: Compilation or build failures
- **Solution**: Check syntax errors, missing imports, configuration issues

**🚨 Runtime Errors**
- **Issue**: Application crashes or unexpected behavior
- **Solution**: Check console logs, verify data types, test with sample data

**🚨 Performance Issues**
- **Issue**: Slow loading or poor performance
- **Solution**: Profile code, optimize algorithms, implement caching

**💡 Pro Tips:**
- Always read error messages carefully
- Use browser developer tools for debugging
- Check official ${mainTech} documentation
- Search community forums for similar issues`;
}

function generateExtensionIdeas(projectType: string, technologies: string[], complexity: string): string {
  const mainTech = technologies[0] || 'development';
  
  const extensions = [
    `**Enhanced Features**: Add advanced ${mainTech} capabilities and integrations`,
    `**API Integration**: Connect with external services and third-party APIs`,
    `**Database Integration**: Add persistent data storage and management`,
    `**User Management**: Implement authentication, authorization, and user profiles`,
    `**Real-time Features**: Add websockets, live updates, or real-time collaboration`,
    `**Mobile Support**: Create responsive design or native mobile applications`,
    `**Analytics & Monitoring**: Add usage tracking, performance monitoring, and analytics`,
    `**Internationalization**: Support multiple languages and locales`
  ];
  
  if (complexity === 'advanced') {
    extensions.push(
      `**Microservices Architecture**: Break into smaller, independent services`,
      `**Advanced Caching**: Implement Redis, CDN, or other caching strategies`,
      `**Load Balancing**: Add horizontal scaling and load distribution`
    );
  }
  
  return extensions.join('\n');
}

// Helper function to enhance AI responses that aren't in JSON format
function enhanceAIResponse(responseText: string, repoAnalysis: any, analysisData: any): string {
  // If the AI response is already well-formatted, enhance it with project-specific details
  if (responseText.length > 500) {
    return responseText + `\n\n---\n\n**Project Details:**\n- Repository: ${repoAnalysis.repository.html_url}\n- Technologies: ${analysisData.technologies.join(', ')}\n- Last Updated: ${new Date(repoAnalysis.repository.updated_at).toLocaleDateString()}`;
  }
  
  // If response is too short, fall back to smart content generation
  return generateSmartContent(repoAnalysis, analysisData, 'professional', 'overview', 'developers');
}

// Original fallback content generator (kept for compatibility)
function generateFallbackContent(repoAnalysis: any, analysisData: any): string {
  return `
# ${repoAnalysis.repository.name}

## Overview

${analysisData.description}

This project showcases modern development practices using ${analysisData.technologies.join(', ')}.

## Technical Stack

The project is built with:

${analysisData.technologies.map((tech: string) => `- **${tech}**`).join('\n')}

## Key Features

${analysisData.readme.substring(0, 500)}

## Dependencies

This project uses several key dependencies:

${analysisData.dependencies.slice(0, 5).map((dep: string) => `- \`${dep}\``).join('\n')}

## Repository Information

- **Stars**: ${repoAnalysis.repository.stargazers_count}
- **Forks**: ${repoAnalysis.repository.forks_count}
- **Last Updated**: ${new Date(repoAnalysis.repository.updated_at).toLocaleDateString()}

## Conclusion

${repoAnalysis.repository.name} demonstrates the effective use of ${analysisData.technologies[0]} for building modern applications. The project structure and implementation provide valuable insights for developers working with similar technologies.

[View on GitHub](${repoAnalysis.repository.html_url})
`;
}

// Advanced feature generators

function generateTableOfContents(content: string): Array<{title: string, level: number, anchor: string}> {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: Array<{title: string, level: number, anchor: string}> = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const anchor = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    
    toc.push({ title, level, anchor });
  }

  return toc;
}

function generateCodeSnippets(techStack: TechnologyStack, projectType: string, focus: string): Array<{language: string, code: string, description: string}> {
  const snippets: Array<{language: string, code: string, description: string}> = [];

  if (focus === 'technical-deep-dive' || focus === 'tutorial') {
    // React example
    if (techStack.frontend.includes('React')) {
      snippets.push({
        language: 'jsx',
        code: `import React, { useState, useEffect } from 'react';

function ExampleComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData().then(setData);
  }, []);

  return (
    <div className="component">
      {data ? <DataDisplay data={data} /> : <Loading />}
    </div>
  );
}`,
        description: 'React component with hooks demonstrating state management and side effects'
      });
    }

    // Node.js/Express example
    if (techStack.backend.includes('Node.js')) {
      snippets.push({
        language: 'javascript',
        code: `const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/data', async (req, res) => {
  try {
    const data = await dataService.getData();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
        description: 'Express.js API endpoint with error handling and async operations'
      });
    }

    // Python example
    if (techStack.backend.includes('Python')) {
      snippets.push({
        language: 'python',
        code: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class DataModel(BaseModel):
    id: int
    name: str
    value: float

@app.get("/data/{item_id}")
async def get_data(item_id: int):
    try:
        data = await data_service.get_by_id(item_id)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))`,
        description: 'FastAPI endpoint with type hints and error handling'
      });
    }
  }

  return snippets.slice(0, 3); // Limit to 3 snippets
}

function generateAdvancedTags(analysisData: any, repoAnalysis: any, techStack: TechnologyStack): string[] {
  const tags = new Set<string>();
  
  // Technology tags
  Object.values(techStack).flat().forEach(tech => {
    tags.add(tech.toLowerCase().replace(/[^a-z0-9]/g, '-'));
  });
  
  // Project type tags
  if (repoAnalysis.repository.description) {
    const desc = repoAnalysis.repository.description.toLowerCase();
    if (desc.includes('api')) tags.add('api');
    if (desc.includes('web')) tags.add('web-development');
    if (desc.includes('mobile')) tags.add('mobile-development');
    if (desc.includes('cli')) tags.add('command-line');
  }
  
  // Language tags
  Object.keys(repoAnalysis.languages || {}).forEach(lang => {
    tags.add(lang.toLowerCase());
  });
  
  // Additional context tags
  tags.add('development');
  tags.add('programming');
  tags.add('open-source');
  
  return Array.from(tags).slice(0, 8);
}

function calculateDynamicReadTime(content: string, complexity: string, focus: string): number {
  const baseWordsPerMinute = 200;
  
  // Adjust reading speed based on complexity
  const complexityMultiplier = {
    'Beginner': 1.0,
    'Intermediate': 1.3,
    'Advanced': 1.6
  };
  
  // Adjust based on focus type
  const focusMultiplier = {
    'overview': 1.0,
    'technical-deep-dive': 1.5,
    'learning-journey': 1.2,
    'showcase': 1.1,
    'tutorial': 1.4
  };
  
  const wordCount = content.split(/\s+/).length;
  const adjustedWPM = baseWordsPerMinute / 
    (complexityMultiplier[complexity as keyof typeof complexityMultiplier] * 
     focusMultiplier[focus as keyof typeof focusMultiplier]);
  
  return Math.max(1, Math.ceil(wordCount / adjustedWPM));
}

function generateAdvancedSEOKeywords(analysisData: any, repoAnalysis: any, focus: string, techStack: TechnologyStack): string[] {
  const keywords = new Set<string>();
  
  // Project name variations
  const projectName = repoAnalysis.repository.name;
  keywords.add(projectName);
  keywords.add(projectName.toLowerCase());
  
  // Technology keywords
  Object.values(techStack).flat().forEach(tech => {
    keywords.add(tech);
    keywords.add(`${tech} tutorial`);
    keywords.add(`${tech} development`);
  });
  
  // Focus-specific keywords
  if (focus === 'tutorial') {
    keywords.add('step-by-step guide');
    keywords.add('how to build');
    keywords.add('tutorial');
  } else if (focus === 'technical-deep-dive') {
    keywords.add('architecture');
    keywords.add('implementation');
    keywords.add('technical analysis');
  }
  
  // Project type keywords
  if (repoAnalysis.repository.description) {
    const desc = repoAnalysis.repository.description.toLowerCase();
    if (desc.includes('api')) keywords.add('REST API');
    if (desc.includes('web')) keywords.add('web application');
    if (desc.includes('mobile')) keywords.add('mobile app');
  }
  
  return Array.from(keywords).slice(0, 12);
}

function generateRelatedProjects(techStack: TechnologyStack, projectType: string): string[] {
  const related: string[] = [];
  
  if (techStack.frontend.includes('React')) {
    related.push('React Portfolio Website', 'React E-commerce Platform', 'React Dashboard Application');
  }
  if (techStack.backend.includes('Node.js')) {
    related.push('Express REST API', 'Node.js Microservices', 'GraphQL Server');
  }
  if (techStack.frontend.includes('Vue.js')) {
    related.push('Vue.js SPA', 'Vue.js PWA', 'Nuxt.js Application');
  }
  if (projectType === 'Full-Stack Application') {
    related.push('MERN Stack Application', 'Full-Stack Blog Platform', 'Real-time Chat Application');
  }
  
  return related.slice(0, 5);
}

function generateSmartContent(repoAnalysis: any, analysisData: any, tone: string, focus: string, targetAudience: string, projectAnalysis?: any): string {
  const { repository, readme, technologies, dependencies, keyFiles, description, topics } = analysisData;
  const projectName = repository.name;
  
  // Enhanced project analysis
  const projectType = projectAnalysis?.projectType || 'Software Project';
  const complexity = projectAnalysis?.complexity || 'Intermediate';
  const techStack = projectAnalysis?.techStack || { frontend: [], backend: [], database: [], tools: [], frameworks: [] };
  
  let content = `# ${generateDynamicTitle(repoAnalysis, analysisData, tone, focus, targetAudience)}\n\n`;
  
  // Dynamic introduction based on target audience and project characteristics
  if (targetAudience === 'recruiters') {
    content += generateRecruiterIntro(description, projectType, technologies, complexity);
  } else if (targetAudience === 'business') {
    content += generateBusinessIntro(description, projectType, technologies, complexity, repoAnalysis);
  } else if (targetAudience === 'students') {
    content += generateStudentIntro(description, projectType, technologies, complexity);
  } else if (targetAudience === 'general') {
    content += generateGeneralIntro(description, projectType, technologies);
  } else {
    content += generateDeveloperIntro(description, projectType, technologies, complexity);
  }
  
  // Enhanced technology analysis
  content += generateAdvancedTechStackSection(techStack, projectType);
  
  // Focus-based content with enhanced intelligence and deeper differentiation
  if (focus === 'technical-deep-dive') {
    content += generateEnhancedTechnicalContent(repoAnalysis, analysisData, projectType, complexity, techStack);
  } else if (focus === 'learning-journey') {
    content += generateEnhancedLearningContent(repoAnalysis, analysisData, projectType, complexity, tone);
  } else if (focus === 'showcase') {
    content += generateEnhancedShowcaseContent(repoAnalysis, analysisData, projectType, techStack);
  } else if (focus === 'tutorial') {
    content += generateStepByStepTutorialContent(repoAnalysis, analysisData, projectType, complexity);
  } else {
    content += generateEnhancedOverviewContent(repoAnalysis, analysisData, projectType, complexity);
  }
  
  // Dynamic conclusion based on complexity and length
  content += generateDynamicConclusion(projectName, projectType, complexity, techStack);
  
  return content;
}

function generateAdvancedTechStackSection(techStack: TechnologyStack, projectType: string): string {
  let content = `## 🛠️ Technology Stack & Architecture\n\n`;
  content += `This ${projectType.toLowerCase()} leverages a modern technology stack designed for scalability, maintainability, and performance.\n\n`;
  
  if (techStack.frontend.length > 0) {
    content += `### Frontend Technologies\n`;
    techStack.frontend.forEach(tech => {
      content += `- **${tech}**: ${getTechnologyDescription(tech, 'frontend')}\n`;
    });
    content += `\n`;
  }
  
  if (techStack.backend.length > 0) {
    content += `### Backend & Server\n`;
    techStack.backend.forEach(tech => {
      content += `- **${tech}**: ${getTechnologyDescription(tech, 'backend')}\n`;
    });
    content += `\n`;
  }
  
  if (techStack.database.length > 0) {
    content += `### Data Management\n`;
    techStack.database.forEach(tech => {
      content += `- **${tech}**: ${getTechnologyDescription(tech, 'database')}\n`;
    });
    content += `\n`;
  }
  
  if (techStack.tools.length > 0) {
    content += `### Development Tools\n`;
    techStack.tools.forEach(tech => {
      content += `- **${tech}**: ${getTechnologyDescription(tech, 'tools')}\n`;
    });
    content += `\n`;
  }
  
  return content;
}

function getTechnologyDescription(tech: string, category: string): string {
  const descriptions: Record<string, Record<string, string>> = {
    frontend: {
      'React': 'Component-based library for building user interfaces with efficient virtual DOM',
      'Vue.js': 'Progressive framework for building user interfaces with gentle learning curve',
      'Angular': 'Full-featured framework with TypeScript, dependency injection, and comprehensive tooling',
      'Next.js': 'React framework with server-side rendering, static generation, and built-in optimizations',
      'TypeScript': 'Typed superset of JavaScript providing better developer experience and code reliability',
      'Tailwind CSS': 'Utility-first CSS framework for rapid UI development',
    },
    backend: {
      'Node.js': 'JavaScript runtime for building fast, scalable server-side applications',
      'Python': 'Versatile language with rich ecosystem for web development and data processing',
      'Express': 'Minimal and flexible Node.js web application framework',
      'FastAPI': 'Modern Python framework for building APIs with automatic documentation',
    },
    database: {
      'MongoDB': 'NoSQL document database for flexible, schema-less data storage',
      'PostgreSQL': 'Advanced relational database with strong consistency and SQL compliance',
      'Redis': 'In-memory data structure store for caching and session management',
      'Firebase': 'Platform providing real-time database, authentication, and hosting services',
    },
    tools: {
      'Docker': 'Containerization platform for consistent deployment across environments',
      'Jest': 'JavaScript testing framework with built-in mocking and assertion library',
      'ESLint': 'Static analysis tool for identifying and fixing JavaScript code issues',
      'GitHub Actions': 'CI/CD platform for automating build, test, and deployment workflows',
    }
  };
  
  return descriptions[category]?.[tech] || 'Modern technology choice for reliable development';
}

function generateEnhancedTechnicalContent(repoAnalysis: any, analysisData: any, projectType: string, complexity: string, techStack: TechnologyStack): string {
  return `## 🔧 Technical Deep Dive

### Architecture Overview

This ${projectType.toLowerCase()} implements a ${complexity.toLowerCase()}-level architecture that demonstrates modern software engineering principles. The system is designed with modularity, scalability, and maintainability as core considerations.

**Key Architectural Decisions:**
- **Separation of Concerns**: Clear distinction between presentation, business logic, and data layers
- **Component-Based Design**: Modular architecture allowing for independent development and testing
- **Scalable Infrastructure**: Built to handle growth in users and data volume
- **Error Handling**: Comprehensive error management and graceful failure recovery

### Implementation Highlights

#### Core Architecture Patterns
${techStack.frontend.length > 0 ? `
**Frontend Architecture:**
- Component-based structure with ${techStack.frontend.join(', ')}
- State management following best practices
- Responsive design principles for cross-device compatibility
- Performance optimization through code splitting and lazy loading
` : ''}

${techStack.backend.length > 0 ? `
**Backend Architecture:**
- RESTful API design with ${techStack.backend.join(', ')}
- Middleware stack for authentication, validation, and error handling
- Database abstraction layer for data persistence
- Scalable service architecture
` : ''}

### Performance Considerations

The application incorporates several performance optimization strategies:

1. **Efficient Data Flow**: Minimized re-renders and optimized state updates
2. **Caching Strategy**: Strategic caching at multiple levels for improved response times
3. **Resource Optimization**: Minimized bundle sizes and optimized asset delivery
4. **Database Optimization**: Efficient queries and proper indexing strategies

### Security Implementation

Security measures implemented throughout the application:
- Input validation and sanitization
- Authentication and authorization mechanisms
- Secure communication protocols
- Protection against common vulnerabilities (XSS, CSRF, injection attacks)

`;
}

function generateEnhancedLearningContent(repoAnalysis: any, analysisData: any, projectType: string, complexity: string, tone: string): string {
  const personalNarrative = tone === 'storytelling' || tone === 'casual';
  
  return `## 📚 Development Journey & Learning Experience

### ${personalNarrative ? 'My Learning Adventure' : 'Development Process'}

${personalNarrative ? 
    `Building this ${projectType.toLowerCase()} was an incredible learning journey that challenged me to grow as a developer and think creatively about problem-solving.` :
    `The development of this ${projectType.toLowerCase()} provided valuable insights into modern software engineering practices and ${complexity.toLowerCase()}-level implementation challenges.`}

### Key Learning Milestones

#### 1. Technology Mastery
${personalNarrative ? 
    `Initially, I was familiar with the basics, but this project pushed me to dive deeper into:` :
    `This project required mastering several key technologies:`}

${analysisData.technologies.slice(0, 3).map((tech: string) => 
    `- **${tech}**: ${personalNarrative ? 'I discovered' : 'Understanding'} advanced features and best practices`
).join('\n')}

#### 2. Problem-Solving Challenges

${personalNarrative ? `The most challenging aspects I encountered were:` : `Key technical challenges addressed:`}

- **Architecture Design**: ${personalNarrative ? 'I had to think carefully about' : 'Implementing'} scalable and maintainable code structure
- **Performance Optimization**: ${personalNarrative ? 'I learned to balance' : 'Balancing'} functionality with speed and efficiency
- **User Experience**: ${personalNarrative ? 'I focused on creating' : 'Designing'} intuitive and responsive interfaces

#### 3. Skills Developed

${personalNarrative ? 'Through this project, I strengthened my abilities in:' : 'This project enhanced skills in:'}

- **Full-Stack Development**: Understanding how frontend and backend components work together
- **Modern DevOps**: Implementing CI/CD pipelines and deployment strategies
- **Code Quality**: Writing clean, testable, and maintainable code
- **Documentation**: Creating comprehensive project documentation

### Lessons Learned

${personalNarrative ? 
    `This experience taught me that successful software development isn't just about writing code—it's about understanding user needs, planning ahead, and continuously learning from challenges.` :
    `The development process reinforced the importance of planning, testing, and iterative improvement in software engineering.`}

**Key Takeaways:**
1. **Planning First**: Proper architecture design saves time in the long run
2. **Testing Matters**: Comprehensive testing prevents issues and builds confidence
3. **User-Centric Design**: Always keep the end user's experience in mind
4. **Continuous Learning**: Technology evolves rapidly, and staying current is essential

`;
}

function generateEnhancedShowcaseContent(repoAnalysis: any, analysisData: any, projectType: string, techStack: TechnologyStack): string {
  return `## ✨ Feature Showcase & Capabilities

### 🎯 Core Features

This ${projectType.toLowerCase()} demonstrates a comprehensive range of features that highlight modern development capabilities and user-centric design.

#### Primary Functionality
- **Intuitive User Interface**: Clean, modern design with excellent user experience
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Real-time Updates**: Dynamic content updates without page refreshes
- **Performance Optimized**: Fast loading times and smooth interactions

#### Advanced Capabilities
${techStack.frontend.length > 0 ? `
**Frontend Excellence:**
- Component-based architecture with ${techStack.frontend.join(', ')}
- State management for complex application logic
- Progressive enhancement for accessibility
- Cross-browser compatibility
` : ''}

${techStack.backend.length > 0 ? `
**Backend Power:**
- Robust API design with ${techStack.backend.join(', ')}
- Scalable server architecture
- Comprehensive error handling
- Data validation and security measures
` : ''}

### 🚀 Technical Innovations

#### Unique Implementation Features
- **Smart Caching**: Intelligent caching strategies for optimal performance
- **Modular Architecture**: Easily extensible and maintainable codebase
- **Error Recovery**: Graceful handling of edge cases and failures
- **Accessibility**: WCAG-compliant design for inclusive user experience

#### Development Best Practices
- **Clean Code**: Well-structured, readable, and documented codebase
- **Testing Strategy**: Comprehensive test coverage for reliability
- **Version Control**: Organized commit history and branching strategy
- **Documentation**: Clear setup instructions and API documentation

### 🎨 User Experience Highlights

**Design Philosophy:**
- Minimalist interface focused on usability
- Consistent design language throughout the application
- Intuitive navigation and user flow
- Fast, responsive interactions

**Accessibility Features:**
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Semantic HTML structure

### 🔧 Technical Stack Showcase

The technology choices demonstrate modern development practices:

${Object.entries(techStack).filter(([_, techs]) => techs.length > 0).map(([category, techs]) => 
    `**${category.charAt(0).toUpperCase() + category.slice(1)}**: ${techs.join(', ')}`
).join('\n')}

This combination provides a solid foundation for scalable, maintainable software development.

`;
}

function generateEnhancedOverviewContent(repoAnalysis: any, analysisData: any, projectType: string, complexity: string): string {
  return `## 📋 Project Overview

### What This Project Delivers

This ${projectType.toLowerCase()} represents a ${complexity.toLowerCase()}-level implementation that showcases modern software development practices and delivers real value to its users.

**Primary Objectives:**
- Demonstrate practical application of current technologies
- Provide a solid foundation for similar projects
- Showcase best practices in software architecture
- Deliver a functional, user-friendly solution

### Technical Foundation

The project is built on a robust technical foundation that ensures reliability, scalability, and maintainability:

**Architecture Highlights:**
- Clean, modular code structure
- Separation of concerns across different layers
- Efficient data management and processing
- Responsive and accessible user interface

**Quality Assurance:**
- Comprehensive testing strategy
- Code quality standards and linting
- Version control with meaningful commit messages
- Documentation for setup and usage

### Business Value

Beyond technical excellence, this project provides tangible business value:

- **Efficiency**: Streamlined processes and automated workflows
- **Scalability**: Architecture designed to grow with increasing demands
- **Maintainability**: Clean code that's easy to modify and extend
- **User Experience**: Intuitive interface that reduces learning curve

### Future Potential

The solid foundation enables future enhancements and extensions:
- Integration with additional services and APIs
- Advanced features and functionality
- Performance optimizations and scaling
- Mobile applications and cross-platform expansion

`;
}

function generateDynamicConclusion(projectName: string, projectType: string, complexity: string, techStack: TechnologyStack): string {
  const techHighlights = Object.values(techStack).flat().slice(0, 3).join(', ');
  
  return `## 🎯 Conclusion

${projectName} demonstrates the effective implementation of ${complexity.toLowerCase()}-level ${projectType.toLowerCase()} development using ${techHighlights}. The project showcases modern software engineering practices, clean code principles, and user-focused design.

**Key Achievements:**
- Successful integration of multiple technologies into a cohesive solution
- Implementation of best practices for code quality and maintainability
- Creation of a scalable architecture ready for future enhancements
- Delivery of a functional product that solves real-world problems

This project serves as both a practical solution and a learning resource, demonstrating how modern tools and techniques can be combined to create effective software solutions.

**Next Steps:**
- Continue monitoring and improving performance
- Gather user feedback for future enhancements
- Explore integration opportunities with other systems
- Consider mobile or cross-platform expansion

[View Project on GitHub](${projectName})

---

*Built with modern development practices and attention to detail, this project represents a commitment to quality software engineering.*

`;
}

// Helper function to run the flow
export async function generateBlogPost(input: BlogGenerationInputType): Promise<BlogPostOutputType> {
  return await generateBlogPostFlow(input);
}