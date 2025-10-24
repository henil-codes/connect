import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

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
app.use(cookieParser())

/* IMPORT ROUTES */
import authRouter from "./routes/auth.js";
// import userRouter from "./src/routes/users.js";

/* ROUTES DEFINITION */
app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.send("Hello, server is working!");
});


export default app;