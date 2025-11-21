import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Import our flows
import './blog-generator';

// Configure Genkit
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_AI_API_KEY,
    }),
  ],
});

console.log('🚀 Genkit AI development server started');
console.log('📝 Blog generation flow loaded and ready');