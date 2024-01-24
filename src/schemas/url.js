import mongoose from "mongoose";

export const urlSchema = new mongoose.Schema({
    to: {
        type: String,
        required: true
    },
    created_by: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    date: Date
});