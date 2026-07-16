import { Request, Response } from 'express';
import { db } from '../utils/firebase';
import { Testimonial } from '../models/Testimonial';
import { Timestamp } from 'firebase-admin/firestore';

const TESTIMONIALS_COLLECTION = 'testimonials';

export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection(TESTIMONIALS_COLLECTION).orderBy('createdAt', 'desc').get();
    const testimonials = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(testimonials);
  } catch (error) {
    console.error('Error getting testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
};

export const addTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonial: Testimonial = req.body;
    const docRef = await db.collection(TESTIMONIALS_COLLECTION).add({
      ...testimonial,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    res.status(201).json({ id: docRef.id, ...testimonial });
  } catch (error) {
    console.error('Error adding testimonial:', error);
    res.status(500).json({ error: 'Failed to add testimonial' });
  }
};

export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const testimonial: Partial<Testimonial> = req.body;
    await db.collection(TESTIMONIALS_COLLECTION).doc(id).update({
      ...testimonial,
      updatedAt: Timestamp.now()
    });
    res.json({ id, ...testimonial });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.collection(TESTIMONIALS_COLLECTION).doc(id).delete();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
};
