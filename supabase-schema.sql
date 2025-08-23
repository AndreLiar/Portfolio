-- Blog Database Schema for Supabase
-- Run this script in your Supabase SQL editor

-- Create blog schema
CREATE SCHEMA IF NOT EXISTS blog;

-- Create enum for post status
CREATE TYPE blog.post_status AS ENUM ('draft', 'published', 'archived');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts table
CREATE TABLE IF NOT EXISTS blog.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content_md TEXT NOT NULL, -- Markdown content
  content_html TEXT,        -- Cached sanitized HTML
  cover_url TEXT,
  status blog.post_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags table
CREATE TABLE IF NOT EXISTS blog.tags (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post-Tag junction table
CREATE TABLE IF NOT EXISTS blog.post_tags (
  post_id UUID REFERENCES blog.posts(id) ON DELETE CASCADE,
  tag_id BIGINT REFERENCES blog.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Post views tracking
CREATE TABLE IF NOT EXISTS blog.post_views (
  post_id UUID PRIMARY KEY REFERENCES blog.posts(id) ON DELETE CASCADE,
  views BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog.post_views ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Posts policies
CREATE POLICY "Public can read published posts" ON blog.posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can manage own posts" ON blog.posts
  FOR ALL USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Admins can manage all posts" ON blog.posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Tags policies
CREATE POLICY "Public can read tags" ON blog.tags
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage tags" ON blog.tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Post-tags policies
CREATE POLICY "Authors and admins can manage post tags" ON blog.post_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM blog.posts 
      WHERE id = post_id AND author_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM blog.posts 
      WHERE id = post_id AND author_id = auth.uid()
    )
  );

-- Post views policies
CREATE POLICY "Public can read post views" ON blog.post_views
  FOR SELECT USING (true);

-- RPC function for incrementing post views
CREATE OR REPLACE FUNCTION blog.increment_post_view(p_post_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO blog.post_views (post_id, views, updated_at)
  VALUES (p_post_id, 1, NOW())
  ON CONFLICT (post_id) 
  DO UPDATE SET 
    views = blog.post_views.views + 1,
    updated_at = NOW();
END;
$$;

-- Grant execute permission on the function
REVOKE ALL ON FUNCTION blog.increment_post_view(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION blog.increment_post_view(UUID) TO anon;
GRANT EXECUTE ON FUNCTION blog.increment_post_view(UUID) TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_status ON blog.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON blog.posts(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_posts_slug ON blog.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_author ON blog.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON blog.tags(slug);
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON blog.post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON blog.post_tags(tag_id);

-- Create a view for easier querying of posts with author info
CREATE OR REPLACE VIEW blog.posts_with_author AS
SELECT 
  p.*,
  prof.full_name as author_name
FROM blog.posts p
LEFT JOIN public.profiles prof ON p.author_id = prof.id;

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'user');
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER handle_posts_updated_at
  BEFORE UPDATE ON blog.posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();