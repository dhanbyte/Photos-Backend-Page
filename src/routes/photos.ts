import express from 'express';
import Photo from '../models/Photo';
import { validatePhotoData } from '../middleware/validation';
import { authenticateAdmin } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/events/:eventId/states/:stateId/photos
 * Fetch photos for a specific event and state
 */
router.get('/events/:eventId/states/:stateId/photos', async (req, res) => {
  try {
    const { eventId, stateId } = req.params;
    
    // Find photos by eventId and state name (stateId in this case is the state name)
    const photos = await Photo.find({ 
      eventId, 
      state: stateId 
    }).sort({ uploadedAt: -1 });
    
    res.status(200).json(photos);
    
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch photos'
    });
  }
});

/**
 * GET /api/photos
 * Fetch all photos with optional filtering
 */
router.get('/', async (req, res) => {
  try {
    const { eventId, state, limit } = req.query;
    
    let query: any = {};
    if (eventId) query.eventId = eventId;
    if (state) query.state = state;
    
    let photoQuery = Photo.find(query).sort({ uploadedAt: -1 });
    
    if (limit) {
      photoQuery = photoQuery.limit(parseInt(limit as string));
    }
    
    const photos = await photoQuery.exec();
    res.status(200).json(photos);
    
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch photos'
    });
  }
});

/**
 * POST /api/photos
 * Create a new photo entry
 */
router.post('/', authenticateAdmin, validatePhotoData, async (req, res) => {
  try {
    const { eventId, state, url, imageUrl, date, uploadedAt } = req.body;
    
    const photoData = {
      eventId,
      state,
      imageUrl: imageUrl || url, // Handle both field names
      url: url || imageUrl,
      uploadedAt: uploadedAt || date || new Date().toISOString(),
      date: date || uploadedAt || new Date().toISOString().split('T')[0]
    };
    
    const newPhoto = new Photo(photoData);
    const savedPhoto = await newPhoto.save();
    
    res.status(201).json({
      success: true,
      data: savedPhoto,
      message: 'Photo created successfully'
    });
    
  } catch (error) {
    console.error('Error creating photo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create photo'
    });
  }
});

/**
 * GET /api/photos/:photoId
 * Fetch a specific photo by ID
 */
router.get('/:photoId', async (req, res) => {
  try {
    const { photoId } = req.params;
    const photo = await Photo.findById(photoId);
    
    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }
    
    return res.status(200).json(photo);
  } catch (error) {
    console.error('Error fetching photo:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch photo'
    });
  }
});

/**
 * DELETE /api/photos/:photoId
 * Delete a photo
 */
router.delete('/:photoId', authenticateAdmin, async (req, res) => {
  try {
    const { photoId } = req.params;
    
    const deletedPhoto = await Photo.findByIdAndDelete(photoId);
    
    if (!deletedPhoto) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Photo deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting photo:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete photo'
    });
  }
});

export default router; 