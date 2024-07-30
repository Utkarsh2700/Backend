import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend  (present in req.body || url)
  // validation (like user has send correct usename i.e. not null || "" , email is in correct format etc.) not empty
  // check if user already exits: username, email
  // check for images, check for avatar
  // upload them to cloudinary, check if avatar is uploaded on cloudinary or not
  // create user object-create entry in DB
  // remove password and refresh token field from response so that front-end does not transfer it to user by mistake
  // check for user creation
  // return response (if user is created else return error)

  const { username, fullname, email, password } = req.body;
  console.log("req.body: ", req.body);
  console.log("email: ", email);
  //   console.log("username: ", username);
  //   console.log("fullname: ", fullname);
  console.log("password: ", password);

  //   if(fullname === ""){
  //     throw new ApiError(400, "fullname is required")
  //   }

  // we can use multiple if like this to verify other fields also or we can use the following method

  if (
    [fullname, email, username, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  if (!email.includes("@")) {
    throw new ApiError(400, "Please enter a valid email");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exits");
  }
  console.log("existedUser", existedUser);

  // multer gives us access to req.files just like  express gives us req.body

  const avatarLocalPath = req.files?.avatar[0]?.path();
  //   localPath becausse fill is still on our server it hasn't beem uploaded on cloudinary yet
  const coverImageLocalPath = req.files?.coverImage[0]?.path();

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  console.log(req.files);

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering a user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

export { registerUser };
