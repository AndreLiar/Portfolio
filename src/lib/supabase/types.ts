// Database types for TypeScript
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: 'user' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
  blog: {
    Tables: {
      posts: {
        Row: {
          id: string;
          author_id: string | null;
          title: string;
          slug: string;
          excerpt: string | null;
          content_md: string;
          content_html: string | null;
          cover_url: string | null;
          status: 'draft' | 'published' | 'archived';
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content_md: string;
          content_html?: string | null;
          cover_url?: string | null;
          status?: 'draft' | 'published' | 'archived';
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string | null;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content_md?: string;
          content_html?: string | null;
          cover_url?: string | null;
          status?: 'draft' | 'published' | 'archived';
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          id: number;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string;
          created_at?: string;
        };
      };
      post_tags: {
        Row: {
          post_id: string;
          tag_id: number;
        };
        Insert: {
          post_id: string;
          tag_id: number;
        };
        Update: {
          post_id?: string;
          tag_id?: number;
        };
      };
      post_views: {
        Row: {
          post_id: string;
          views: number;
          updated_at: string;
        };
        Insert: {
          post_id: string;
          views?: number;
          updated_at?: string;
        };
        Update: {
          post_id?: string;
          views?: number;
          updated_at?: string;
        };
      };
    };
    Views: {
      posts_with_author: {
        Row: {
          id: string;
          author_id: string | null;
          title: string;
          slug: string;
          excerpt: string | null;
          content_md: string;
          content_html: string | null;
          cover_url: string | null;
          status: 'draft' | 'published' | 'archived';
          published_at: string | null;
          created_at: string;
          updated_at: string;
          author_name: string | null;
        };
      };
    };
    Functions: {
      increment_post_view: {
        Args: {
          p_post_id: string;
        };
        Returns: undefined;
      };
    };
  };
};

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Post = Database['blog']['Tables']['posts']['Row'];
export type PostWithAuthor = Database['blog']['Views']['posts_with_author']['Row'];
export type Tag = Database['blog']['Tables']['tags']['Row'];
export type PostTag = Database['blog']['Tables']['post_tags']['Row'];
export type PostView = Database['blog']['Tables']['post_views']['Row'];

export type PostStatus = 'draft' | 'published' | 'archived';
export type UserRole = 'user' | 'admin';