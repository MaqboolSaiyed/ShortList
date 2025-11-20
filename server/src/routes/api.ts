import express from 'express';
import { upload, analyzeResume, chatWithResume } from '../controllers/resumeController';

const router = express.Router();

router.post('/analyze', upload.single('resume'), analyzeResume);
router.post('/chat', chatWithResume);

export default router;
