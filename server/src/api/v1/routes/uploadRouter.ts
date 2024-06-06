import { Router } from 'express';
import { uploadController } from '#api/v1/controllers/index.js';
import { authMiddleware } from '#middleware/index.js';

const router = Router();

router.post('/', authMiddleware, uploadController.uploadFile);

export default router;
