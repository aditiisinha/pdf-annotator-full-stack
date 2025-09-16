import express from "express";
import Highlight from "../models/Highlight.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * Create a highlight
 */
router.post("/:pdfUuid", verifyToken, async (req, res) => {
  try {
    const { pdfUuid } = req.params;
    const { pageNumber, text, boundingBox } = req.body;

    const highlight = new Highlight({
      pdfUuid,
      user: req.user.id,
      pageNumber,
      text,
      boundingBox
    });

    await highlight.save();
    res.json(highlight);
  } catch (err) {
    console.error("Highlight create error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Get highlights for a PDF
 */
router.get("/:pdfUuid", verifyToken, async (req, res) => {
  try {
    const { pdfUuid } = req.params;
    const highlights = await Highlight.find({ pdfUuid, user: req.user.id });
    res.json(highlights);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Update a highlight
 */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const highlight = await Highlight.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!highlight) {
      return res.status(404).json({ message: "Highlight not found" });
    }
    res.json(highlight);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Delete a highlight
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const highlight = await Highlight.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!highlight) {
      return res.status(404).json({ message: "Highlight not found" });
    }
    res.json({ message: "Highlight deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
