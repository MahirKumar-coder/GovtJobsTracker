import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscriber extends Document {
  email: string;
  jobId?: mongoose.Types.ObjectId;
  reminderType: 'last_date' | 'weekly_newsletter';
  isSent: boolean;
  createdAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
    reminderType: {
      type: String,
      enum: ['last_date', 'weekly_newsletter'],
      default: 'last_date',
    },
    isSent: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Subscriber = mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);
