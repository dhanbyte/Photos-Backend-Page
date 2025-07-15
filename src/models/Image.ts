import mongoose, { Schema, Document } from 'mongoose';

export interface IImage extends Document {
  fileId: string;
  fileName: string;
  filePath: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  fileType: string;
  width?: number;
  height?: number;
  tags: string[];
  customMetadata?: Record<string, any>;
  isPrivateFile: boolean;
  uploadedAt: Date;
  updatedAt: Date;
}

const ImageSchema: Schema = new Schema({
  fileId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  size: {
    type: Number,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  },
  tags: [{
    type: String,
    trim: true
  }],
  customMetadata: {
    type: Schema.Types.Mixed
  },
  isPrivateFile: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: 'uploadedAt', updatedAt: 'updatedAt' }
});

// Create indexes for better query performance
ImageSchema.index({ uploadedAt: -1 });
ImageSchema.index({ tags: 1 });
ImageSchema.index({ fileType: 1 });

export default mongoose.model<IImage>('Image', ImageSchema); 