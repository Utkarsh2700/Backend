import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// todo ask chat-gpt about the condtion when we store files in memoryStorage using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  // FILE WITH UNIQUE NAME AND SMALL SEGMENTS
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname));
  },
});
// COMMENTING SINCE WE WANT TO SEND THE FILE IN SEGMENTS AND HAVE UNIQUE NAME FOR EACH SEGMENT

//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//     console.log(file);
//     // todo console.log this file to see what is in the output or read the official documentation
//     // saving file as orignalname is not a good practice because if user uploads multiple file with same name then files will be overwitten
//     // TODO : so after finishing the project then revisit and give files unique name
//   },

// This is multer configuration
export const upload = multer({
  storage,
});

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, '/tmp/my-uploads')
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.fieldname + '-' + uniqueSuffix)
//     }
//   })

//   const upload = multer({ storage: storage })
