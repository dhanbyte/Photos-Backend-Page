import express from 'express';
import State from '../models/State';
import { validateStateData } from '../middleware/validation';
import { authenticateAdmin } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/states?eventId={eventId}
 * Fetch states by event ID (used by Admin panel)
 */
router.get('/', async (req, res) => {
  try {
    const { eventId } = req.query;
    
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required'
      });
    }
    
    const states = await State.find({ eventId }).sort({ name: 1 });
    return res.status(200).json(states);
    
  } catch (error) {
    console.error('Error fetching states:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch states'
    });
  }
});

/**
 * GET /api/events/:eventId/states
 * Fetch states by event ID (alternative endpoint used by States page)
 */
router.get('/events/:eventId/states', async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const states = await State.find({ eventId }).sort({ name: 1 });
    res.status(200).json(states);
    
  } catch (error) {
    console.error('Error fetching states for event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch states for event'
    });
  }
});

/**
 * POST /api/states
 * Create a new state
 */
router.post('/', authenticateAdmin, validateStateData, async (req, res) => {
  try {
    const { name, eventId } = req.body;
    
    // Check if state already exists for this event
    const existingState = await State.findOne({ name, eventId });
    if (existingState) {
      return res.status(400).json({
        success: false,
        message: 'State already exists for this event'
      });
    }
    
    const newState = new State({
      name,
      eventId
    });
    
    const savedState = await newState.save();
    
    return res.status(201).json({
      success: true,
      data: savedState,
      message: 'State created successfully'
    });
    
  } catch (error) {
    console.error('Error creating state:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create state'
    });
  }
});

/**
 * GET /api/states/:stateId
 * Fetch a specific state by ID
 */
router.get('/:stateId', async (req, res) => {
  try {
    const { stateId } = req.params;
    const state = await State.findById(stateId).populate('eventId');
    
    if (!state) {
      return res.status(404).json({
        success: false,
        message: 'State not found'
      });
    }
    
    return res.status(200).json(state);
  } catch (error) {
    console.error('Error fetching state:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch state'
    });
  }
});

/**
 * DELETE /api/states/:stateId
 * Delete a state
 */
router.delete('/:stateId', authenticateAdmin, async (req, res) => {
  try {
    const { stateId } = req.params;
    
    const deletedState = await State.findByIdAndDelete(stateId);
    
    if (!deletedState) {
      return res.status(404).json({
        success: false,
        message: 'State not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'State deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting state:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete state'
    });
  }
});

export default router; 