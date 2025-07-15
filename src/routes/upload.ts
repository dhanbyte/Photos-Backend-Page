import express from 'express';
import multer from 'multer';
import imagekit from '../config/imagekit';
import { authenticateAdmin } from '../middleware/auth';

const router = express.Router();

// Configure multer for file upload handling
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

/**
 * POST /api/upload
 * Upload a file to ImageKit
 */
router.post('/', authenticateAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: '/gallery-uploads/',
      useUniqueFileName: true,
      responseFields: 'url,fileId,name,size,filePath,height,width'
    });

    // Return the file URL that frontend expects
    return res.status(200).json({
      success: true,
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      name: uploadResponse.name,
      size: uploadResponse.size,
      filePath: uploadResponse.filePath,
      width: uploadResponse.width,
      height: uploadResponse.height,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload file'
    });
  }
});

/**
 * POST /api/upload/multiple
 * Upload multiple files to ImageKit
 */
router.post('/multiple', authenticateAdmin, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files provided'
      });
    }

    // Upload all files to ImageKit
    const uploadPromises = req.files.map((file) =>
      imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: '/gallery-uploads/',
        useUniqueFileName: true,
        responseFields: 'url,fileId,name,size,filePath,height,width'
      })
    );

    const uploadResults = await Promise.all(uploadPromises);

    return res.status(200).json({
      success: true,
      files: uploadResults.map(result => ({
        url: result.url,
        fileId: result.fileId,
        name: result.name,
        size: result.size,
        filePath: result.filePath,
        width: result.width,
        height: result.height
      })),
      message: 'Files uploaded successfully'
    });

  } catch (error) {
    console.error('Error uploading files:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload files'
    });
  }
});

export default router; 