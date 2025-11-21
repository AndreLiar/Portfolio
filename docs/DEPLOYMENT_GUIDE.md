# 🚀 Portfolio & Blog System Deployment Guide - Firebase Edition

## 📋 **Deployment Overview**

This guide covers deploying the complete portfolio website with integrated blog system using Firebase authentication and Firestore database.

### **Tech Stack:**
- **Frontend**: Next.js 15.3.3 with App Router
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Hosting**: Vercel (recommended) or Firebase Hosting
- **Internationalization**: EN/FR/DE support

---

## 🔧 **Environment Variables Setup**

### **1. Go to Your Hosting Platform**

#### **For Vercel:**
- Visit https://vercel.com/dashboard
- Select your Portfolio project
- Go to **Settings** → **Environment Variables**

#### **For Firebase Hosting:**
- Use Firebase Functions for environment variables
- Configure in `firebase.json` and `.env.production`

### **2. Required Environment Variables:**

| Variable Name | Example Value | Notes |
|---------------|--------------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyBH66f9fFnxHIkN6hHdO6iM6uhTBKUD19w` | Firebase API key (public) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `portfolioandre-6ecd1.firebaseapp.com` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `portfolioandre-6ecd1` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `portfolioandre-6ecd1.firebasestorage.app` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `841259756897` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:841259756897:web:fdff4ee3e469f1154d6920` | Firebase app ID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-LXN0LQ7WT9` | Firebase analytics ID (optional) |
| `FIREBASE_PROJECT_ID` | `portfolioandre-6ecd1` | Firebase project ID (server-side) |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-xyz@project.iam.gserviceaccount.com` | Service account email |
| `FIREBASE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...` | Service account private key |
| `BLOG_ORIGIN` | `https://your-domain.vercel.app` | Your deployed URL |
| `BLOG_ADMIN_EMAIL` | `your-email@domain.com` | Admin notification email |
| `NEXT_PUBLIC_BASE_URL` | `https://your-domain.vercel.app` | Your deployed URL |
| `RESEND_API_KEY` | `re_epCx3gdX_HVZHMLb2WEVXS9nPXRqUfoNf` | Email service API key |
| `GEMINI_API_KEY` | `your_gemini_api_key` | AI resume analyzer (optional) |

### **3. Copy Values from Local Environment**
Use the exact values from your local `.env` file for the Firebase credentials.

### **4. Important Notes:**
- **NEXT_PUBLIC_** variables are exposed to the browser
- **Private keys** should be properly escaped (replace `\n` with actual newlines)
- **Service account** must have Firestore Admin permissions

---

## 🔥 **Firebase Configuration**

### **1. Firebase Console Setup**

#### **Enable Required Services:**
1. **Authentication**:
   - Go to Authentication → Sign-in method
   - Enable Email/Password provider
   - Configure authorized domains (add your deployment domain)

2. **Firestore Database**:
   - Go to Firestore Database → Create database
   - Choose production mode
   - Select appropriate region

3. **Service Account**:
   - Go to Project Settings → Service accounts
   - Generate new private key for Admin SDK
   - Download the JSON file and extract credentials

### **2. Firestore Security Rules**

