import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  // TODO: get all comments on a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const comments = await Comment.find({ video: videoId });
  console.log("comments", comments);

  if (comments.length === 0) {
    // throw new ApiError(404, "No comments on video yet");
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No comments on this video yet"));
  }
  let allComments;
  try {
    allComments = await Comment.aggregate([
      {
        $match: {
          video: new mongoose.Types.ObjectId(videoId),
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
                avatar: 1,
                username: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "owner",
          foreignField: "likedBy",
          as: "likes",
          pipeline: [
            {
              $match: {
                comment: { $exists: true },
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
      {
        $addFields: {
          likes: { $size: "$likes" },
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: parseInt(limit),
      },
    ]);
  } catch (error) {
    throw new ApiError(500, "Error while fetching comments");
  }
  if (!allComments) {
    throw new ApiError(200, "No Comments on this video yet");
  }
  // If there is any error then we need to remove AggregatePaginate
  // const result = await Comment.aggregatePaginate(allComments, { page, limit });
  return (
    res
      .status(200)
      // .json(new ApiResponse(200, result, "All Comments fetched Successfully"));
      .json(
        new ApiResponse(200, allComments, "All Comments fetched Successfully")
      )
  );
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { content } = req.body;
  const { videoId } = req.params;
  const isVideoValid = await Video.findById(videoId);
  if (content.length < 1 || content.trim() == "") {
    throw new ApiError(400, "Comment Content cannot be empty");
  }
  if (!isVideoValid) {
    throw new ApiError(400, "Invalid VideoId");
  }
  const userId = req.user?._id;
  console.log("req.user?._id = ", req.user?._id);
  const result = await Comment.create({
    content,
    video: videoId,
    owner: userId,
  });
  if (!result) {
    throw new ApiError(500, "Error while posting comment");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, result, "Comment posted Successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  // What is the difference between using findById and then updating and using findByIdAndUpdate
  const { commentId } = req.param;
  const { content } = req.body;

  if (content.length < 1 || content.trim() == "") {
    throw new ApiError(400, "Comment Content cannot be empty");
  }

  const commentToUpdate = await Comment.findByIdAndUpdate(
    commentId,
    {
      content,
    },
    { new: true }
  );
  if (!commentToUpdate) {
    throw new ApiError(500, "Error while updating the comment");
  }

  return res.status(201, commentToUpdate, "Comment Updated Successfully");
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  const commentTodDelete = await Comment.findByIdAndDelete(commentId);
  if (!commentTodDelete) {
    throw new ApiError(409, "Comment has already been Deleted");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment has been deleted Successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
