'use client';

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { COLLECTIONS, Profile, UserRole } from './types';

// Sign up new user
export async function signUp(email: string, password: string, fullName?: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Update display name if provided
    if (fullName) {
      await updateProfile(user, { displayName: fullName });
    }

    // Create user profile in Firestore
    const isAdminEmail = user.email === 'kanmegnea@gmail.com';
    const profile: Omit<Profile, 'id'> = {
      email: user.email!,
      full_name: fullName || null,
      role: isAdminEmail ? 'admin' : 'user', // Auto-admin for your email
      created_at: new Date(),
      updated_at: new Date()
    };

    await setDoc(doc(db, COLLECTIONS.PROFILES, user.uid), profile);

    return { user, profile };
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

// Sign in existing user
export async function signIn(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Auto-upgrade admin email to admin role if not already
    if (result.user.email === 'kanmegnea@gmail.com') {
      const profile = await getUserProfile(result.user.uid);
      if (profile && profile.role !== 'admin') {
        console.log('Upgrading user to admin role...');
        await updateUserRole(result.user.uid, 'admin');
      }
    }
    
    return result.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

// Sign out
export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

// Get user profile
export async function getUserProfile(uid: string): Promise<Profile | null> {
  try {
    const docRef = doc(db, COLLECTIONS.PROFILES, uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: uid,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        created_at: data.created_at?.toDate() || new Date(),
        updated_at: data.updated_at?.toDate() || new Date()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

// Update user role (admin function)
export async function updateUserRole(uid: string, role: UserRole) {
  try {
    const profileRef = doc(db, COLLECTIONS.PROFILES, uid);
    await setDoc(profileRef, {
      role,
      updated_at: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

// Check if user is admin
export async function isUserAdmin(uid: string): Promise<boolean> {
  try {
    const profile = await getUserProfile(uid);
    return profile?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// Auth state listener
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Reset password
export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}

// Get current user
export function getCurrentUser() {
  return auth.currentUser;
}