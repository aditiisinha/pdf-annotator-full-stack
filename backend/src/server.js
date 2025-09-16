import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';

import authRoutes from '../routes/routes.js';
import pdfRoutes from '../routes/pdf.js';
import highlightRoutes from '../routes/highlightroute.js';

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded PDFs as static files
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/pdf', pdfRoutes);
app.use("/api/highlights", highlightRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`✅ Backend running on http://localhost:${port}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('📡 MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 MongoDB disconnected');
});
