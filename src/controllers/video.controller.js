import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO : get all videos based on query, sort, pagination
  if (!query || query.trim() === "") {
    throw new ApiError(404, "Please provide a valid query");
  }
  const sortCriteria = {};
  sortCriteria[sortBy] = sortType === "desc" ? -1 : 1;
  let videos;
  if (!userId) {
    videos = await Video.aggregate([
      {
        $match: {
          title: {
            $regex: query,
            $options: "i",
          },
        },
      },
      {
        $sort: sortCriteria,
      },
      {
        $skip: limit * (page - 1),
      },
      {
        $limit: parseInt(limit),
      },
    ]);
  } else {
    videos = await Video.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
          title: { $regex: query, $options: "i" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "details",
          pipeline: [
            {
              $project: {
                fullName: 1,
                avatar: 1,
                username: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          details: {
            $first: "$details",
          },
        },
      },
      {
        $sort: sortCriteria,
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: parseInt(limit),
      },
    ]);
  }
  if (!videos || videos.length == 0) {
    return new ApiError(404, "No videos with such query parameters");
  }

  const result = await Video.aggregatePaginate(videos, { page, limit });
  return res
    .status(200)
    .json(new ApiResponse(200, result, "All videos fetched Successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  console.log(req.body);

  //TODO: get video, upload on cloudinary, create video
  // get details from frontend
  //verify the details
  // check for thumbnail and video
  // upload thumbnail and video to cloudinary verfy if both have been uploaded
  // get duration from the cloudinary and store it so it can be added to db
  // create a video entry in db
  // check if the video has been uploaded sucessfully or not
  // return response

  if ([title, description].some((item) => item.trim === "")) {
    throw new ApiError(
      400,
      "Please provide proper title and description they cannot be null or empty"
    );
  }

  // to upload thumbnail and video we need access to multer so we can get req.files to upload both the thumbnail and video

  const thumbnailLocalPath = req?.files?.thumbnail[0]?.path;
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbanil is required");
  }

  const videoFileLocalPath = req?.files?.videoFile[0]?.path;
  if (!videoFileLocalPath) {
    throw new ApiError(400, "Video file is required");
  }
  console.log("Files from Video upload (req.files) ", req.files);

  let thumbnail;
  let videoFile;

  try {
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    videoFile = await uploadOnCloudinary(videoFileLocalPath);
  } catch (error) {
    throw new ApiError(500, "Error uploading files to Cloudinary");
  }

  console.table([thumbnail, videoFile]);

  if (!thumbnail || !videoFile) {
    throw new ApiError(400, "Please upload thumbnail and video again");
  }

  const duration = videoFile?.duration;

  const video = await Video.create({
    title,
    description,
    thumbnail: thumbnail?.url,
    videoFile: videoFile?.url,
    duration,
    isPublished: true,
  });

  const uploadedVideo = await Video.findById(video._id);

  return res
    .status(201)
    .json(new ApiResponse(201, uploadedVideo, "Video uploaded sucessfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // TODO: update video details like title description, thunbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
