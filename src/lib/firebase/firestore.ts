import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  increment,
  serverTimestamp,
  DocumentSnapshot,
  QueryConstraint,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';
import { 
  COLLECTIONS, 
  Post, 
  PostData, 
  PostWithAuthor, 
  Tag, 
  TagData, 
  PostTag, 
  PostView,
  PostStatus,
  // Portfolio types
  Bio,
  BioData,
  Project,
  ProjectData,
  Skill,
  SkillData,
  WorkExperience,
  WorkExperienceData,
  Education,
  EducationData,
  Language,
  LanguageData,
  Interest,
  InterestData,
  Journey,
  JourneyData
} from './types';

// Posts CRUD operations
export class PostsService {
  // Get all posts with pagination
  static async getPosts(options?: {
    status?: PostStatus;
    limit?: number;
    lastDoc?: DocumentSnapshot;
    orderByField?: string;
    orderDirection?: 'asc' | 'desc';
  }) {
    try {
      const constraints: QueryConstraint[] = [];
      
      if (options?.status) {
        constraints.push(where('status', '==', options.status));
      }
      
      constraints.push(
        orderBy(options?.orderByField || 'created_at', options?.orderDirection || 'desc')
      );
      
      if (options?.limit) {
        constraints.push(limit(options.limit));
      }
      
      if (options?.lastDoc) {
        constraints.push(startAfter(options.lastDoc));
      }

      const postsQuery = query(collection(db, COLLECTIONS.POSTS), ...constraints);
      const snapshot = await getDocs(postsQuery);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate() || new Date(),
        updated_at: doc.data().updated_at?.toDate() || new Date(),
        published_at: doc.data().published_at?.toDate() || null,
      })) as Post[];
    } catch (error) {
      console.error('Error getting posts:', error);
      throw error;
    }
  }

  // Get single post by ID
  static async getPost(id: string): Promise<Post | null> {
    try {
      const docRef = doc(db, COLLECTIONS.POSTS, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id,
          ...data,
          created_at: data.created_at?.toDate() || new Date(),
          updated_at: data.updated_at?.toDate() || new Date(),
          published_at: data.published_at?.toDate() || null,
        } as Post;
      }
      return null;
    } catch (error) {
      console.error('Error getting post:', error);
      return null;
    }
  }

  // Get post by slug
  static async getPostBySlug(slug: string): Promise<Post | null> {
    try {
      const postsQuery = query(
        collection(db, COLLECTIONS.POSTS),
        where('slug', '==', slug),
        where('status', '==', 'published')
      );
      const snapshot = await getDocs(postsQuery);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          created_at: data.created_at?.toDate() || new Date(),
          updated_at: data.updated_at?.toDate() || new Date(),
          published_at: data.published_at?.toDate() || null,
        } as Post;
      }
      return null;
    } catch (error) {
      console.error('Error getting post by slug:', error);
      return null;
    }
  }

  // Create new post
  static async createPost(postData: Omit<PostData, 'created_at' | 'updated_at'>) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.POSTS), {
        ...postData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  // Update post
  static async updatePost(id: string, updates: Partial<PostData>) {
    try {
      const docRef = doc(db, COLLECTIONS.POSTS, id);
      await updateDoc(docRef, {
        ...updates,
        updated_at: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  // Delete post
  static async deletePost(id: string) {
    try {
      const batch = writeBatch(db);
      
      // Delete the post
      const postRef = doc(db, COLLECTIONS.POSTS, id);
      batch.delete(postRef);
      
      // Delete associated post_tags
      const postTagsQuery = query(
        collection(db, COLLECTIONS.POST_TAGS),
        where('post_id', '==', id)
      );
      const postTagsSnapshot = await getDocs(postTagsQuery);
      postTagsSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      // Delete post views
      const postViewRef = doc(db, COLLECTIONS.POST_VIEWS, id);
      batch.delete(postViewRef);
      
      await batch.commit();
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  // Increment post views
  static async incrementViews(postId: string) {
    try {
      const viewRef = doc(db, COLLECTIONS.POST_VIEWS, postId);
      await updateDoc(viewRef, {
        views: increment(1),
        updated_at: serverTimestamp()
      });
    } catch (error) {
      // If document doesn't exist, create it
      try {
        await updateDoc(viewRef, {
          views: 1,
          updated_at: serverTimestamp()
        });
      } catch (createError) {
        console.error('Error creating post view:', createError);
      }
    }
  }
}

// Tags CRUD operations
export class TagsService {
  // Get all tags
  static async getTags(): Promise<Tag[]> {
    try {
      const tagsQuery = query(collection(db, COLLECTIONS.TAGS), orderBy('name'));
      const snapshot = await getDocs(tagsQuery);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate() || new Date(),
      })) as Tag[];
    } catch (error) {
      console.error('Error getting tags:', error);
      throw error;
    }
  }

  // Create tag
  static async createTag(tagData: Omit<TagData, 'created_at'>) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.TAGS), {
        ...tagData,
        created_at: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }

  // Get posts by tag
  static async getPostsByTag(tagSlug: string): Promise<Post[]> {
    try {
      // First find the tag
      const tagsQuery = query(
        collection(db, COLLECTIONS.TAGS),
        where('slug', '==', tagSlug)
      );
      const tagSnapshot = await getDocs(tagsQuery);
      
      if (tagSnapshot.empty) {
        return [];
      }
      
      const tagId = tagSnapshot.docs[0].id;
      
      // Get post IDs for this tag
      const postTagsQuery = query(
        collection(db, COLLECTIONS.POST_TAGS),
        where('tag_id', '==', tagId)
      );
      const postTagsSnapshot = await getDocs(postTagsQuery);
      
      const postIds = postTagsSnapshot.docs.map(doc => doc.data().post_id);
      
      if (postIds.length === 0) {
        return [];
      }
      
      // Get posts (Firestore 'in' queries are limited to 10 items)
      const posts: Post[] = [];
      for (let i = 0; i < postIds.length; i += 10) {
        const batch = postIds.slice(i, i + 10);
        const postsQuery = query(
          collection(db, COLLECTIONS.POSTS),
          where('__name__', 'in', batch),
          where('status', '==', 'published'),
          orderBy('published_at', 'desc')
        );
        const postsSnapshot = await getDocs(postsQuery);
        
        const batchPosts = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          created_at: doc.data().created_at?.toDate() || new Date(),
          updated_at: doc.data().updated_at?.toDate() || new Date(),
          published_at: doc.data().published_at?.toDate() || null,
        })) as Post[];
        
        posts.push(...batchPosts);
      }
      
      return posts;
    } catch (error) {
      console.error('Error getting posts by tag:', error);
      throw error;
    }
  }
}

