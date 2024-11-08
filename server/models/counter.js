import { Schema, model } from 'mongoose';

const counterSchema = new Schema({
    _id: { type: String },
    lastReportId: { type: Number, default: 0 },
});

export default model('Counter', counterSchema);
