import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription
  // get the channel which is to be toggled from params
  // get the details regarding whether channel is already subscribed or not
  // check if the the channelId is valid or not

  const { subscribed } = req.query;
  const isChannelValid = await User.findById(channelId);
  if (!isChannelValid) {
    throw new ApiError(404, "Channel Not Found");
  }
  let result;
  if (subscribed === "true") {
    result = await Subscription.deleteOne({
      channel: channelId,
      subscriber: req.user?._id,
    });
    console.log(result);
  } else {
    result = await Subscription.create({
      channel: channelId,
      subscriber: req.user?._id,
    });
  }
  if (!result) {
    throw new ApiError(500, "Error while toggling the subscription status");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        subscribed === "true"
          ? "Channel Unsubscribed Successfully"
          : "Channel Subscribed Successfully"
      )
    );
});
// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: return subscribers list
  // check if the channel is Valid
  // match the channelId with channel
  const isChannelValid = await User.findById(channelId);
  if (!isChannelValid) {
    throw new ApiError(404, "Channel Not Found");
  }
  const channelSubscribers = await Subscription.aggregate([
    {
      $match: {
        channel: channelId,
      },
    },
  ]);
  if (!channelSubscribers) {
    throw new ApiError(500, "Error while fetching channel Subscribers");
  }
  const subscriberCount = channelSubscribers.length;
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscriberCount,
        "Subscriber Count fetched Successfully"
      )
    );
});

// controller to return channel lsit to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: return subscribed channels
  // check if the channel is valid
  // match the chnnels where subscriber matches channelId
  const isValidUser = await User.findById(channelId);
  if (!isValidUser) {
    throw new ApiError(404, "Subscriber Not Found");
  }
  const subscribedChannels = await Subscription.aggregate([
    {
      $match: {
        subscriber: channelId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
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
  if (!subscribedChannels) {
    throw new ApiError(500, "Error while fetching subscribed channel");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribedChannels,
        "All subscribed channels fetched successfully"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
