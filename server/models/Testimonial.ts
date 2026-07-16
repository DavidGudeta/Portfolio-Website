import { Timestamp } from 'firebase-admin/firestore';

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
