import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin, { IAdmin } from '../models/Admin';

// Extend Request interface to include admin
export interface AuthRequest extends Request {
  admin?: IAdmin;
}

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'qwe123qwe123qwe123';

// Generate JWT token
export const generateToken = (adminId: string): string => {
  return jwt.sign({ adminId }, JWT_SECRET, { expiresIn: '24h' });
};

// Verify JWT token middleware
export const authenticateAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { adminId: string };
    const admin = await Admin.findById(decoded.adminId);

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or admin account is inactive.'
      });
    }

    req.admin = admin;
    next();
    return;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error during authentication.'
    });
  }
};

// Optional authentication middleware (for routes that can be accessed by both admin and public)
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as { adminId: string };
      const admin = await Admin.findById(decoded.adminId);
      
      if (admin && admin.isActive) {
        req.admin = admin;
      }
    }
    
    next();
    return;
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
    return;
  }
}; 