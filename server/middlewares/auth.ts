import { Request, Response, NextFunction } from 'express';
import { auth, db } from '../utils/firebase';

export interface AuthRequest extends Request {
  user?: any;
  isAdmin?: boolean;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    
    // Check if admin
    const isAdminEmail = decodedToken.email === 'masaraproperties2025@gmail.com' && decodedToken.email_verified;
    
    if (isAdminEmail) {
      req.isAdmin = true;
    } else {
      const userDoc = await db.collection('users').doc(decodedToken.uid).get();
      if (userDoc.exists && userDoc.data()?.role === 'admin') {
        req.isAdmin = true;
      } else {
        req.isAdmin = false;
      }
    }
    
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.isAdmin) {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
};
