#!/usr/bin/env tsx

/**
 * Migration script to transfer portfolio data from JSON locale files to Firestore
 * Run with: npx tsx scripts/migrate-to-firestore.ts
 */

import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env file
config();

// Firebase config - make sure your environment variables are set
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collection names
const COLLECTIONS = {
  BIO: 'bio',
  PROJECTS: 'projects',
  SKILLS: 'skills',
  WORK_EXPERIENCE: 'work_experience',
  EDUCATION: 'education',
  LANGUAGES: 'languages',
  INTERESTS: 'interests',
  JOURNEY: 'journey',
} as const;

interface JsonData {
  data: {
    name: string;
    fullName: string;
    title: string;
    location: string;
    contact: {
      email: string;
      phone: string;
      github: string;
      linkedin: string;
    };
    summary: string;
    skills: Array<{
      title: string;
      Icon: string;
      skills: string[];
    }>;
    projects: Array<{
      title: string;
      purpose: string;
      stack: string[];
      impact: string;
      role: string;
      features: string[];
      link?: string;
      repoUrl?: string;
    }>;
    workExperience: Array<{
      date: string;
      title: string;
      subtitle: string;
      description: string;
    }>;
    education: Array<{
      date: string;
      title: string;
      subtitle: string;
      description: string;
    }>;
    softSkills: string[];
    languages: Array<{
      name: string;
      level: string;
    }>;
    interests: string[];
  };
}

async function loadJsonData(): Promise<JsonData> {
  const jsonPath = join(process.cwd(), 'src/locales/en.json');
  const jsonContent = readFileSync(jsonPath, 'utf-8');
  return JSON.parse(jsonContent);
}

async function migrateBio(data: JsonData['data']) {
  console.log('🔄 Migrating bio data...');
  
  const bioData = {
    name: data.name,
    fullName: data.fullName,
    title: data.title,
    location: data.location,
    summary: data.summary,
    contact: data.contact,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };

  const bioRef = doc(db, COLLECTIONS.BIO, 'singleton');
  await setDoc(bioRef, bioData);
  console.log('✅ Bio data migrated successfully');
}

async function migrateProjects(projects: JsonData['data']['projects']) {
  console.log('🔄 Migrating projects...');
  
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    const projectData = {
      title: project.title,
      purpose: project.purpose,
      stack: project.stack,
      impact: project.impact,
      role: project.role,
      features: project.features,
      link: project.link || '',
      repoUrl: project.repoUrl || '',
      imageUrl: '',
      order: i + 1,
      status: 'published' as const,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };

    await addDoc(collection(db, COLLECTIONS.PROJECTS), projectData);
    console.log(`✅ Project "${project.title}" migrated`);
  }
}

async function migrateSkills(skills: JsonData['data']['skills'], softSkills: string[]) {
  console.log('🔄 Migrating skills...');
  
  // Migrate technical skills
  for (let i = 0; i < skills.length; i++) {
    const skill = skills[i];
    const skillData = {
      title: skill.title,
      icon: skill.Icon,
      skills: skill.skills,
      category: 'technical' as const,
      order: i + 1,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };

    await addDoc(collection(db, COLLECTIONS.SKILLS), skillData);
    console.log(`✅ Technical skill "${skill.title}" migrated`);
  }

  // Migrate soft skills as a single entry
  const softSkillData = {
    title: 'Soft Skills',
    icon: 'Users',
    skills: softSkills,
    category: 'soft' as const,
    order: skills.length + 1,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };

  await addDoc(collection(db, COLLECTIONS.SKILLS), softSkillData);
  console.log('✅ Soft skills migrated');
}

async function migrateWorkExperience(workExperience: JsonData['data']['workExperience']) {
  console.log('🔄 Migrating work experience...');
  
  for (let i = 0; i < workExperience.length; i++) {
    const work = workExperience[i];
    const workData = {
      date: work.date,
      title: work.title,
      subtitle: work.subtitle,
      description: work.description,
      order: i + 1,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };

    await addDoc(collection(db, COLLECTIONS.WORK_EXPERIENCE), workData);
    console.log(`✅ Work experience "${work.title}" migrated`);
  }
}

