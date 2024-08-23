import { Router } from "express";
import {
  getAllVideos,
  deleteVideo,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller";
import { verifyJWT } from "../middlewares/auth.middlewarejs";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/")
  .get(getAllVideos)
  .post(
    upload.fields([
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thunbnail",
        maxCount: 1,
      },
    ]),
    publishAVideo
  );
router
  .route("/:videoId")
  .get(getVideoById)
  .delete(deleteVideo)
  .patch(upload.single("thunbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default Router;
