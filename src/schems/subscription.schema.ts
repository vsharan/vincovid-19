import * as mongoose from 'mongoose';

export const SubscriptionSchema = new mongoose.Schema({
    email: String
})