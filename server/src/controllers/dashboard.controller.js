import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel Stats like total video views, total subscribers, total videos, total likes, etc.
  // get userId from req.user
  // then aggregation pipelines

  const userId = req.user._id;
  // console.log(req.user);

  // console.log("userId", userId);

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User Not Found");
  }
  const channelStats = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "owner",
        as: "video_details",
        pipeline: [
          {
            $group: {
              _id: null,
              views: { $sum: "$views" },
            },
          },
          {
            $project: {
              _id: 0,
              views: "$views",
            },
          },
        ],
      },
    },
    {
      $addFields: {
        video_details: {
          $arrayElemAt: ["$video_details", 0],
        },
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers_details",
      },
    },
    {
      $addFields: {
        subscribers_details: { $size: "$subscribers_details" },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "owner",
        as: "total_videos",
      },
    },
    {
      $addFields: {
        total_videos: { $size: "$total_videos" },
      },
    },
    // to add total likes
  ]);
  if (!channelStats) {
    throw new ApiError(500, "Error while fetching the Channel Stats");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, channelStats, "Channels Stats fetched Successfully")
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User Not Found");
  }
  const channelVideos = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        avatar: 1,
        coverImage: 1,
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "owner",
        as: "userVideos",
      },
    },
  ]);
});

export { getChannelStats, getChannelVideos };
