import multer from "multer";

// todo ask chat-gpt about the condtion when we store files in memoryStorage using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    console.log(file);
    // todo console.log this file to see what is in the output or read the official documentation
    // saving file as orignalname is not a good practice because if user uploads multiple file with same name then files will be overwitten
    // TODO : so after finishing the project then revisit and give files unique name
  },
});

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
