#!/usr/bin/env tsx
/**
 * Script to update existing journey entries in Firestore with HTML-formatted descriptions
 * This script will:
 * 1. Check for existing journey entries
 * 2. Find HDI France and FedHub entries by title
 * 3. Update their descriptions with HTML content including company links
 * 4. Create the entries if they don't exist
 */

import { JourneyService } from '../src/lib/firebase/firestore';
import { JourneyData } from '../src/lib/firebase/types';

// HDI France HTML description (without company URL - it will be in subtitle)
const HDI_FRANCE_DESCRIPTION = `Provided Level 1 & 2 technical support, managing user incidents for hardware, network, and software issues via <strong>GLPI</strong>.<br><br>

<strong>Key Responsibilities:</strong>
<ul>
  <li>Modernized and maintained legacy <em>Python scripts</em>, focusing on performance optimization, bug fixes, and code readability</li>
  <li>Developed automation scripts to streamline document exports, improving data accessibility and workflow efficiency</li>
  <li>Managed the IT asset lifecycle, including deployment, configuration, and network administration for user workstations and meeting room hardware (<em>ClickShare</em>)</li>
</ul>`;

// FedHub HTML description (without company URL - it will be in subtitle)
const FEDHUB_DESCRIPTION = `<strong>Web Scraping with Python:</strong> Developed a Python scraping algorithm using <em>BeautifulSoup</em> to extract and structure data, along with a simple web interface for practical use.<br><br>

<strong>SEO Optimization:</strong> Improved website SEO and performance using <em>Laravel</em> and <em>React TypeScript</em>.<br><br>

<strong>Key Achievements:</strong>
<ul>
  <li>Optimized dynamic and static loading</li>
  <li>Compressed resources for better performance</li>
  <li>Enhanced meta tags and descriptions for better search engine ranking</li>
</ul>`;

// Complete journey entry data
const HDI_FRANCE_ENTRY: Omit<JourneyData, 'order'> = {
  title: "IT Support & Python Development (Apprentice)",
  date: "September 2023 - September 2024",
  description: HDI_FRANCE_DESCRIPTION,
  type: "achievement",
};

const FEDHUB_ENTRY: Omit<JourneyData, 'order'> = {
  title: "Software Developer Intern",
  date: "June 2023 - August 2023", 
  description: FEDHUB_DESCRIPTION,
  type: "achievement",
};

async function updateJourneyEntries() {
  try {
    console.log('🔍 Fetching existing journey entries...');
    
    // Get all existing journey entries
    const existingEntries = await JourneyService.getJourneyEntries();
    console.log(`Found ${existingEntries.length} existing journey entries`);
    
    // Find HDI France entry
    const hdiEntry = existingEntries.find(entry => 
      entry.title.includes("HDI") || 
      entry.title.includes("IT Support & Python Development")
    );
    
    // Find FedHub entry
    const fedhubEntry = existingEntries.find(entry => 
      entry.title.includes("FedHub") || 
      entry.title.includes("Software Developer Intern")
    );
    
    console.log(`HDI France entry ${hdiEntry ? 'found' : 'not found'}`);
    console.log(`FedHub entry ${fedhubEntry ? 'found' : 'not found'}`);
    
    // Update or create HDI France entry
    if (hdiEntry) {
      console.log('🔄 Updating HDI France entry...');
      await JourneyService.updateJourneyEntry(hdiEntry.id, {
        title: HDI_FRANCE_ENTRY.title,
        date: HDI_FRANCE_ENTRY.date,
        description: HDI_FRANCE_ENTRY.description,
        type: HDI_FRANCE_ENTRY.type,
      });
      console.log('✅ HDI France entry updated successfully');
    } else {
      console.log('➕ Creating new HDI France entry...');
      const hdiId = await JourneyService.createJourneyEntry(HDI_FRANCE_ENTRY);
      console.log(`✅ HDI France entry created with ID: ${hdiId}`);
    }
    
    // Update or create FedHub entry
    if (fedhubEntry) {
      console.log('🔄 Updating FedHub entry...');
      await JourneyService.updateJourneyEntry(fedhubEntry.id, {
        title: FEDHUB_ENTRY.title,
        date: FEDHUB_ENTRY.date,
        description: FEDHUB_ENTRY.description,
        type: FEDHUB_ENTRY.type,
      });
      console.log('✅ FedHub entry updated successfully');
    } else {
      console.log('➕ Creating new FedHub entry...');
      const fedhubId = await JourneyService.createJourneyEntry(FEDHUB_ENTRY);
      console.log(`✅ FedHub entry created with ID: ${fedhubId}`);
    }
    
    // Display final state
    console.log('\n📋 Final journey entries:');
    const finalEntries = await JourneyService.getJourneyEntries();
    finalEntries.forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.title} (${entry.date}) - Type: ${entry.type}`);
    });
    
    console.log('\n🎉 Journey entries update completed successfully!');
    console.log('📱 Changes should now appear in the admin panel and frontend.');
    
  } catch (error) {
    console.error('❌ Error updating journey entries:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  updateJourneyEntries()
    .then(() => {
      console.log('✨ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

export { updateJourneyEntries };