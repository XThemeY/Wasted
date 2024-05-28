import { Router } from 'express';
import { commentController } from '#api/v1/controllers/index.js';
import {
  commentsValidMiddleware,
  delResCommentValidMiddleware,
  editCommentValidMiddleware,
  isCommentOwner,
  roleMiddleware,
} from '#middleware/index.js';
import { ROLES } from '#config/index.js';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get(`/`, commentController.getMediaComments);
router.post(
  `/add`,
  //fileUploadValidation,
  commentsValidMiddleware(),
  commentController.addComment,
);
router.patch(
  `/update`,
  editCommentValidMiddleware(),
  isCommentOwner,
  roleMiddleware([ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER]),
  //fileUploadValidation,
  commentController.editComment,
);
router.delete(
  `/${idRegExp}`,
  delResCommentValidMiddleware(),
  isCommentOwner,
  roleMiddleware([ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER]),
  commentController.delComment,
);

router.patch(
  `/restore/${idRegExp}`,
  delResCommentValidMiddleware(),
  roleMiddleware([ROLES.ADMIN, ROLES.MODERATOR]),
  commentController.restoreComment,
);

router.post(`/${idRegExp}/reaction`, commentController.setReactionComment);

export default router;
