import { Timestamp } from 'firebase-admin/firestore';

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
  amenities?: string[];
  gallery?: string[];
  videoUrl?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Inquiry {
  id?: string;
  name: string;
  email: string;
  phone: string;
  date?: string;
  notes?: string;
  propertyId?: string;
  createdAt?: Timestamp;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'client';
  createdAt?: Timestamp;
}
