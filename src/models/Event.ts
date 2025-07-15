import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  _id: string;
  name: string;
  date: string;
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
EventSchema.index({ date: -1 });
EventSchema.index({ name: 1 });

export default mongoose.model<IEvent>('Event', EventSchema); 