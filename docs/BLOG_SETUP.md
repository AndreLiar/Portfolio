# Blog System Setup Guide - Firebase Edition

This guide explains how to set up and use the complete blog system integrated with Firebase authentication and Firestore database.

## 🏗️ System Architecture

- **Frontend**: Next.js 15.3.3 with App Router
- **Authentication**: Firebase Auth with email/password
- **Database**: Firestore with structured collections
- **Admin Interface**: Role-based access control
- **Internationalization**: Multilingual support (EN/FR/DE)

## 🔧 Firebase Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# Firebase Client Configuration (Public)
NEXT_PUBLIC_FIREBASE_API_KEY="your_firebase_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_project.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your_measurement_id"

# Firebase Admin Configuration (Private - for server-side)
FIREBASE_PROJECT_ID="your_project_id"
FIREBASE_CLIENT_EMAIL="your_admin_service_account_email"
FIREBASE_PRIVATE_KEY="your_admin_private_key"

# Blog Configuration
BLOG_ORIGIN="http://localhost:9009"
BLOG_ADMIN_EMAIL="your_admin_email@domain.com"
```

### Firebase Console Setup

1. **Create Firebase Project**: Go to [Firebase Console](https://console.firebase.google.com/)
2. **Enable Authentication**: 
   - Go to Authentication > Sign-in method
   - Enable Email/Password provider
3. **Create Firestore Database**:
   - Go to Firestore Database > Create database
   - Start in production mode or test mode
4. **Generate Service Account**:
   - Go to Project Settings > Service accounts
   - Generate new private key for Admin SDK

### Firestore Database Structure

The blog system uses these Firestore collections:

```
📁 profiles/
  📄 {userId}
    - email: string
    - full_name: string
    - role: "user" | "admin"
    - created_at: timestamp
    - updated_at: timestamp

📁 posts/
  📄 {postId}
    - title: string
    - slug: string (unique)
    - content: string (markdown)
    - excerpt: string
    - status: "draft" | "published" | "archived"
    - featured_image: string (optional)
    - author_id: string (user reference)
    - created_at: timestamp
    - updated_at: timestamp
    - published_at: timestamp (optional)

📁 tags/
  📄 {tagId}
    - name: string (unique)
    - slug: string (unique)
    - description: string (optional)
    - created_at: timestamp

📁 post_tags/
  📄 {relationId}
    - post_id: string (post reference)
    - tag_id: string (tag reference)
    - created_at: timestamp

📁 post_views/
  📄 {viewId}
    - post_id: string (post reference)
    - viewed_at: timestamp
    - user_agent: string (optional)
```

## 🚀 Quick Start

### 1. Environment Setup

1. Copy your Firebase configuration values to `.env`
2. Ensure all required environment variables are set
3. Install dependencies: `npm install`

### 2. Create Admin User

1. Start the development server: `npm run dev`
2. Navigate to `/auth/login`
3. Create your first account using the signup form
4. **Important**: Manually set the user's role to "admin" in Firestore:
   ```
   Go to Firestore Console → profiles → {your-user-id} → edit role field to "admin"
   ```

### 3. Access Admin Dashboard

1. After setting admin role, navigate to `/admin/blog`
2. You should now have access to the blog management interface

## 📝 Blog Management Features

### Post Management
- **Create Posts**: Rich markdown editor with live preview
- **Edit Posts**: Full content management with status control
- **Bulk Operations**: Select multiple posts for status changes
- **Status Control**: Draft, Published, Archived states

### Tag Management
- **Create Tags**: Inline tag creation during post editing
- **Tag Association**: Multiple tags per post
- **Tag Filtering**: Browse posts by tag categories

### Content Features
- **Markdown Support**: Full markdown syntax with live preview
- **Slug Generation**: Automatic URL-friendly slug creation
- **Featured Images**: Optional image support for posts
- **Excerpts**: Auto-generated or custom excerpts

### Analytics
- **View Tracking**: Post view analytics
- **Post Statistics**: Creation and update timestamps

## 🌐 Internationalization

### Adding Blog Translations

Blog-specific translations are in `src/locales/{locale}.json`:

```json
{
  "Header": {
    "nav": {
      "blog": "Blog"
    }
  },
  "Blog": {
    "title": "Blog",
    "subtitle": "Thoughts, tutorials, and insights",
    "readMore": "Read more",
    "backToBlog": "← Back to Blog",
    "noPostsFound": "No posts found",
    "loadMore": "Load More Posts",
    "tags": "Tags",
    "allTags": "All Tags",
    "publishedOn": "Published on",
    "admin": {
      "dashboard": "Blog Dashboard",
      "createPost": "Create New Post",
      "editPost": "Edit Post",
      "posts": "Posts",
      "tags": "Tags",
      "logout": "Logout"
    }
  }
}
```

### Supported Languages
- **English** (en) - Default
- **French** (fr)  
- **German** (de)

## 🔒 Security & Access Control

### Authentication Flow
1. **Firebase Auth**: Email/password authentication
2. **Session Management**: Server-side session validation
3. **Middleware Protection**: Route-level access control
4. **Role Verification**: Admin role requirement for admin routes

### Protected Routes
- `/admin/*` - Requires authentication and admin role
- `/auth/*` - Redirects if already authenticated

### Security Features
- **Server-side validation**: All database operations validated
- **Role-based access**: Admin-only content management
- **Input sanitization**: Markdown content safely rendered
- **CSRF protection**: Session-based authentication

## 🛠️ Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint

# AI development (if using Genkit)
npm run genkit:dev
```

## 📁 File Structure

```
src/
├── app/
│   ├── [lang]/
│   │   └── blog/           # Public blog pages
│   ├── admin/
│   │   └── blog/           # Admin dashboard
│   └── auth/
│       └── login/          # Authentication
├── components/
│   ├── admin/              # Admin interface components
│   └── blog/               # Public blog components
├── lib/
│   └── firebase/           # Firebase configuration & services
└── locales/                # Internationalization files
```

## 🐛 Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check Firebase environment variables
   - Verify Email/Password is enabled in Firebase Console
   - Ensure service account credentials are correct

2. **Admin access denied**
   - Verify user role is set to "admin" in Firestore
   - Check middleware configuration
   - Clear browser cache and cookies

3. **Posts not loading**
   - Verify Firestore rules allow read access
   - Check network tab for API errors
   - Ensure collections exist in Firestore

4. **Build failures**
   - Run `npm run typecheck` to identify TypeScript errors
   - Verify all environment variables are set
   - Check for missing dependencies

### Database Rules

Ensure your Firestore rules allow proper access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to published posts
    match /posts/{postId} {
      allow read: if resource.data.status == 'published';
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/profiles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Allow public read access to tags
    match /tags/{tagId} {
      allow read: if true;
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/profiles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Admin-only access to profiles
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
                     get(/databases/$(database)/documents/profiles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Allow public read/write for post views (analytics)
    match /post_views/{viewId} {
      allow read, write: if true;
    }
    
    // Admin-only access to post_tags
    match /post_tags/{relationId} {
      allow read: if true;
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/profiles/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 🎯 Next Steps

1. **Customize Design**: Modify blog components to match your portfolio theme
2. **Add Features**: Implement comments, search, or newsletter signup
3. **SEO Optimization**: Add structured data and meta tags
4. **Performance**: Implement caching and image optimization
5. **Analytics**: Add Google Analytics or other tracking

---

**Note**: This blog system is fully integrated with the portfolio and supports the same internationalization and design system. All content is managed through the Firebase-powered admin interface.