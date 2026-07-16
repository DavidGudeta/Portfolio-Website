import { Request, Response } from 'express';
import { db } from '../utils/firebase';
import { Timestamp } from 'firebase-admin/firestore';

const USERS_COLLECTION = 'users';

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const doc = await db.collection(USERS_COLLECTION).doc(uid).get();
    if (doc.exists) {
      res.json(doc.data());
    } else {
      res.status(404).json({ error: 'User profile not found' });
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

export const createUserProfile = async (req: Request, res: Response) => {
  try {
    const { uid, email, role } = req.body;
    await db.collection(USERS_COLLECTION).doc(uid).set({
      uid,
      email,
      role: role || 'client',
      createdAt: Timestamp.now()
    });
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error creating user profile:', error);
    res.status(500).json({ error: 'Failed to create user profile' });
  }
};
