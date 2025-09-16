import mongoose from "mongoose";

const highlightSchema = new mongoose.Schema({
  pdfUuid: { type: String, required: true }, // link to PDF
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pageNumber: { type: Number, required: true },
  text: { type: String, required: true },
  boundingBox: {
    x: Number,
    y: Number,
    width: Number,
    height: Number
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Highlight", highlightSchema);
