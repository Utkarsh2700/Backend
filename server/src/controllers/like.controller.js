import mongoose, { isValidObjectId, Mongoose } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;
  // TODO: toggle like on video
  // get user id from req.user
  // check if the video Exists or not
  // check if the user has already liked the video
  // If like exists remove it
  // If no like exists, add new like
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video Not Found");
  }
  const existingLike = await Like.findOne({ video: videoId, likedBy: userId });
  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Like removed from video"));
  } else {
    const newLike = await Like.create({
      video: videoId,
      likedBy: userId,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, newLike, "Video Liked Successfully"));
  }
});
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  // TODO: toggle like on comment
  // get commentId
  // get userId
  // if comment does not exist then throw error
  // check if user has already liked the comment
  // If like exist then remove it
  // If like does not exist add new like
  const userId = req.user?._id;
  const comment = Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment Not Found");
  }
  const existingComment = await Comment.findOne({
    comment: commentId,
    likedBy: userId,
  });
  if (existingComment) {
    await Like.findByIdAndDelete(existingComment._id);
    return res
      .status(200)
      .json(
        new ApiResponse(200, {}, "Like removed from Commment Successfully")
      );
  } else {
    const newLike = await Like.create({
      comment: commentId,
      likedBy: userId,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, newLike, "Commmet Liked Successfully"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  // TODO: toggle like on tweet
  // get tweetId
  // get userId
  // Check if tweet exist or not
  // Check if tweet has already been like or not
  // if tweet is already liked then remove the like
  // if tweet is not liked then add like to tweet
  const userId = req.user?._id;
  const tweetToToggle = await Tweet.findById(tweetId);
  if (!tweetToToggle) {
    throw new ApiError(404, "Tweet Not Found");
  }
  const existingTweet = await Tweet.findOne({
    tweet: tweetId,
    likedBy: userId,
  });
  if (existingTweet) {
    await Like.findByIdAndDelete(existingTweet._id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Like removed from Tweet Successfully"));
  } else {
    const newLike = await Like.create({
      tweet: tweetId,
      likedBy: userId,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, newLike, "Like added to Tweet Successfully"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  // TODO: get all liked videos
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User Not Found");
  }
  const likedVideos = await Like.aggregate([
    {
      $match: {
        $and: [
          { likedBy: new mongoose.Types.ObjectId(userId) },
          { video: { $exists: true } },
        ],
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "liked_videos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "likedBy",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    avatar: 1,
                    fullname: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $arrayElemAt: ["$owner", 0],
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        liked_videos: {
          $arrayElemAt: ["$liked_videos", 0],
        },
      },
    },
  ]);
  if (!likedVideos) {
    throw new ApiError(401, "No Liked Videos By User");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        likedVideos,
        likedVideos.length === 0
          ? "No Liked Videos By User"
          : "Videos liked by Logged In User fetched Successfully"
      )
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
