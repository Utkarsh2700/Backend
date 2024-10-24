import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use("/public", express.static("public"));
// app.use(express.static("public"));
app.use(cookieParser());

//routes import

// routes are imported like this only in the middle

import userRouter from "./routes/user.routes.js";
import healthCheckRouter from "./routes/healthcheck.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

// we can give any name to our import in case export default only

//routes declaration
// we cant use app.get for routes now because earlier we were writing router and controller togather talking about the freecodeCamp type approach

// Since things are being separated so we need to use middleware for this function like app.use()

app.use("/api/v1/users", userRouter);
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// now controll is given to router file 4th line
// now url will look like ("http://localhost:8000/api/v1/users/register")
// after /users we will go to /register

export { app };
