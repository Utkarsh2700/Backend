import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Defining a schema for video segements

// const SegmentSchema = new mongoose.Schema({
//   // url: {
//   //   type: String,
//   //   required: true,
//   // },
//   // duration: {
//   //   type: Number,
//   //   required: true,
//   // },
// });

const videoSchema = new mongoose.Schema(
  {
    videoFile: {
      type: String, //cloudnary url
      required: true,
    },
    thumbnail: {
      type: String, //cloudnaryUrl
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, //cloudnary
      required: true,
    },
    views: {
      type: String,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    segments: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
