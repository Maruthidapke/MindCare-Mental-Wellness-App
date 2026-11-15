import jwt from 'jsonwebtoken';
import { store } from '../data/store.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'mindcare_jwt_super_secret_key_eng24cs0127_dsu';
    const decoded = jwt.verify(token, secret);
    const user = await store.findUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid session or user not found.' });
    }

    req.user = {
      _id: user._id || user.id,
      name: user.name,
      email: user.email,
      studentDetails: user.studentDetails
    };
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Session expired or invalid token.' });
  }
};

