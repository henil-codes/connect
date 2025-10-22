import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register, login } from "./controllers/auth.js";
import connect from "./utils/conn.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.listen(process.env.PORT || 6001, () => {
  console.log(`Server Port: ${process.env.PORT || 6001}`);
});

/* CONNECT TO MONGOOSE */
connect();

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES */

app.get("/", (req, res) => {
  res.json({"message" : "Server is running"});
})

// app.use("/auth", authRoutes);
// app.use("/users", userRoutes);

//route for registration and upload the registration image to multer
app.post("/auth/register", upload.single("picture"), register);
app.post("/auth/login", login);