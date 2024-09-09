import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.params;
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
  //TODO: get video, upload on cloudinary, create video
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
