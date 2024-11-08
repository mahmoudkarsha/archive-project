import mongoose, { Schema, model } from 'mongoose';

const reportsSchema = new Schema(
    {
        autoId: { type: Number },
        subject: { type: String },
        note: { type: String },
        date: { type: Date },
        path: { type: mongoose.Schema.Types.ObjectId, ref: 'Tree' },
        number: { type: String, unique: true },
        documentFiles: [{ type: Object }],
        photoFiles: [{ type: Object }],
        videoFiles: [{ type: Object }],
        compressedFiles: [{ type: Object }],
        audioFiles: [{ type: Object }],
    },
    { timestamps: true }
);

export default model('Report', reportsSchema);
