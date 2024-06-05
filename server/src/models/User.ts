// server/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    balance: number;
    date: Date;
}

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<IUser>('User', UserSchema);