async function migrateEducation(education: JsonData['data']['education']) {
  console.log('🔄 Migrating education...');
  
  for (let i = 0; i < education.length; i++) {
    const edu = education[i];
    const eduData = {
      date: edu.date,
      title: edu.title,
      subtitle: edu.subtitle,
      description: edu.description,
      order: i + 1,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };

    await addDoc(collection(db, COLLECTIONS.EDUCATION), eduData);
    console.log(`✅ Education "${edu.title}" migrated`);
  }
}

async function migrateLanguages(languages: JsonData['data']['languages']) {
  console.log('🔄 Migrating languages...');
  
  for (let i = 0; i < languages.length; i++) {
    const lang = languages[i];
    const langData = {
      name: lang.name,
      level: lang.level,
      order: i + 1,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };

    await addDoc(collection(db, COLLECTIONS.LANGUAGES), langData);
    console.log(`✅ Language "${lang.name}" migrated`);
  }
}

async function migrateInterests(interests: JsonData['data']['interests']) {
  console.log('🔄 Migrating interests...');
  
  for (let i = 0; i < interests.length; i++) {
    const interest = interests[i];
    const interestData = {
      name: interest,
      order: i + 1,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };

    await addDoc(collection(db, COLLECTIONS.INTERESTS), interestData);
    console.log(`✅ Interest "${interest}" migrated`);
  }
}

async function migrateJourney(workExperience: JsonData['data']['workExperience'], education: JsonData['data']['education']) {
  console.log('🔄 Migrating journey entries...');
  
  // Create journey entries from work experience and education
  const journeyEntries = [
    ...workExperience.map(work => ({
      title: work.title,
      date: work.date,
      description: `${work.subtitle}: ${work.description}`,
      type: 'milestone' as const,
    })),
    ...education.map(edu => ({
      title: edu.title,
      date: edu.date,
      description: `${edu.subtitle}: ${edu.description}`,
      type: 'achievement' as const,
    })),
  ];

  // Sort by date (most recent first)
  journeyEntries.sort((a, b) => {
    // Simple date comparison - adjust if needed for your date format
    return new Date(b.date.split(' - ')[0]).getTime() - new Date(a.date.split(' - ')[0]).getTime();
  });

  for (let i = 0; i < journeyEntries.length; i++) {
    const entry = journeyEntries[i];
    const journeyData = {
      title: entry.title,
      date: entry.date,
      description: entry.description,
      type: entry.type,
      order: i + 1,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };

    await addDoc(collection(db, COLLECTIONS.JOURNEY), journeyData);
    console.log(`✅ Journey entry "${entry.title}" migrated`);
  }
}

async function main() {
  try {
    console.log('🚀 Starting migration to Firestore...');
    
    // Load JSON data
    const jsonData = await loadJsonData();
    console.log('📖 JSON data loaded successfully');

    // Migrate all data
    await migrateBio(jsonData.data);
    await migrateProjects(jsonData.data.projects);
    await migrateSkills(jsonData.data.skills, jsonData.data.softSkills);
    await migrateWorkExperience(jsonData.data.workExperience);
    await migrateEducation(jsonData.data.education);
    await migrateLanguages(jsonData.data.languages);
    await migrateInterests(jsonData.data.interests);
    await migrateJourney(jsonData.data.workExperience, jsonData.data.education);

    console.log('🎉 Migration completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Update your frontend components to read from Firestore');
    console.log('2. Test the admin forms to ensure they work correctly');
    console.log('3. Verify the data in Firebase Console');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Check if environment variables are set
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  console.error('❌ Firebase environment variables not set. Please check your .env file.');
  process.exit(1);
}

main();