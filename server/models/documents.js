import { Schema, model } from "mongoose";

const docSchema = new Schema(
  {
    filepath: { type: String },
    filename: { type: String },
    reportid: { type: Schema.Types.ObjectId, ref: "Report" },
    content: { type: String },
  },
  { timestamps: true }
);

export default model("Document", docSchema);
