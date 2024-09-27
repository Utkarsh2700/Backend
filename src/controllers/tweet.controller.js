import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.model.js";

const createTweet = asyncHandler(async (req, res) => {
  // TODO: create tweet
  // get the content from body
  // get the userId
  // make sure content is not empty
  // create the tweet

  const { content } = req.body;
  const userId = req.user?._id;
  if (content.trim().length === 0) {
    throw new ApiError(400, "Content cannot be Empty");
  }
  const tweet = await Tweet.create({
    content,
    owner: userId,
  });
  if (!tweet) {
    throw new ApiError(500, "Error while adding the tweet");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet Added Successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get User Tweet
  const { userId } = req.params;
  // get the userId
  // use match operator to find all the tweets by user
  // lookup to get username and avatar
  const userTweets = await Tweet.aggregate([
    {
      $match: {
        owner: mongoose.Types.ObjectId.createFromHexString(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "user_details",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        user_details: {
          $arrayElemAt: ["$user_details", 0],
        },
      },
    },
  ]);
  if (!userTweets) {
    throw new ApiError(500, "Error While Fetching the User Tweets`");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, userTweets, "User Tweets Fetched Successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  // TODO: update tweet
  const { tweetId } = req.params;
  const { content } = req.body;
  const updateTweet = await Tweet.findById(tweetId);
  if (!updateTweet) {
    throw new ApiError(404, "Tweet Not Found");
  }
  const tweetToUpdate = await Tweet.findByIdAndUpdate(tweetId, { content });
  if (!tweetToUpdate) {
    throw new ApiError(500, "Unable to Update Tweet");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tweetToUpdate, "Tweet Updated Successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  // TODO: delete tweet
  const { tweetId } = req.params;
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not Found");
  }
  const tweetToDelete = await Tweet.findByIdAndDelete(tweetId);
  if (!tweetToDelete) {
    throw new ApiError(500, "Error while deleting tweet");
  }
  return res.status(200, {}, "Tweet Deleted Successfully");
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
