import { Request, Response } from 'express';
import { db } from '../utils/firebase';
import { Property, Inquiry } from '../models/Property';
import { Timestamp } from 'firebase-admin/firestore';

const PROPERTIES_COLLECTION = 'properties';
const INQUIRIES_COLLECTION = 'inquiries';

export const getProperties = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection(PROPERTIES_COLLECTION).orderBy('createdAt', 'desc').get();
    const properties = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(properties);
  } catch (error) {
    console.error('Error getting properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};

export const addProperty = async (req: Request, res: Response) => {
  try {
    const property: Property = req.body;
    const docRef = await db.collection(PROPERTIES_COLLECTION).add({
      ...property,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    res.status(201).json({ id: docRef.id, ...property });
  } catch (error) {
    console.error('Error adding property:', error);
    res.status(500).json({ error: 'Failed to add property' });
  }
};

export const updateProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const property: Partial<Property> = req.body;
    await db.collection(PROPERTIES_COLLECTION).doc(id).update({
      ...property,
      updatedAt: Timestamp.now()
    });
    res.json({ id, ...property });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
};

export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.collection(PROPERTIES_COLLECTION).doc(id).delete();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
};

export const addInquiry = async (req: Request, res: Response) => {
  try {
    const inquiry: Inquiry = req.body;
    const docRef = await db.collection(INQUIRIES_COLLECTION).add({
      ...inquiry,
      createdAt: Timestamp.now()
    });
    res.status(201).json({ id: docRef.id, ...inquiry });
  } catch (error) {
    console.error('Error adding inquiry:', error);
    res.status(500).json({ error: 'Failed to add inquiry' });
  }
};

export const getInquiries = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection(INQUIRIES_COLLECTION).orderBy('createdAt', 'desc').get();
    const inquiries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(inquiries);
  } catch (error) {
    console.error('Error getting inquiries:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
};

export const deleteInquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.collection(INQUIRIES_COLLECTION).doc(id).delete();
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
};
