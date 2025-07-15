import express from 'express';
import Event from '../models/Event';
import { validateEventData } from '../middleware/validation';
import { authenticateAdmin } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/events
 * Fetch all events
 */
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events'
    });
  }
});

/**
 * GET /api/events/:eventId
 * Fetch a specific event by ID
 */
router.get('/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    return res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch event'
    });
  }
});

/**
 * POST /api/events
 * Create a new event (Admin only)
 */
router.post('/', authenticateAdmin, validateEventData, async (req, res) => {
  try {
    const { name, date, coverImage } = req.body;
    
    if (!name || !coverImage) {
      return res.status(400).json({ message: "Missing name or image" });
    }
    
    const newEvent = new Event({
      name,
      date,
      coverImage
    });
    
    const savedEvent = await newEvent.save();
    
    return res.status(201).json({
      success: true,
      data: savedEvent,
      message: 'Event created successfully'
    });
    
  } catch (error) {
    console.error('Error creating event:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create event'
    });
  }
});

/**
 * PUT /api/events/:eventId
 * Update an existing event (Admin only)
 */
router.put('/:eventId', authenticateAdmin, validateEventData, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { name, date, coverImage } = req.body;
    
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { name, date, coverImage },
      { new: true, runValidators: true }
    );
    
    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: updatedEvent,
      message: 'Event updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating event:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update event'
    });
  }
});

/**
 * DELETE /api/events/:eventId
 * Delete an event (Admin only)
 */
router.delete('/:eventId', authenticateAdmin, async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    
    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting event:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete event'
    });
  }
});

export default router; 