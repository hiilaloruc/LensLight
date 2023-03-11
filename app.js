import express from "express";
import dotenv from "dotenv";
import conn from "./db.js";
import cookieParser from "cookie-parser";
import pageRoute from "./routes/pageRoute.js";
import photoRoute from "./routes/photoRoute.js";
import userRoute from "./routes/userRoute.js";
import { checkUser } from "./middlewares/authMiddleware.js";
//Nodejs Web application consists of a "request and response" loop...

dotenv.config();
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

//routes the urls
app.get("*", checkUser); //in all get methods call checkUser function
app.use("/", pageRoute);
app.use("/photos", photoRoute);
app.use("/users", userRoute);

app.listen(port, () => {
  console.log(`app listening on port : ${port}`);
});
//nodemon plugin: no need to reset the server to see the changes -> npm install -D nodemon
