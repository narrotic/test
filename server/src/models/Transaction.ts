// server/models/Transaction.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  sender: mongoose.Types.ObjectId;
  recipient: string;
  amount: number;
  date: Date;
}

const TransactionSchema: Schema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
