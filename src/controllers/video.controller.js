import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteVideoFromCloudinary,
  deleteThumbnailFromCloudinary,
} from "../utils/cloudinary.js";

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
  // console.log("Files from Video upload (req.files) ", req.files);

  let thumbnail;
  let videoFile;

  try {
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    videoFile = await uploadOnCloudinary(videoFileLocalPath);
  } catch (error) {
    throw new ApiError(500, "Error uploading files to Cloudinary");
  }

  console.log("thumbnail = ", thumbnail);
  console.log("videoFile = ", videoFile);

  if (!thumbnail || !videoFile) {
    throw new ApiError(400, "Please upload thumbnail and video again");
  }

  const duration = videoFile?.duration;
  console.log("duration = ", duration);

  const owner = req.user?._id;
  console.log("owner = ", owner);

  const video = await Video.create({
    title,
    description,
    thumbnail: thumbnail?.url,
    videoFile: videoFile?.url,
    duration,
    isPublished: true,
    owner,
  });

  const uploadedVideo = await Video.findById(video._id);
  if (!updateVideo) {
    throw new ApiError(500, "Error while uploading the video");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, uploadedVideo, "Video uploaded sucessfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // TODO: get video by id
  // get details from frontend
  // find the video using findById match
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "No video found with the given id");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video found Successfully"));
  //
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // TODO: update video details like title description, thunbnail
  // get details from frontend
  // for the details like title and description are things are fair and simple just chnage the respective fields in the database
  // for thumbanil/video for now we will just upload the new thumbanil/video on cloudinary and update the url but in future we will upload new and delete old files
  const { title, description } = req.body;
  // using .every function to find if all the fields are empty
  // returns boolean based on if all elements pass the condition or not

  const updateFields = {};
  if (title) updateFields.title = title;
  if (description) updateFields.description = description;

  if (req.files?.thumbnail?.[0] || req.files?.videoFile?.[0]) {
    const video = await Video.findById(videoId);

    if (req.files?.thumbnail?.[0]) {
      const thumbnailLocalPath = req.files?.thumbanil[0]?.path;
      if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is missing please upload");
      }
      const updatedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

      if (!updatedThumbnail.url) {
        throw new ApiError(400, "Error while uploading thumbnail");
      }

      if (video.thumbnail) {
        await deleteThumbnailFromCloudinary(video.thumbnail);
      }

      updateFields.thumbnail = updatedThumbnail.url;
    }
    if (req.files?.videoFile?.[0]) {
      const videoFileLocalPath = req.files?.videoFile[0]?.path;
      if (!videoFileLocalPath) {
        throw new ApiError(400, "videoFile is missing please upload");
      }
      const updatedVideoFile = uploadOnCloudinary(videoFileLocalPath);

      if (!updatedVideoFile.url) {
        throw new ApiError(400, "Error while uploading videoFile");
      }
      if (video.videoFile) {
        await deleteVideoFromCloudinary(video.videoFile);
      }
      updateFields.videoFile = updatedVideoFile.url;
    }
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    req.video?._id,
    {
      $set: { updateFields },
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated Successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // TODO: delete video
  // get details from frontend
  // findByIdandDelete the video
  // remove the video file from cloudinary
  // remove the thumbnail from cloudinary
  const videoToDelete = await Video.findByIdAndDelete(videoId);
  if (!videoToDelete) {
    throw new ApiError(409, "Video has been already deleted");
  }
  if (videoToDelete.thumbanil)
    await deleteThumbnailFromCloudinary(videoToDelete.thumbanil);
  if (videoToDelete.thumbanil)
    await deleteVideoFromCloudinary(videoToDelete.videoFile);
  return res
    .status(200)
    .josn(new ApiResponse(200, {}, "Video has been deleted Successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // get details from frontend
  // find the  video by id
  // toggle the status
  // save the changes

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "No video found with the given id");
  }
  video.isPublished = !video.isPublished;
  await video.save();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Publish status has been toggled"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
