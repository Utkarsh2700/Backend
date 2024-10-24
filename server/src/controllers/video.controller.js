import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteVideoFromCloudinary,
  deleteImageFromCloudinary,
  uploadM3OnCloudinary,
  uploadTsOnCloudinary,
} from "../utils/cloudinary.js";

import { v4 as uuidv4 } from "uuid";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { stderr, stdout } from "process";

import { fileURLToPath } from "url";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  // console.log("req", req);

  console.log("req.query", req.query);

  if (!query || query.trim() === "") {
    // throw new ApiError(404, "Please provide a valid query");// removed this as we need to show some videos to user who just logged in
    const videos = await Video.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner_details",
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
          owner_details: {
            $arrayElemAt: ["$owner_details", 0],
          },
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: parseInt(limit),
      },
    ]);
    if (!videos) {
      throw new ApiError(500, "Error while fetching videos");
    }
    // const result = await Video.aggregatePaginate(videos, { page, limit });
    return res
      .status(200)
      .json(new ApiResponse(200, videos, "All Video Fetched Successfully"));
  }

  //TODO : get all videos based on query, sort, pagination

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
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "userDetails",
          pipeline: [
            {
              $project: {
                fullName: 1,
                username: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          userDetails: {
            $first: "$userDetails",
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

  // const result = await Video.aggregatePaginate(videos, { page, limit });
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "All videos fetched Successfully"));
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

  let thumbnail;

  if ([title, description].some((item) => item.trim === "")) {
    throw new ApiError(
      400,
      "Please provide proper title and description they cannot be null or empty"
    );
  }

  // to upload thumbnail and video we need access to multer so we can get req.files to upload both the thumbnail and video

  const thumbnailLocalPath = req?.files?.thumbnail[0]?.path;
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
  }

  const videoFileLocalPath = req?.files?.videoFile[0]?.path;
  if (!videoFileLocalPath) {
    throw new ApiError(400, "Video file is required");
  }
  console.log(req.files);

  // Get the current file path and directory
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // generating unique ID for filenames
  const videoId = uuidv4();
  // const hlsOutputDir = `../public/temp/uploads/${videoId}`;
  const hlsOutputDir = path.join(__dirname, `../../public/temp/${videoId}`);
  if (!fs.existsSync(hlsOutputDir)) {
    fs.mkdirSync(hlsOutputDir, { recursive: true });
  }

  // FFMPEG command to generate HLS(m3u8 and .ts file)
  // const hlsFilePath = `${hlsOutputDir}/output.m3u8`;
  const hlsFilePath = path.join(hlsOutputDir, "output.m3u8");
  console.log("hlsFilePath", hlsFilePath);
  // The following command is the meat part

  const outputPath = `./public/temp/${videoId}`;
  const hlsPath = `${outputPath}/output.m3u8`;

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  console.log("hlsPath", hlsPath);

  const ffmpegCommand = `ffmpeg -i ${videoFileLocalPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

  const calculateHlsDuration = (m3u8FilePath) => {
    const fileContent = fs.readFileSync(m3u8FilePath, "utf-8");
    const durationLines = fileContent
      .split("\n")
      .filter((line) => line.startsWith("#EXTINF"));

    const totalDuration = durationLines.reduce((sum, line) => {
      const duration = parseFloat(
        line.replace("#EXTINF:", "").replace(",", "")
      );
      return sum + duration;
    }, 0);
    return totalDuration;
  };

  exec(ffmpegCommand, async (error, stderr, stdout) => {
    if (error) {
      // throw new ApiError(500, `Error converting video to HLS: ${error}`);
      console.log("exec error:", error);
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);

    try {
      // Uploading the HLS .m3u8 and .ts file to cloudinary
      const hlsFiles = fs.readdirSync(hlsOutputDir);

      console.log("hlsFiles", hlsFiles);

      const m3File = hlsFiles.filter((file) => file.endsWith(".m3u8"));

      console.log("m3File", m3File);

      const hlsDuration = calculateHlsDuration(hlsPath);

      console.log("hlsDuration", hlsDuration);

      const cloudinaryM3 = await uploadM3OnCloudinary(
        `public/temp/${videoId}/${m3File.toString()}`
      );

      console.log("cloudinaryM3", cloudinaryM3);

      // const tsFile = hlsFiles.filter((file) => file.endsWith(".ts"));

      // console.log("tsFile", tsFile);

      // COMMENTING FOR TESTING PURPOSE
      // const cloudinaryUploads = await Promise.all(
      //   hlsFiles.map((file) =>
      //     uploadOnCloudinary(path.join(hlsOutputDir, file))
      //   )
      // );

      const cloudinaryUploads = await Promise.all(
        hlsFiles
          .filter((file) => file.endsWith(".ts")) // Only upload .ts files
          .map((file) => uploadTsOnCloudinary(path.join(hlsOutputDir, file)))
      );

      console.log("Cloudinary uploads:", cloudinaryUploads);

      // COMMENTING FOR TESTING PURPOSE
      const playlist = cloudinaryUploads.filter((segment) => segment !== null);

      // console.log("playlist", playlist);

      // calculating total video duration

      // COMMENTING FOR TESTING PURPOSE
      const totalDuration = playlist.reduce((sum, segement) => {
        return sum + (segement.duration || 0);
      }, 0);

      console.log("totalDuration", totalDuration);

      // COMMENTING FOR TESTING PURPOSE
      // const playlistFile = playlist.find((file) =>
      //   file.playback_url.endsWith(".m3u8")
      // );
      const tsFiles = playlist.filter((file) => file.url.endsWith(".ts"));
      // console.log("playlistFile", playlistFile);
      // console.log("tsFiles", tsFiles);

      const segments = tsFiles.map((file) => file.secure_url);

      if (tsFiles.length === 0) {
        console.error("Failed to upload HLS files:", playlist);
        throw new ApiError(500, "Error while uploading files to Cloudinary");
      }
      // Upload thumbnail to Cloudinary
      thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

      const owner = req.user?._id;

      const video = await Video.create({
        title,
        description,
        thumbnail: thumbnail.url,
        videoFile: cloudinaryM3.secure_url,
        duration: hlsDuration,
        isPublished: true,
        segments,
        owner,
      });
      const result = await Video.aggregate([
        {
          $match: {
            title: title,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "UserDetails",
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
            UserDetails: {
              $arrayElemAt: ["$UserDetails", 0],
            },
          },
        },
      ]);
      return res
        .status(201)
        .json(new ApiResponse(201, result, "Video Uploaded Successfully"));
    } catch (uploadError) {
      console.log("UploadError", uploadError);
      throw new ApiError(
        500,
        `Error while uploading HLS files to cloudinary ${uploadError}`
      );
    }
  });

  // let videoFile;

  // try {
  //   thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  //   videoFile = await uploadOnCloudinary(videoFileLocalPath);
  // } catch (error) {
  //   throw new ApiError(500, "Error uploading files to Cloudinary");
  // }

  // console.log("thumbnail = ", thumbnail);
  // console.log("videoFile = ", videoFile);

  // if (!thumbnail || !videoFile) {
  //   throw new ApiError(400, "Please upload thumbnail and video again");
  // }

  // const duration = videoFile?.duration;
  // console.log("duration = ", duration);

  // const owner = req.user?._id;
  // console.log("owner = ", owner);

  // const video = await Video.create({
  //   title,
  //   description,
  //   thumbnail: thumbnail?.url,
  //   videoFile: videoFile?.url,
  //   duration,
  //   isPublished: true,
  //   owner,
  // });

  // const uploadedVideo = await Video.findById(video._id);
  // if (!updateVideo) {
  //   throw new ApiError(500, "Error while uploading the video");
  // }

  // return res
  //   .status(201)
  //   .json(new ApiResponse(201, uploadedVideo, "Video uploaded sucessfully"));
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

  const result = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              password: 0,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        ownerDetails: {
          $first: "$ownerDetails",
        },
      },
    },
  ]);

  const videoData = result[0];

  return res
    .status(200)
    .json(new ApiResponse(200, videoData, "Video found Successfully"));
  //
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // TODO: update video details like title description, thunbnail
  // get details from frontend
  // for the details like title and description are things are fair and simple just chnage the respective fields in the database
  // for thumbnail/video for now we will just upload the new thumbnail/video on cloudinary and update the url but in future we will upload new and delete old files
  const { title, description } = req.body;
  // using .every function to find if all the fields are empty
  // returns boolean based on if all elements pass the condition or not

  // const updateFields = {};
  // if (title) updateFields.title = title;
  // if (description) updateFields.description = description;

  let updatedThumbnail;
  let updatedVideoFile;

  console.log("req.files", req.files);
  if (req.files?.thumbnail[0] || req.files?.videoFile[0]) {
    const video = await Video.findById(videoId);
    // console.log("video =", video);

    if (req.files?.thumbnail[0]) {
      const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
      if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is missing please upload");
      }
      updatedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

      if (!updatedThumbnail.url) {
        throw new ApiError(400, "Error while uploading thumbnail");
      }

      if (video.thumbnail) {
        await deleteImageFromCloudinary(video.thumbnail);
      }

      // updateFields.thumbnail = updatedThumbnail.url;
    }

    // req?.files?.videoFile[0]?.path;
    if (req.files?.videoFile[0]) {
      const videoFileLocalPath = req.files?.videoFile[0]?.path;
      if (!videoFileLocalPath) {
        throw new ApiError(400, "videoFile is missing please upload");
      }
      updatedVideoFile = await uploadOnCloudinary(videoFileLocalPath);

      if (!updatedVideoFile.url) {
        throw new ApiError(400, "Error while uploading videoFile");
      }
      if (video.videoFile) {
        await deleteVideoFromCloudinary(video.videoFile);
      }
      // updateFields.videoFile = updatedVideoFile.url;
    }
  }
  const duration = updatedVideoFile.duration;

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: updatedThumbnail.url,
        videoFile: updatedVideoFile.url,
        duration,
      },
    },
    {
      new: true,
    }
  );
  if (!updatedVideo) {
    throw new ApiError(500, "Error while updating the video");
  }
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
  if (videoToDelete.thumbnail)
    await deleteImageFromCloudinary(videoToDelete.thumbnail);
  if (videoToDelete.thumbnail)
    await deleteVideoFromCloudinary(videoToDelete.videoFile);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video has been deleted Successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // get details from frontend
  // find the  video by id
  // toggle the status
  // save the changes

  const video = await Video.findById(videoId);
  // console.log("video =", video);

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
