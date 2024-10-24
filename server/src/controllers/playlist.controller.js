import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  // TODO: createPlaylist
  // get playlist name and description
  // get userId and add it as owner
  // verify that description and name is not empty
  const userId = req.user?._id;
  if ([name, description].some((field) => field.trim() === "")) {
    throw new ApiError(
      400,
      "Please provide all the fields name and descripton cannot be null or empty"
    );
  }
  const playlist = await Playlist.create({
    name,
    description,
    owner: userId,
  });
  if (!playlist) {
    throw new ApiError(500, "Error while creating a Playlist");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist created Successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  // TODO: get user playlists
  // get the userId from the params
  // check if the user exists
  // use aggregation pipeline to match the userId
  // then lookup to user
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User Not Found");
  }
  const userPlaylist = await Playlist.aggregate([
    {
      $match: {
        owner: mongoose.Types.ObjectId("66aa330326b79e6974d8cab1"),
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        videos: 1,
        owner: 1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "result",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
              coverImage: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        // result: {
        //   $first:"$result"
        // }
        result: {
          $arrayElemAt: ["$result", 0],
        },
      },
    },
  ]);
  if (!userPlaylist) {
    throw new ApiError(404, "No playlist found for the User");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, userPlaylist, "User Playlist fetched Successfully")
    );
});
const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: get playlist by id
  // get the playlistId from params
  // check if playlistId is valid or not
  //
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "No Playlist Found with the given Id ");
  }
  const playlistById = await Playlist.aggregate([
    {
      $match: {
        _id: ObjectId("66ed61235c1f71d49804230b"),
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
          $first: "$user_details",
        },
      },
    },
  ]);
  if (!playlistById) {
    throw new ApiError(500, "Error while fetching the playlist");
  }
  return res
    .status(200)
    .json(200, playlistById, "Playlist fetched Successfully");
});
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: add video to playlist
  const playlist = await Playlist.findById(playlistId);
  const video = await Playlist.findById(videoId);
  if (!playlist) {
    throw new ApiError(404, "Playlist Not Found");
  }
  if (!video) {
    throw new ApiError(404, "Video Not Found");
  }
  const addedVideo = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $push: {
        videos: videoId,
      },
    },
    {
      new: true,
    }
  );
  if (!addedVideo) {
    throw new ApiError(500, "Error while adding Video`");
  }
  const updatedPlaylist = await Playlist.findById(playlistId);
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { addedVideo, updatedPlaylist },
        "Video Added to playlist Successfully"
      )
    );
});
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
});
const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist Not Found");
  }
  const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);
  if (!deletedPlaylist) {
    throw new ApiError(500, "Error while deleting the playlist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted Successfully"));
});
const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  // TODO: update playlist
  // get the playlistId from params
  // get the name and description from body
  // check if the the name and description are non-empty
  // find  the playlist byIdAnd update the playlist
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist Not Found");
  }
  if ([name, description].some((field) => field.trim() === "")) {
    throw new ApiError(400, "Name and Descripiton cannot be null or empty");
  }
  const playlistToUpdate = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        name,
        description,
      },
    },
    {
      new: true,
    }
  );
  if (!playlistToUpdate) {
    throw new ApiError(500, "Error while updating the playlist");
  }
  // Will have to compare and see the difference between the third and second database call.Maybe removing third db call will help increase the performance without any side-effects
  const updatedPlaylist = await Playlist.findById(playlistId);
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "Playlist Updated Successfully")
    );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
