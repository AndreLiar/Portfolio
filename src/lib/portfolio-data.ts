/**
 * Portfolio Data Service - Frontend service to fetch portfolio data from Firestore
 * This service provides easy access to all portfolio data for the frontend components
 */

import {
  BioService,
  ProjectsService,
  SkillsService,
  WorkExperienceService,
  EducationService,
  LanguagesService,
  InterestsService,
  JourneyService,
} from '@/lib/firebase/firestore';
import type {
  Bio,
  Project,
  Skill,
  WorkExperience,
  Education,
  Language,
  Interest,
  Journey,
} from '@/lib/firebase/types';

// Portfolio data aggregated type
export interface PortfolioData {
  bio: Bio | null;
  projects: Project[];
  skills: {
    technical: Skill[];
    soft: Skill[];
  };
  workExperience: WorkExperience[];
  education: Education[];
  languages: Language[];
  interests: Interest[];
  journey: Journey[];
}

/**
 * Portfolio Data Service - Main service for frontend
 */
export class PortfolioDataService {
  /**
   * Get complete portfolio data
   */
  static async getPortfolioData(): Promise<PortfolioData> {
    try {
      // Fetch all data in parallel for better performance
      const [
        bio,
        projects,
        technicalSkills,
        softSkills,
        workExperience,
        education,
        languages,
        interests,
        journey,
      ] = await Promise.all([
        BioService.getBio(),
        ProjectsService.getProjects('published'),
        SkillsService.getSkills('technical'),
        SkillsService.getSkills('soft'),
        WorkExperienceService.getWorkExperiences(),
        EducationService.getEducations(),
        LanguagesService.getLanguages(),
        InterestsService.getInterests(),
        JourneyService.getJourneyEntries(),
      ]);

      return {
        bio,
        projects,
        skills: {
          technical: technicalSkills,
          soft: softSkills,
        },
        workExperience,
        education,
        languages,
        interests,
        journey,
      };
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      // Return empty structure on error
      return {
        bio: null,
        projects: [],
        skills: {
          technical: [],
          soft: [],
        },
        workExperience: [],
        education: [],
        languages: [],
        interests: [],
        journey: [],
      };
    }
  }

  /**
   * Get bio data only
   */
  static async getBio(): Promise<Bio | null> {
    try {
      return await BioService.getBio();
    } catch (error) {
      console.error('Error fetching bio:', error);
      return null;
    }
  }

  /**
   * Get published projects only
   */
  static async getPublishedProjects(): Promise<Project[]> {
    try {
      return await ProjectsService.getProjects('published');
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  /**
   * Get all projects (admin view)
   */
  static async getAllProjects(): Promise<Project[]> {
    try {
      return await ProjectsService.getProjects();
    } catch (error) {
      console.error('Error fetching all projects:', error);
      return [];
    }
  }

  /**
   * Get technical skills only
   */
  static async getTechnicalSkills(): Promise<Skill[]> {
    try {
      return await SkillsService.getSkills('technical');
    } catch (error) {
      console.error('Error fetching technical skills:', error);
      return [];
    }
  }

  /**
   * Get soft skills only
   */
  static async getSoftSkills(): Promise<Skill[]> {
    try {
      return await SkillsService.getSkills('soft');
    } catch (error) {
      console.error('Error fetching soft skills:', error);
      return [];
    }
  }

  /**
   * Get work experience
   */
  static async getWorkExperience(): Promise<WorkExperience[]> {
    try {
      return await WorkExperienceService.getWorkExperiences();
    } catch (error) {
      console.error('Error fetching work experience:', error);
      return [];
    }
  }

  /**
   * Get education
   */
  static async getEducation(): Promise<Education[]> {
    try {
      return await EducationService.getEducations();
    } catch (error) {
      console.error('Error fetching education:', error);
      return [];
    }
  }

  /**
   * Get languages
   */
  static async getLanguages(): Promise<Language[]> {
    try {
      return await LanguagesService.getLanguages();
    } catch (error) {
      console.error('Error fetching languages:', error);
      return [];
    }
  }

  /**
   * Get interests
   */
  static async getInterests(): Promise<Interest[]> {
    try {
      return await InterestsService.getInterests();
    } catch (error) {
      console.error('Error fetching interests:', error);
      return [];
    }
  }

  /**
   * Get journey entries
   */
  static async getJourney(): Promise<Journey[]> {
    try {
      return await JourneyService.getJourneyEntries();
    } catch (error) {
      console.error('Error fetching journey:', error);
      return [];
    }
  }
}

/**
 * Helper function to format data for compatibility with existing components
 * This helps bridge the gap between the new Firestore structure and existing components
 */
export function formatPortfolioDataForComponents(data: PortfolioData) {
  return {
    // Bio/About section
    bio: data.bio ? {
      name: data.bio.name,
      fullName: data.bio.fullName,
      title: data.bio.title,
      location: data.bio.location,
      summary: data.bio.summary,
      contact: data.bio.contact,
    } : null,

    // Projects
    projects: data.projects.map(project => ({
      title: project.title,
      purpose: project.purpose,
      stack: project.stack,
      impact: project.impact,
      role: project.role,
      features: project.features,
      link: project.link,
      repoUrl: project.repoUrl,
    })),

    // Skills - combine technical and soft skills in the format expected by components
    skills: [
      ...data.skills.technical.map(skill => ({
        title: skill.title,
        Icon: skill.icon,
        skills: skill.skills,
      })),
    ],

    // Soft skills as array of strings
    softSkills: data.skills.soft.flatMap(skill => skill.skills),

    // Work Experience
    workExperience: data.workExperience.map(work => ({
      date: work.date,
      title: work.title,
      subtitle: work.subtitle,
      description: work.description,
    })),

    // Education
    education: data.education.map(edu => ({
      date: edu.date,
      title: edu.title,
      subtitle: edu.subtitle,
      description: edu.description,
    })),

    // Languages
    languages: data.languages.map(lang => ({
      name: lang.name,
      level: lang.level,
    })),

    // Interests as array of strings
    interests: data.interests.map(interest => interest.name),
  };
}