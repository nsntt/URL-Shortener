import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    username: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    nick: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    password: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    urls: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Url'
    }],
    banned: {
        type: mongoose.SchemaTypes.Boolean,
        default: false
    },
    deleted: {
        type: mongoose.SchemaTypes.Boolean,
        default: false
    },
    date: mongoose.SchemaTypes.Date
});
