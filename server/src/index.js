import express from "express";
import dotenv from "dotenv";
import path from "path";
import app from "./app.js";
import { fileURLToPath } from "url";
import connect from "./utils/conn.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.listen(process.env.PORT || 6001, () => {
  console.log(`Server Port: ${process.env.PORT || 6001}`);
});

/* CONNECT TO MONGOOSE */
connect();