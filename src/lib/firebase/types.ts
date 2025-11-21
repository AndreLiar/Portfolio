// Firebase/Firestore types to replace Supabase types

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'user' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export interface Post {
  id: string;
  author_id: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content_md: string;
  content_html: string | null;
  cover_url: string | null;
  status: 'draft' | 'published' | 'archived';
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface PostWithAuthor extends Post {
  author_name: string | null;
  author_email: string | null;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: Date;
}

export interface PostTag {
  post_id: string;
  tag_id: string;
}

export interface PostView {
  post_id: string;
  views: number;
  updated_at: Date;
}

// Firestore document data (without id, as it's stored separately)
export interface ProfileData extends Omit<Profile, 'id'> {}
export interface PostData extends Omit<Post, 'id'> {}
export interface TagData extends Omit<Tag, 'id'> {}
export interface PostViewData extends Omit<PostView, 'post_id'> {}

export type PostStatus = 'draft' | 'published' | 'archived';
export type UserRole = 'user' | 'admin';

// Firebase Auth User with custom claims
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role?: UserRole;
}

// Portfolio Data Types
export interface Bio {
  id: string;
  name: string;
  fullName: string;
  title: string;
  location: string;
  summary: string;
  contact: {
    email: string;
    phone: string;
    github: string;
    linkedin: string;
  };
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  id: string;
  title: string;
  purpose: string;
  stack: string[];
  impact: string;
  role: string;
  features: string[];
  link?: string;
  repoUrl?: string;
  imageUrl?: string;
  order: number;
  status: 'draft' | 'published';
  created_at: Date;
  updated_at: Date;
}

export interface Skill {
  id: string;
  title: string;
  icon: string;
  skills: string[];
  category: 'technical' | 'soft';
  order: number;
  created_at: Date;
  updated_at: Date;
}

export interface WorkExperience {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  description: string;
  order: number;
  created_at: Date;
  updated_at: Date;
}

export interface Education {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  description: string;
  order: number;
  created_at: Date;
  updated_at: Date;
}

export interface Language {
  id: string;
  name: string;
  level: string;
  order: number;
  created_at: Date;
  updated_at: Date;
}

export interface Interest {
  id: string;
  name: string;
  order: number;
  created_at: Date;
  updated_at: Date;
}

export interface Journey {
  id: string;
  title: string;
  date: string;
  description: string;
  type: 'milestone' | 'achievement' | 'personal';
  order: number;
  created_at: Date;
  updated_at: Date;
}

// Firestore document data (without id and timestamps for creation)
export interface BioData extends Omit<Bio, 'id' | 'created_at' | 'updated_at'> {}
export interface ProjectData extends Omit<Project, 'id' | 'created_at' | 'updated_at'> {}
export interface SkillData extends Omit<Skill, 'id' | 'created_at' | 'updated_at'> {}
export interface WorkExperienceData extends Omit<WorkExperience, 'id' | 'created_at' | 'updated_at'> {}
export interface EducationData extends Omit<Education, 'id' | 'created_at' | 'updated_at'> {}
export interface LanguageData extends Omit<Language, 'id' | 'created_at' | 'updated_at'> {}
export interface InterestData extends Omit<Interest, 'id' | 'created_at' | 'updated_at'> {}
export interface JourneyData extends Omit<Journey, 'id' | 'created_at' | 'updated_at'> {}

// Collection names for Firestore
export const COLLECTIONS = {
  PROFILES: 'profiles',
  POSTS: 'posts',
  TAGS: 'tags',
  POST_TAGS: 'post_tags',
  POST_VIEWS: 'post_views',
  // Portfolio collections
  BIO: 'bio',
  PROJECTS: 'projects',
  SKILLS: 'skills',
  WORK_EXPERIENCE: 'work_experience',
  EDUCATION: 'education',
  LANGUAGES: 'languages',
  INTERESTS: 'interests',
  JOURNEY: 'journey',
} as const;