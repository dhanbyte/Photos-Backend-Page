import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

/**
 * Validate ImageKit authentication request
 */
export const validateImageKitRequest = (req: Request, res: Response, next: NextFunction): void => {
  // Basic validation - you can add more specific validation as needed
  const schema = Joi.object({
    // Add any query parameters or body validation here if needed
  });

  const { error } = schema.validate(req.query);
  
  if (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid request parameters',
      details: error.details.map(detail => detail.message)
    });
    return;
  }
  
  next();
};

/**
 * Validate event data
 */
export const validateEventData = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    date: Joi.string().required(),
    coverImage: Joi.string().uri().optional()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid event data',
      details: error.details.map((detail: any) => detail.message)
    });
    return;
  }
  
  next();
};

/**
 * Validate state data
 */
export const validateStateData = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    eventId: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid state data',
      details: error.details.map((detail: any) => detail.message)
    });
    return;
  }
  
  next();
};

/**
 * Validate photo data
 */
export const validatePhotoData = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    eventId: Joi.string().required(),
    state: Joi.string().required(),
    imageUrl: Joi.string().uri().optional(),
    url: Joi.string().uri().optional(),
    uploadedAt: Joi.string().optional(),
    date: Joi.string().optional()
  }).or('imageUrl', 'url'); // At least one of imageUrl or url must be present

  const { error } = schema.validate(req.body);
  
  if (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid photo data',
      details: error.details.map((detail: any) => detail.message)
    });
    return;
  }
  
  next();
};

/**
 * Validate file upload metadata (optional)
 */
export const validateFileMetadata = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    fileName: Joi.string().optional(),
    folder: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    customMetadata: Joi.object().optional()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid file metadata',
      details: error.details.map((detail: any) => detail.message)
    });
    return;
  }
  
  next();
}; 