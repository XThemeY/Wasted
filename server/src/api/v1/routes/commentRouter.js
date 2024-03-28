import { Router } from 'express';
import { commentController } from '#apiV1/controllers/index.js';
import { commentsUploadValidation } from '#apiV1/middleware/index.js';

const router = Router({ mergeParams: true });
const idRegExp = ':id(\\d+)';

router.get(`/`, commentController.getComments);
router.post(`/`, commentsUploadValidation, commentController.addComment);
router.patch(`/`, commentController.editComment);
router.delete(`/`, commentController.delComment);
router.post(`/${idRegExp}/reaction`, commentController.setReactionComment);

export default router;
