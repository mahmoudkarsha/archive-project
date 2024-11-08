import { Schema, model } from 'mongoose';

const treeSchema = new Schema(
    {
        path: { type: String },
        reports: [{ type: Schema.Types.ObjectId, ref: 'Report' }],
    },
    { timestamps: true }
);

export default model('Tree', treeSchema);
