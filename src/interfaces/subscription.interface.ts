import { Document } from 'mongoose';

export interface Subscription extends Document {
    readonly name: string;
}