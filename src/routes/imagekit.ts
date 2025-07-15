import express from 'express';
import imagekit from '../config/imagekit';
import { validateImageKitRequest } from '../middleware/validation';

const router = express.Router();

/**
 * Generate authentication parameters for ImageKit client-side upload
 * This endpoint provides the token, signature, and expire timestamp
 * required for direct client-side uploads to ImageKit
 */
router.get('/auth', validateImageKitRequest, (req, res) => {
  try {
    // Generate authentication parameters
    const authParams = imagekit.getAuthenticationParameters();
    
    console.log('🔐 Generated ImageKit auth params for client upload');
    
    res.status(200).json({
      success: true,
      data: {
        token: authParams.token,
        expire: authParams.expire,
        signature: authParams.signature,
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
      },
      message: 'Authentication parameters generated successfully'
    });
    
  } catch (error) {
    console.error('❌ Error generating ImageKit auth params:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate authentication parameters'
    });
  }
});

/**
 * Get ImageKit configuration for client-side initialization
 * Returns public configuration needed by the frontend
 */
router.get('/config', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
        authenticationEndpoint: `${req.protocol}://${req.get('host')}/api/imagekit/auth`
      },
      message: 'ImageKit configuration retrieved successfully'
    });
    
  } catch (error) {
    console.error('❌ Error getting ImageKit config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get ImageKit configuration'
    });
  }
});

/**
 * Webhook endpoint for ImageKit upload notifications (optional)
 * This can be used to track uploads and store metadata in MongoDB
 */
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  try {
    // Here you can process ImageKit webhook events
    // and store image metadata in MongoDB if needed
    console.log('📸 ImageKit webhook received:', req.body);
    
    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully'
    });
    
  } catch (error) {
    console.error('❌ Error processing ImageKit webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process webhook'
    });
  }
});

export default router; 