Deploy these security rules to your Firestore database:

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
    
    // User profile access
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
                     get(/databases/$(database)/documents/profiles/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Allow public read/write for post views (analytics)
    match /post_views/{viewId} {
      allow read, write: if true;
    }
    
    // Public read, admin write for post_tags
    match /post_tags/{relationId} {
      allow read: if true;
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/profiles/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### **3. Authentication Domain Setup**

Add your deployment domain to Firebase Auth:
1. Go to Authentication → Settings → Authorized domains
2. Add your production domain (e.g., `your-site.vercel.app`)

---

## 🚀 **Deployment Steps**

### **Step 1: Pre-deployment Checklist**

- [ ] All environment variables configured
- [ ] Firebase services enabled
- [ ] Firestore security rules deployed
- [ ] Service account credentials added
- [ ] Build passes locally (`npm run build`)

### **Step 2: Deploy to Vercel**

```bash
# Connect to Vercel (if not already connected)
npx vercel login

# Deploy
npx vercel --prod

# Or use GitHub integration for automatic deployments
```

### **Step 3: Post-deployment Setup**

1. **Create Admin User**:
   - Visit `/auth/login` on your deployed site
   - Create your first account
   - Go to Firebase Console → Firestore → profiles
   - Find your user document and set `role: "admin"`

2. **Test Blog System**:
   - Access `/admin/blog` to verify admin access
   - Create a test blog post
   - Verify public blog at `/en/blog` works

3. **Verify Internationalization**:
   - Test all language routes (`/en`, `/fr`, `/de`)
   - Verify language switching works
   - Check SEO metadata in different languages

---

## 🐛 **Common Deployment Issues**

### **Build Errors**

#### **1. Environment Variable Errors**
```
Error: Missing required Firebase environment variables
```
**Solution**: Ensure all required environment variables are set in your hosting platform.

#### **2. Firebase Admin Initialization Error**
```
Error: Could not load the default credentials
```
**Solution**: 
- Verify `FIREBASE_PRIVATE_KEY` is properly formatted
- Ensure service account has correct permissions
- Check that all three admin variables are set

#### **3. TypeScript Build Errors**
```
Type error: Property 'xyz' does not exist
```
**Solution**: Run `npm run typecheck` locally to identify and fix type issues.

### **Runtime Errors**

#### **1. Authentication Not Working**
- Check Firebase Auth domain configuration
- Verify environment variables are correctly set
- Ensure Email/Password provider is enabled

#### **2. Database Permission Denied**
- Review Firestore security rules
- Check user role in profiles collection
- Verify service account permissions

#### **3. Blog Posts Not Loading**
- Check Firestore collections exist
- Verify security rules allow public read for published posts
- Ensure proper data structure in Firestore

---

## 📊 **Performance Optimization**

### **1. Next.js Optimizations**

```javascript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizeCss: false, // Disable if causing build issues
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
};
```

### **2. Firebase Optimizations**

- Use Firestore compound indexes for complex queries
- Implement proper pagination for blog posts
- Cache static content using Next.js ISR
- Optimize images stored in Firebase Storage

### **3. SEO Optimizations**

- Ensure proper meta tags for all pages
- Implement structured data for blog posts
- Configure sitemap generation
- Set up proper Open Graph tags

---

## 🔒 **Security Checklist**

- [ ] Firestore security rules properly configured
- [ ] Service account key properly secured (not in client-side code)
- [ ] CORS properly configured for Firebase
- [ ] Admin routes protected by middleware
- [ ] User input sanitized (especially blog content)
- [ ] Rate limiting implemented for sensitive operations

---

## 📈 **Monitoring & Analytics**

### **1. Firebase Analytics**
- Enable Firebase Analytics in console
- Add measurement ID to environment variables
- Monitor user engagement and page views

### **2. Error Monitoring**
Consider adding error monitoring services:
- Sentry for error tracking
- LogRocket for user session recording
- Vercel Analytics for performance monitoring

### **3. Performance Monitoring**
- Monitor Core Web Vitals
- Track blog post engagement
- Monitor authentication success rates

---

## 🎯 **Post-Deployment Tasks**

1. **Content Migration**: If migrating from another platform, import content to Firestore
2. **SEO Setup**: Submit sitemap to Google Search Console
3. **Social Media**: Update social media links with new blog URLs
4. **Analytics**: Configure Google Analytics or other tracking
5. **Backup Strategy**: Set up automated Firestore backups
6. **Monitoring**: Set up alerts for downtime or errors

---

**✅ Deployment Complete!** 

Your portfolio with integrated blog system should now be live and fully functional with Firebase backend.

For ongoing maintenance, refer to the [Blog Setup Guide](./BLOG_SETUP.md) for content management and the [CLAUDE.md](./CLAUDE.md) for development guidance.