import { auth } from '../firebase';

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
  createdAt?: any;
  updatedAt?: any;
}

const API_BASE_URL = '/api/testimonials';

const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) return { 'Content-Type': 'application/json' };
  const token = await user.getIdToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error('Failed to fetch testimonials');
    return await response.json();
  } catch (error) {
    console.error('Error getting testimonials:', error);
    return [];
  }
};

export const addTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(testimonial)
    });
    if (!response.ok) throw new Error('Failed to add testimonial');
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error adding testimonial:', error);
  }
};

export const updateTestimonial = async (id: string, testimonial: Partial<Testimonial>) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(testimonial)
    });
    if (!response.ok) throw new Error('Failed to update testimonial');
  } catch (error) {
    console.error('Error updating testimonial:', error);
  }
};

export const deleteTestimonial = async (id: string) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers
    });
    if (!response.ok) throw new Error('Failed to delete testimonial');
  } catch (error) {
    console.error('Error deleting testimonial:', error);
  }
};
