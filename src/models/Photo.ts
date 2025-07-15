import mongoose, { Schema, Document } from 'mongoose';

export interface IPhoto extends Document {
  _id: string;
  imageUrl: string;
  uploadedAt: string;
  eventId: string;
  state: string;
  url?: string; // alias for imageUrl used in some frontend calls
  date?: string; // alias for uploadedAt used in some frontend calls
}

const PhotoSchema: Schema = new Schema({
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    trim: true
  },
  uploadedAt: {
    type: String,
    required: true
  },
  date: {
    type: String
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    index: true
  },
  state: {
    type: String,
    required: true,
    trim: true,
    index: true
  }
}, {
  timestamps: true
});

// Create compound indexes for better query performance
PhotoSchema.index({ eventId: 1, state: 1 });
PhotoSchema.index({ uploadedAt: -1 });

// Virtual to handle both imageUrl and url fields
PhotoSchema.virtual('displayUrl').get(function() {
  return this.imageUrl || this.url;
});

export default mongoose.model<IPhoto>('Photo', PhotoSchema); 