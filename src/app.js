import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/main.routes.js";
import http from "http";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createTransporter } from "./utils/mailer.js";
import { jobs } from "./jobs/main.js";

// Required for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class App {
  constructor() {
    createTransporter()
    this.app = express();
    this.app.use(express.json());
    this.http = new http.Server(this.app);
    this.PORT = process.env.PORT || 8000;
    this.initMiddleware();
    this.connectToMongoDB();
    this.initRoutes();
  }

  initMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    dotenv.config();
  }

  connectToMongoDB() {
    const db = process.env.MONGODB_URI;
    mongoose.connect(
      db
    ).then((result)=>{
      console.log("database successfully connected");
      jobs.activateAll();
    }).catch((err)=>{
      console.log(err)
      console.log("An error starting database occurred");
    });
  }

  initRoutes() {
    const publicPath = path.join(__dirname, "..", "public");
    this.app.use(express.static(publicPath));
    this.app.use("/", router);
  }

  createServer() {
    this.http.listen(this.PORT, () => {
      console.log("Server started at port 8000");
    });
  }
}