import express from 'express';
import Admin from '../models/Admin';
import { generateToken, authenticateAdmin, AuthRequest } from '../middleware/auth';
import Joi from 'joi';

const router = express.Router();

// Simple validation middleware
const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }
    
    next();
    return;
  };
};

// Validation schemas
const loginSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(6).required()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

// Login route
router.post('/login', validateRequest(loginSchema), async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin by username
    const admin = await Admin.findOne({ username: username.toLowerCase() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Admin account is deactivated'
      });
    }

    // Compare password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id as string);

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: admin.toJSON()
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Get current admin profile
router.get('/profile', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    return res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        admin: req.admin?.toJSON()
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving profile'
    });
  }
});

// Change password
router.put('/change-password', authenticateAdmin, validateRequest(changePasswordSchema), async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = req.admin!;

    // Verify current password
    const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    return res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error changing password'
    });
  }
});

// Logout route (client-side should remove token)
router.post('/logout', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    return res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});

// Verify token route
router.get('/verify', authenticateAdmin, async (req: AuthRequest, res) => {
  try {
    return res.json({
      success: true,
      message: 'Token is valid',
      data: {
        admin: req.admin?.toJSON()
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during token verification'
    });
  }
});

export default router; 