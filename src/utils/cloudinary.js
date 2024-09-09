import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null; // we can also return as message such as could not find the localFilePath
    //upload the file on cloudinary

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfully
    // console.log("File is uploaded on cloudinary", response.url);
    // console.log(response);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // if file is not uploaded from our local server to cloudinary then also we will remove this mallicious file from our server
    fs.unlinkSync(localFilePath); // remove the locally uploaded file as the upload operation failed
    return null;
  }
};

const deleteVideoFromCloudinary = async (publicUri) => {
  try {
    if (!publicUri) return null;
    const response = await cloudinary.uploader.destroy(publicUri, {
      resource_type: "video",
    });
    console.log("File deleted from Cloudinary:", publicUri);
    return response;
  } catch (error) {
    console.error("Error while deleting video from Cloudinary", error);
  }
};

const deleteThumbnailFromCloudinary = async (publicUri) => {
  try {
    if (!publicUri) return null;
    const response = await cloudinary.uploader.destroy(publicUri, {
      resource_type: "image",
    });
    console.log("File deleted from Cloudinary:", publicUri);
    return response;
  } catch (error) {
    console.error("Error while deleting video from Cloudinary", error);
  }
};
export {
  uploadOnCloudinary,
  deleteVideoFromCloudinary,
  deleteThumbnailFromCloudinary,
};

// import { v2 as cloudinary } from 'cloudinary';

// (async function() {

//     // Configuration
//     cloudinary.config({
//         cloud_name: 'cloud_name',
//         api_key: '<your_api_key>',
//         api_secret: '<your_api_secret>' // Click 'View Credentials' below to copy your API secret
//     });

//     // Upload an image
//      const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });

//     console.log(uploadResult);

//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });

//     console.log(optimizeUrl);

//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });

//     console.log(autoCropUrl);
// })();
