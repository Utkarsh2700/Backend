import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  // TODO: create tweet
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: create tweet
  const { userId } = req.params;
});

const updateTweet = asyncHandler(async (req, res) => {
  // TODO: create tweet
  const { tweetId } = req.params;
});

const deleteTweet = asyncHandler(async (req, res) => {
  // TODO: create tweet
  const { tweetId } = req.params;
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
