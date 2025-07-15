import mongoose, { Schema, Document } from 'mongoose';

export interface IState extends Document {
  _id: string;
  name: string;
  eventId: string;
  createdAt: Date;
  updatedAt: Date;
}

const StateSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Create compound index for better query performance
StateSchema.index({ eventId: 1, name: 1 });

export default mongoose.model<IState>('State', StateSchema); 