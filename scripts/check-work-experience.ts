#!/usr/bin/env tsx
/**
 * Script to check existing work experience entries in Firestore
 */

import { WorkExperienceService, JourneyService } from '../src/lib/firebase/firestore';

async function checkWorkExperience() {
  try {
    console.log('🔍 Checking existing work experience entries...');
    
    // Get all work experience entries
    const workExperience = await WorkExperienceService.getWorkExperiences();
    console.log(`Found ${workExperience.length} work experience entries:`);
    
    workExperience.forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.title} (${entry.date})`);
      console.log(`   Subtitle: ${entry.subtitle}`);
      console.log(`   Description: ${entry.description.substring(0, 100)}...`);
      console.log('');
    });
    
    console.log('🔍 Checking journey entries...');
    
    // Get all journey entries
    const journeyEntries = await JourneyService.getJourneyEntries();
    console.log(`Found ${journeyEntries.length} journey entries:`);
    
    journeyEntries.forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.title} (${entry.date}) - Type: ${entry.type}`);
      console.log(`   Description: ${entry.description.substring(0, 100)}...`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error checking entries:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  checkWorkExperience()
    .then(() => {
      console.log('✨ Check completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

export { checkWorkExperience };