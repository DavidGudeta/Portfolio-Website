import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface Property {
  id?: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: string;
  image: string;
  description: string;
  type?: string;
  amenities?: string[];
  gallery?: string[];
  videoUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

const API_BASE_URL = '/api/properties';

const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) return { 'Content-Type': 'application/json' };
  const token = await user.getIdToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const getProperties = async (): Promise<Property[]> => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error('Failed to fetch properties');
    return await response.json();
  } catch (error) {
    console.error('Error getting properties:', error);
    return [];
  }
};

export const addProperty = async (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(property)
    });
    if (!response.ok) throw new Error('Failed to add property');
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error adding property:', error);
  }
};

export const updateProperty = async (id: string, property: Partial<Property>) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(property)
    });
    if (!response.ok) throw new Error('Failed to update property');
  } catch (error) {
    console.error('Error updating property:', error);
  }
};

export const deleteProperty = async (id: string) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers
    });
    if (!response.ok) throw new Error('Failed to delete property');
  } catch (error) {
    console.error('Error deleting property:', error);
  }
};

// User Profile Service (Still using Firestore directly for now as no backend route yet)
const USERS_API_URL = '/api/users/profile';

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'client';
  createdAt: any;
}

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${USERS_API_URL}/${uid}`, { headers });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const createUserProfile = async (uid: string, email: string, role: 'admin' | 'client' = 'client') => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(USERS_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ uid, email, role })
    });
    if (!response.ok) throw new Error('Failed to create user profile');
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
};

// Inquiries Service
export interface Inquiry {
  id?: string;
  name: string;
  email: string;
  phone: string;
  date?: string;
  notes?: string;
  propertyId?: string;
  createdAt?: any;
}

export const getInquiries = async (): Promise<Inquiry[]> => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/inquiries`, { headers });
    if (!response.ok) throw new Error('Failed to fetch inquiries');
    return await response.json();
  } catch (error) {
    console.error('Error getting inquiries:', error);
    return [];
  }
};

export const addInquiry = async (inquiry: Omit<Inquiry, 'id' | 'createdAt'>) => {
  try {
    const response = await fetch(`${API_BASE_URL}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry)
    });
    if (!response.ok) throw new Error('Failed to add inquiry');
  } catch (error) {
    console.error('Error adding inquiry:', error);
  }
};

export const deleteInquiry = async (id: string) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/inquiries/${id}`, {
      method: 'DELETE',
      headers
    });
    if (!response.ok) throw new Error('Failed to delete inquiry');
  } catch (error) {
    console.error('Error deleting inquiry:', error);
  }
};

export const seedProperties = async (properties: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>[]) => {
  try {
    const promises = properties.map(p => addProperty(p));
    await Promise.all(promises);
  } catch (error) {
    console.error("Error seeding properties:", error);
  }
};

// Content & Settings (Still using Firestore directly for simplicity or add routes if needed)
export const getAboutContent = async () => {
  const path = 'content/about';
  try {
    const docRef = doc(db, 'content', 'about');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.GET, path);
    }
    return null;
  }
};

export const updateAboutContent = async (content: any) => {
  const path = 'content/about';
  try {
    const docRef = doc(db, 'content', 'about');
    await setDoc(docRef, content, { merge: true });
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
    console.error('Error updating about content:', error);
  }
};

export const getSiteSettings = async () => {
  const path = 'settings/global';
  try {
    const docRef = doc(db, 'settings', 'global');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.GET, path);
    }
    return null;
  }
};

export const updateSiteSettings = async (settings: any) => {
  const path = 'settings/global';
  try {
    const docRef = doc(db, 'settings', 'global');
    await setDoc(docRef, settings, { merge: true });
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
    console.error('Error updating site settings:', error);
  }
};
