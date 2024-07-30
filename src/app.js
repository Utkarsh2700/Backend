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

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import

// routes are imported like this only in the middle

import userRouter from "./routes/user.routes.js";

// we can give any name to our import in case export default only

//routes declaration
// we cant use app.get for routes now because earlier we were writing router and controller togather talking about the freecodeCamp type approach

// Since things are being separated so we need to use middleware for this function like app.use()

app.use("/api/v1/users", userRouter);

// now controll is given to router file 4th line
// now url will look like ("http://localhost:8000/api/v1/users/register")
// after /users we will go to /register

export { app };
