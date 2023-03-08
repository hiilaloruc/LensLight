import express from "express";
import dotenv from "dotenv";
import conn from "./db.js";
import pageRoute from "./routes/pageRoute.js";
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

//routes the urls
app.use("/", pageRoute);

app.listen(port, () => {
  console.log(`app listening on port : ${port}`);
});
//nodemon plugin: no need to reset the server to see the changes -> npm install -D nodemon
