import express from "express";
import dotenv from "dotenv";
import conn from "./db.js";
import cookieParser from "cookie-parser";
import pageRoute from "./routes/pageRoute.js";
import photoRoute from "./routes/photoRoute.js";
import userRoute from "./routes/userRoute.js";
import { checkUser } from "./middlewares/authMiddleware.js";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
//Nodejs Web application consists of a "request and response" loop...

dotenv.config();
//cloudinary settings
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//connect to DATABASE
conn();

const app = express();
const port = process.env.PORT;

//ejs template engine
app.set("view engine", "ejs");

//static files middleware(arayazılım)
app.use(express.static("public"));
app.use(express.json()); //post requests can be separated and read in the req body
app.use(express.urlencoded({ extended: true })); //To read the data from the form
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true })); //when the file is uploading, it creates a temporary file

//routes the urls : use(in both post and get requests)
app.use("*", checkUser); //in all get methods call checkUser function
app.use("/", pageRoute);
app.use("/photos", photoRoute);
app.use("/users", userRoute);

app.listen(port, () => {
  console.log(`app listening on port : ${port}`);
});
//nodemon plugin: no need to reset the server to see the changes -> npm install -D nodemon
