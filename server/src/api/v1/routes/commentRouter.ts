import { Router } from 'express';
import { commentController } from '#api/v1/controllers/index.js';
import {
  fileUploadValidation,
  isCommentOwner,
  commentsFormValidation,
  roleMiddleware,
} from '#middleware/index.js';
import { ROLES } from '#config/index.js';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get(`/`, commentController.getComments);
router.post(
  `/`,
  fileUploadValidation,
  commentsFormValidation,
  commentController.addComment,
);
router.patch(
  `/${idRegExp}`,
  isCommentOwner,
  roleMiddleware([ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER]),
  fileUploadValidation,
  commentsFormValidation,
  commentController.editComment,
);
router.delete(
  `/${idRegExp}`,
  isCommentOwner,
  roleMiddleware([ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER]),
  commentController.delComment,
);

router.patch(
  `/restore/${idRegExp}`,
  roleMiddleware([ROLES.ADMIN, ROLES.MODERATOR]),
  commentController.restoreComment,
);

router.post(`/${idRegExp}/reaction`, commentController.setReactionComment);

export default router;
