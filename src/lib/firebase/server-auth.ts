import { cookies } from 'next/headers';
import { adminAuth, adminDb } from './admin';
import { COLLECTIONS, Profile } from './types';

// Verify Firebase ID token on server
export async function verifyIdToken(idToken: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return null;
  }
}

// Get user from server-side cookie
export async function getCurrentUserServer() {
  try {
    const cookieStore = await cookies();
    const idToken = cookieStore.get('firebase-token')?.value;
    
    if (!idToken) {
      return null;
    }

    const decodedToken = await verifyIdToken(idToken);
    if (!decodedToken) {
      return null;
    }

    return {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      role: decodedToken.role || 'user'
    };
  } catch (error) {
    console.error('Error getting current user on server:', error);
    return null;
  }
}

// Get user profile from server
export async function getUserProfileServer(uid: string): Promise<Profile | null> {
  try {
    const doc = await adminDb.collection(COLLECTIONS.PROFILES).doc(uid).get();
    
    if (!doc.exists) {
      return null;
    }

    const data = doc.data()!;
    return {
      id: uid,
      email: data.email,
      full_name: data.full_name,
      role: data.role,
      created_at: data.created_at?.toDate() || new Date(),
      updated_at: data.updated_at?.toDate() || new Date()
    };
  } catch (error) {
    console.error('Error getting user profile on server:', error);
    return null;
  }
}

// Check if user is admin on server
export async function isUserAdminServer(uid: string): Promise<boolean> {
  try {
    const profile = await getUserProfileServer(uid);
    return profile?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status on server:', error);
    return false;
  }
}

// Create session cookie
export async function createSessionCookie(idToken: string, expiresIn: number = 60 * 60 * 24 * 5 * 1000) {
  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    return sessionCookie;
  } catch (error) {
    console.error('Error creating session cookie:', error);
    throw error;
  }
}

// Verify session cookie
export async function verifySessionCookie(sessionCookie: string) {
  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return null;
  }
}