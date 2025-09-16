import mongoose from "mongoose";

const PdfSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  uuid: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Pdf", PdfSchema);
