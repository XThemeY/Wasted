import { Router } from 'express';
import { commentController } from '#api/v1/controllers/index.js';
import {
  commentsValidMiddleware,
  delResCommentValidMiddleware,
  editCommentValidMiddleware,
  allCommentsValidMiddleware,
  commentReactionsValidMiddleware,
  isCommentOwner,
  roleMiddleware,
  authMiddleware,
} from '#middleware/index.js';
import { ROLES } from '#config/index.js';

const router = Router();
const idRegExp = ':id(\\d+)';

router.get(
  `/`,
  allCommentsValidMiddleware(),
  commentController.getMediaComments,
);
router.post(
  `/`,
  //fileUploadValidation,
  authMiddleware,
  commentsValidMiddleware(),
  commentController.addComment,
);
router.patch(
  `/${idRegExp}`,
  authMiddleware,
  editCommentValidMiddleware(),
  isCommentOwner,
  roleMiddleware([ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER]),
  //fileUploadValidation,
  commentController.editComment,
);
router.delete(
  `/${idRegExp}`,
  authMiddleware,
  delResCommentValidMiddleware(),
  isCommentOwner,
  roleMiddleware([ROLES.ADMIN, ROLES.MODERATOR, ROLES.USER]),
  commentController.delComment,
);

router.patch(
  `/${idRegExp}/restore`,
  authMiddleware,
  delResCommentValidMiddleware(),
  isCommentOwner,
  roleMiddleware([ROLES.ADMIN, ROLES.MODERATOR]),
  commentController.restoreComment,
);

router.post(
  `/${idRegExp}/reactions`,
  authMiddleware,
  commentReactionsValidMiddleware(),
  commentController.setReactionComment,
);

export default router;
