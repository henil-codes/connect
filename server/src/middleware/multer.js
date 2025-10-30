import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

<<<<<<< Updated upstream
export const upload = multer({ storage });
=======
export const upload = multer({ storage });
>>>>>>> Stashed changes
