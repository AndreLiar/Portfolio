#!/usr/bin/env tsx
/**
 * Script to update existing work experience entries in Firestore with HTML-formatted descriptions
 * This script will:
 * 1. Find HDI France and FedHub work experience entries
 * 2. Update their descriptions with HTML content including company links
 */

import { WorkExperienceService } from '../src/lib/firebase/firestore';

// HDI France HTML description
const HDI_FRANCE_DESCRIPTION = `Provided Level 1 & 2 technical support, managing user incidents for hardware, network, and software issues via <strong>GLPI</strong>.<br><br>

<strong>Key Responsibilities:</strong>
<ul>
  <li>Modernized and maintained legacy <em>Python scripts</em>, focusing on performance optimization, bug fixes, and code readability</li>
  <li>Developed automation scripts to streamline document exports, improving data accessibility and workflow efficiency</li>
  <li>Managed the IT asset lifecycle, including deployment, configuration, and network administration for user workstations and meeting room hardware (<em>ClickShare</em>)</li>
</ul>

<a href="https://www.hdi.global/fr-fr/insurance/" target="_blank">Visit HDI France</a>`;

// FedHub HTML description
const FEDHUB_DESCRIPTION = `<strong>Web Scraping with Python:</strong> Developed a Python scraping algorithm using <em>BeautifulSoup</em> to extract and structure data, along with a simple web interface for practical use.<br><br>

<strong>SEO Optimization:</strong> Improved website SEO and performance using <em>Laravel</em> and <em>React TypeScript</em>.<br><br>

<strong>Key Achievements:</strong>
<ul>
  <li>Optimized dynamic and static loading</li>
  <li>Compressed resources for better performance</li>
  <li>Enhanced meta tags and descriptions for better search engine ranking</li>
</ul>

<a href="https://fedhubs.com/" target="_blank">Visit FedHub</a>`;

async function updateWorkExperience() {
  try {
    console.log('🔍 Fetching existing work experience entries...');
    
    // Get all existing work experience entries
    const existingEntries = await WorkExperienceService.getWorkExperiences();
    console.log(`Found ${existingEntries.length} work experience entries`);
    
    // Find HDI France entry
    const hdiEntry = existingEntries.find(entry => 
      entry.title.includes("HDI") || 
      entry.subtitle.includes("HDI") ||
      entry.title.includes("IT Support & Python Development")
    );
    
    // Find FedHub entry
    const fedhubEntry = existingEntries.find(entry => 
      entry.title.includes("FedHub") || 
      entry.subtitle.includes("FedHub") ||
      entry.title.includes("Software Developer Intern")
    );
    
    console.log(`HDI France entry ${hdiEntry ? 'found' : 'not found'}`);
    if (hdiEntry) {
      console.log(`  ID: ${hdiEntry.id}, Title: ${hdiEntry.title}, Subtitle: ${hdiEntry.subtitle}`);
    }
    
    console.log(`FedHub entry ${fedhubEntry ? 'found' : 'not found'}`);
    if (fedhubEntry) {
      console.log(`  ID: ${fedhubEntry.id}, Title: ${fedhubEntry.title}, Subtitle: ${fedhubEntry.subtitle}`);
    }
    
    // Update HDI France entry
    if (hdiEntry) {
      console.log('🔄 Updating HDI France work experience entry...');
      await WorkExperienceService.updateWorkExperience(hdiEntry.id, {
        subtitle: `${hdiEntry.subtitle}<br><a href="https://www.hdi.global/fr-fr/insurance/" target="_blank">🌐 Visit HDI France</a>`,
        description: HDI_FRANCE_DESCRIPTION,
      });
      console.log('✅ HDI France work experience entry updated successfully');
    } else {
      console.log('⚠️  HDI France work experience entry not found');
    }
    
    // Update FedHub entry
    if (fedhubEntry) {
      console.log('🔄 Updating FedHub work experience entry...');
      await WorkExperienceService.updateWorkExperience(fedhubEntry.id, {
        subtitle: `${fedhubEntry.subtitle}<br><a href="https://fedhubs.com/" target="_blank">🌐 Visit FedHub</a>`,
        description: FEDHUB_DESCRIPTION,
      });
      console.log('✅ FedHub work experience entry updated successfully');
    } else {
      console.log('⚠️  FedHub work experience entry not found');
    }
    
    // Display final state
    console.log('\n📋 Final work experience entries:');
    const finalEntries = await WorkExperienceService.getWorkExperiences();
    finalEntries.forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.title} (${entry.date}) - ${entry.subtitle}`);
      console.log(`   Description: ${entry.description.substring(0, 100)}...`);
      console.log('');
    });
    
    console.log('\n🎉 Work experience entries update completed successfully!');
    console.log('📱 Changes should now appear on the frontend timeline with HTML formatting and company links.');
    
  } catch (error) {
    console.error('❌ Error updating work experience entries:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  updateWorkExperience()
    .then(() => {
      console.log('✨ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

export { updateWorkExperience };