// Post Tags relationship operations
export class PostTagsService {
  // Add tags to post
  static async addTagsToPost(postId: string, tagIds: string[]) {
    try {
      const batch = writeBatch(db);
      
      tagIds.forEach(tagId => {
        const postTagRef = doc(collection(db, COLLECTIONS.POST_TAGS));
        batch.set(postTagRef, {
          post_id: postId,
          tag_id: tagId
        });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error adding tags to post:', error);
      throw error;
    }
  }

  // Remove all tags from post
  static async removeAllTagsFromPost(postId: string) {
    try {
      const postTagsQuery = query(
        collection(db, COLLECTIONS.POST_TAGS),
        where('post_id', '==', postId)
      );
      const snapshot = await getDocs(postTagsQuery);
      
      const batch = writeBatch(db);
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error removing tags from post:', error);
      throw error;
    }
  }

  // Get tags for post
  static async getTagsForPost(postId: string): Promise<Tag[]> {
    try {
      const postTagsQuery = query(
        collection(db, COLLECTIONS.POST_TAGS),
        where('post_id', '==', postId)
      );
      const postTagsSnapshot = await getDocs(postTagsQuery);
      
      const tagIds = postTagsSnapshot.docs.map(doc => doc.data().tag_id);
      
      if (tagIds.length === 0) {
        return [];
      }
      
      const tags: Tag[] = [];
      for (let i = 0; i < tagIds.length; i += 10) {
        const batch = tagIds.slice(i, i + 10);
        const tagsQuery = query(
          collection(db, COLLECTIONS.TAGS),
          where('__name__', 'in', batch)
        );
        const tagsSnapshot = await getDocs(tagsQuery);
        
        const batchTags = tagsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          created_at: doc.data().created_at?.toDate() || new Date(),
        })) as Tag[];
        
        tags.push(...batchTags);
      }
      
      return tags;
    } catch (error) {
      console.error('Error getting tags for post:', error);
      throw error;
    }
  }
}

