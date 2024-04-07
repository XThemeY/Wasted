import { Router } from 'express';
import { commentController } from '#apiV1/controllers/index.js';
import {
  fileUploadValidation,
  isCommentOwner,
  commentsFormValidation,
  roleMiddleware,
} from '#apiV1/middleware/index.js';
import { ROLES } from '#apiV1/config/index.js';

const router = Router({ mergeParams: true });
const idRegExp = ':id(\\d+)';

router.get(`/`, commentController.getComments);
router.post(
  `/`,
  fileUploadValidation,
  commentsFormValidation,
  commentController.addComment,
);
router.patch(
  `/`,
  isCommentOwner,
  fileUploadValidation,
  commentsFormValidation,
  commentController.editComment,
);
router.delete(
  `/`,
  isCommentOwner,
  roleMiddleware([ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER]),
  commentController.delComment,
);
router.post(`/${idRegExp}/reaction`, commentController.setReactionComment);

export default router;
