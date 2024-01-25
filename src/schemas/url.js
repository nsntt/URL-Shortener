import mongoose from "mongoose";

export const urlSchema = new mongoose.Schema({
    to: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    personalized_link: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    created_by: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    deleted: {
        type: mongoose.SchemaTypes.Boolean,
        default: false
    },
    date: Date
});