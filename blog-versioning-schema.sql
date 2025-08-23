-- Add versioning support to the blog system
-- Run this after the main schema

-- Create post versions table for version history and rollback
CREATE TABLE IF NOT EXISTS blog.post_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES blog.posts(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT,
  content_md TEXT NOT NULL,
  content_html TEXT,
  cover_url TEXT,
  status blog.post_status NOT NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id),
  change_summary TEXT, -- What changed in this version
  UNIQUE(post_id, version_number)
);

-- Enable RLS
ALTER TABLE blog.post_versions ENABLE ROW LEVEL SECURITY;

-- Version policies - same as posts
CREATE POLICY "Public can read published post versions" ON blog.post_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM blog.posts p 
      WHERE p.id = post_id AND p.status = 'published'
    )
  );

CREATE POLICY "Authors can manage own post versions" ON blog.post_versions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM blog.posts p 
      WHERE p.id = post_id AND p.author_id = auth.uid()
    )
  );

-- Function to create a version when post is updated
CREATE OR REPLACE FUNCTION blog.create_post_version()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  next_version INTEGER;
BEGIN
  -- Get the next version number
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO next_version
  FROM blog.post_versions
  WHERE post_id = NEW.id;

  -- Create version record
  INSERT INTO blog.post_versions (
    post_id,
    version_number,
    title,
    slug,
    excerpt,
    content_md,
    content_html,
    cover_url,
    status,
    published_at,
    created_by,
    change_summary
  ) VALUES (
    NEW.id,
    next_version,
    NEW.title,
    NEW.slug,
    NEW.excerpt,
    NEW.content_md,
    NEW.content_html,
    NEW.cover_url,
    NEW.status,
    NEW.published_at,
    NEW.author_id,
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'Initial version'
      ELSE 'Updated post'
    END
  );

  RETURN NEW;
END;
$$;

-- Create trigger to auto-version posts
DROP TRIGGER IF EXISTS post_versioning_trigger ON blog.posts;
CREATE TRIGGER post_versioning_trigger
  AFTER INSERT OR UPDATE ON blog.posts
  FOR EACH ROW
  EXECUTE FUNCTION blog.create_post_version();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_post_versions_post_id ON blog.post_versions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_versions_created_at ON blog.post_versions(created_at DESC);

-- Function to rollback to a specific version
CREATE OR REPLACE FUNCTION blog.rollback_to_version(
  p_post_id UUID,
  p_version_number INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  version_record RECORD;
BEGIN
  -- Get the version data
  SELECT * INTO version_record
  FROM blog.post_versions
  WHERE post_id = p_post_id AND version_number = p_version_number;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Update the post with version data
  UPDATE blog.posts
  SET
    title = version_record.title,
    slug = version_record.slug,
    excerpt = version_record.excerpt,
    content_md = version_record.content_md,
    content_html = version_record.content_html,
    cover_url = version_record.cover_url,
    status = version_record.status,
    published_at = version_record.published_at,
    updated_at = NOW()
  WHERE id = p_post_id;

  RETURN TRUE;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION blog.rollback_to_version(UUID, INTEGER) TO authenticated;

-- Add post templates table for quick post creation
CREATE TABLE IF NOT EXISTS blog.post_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  title_template TEXT NOT NULL,
  content_template TEXT NOT NULL,
  default_tags TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE
);

-- Enable RLS for templates
ALTER TABLE blog.post_templates ENABLE ROW LEVEL SECURITY;

-- Template policies
CREATE POLICY "Users can read public templates" ON blog.post_templates
  FOR SELECT USING (is_public = TRUE OR created_by = auth.uid());

CREATE POLICY "Users can manage own templates" ON blog.post_templates
  FOR ALL USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Add some default templates
INSERT INTO blog.post_templates (name, description, title_template, content_template, default_tags, is_public) VALUES
(
  'Tutorial Post',
  'Template for technical tutorials',
  'How to {Topic}',
  '# How to {Topic}

## Introduction
Brief introduction to what we''ll learn...

## Prerequisites
- Prerequisite 1
- Prerequisite 2

## Step 1: Getting Started
Explain the first step...

## Step 2: Implementation
Show the implementation...

## Step 3: Testing
How to test...

## Conclusion
Wrap up and next steps...

## Resources
- [Link 1](https://example.com)
- [Link 2](https://example.com)',
  'tutorial, how-to, programming',
  TRUE
),
(
  'Quick Tip',
  'Template for short tips and tricks',
  'Quick Tip: {Tip Name}',
  '# Quick Tip: {Tip Name}

Here''s a quick tip that can save you time...

## The Problem
Describe the common problem...

## The Solution
```code
// Your code solution here
```

## Why It Works
Explain the reasoning...

**Pro tip:** Additional insight or warning...',
  'tip, quick, productivity',
  TRUE
),
(
  'Project Showcase',
  'Template for showcasing projects',
  'Project Showcase: {Project Name}',
  '# Project Showcase: {Project Name}

## Overview
Brief description of the project...

## Features
- Feature 1
- Feature 2
- Feature 3

## Technology Stack
- Frontend: 
- Backend: 
- Database: 
- Deployment: 

## Challenges & Solutions
Discuss interesting challenges...

## Live Demo
[View Project](https://your-project.com)

## Source Code
[GitHub Repository](https://github.com/username/repo)',
  'project, showcase, development',
  TRUE
);

-- View for easy version management
CREATE OR REPLACE VIEW blog.post_version_history AS
SELECT 
  pv.*,
  p.title as current_title,
  p.status as current_status,
  prof.full_name as created_by_name
FROM blog.post_versions pv
JOIN blog.posts p ON pv.post_id = p.id
LEFT JOIN public.profiles prof ON pv.created_by = prof.id
ORDER BY pv.post_id, pv.version_number DESC;