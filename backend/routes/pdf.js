import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import Pdf from "../models/Pdf.js"; // create this model
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({ storage });

// Upload PDF
router.post("/upload", verifyToken, upload.single("pdf"), async (req, res) => {
  try {
    const newPdf = new Pdf({
      userId: req.user.id,
      filename: req.file.originalname,
      filepath: req.file.path,
      uuid: path.parse(req.file.filename).name,
    });

    await newPdf.save();
    res.status(201).json({ message: "PDF uploaded", pdf: newPdf });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// List PDFs
router.get("/", verifyToken, async (req, res) => {
  try {
    const pdfs = await Pdf.find({ userId: req.user.id });
    res.json(pdfs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