// Portfolio Services

// Bio Service (Singleton)
export class BioService {
  private static readonly BIO_DOC_ID = 'singleton';

  static async getBio(): Promise<Bio | null> {
    try {
      const docRef = doc(db, COLLECTIONS.BIO, this.BIO_DOC_ID);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: this.BIO_DOC_ID,
          ...data,
          created_at: data.created_at?.toDate() || new Date(),
          updated_at: data.updated_at?.toDate() || new Date(),
        } as Bio;
      }
      return null;
    } catch (error) {
      console.error('Error getting bio:', error);
      return null;
    }
  }

  static async updateBio(bioData: Partial<BioData>) {
    try {
      const docRef = doc(db, COLLECTIONS.BIO, this.BIO_DOC_ID);
      await updateDoc(docRef, {
        ...bioData,
        updated_at: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating bio:', error);
      throw error;
    }
  }

  static async createBio(bioData: BioData) {
    try {
      const docRef = doc(db, COLLECTIONS.BIO, this.BIO_DOC_ID);
      await updateDoc(docRef, {
        ...bioData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error creating bio:', error);
      throw error;
    }
  }
}

// Projects Service
export class ProjectsService {
  static async getProjects(status?: 'draft' | 'published'): Promise<Project[]> {
    try {
      // Simplified query - get all projects and filter/sort in memory
      const projectsQuery = query(collection(db, COLLECTIONS.PROJECTS));
      const snapshot = await getDocs(projectsQuery);
      
      let projects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate() || new Date(),
        updated_at: doc.data().updated_at?.toDate() || new Date(),
      })) as Project[];

      // Filter by status if provided
      if (status) {
        projects = projects.filter(project => project.status === status);
      }

      // Sort by order
      projects.sort((a, b) => (a.order || 0) - (b.order || 0));

      return projects;
    } catch (error) {
      console.error('Error getting projects:', error);
      throw error;
    }
  }

  static async getProject(id: string): Promise<Project | null> {
    try {
      const docRef = doc(db, COLLECTIONS.PROJECTS, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id,
          ...data,
          created_at: data.created_at?.toDate() || new Date(),
          updated_at: data.updated_at?.toDate() || new Date(),
        } as Project;
      }
      return null;
    } catch (error) {
      console.error('Error getting project:', error);
      return null;
    }
  }

  static async createProject(projectData: Omit<ProjectData, 'order'>) {
    try {
      // Get next order number
      const projectsQuery = query(collection(db, COLLECTIONS.PROJECTS), orderBy('order', 'desc'), limit(1));
      const snapshot = await getDocs(projectsQuery);
      const nextOrder = snapshot.empty ? 1 : (snapshot.docs[0].data().order + 1);

      const docRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), {
        ...projectData,
        order: nextOrder,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  static async updateProject(id: string, updates: Partial<ProjectData>) {
    try {
      const docRef = doc(db, COLLECTIONS.PROJECTS, id);
      await updateDoc(docRef, {
        ...updates,
        updated_at: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  static async deleteProject(id: string) {
    try {
      const docRef = doc(db, COLLECTIONS.PROJECTS, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
}

// Skills Service
export class SkillsService {
  static async getSkills(category?: 'technical' | 'soft'): Promise<Skill[]> {
    try {
      // Simplified query - get all skills and filter/sort in memory
      const skillsQuery = query(collection(db, COLLECTIONS.SKILLS));
      const snapshot = await getDocs(skillsQuery);
      
      let skills = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate() || new Date(),
        updated_at: doc.data().updated_at?.toDate() || new Date(),
      })) as Skill[];

      // Filter by category if provided
      if (category) {
        skills = skills.filter(skill => skill.category === category);
      }

      // Sort by order
      skills.sort((a, b) => (a.order || 0) - (b.order || 0));

      return skills;
    } catch (error) {
      console.error('Error getting skills:', error);
      throw error;
    }
  }

  static async getSkill(id: string): Promise<Skill | null> {
    try {
      const docRef = doc(db, COLLECTIONS.SKILLS, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id,
          ...data,
          created_at: data.created_at?.toDate() || new Date(),
          updated_at: data.updated_at?.toDate() || new Date(),
        } as Skill;
      }
      return null;
    } catch (error) {
      console.error('Error getting skill:', error);
      return null;
    }
  }

  static async createSkill(skillData: Omit<SkillData, 'order'>) {
    try {
      const skillsQuery = query(collection(db, COLLECTIONS.SKILLS), orderBy('order', 'desc'), limit(1));
      const snapshot = await getDocs(skillsQuery);
      const nextOrder = snapshot.empty ? 1 : (snapshot.docs[0].data().order + 1);

      const docRef = await addDoc(collection(db, COLLECTIONS.SKILLS), {
        ...skillData,
        order: nextOrder,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating skill:', error);
      throw error;
    }
  }

  static async updateSkill(id: string, updates: Partial<SkillData>) {
    try {
      const docRef = doc(db, COLLECTIONS.SKILLS, id);
      await updateDoc(docRef, {
        ...updates,
        updated_at: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating skill:', error);
      throw error;
    }
  }

  static async deleteSkill(id: string) {
    try {
      const docRef = doc(db, COLLECTIONS.SKILLS, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting skill:', error);
      throw error;
    }
  }
}

// Work Experience Service
export class WorkExperienceService {
  static async getWorkExperiences(): Promise<WorkExperience[]> {
    try {
      const workExpQuery = query(collection(db, COLLECTIONS.WORK_EXPERIENCE));
      const snapshot = await getDocs(workExpQuery);
      
      let workExperiences = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate() || new Date(),
        updated_at: doc.data().updated_at?.toDate() || new Date(),
      })) as WorkExperience[];
      
      // Sort by order in memory
      workExperiences.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      return workExperiences;
    } catch (error) {
      console.error('Error getting work experiences:', error);
      throw error;
    }
  }

  static async getWorkExperience(id: string): Promise<WorkExperience | null> {
    try {
      const docRef = doc(db, COLLECTIONS.WORK_EXPERIENCE, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id,
          ...data,
          created_at: data.created_at?.toDate() || new Date(),
          updated_at: data.updated_at?.toDate() || new Date(),
        } as WorkExperience;
      }
      return null;
    } catch (error) {
      console.error('Error getting work experience:', error);
      return null;
    }
  }

  static async createWorkExperience(workExpData: Omit<WorkExperienceData, 'order'>) {
    try {
      const workExpQuery = query(collection(db, COLLECTIONS.WORK_EXPERIENCE), orderBy('order', 'desc'), limit(1));
      const snapshot = await getDocs(workExpQuery);
      const nextOrder = snapshot.empty ? 1 : (snapshot.docs[0].data().order + 1);

      const docRef = await addDoc(collection(db, COLLECTIONS.WORK_EXPERIENCE), {
        ...workExpData,
        order: nextOrder,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating work experience:', error);
      throw error;
    }
  }

  static async updateWorkExperience(id: string, updates: Partial<WorkExperienceData>) {
    try {
      const docRef = doc(db, COLLECTIONS.WORK_EXPERIENCE, id);
      await updateDoc(docRef, {
        ...updates,
        updated_at: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating work experience:', error);
      throw error;
    }
  }

  static async deleteWorkExperience(id: string) {
    try {
      const docRef = doc(db, COLLECTIONS.WORK_EXPERIENCE, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting work experience:', error);
      throw error;
    }
  }
}

// Education Service
export class EducationService {
  static async getEducations(): Promise<Education[]> {
    try {
      const educationQuery = query(collection(db, COLLECTIONS.EDUCATION));
      const snapshot = await getDocs(educationQuery);
      
      let educations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate() || new Date(),
        updated_at: doc.data().updated_at?.toDate() || new Date(),
      })) as Education[];
      
      // Sort by order in memory
      educations.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      return educations;
    } catch (error) {
      console.error('Error getting educations:', error);
      throw error;
    }
  }

  static async getEducation(id: string): Promise<Education | null> {
    try {
      const docRef = doc(db, COLLECTIONS.EDUCATION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id,
          ...data,
          created_at: data.created_at?.toDate() || new Date(),
          updated_at: data.updated_at?.toDate() || new Date(),
        } as Education;
      }
      return null;
    } catch (error) {
      console.error('Error getting education:', error);
      return null;
    }
  }

  static async createEducation(educationData: Omit<EducationData, 'order'>) {
    try {
      const educationQuery = query(collection(db, COLLECTIONS.EDUCATION), orderBy('order', 'desc'), limit(1));
      const snapshot = await getDocs(educationQuery);
      const nextOrder = snapshot.empty ? 1 : (snapshot.docs[0].data().order + 1);

      const docRef = await addDoc(collection(db, COLLECTIONS.EDUCATION), {
        ...educationData,
        order: nextOrder,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating education:', error);
      throw error;
    }
  }

  static async updateEducation(id: string, updates: Partial<EducationData>) {
    try {
      const docRef = doc(db, COLLECTIONS.EDUCATION, id);
      await updateDoc(docRef, {
        ...updates,
        updated_at: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating education:', error);
      throw error;
    }
  }

  static async deleteEducation(id: string) {
    try {
      const docRef = doc(db, COLLECTIONS.EDUCATION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting education:', error);
      throw error;
    }
  }
}

// Languages Service
export class LanguagesService {
  static async getLanguages(): Promise<Language[]> {
    try {
      const languagesQuery = query(collection(db, COLLECTIONS.LANGUAGES));
      const snapshot = await getDocs(languagesQuery);
      
      let languages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate() || new Date(),
        updated_at: doc.data().updated_at?.toDate() || new Date(),
      })) as Language[];
      
      // Sort by order in memory
      languages.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      return languages;
    } catch (error) {
      console.error('Error getting languages:', error);
      throw error;
    }
  }

  static async getLanguage(id: string): Promise<Language | null> {
    try {
      const docRef = doc(db, COLLECTIONS.LANGUAGES, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id,
          ...data,
          created_at: data.created_at?.toDate() || new Date(),
          updated_at: data.updated_at?.toDate() || new Date(),
        } as Language;
      }
      return null;
    } catch (error) {
      console.error('Error getting language:', error);
      return null;
    }
  }

  static async createLanguage(languageData: Omit<LanguageData, 'order'>) {
    try {
      const languagesQuery = query(collection(db, COLLECTIONS.LANGUAGES), orderBy('order', 'desc'), limit(1));
      const snapshot = await getDocs(languagesQuery);
      const nextOrder = snapshot.empty ? 1 : (snapshot.docs[0].data().order + 1);

      const docRef = await addDoc(collection(db, COLLECTIONS.LANGUAGES), {
        ...languageData,
        order: nextOrder,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating language:', error);
      throw error;
    }
  }

  static async updateLanguage(id: string, updates: Partial<LanguageData>) {
    try {
      const docRef = doc(db, COLLECTIONS.LANGUAGES, id);
      await updateDoc(docRef, {
        ...updates,
        updated_at: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating language:', error);
      throw error;
    }
  }

  static async deleteLanguage(id: string) {
    try {
      const docRef = doc(db, COLLECTIONS.LANGUAGES, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting language:', error);
      throw error;
    }
  }
}

// Interests Service
export class InterestsService {
  static async getInterests(): Promise<Interest[]> {
    try {
      const interestsQuery = query(collection(db, COLLECTIONS.INTERESTS));
      const snapshot = await getDocs(interestsQuery);
      
      let interests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate() || new Date(),
        updated_at: doc.data().updated_at?.toDate() || new Date(),
      })) as Interest[];
      
      // Sort by order in memory
      interests.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      return interests;
    } catch (error) {
      console.error('Error getting interests:', error);
      throw error;
    }
  }

  static async getInterest(id: string): Promise<Interest | null> {
    try {
      const docRef = doc(db, COLLECTIONS.INTERESTS, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id,
          ...data,
          created_at: data.created_at?.toDate() || new Date(),
          updated_at: data.updated_at?.toDate() || new Date(),
        } as Interest;
      }
      return null;
    } catch (error) {
      console.error('Error getting interest:', error);
      return null;
    }
  }

  static async createInterest(interestData: Omit<InterestData, 'order'>) {
    try {
      const interestsQuery = query(collection(db, COLLECTIONS.INTERESTS), orderBy('order', 'desc'), limit(1));
      const snapshot = await getDocs(interestsQuery);
      const nextOrder = snapshot.empty ? 1 : (snapshot.docs[0].data().order + 1);

      const docRef = await addDoc(collection(db, COLLECTIONS.INTERESTS), {
        ...interestData,
        order: nextOrder,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating interest:', error);
      throw error;
    }
  }

  static async updateInterest(id: string, updates: Partial<InterestData>) {
    try {
      const docRef = doc(db, COLLECTIONS.INTERESTS, id);
      await updateDoc(docRef, {
        ...updates,
        updated_at: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating interest:', error);
      throw error;
    }
  }

  static async deleteInterest(id: string) {
    try {
      const docRef = doc(db, COLLECTIONS.INTERESTS, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting interest:', error);
      throw error;
    }
  }
}

// Journey Service
export class JourneyService {
  static async getJourneyEntries(): Promise<Journey[]> {
    try {
      const journeyQuery = query(collection(db, COLLECTIONS.JOURNEY));
      const snapshot = await getDocs(journeyQuery);
      
      let journeyEntries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate() || new Date(),
        updated_at: doc.data().updated_at?.toDate() || new Date(),
      })) as Journey[];
      
      // Sort by order in memory
      journeyEntries.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      return journeyEntries;
    } catch (error) {
      console.error('Error getting journey entries:', error);
      throw error;
    }
  }

  static async getJourneyEntry(id: string): Promise<Journey | null> {
    try {
      const docRef = doc(db, COLLECTIONS.JOURNEY, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id,
          ...data,
          created_at: data.created_at?.toDate() || new Date(),
          updated_at: data.updated_at?.toDate() || new Date(),
        } as Journey;
      }
      return null;
    } catch (error) {
      console.error('Error getting journey entry:', error);
      return null;
    }
  }

  static async createJourneyEntry(journeyData: Omit<JourneyData, 'order'>) {
    try {
      const journeyQuery = query(collection(db, COLLECTIONS.JOURNEY), orderBy('order', 'desc'), limit(1));
      const snapshot = await getDocs(journeyQuery);
      const nextOrder = snapshot.empty ? 1 : (snapshot.docs[0].data().order + 1);

      const docRef = await addDoc(collection(db, COLLECTIONS.JOURNEY), {
        ...journeyData,
        order: nextOrder,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating journey entry:', error);
      throw error;
    }
  }

  static async updateJourneyEntry(id: string, updates: Partial<JourneyData>) {
    try {
      const docRef = doc(db, COLLECTIONS.JOURNEY, id);
      await updateDoc(docRef, {
        ...updates,
        updated_at: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating journey entry:', error);
      throw error;
    }
  }

  static async deleteJourneyEntry(id: string) {
    try {
      const docRef = doc(db, COLLECTIONS.JOURNEY, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting journey entry:', error);
      throw error;
    }
  }
}