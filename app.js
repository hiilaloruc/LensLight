import express from "express";

const app = express();
const port = 3000;

//ejs template engine
app.set("view engine", "ejs");

//static files middleware(arayazılım)
app.use(express.static("public"));

//Nodejs Web application consists of a "request and response" loop...
app.get("/", (req, res) => {
  //res.send("Hello nodeJs! :)");
  res.render("index");
});
app.get("/about", (req, res) => {
  //res.send("Hello nodeJs! :)");
  res.render("about");
});

app.listen(port, () => {
  console.log(`app listening on port : ${port}`);
});
//nodemon plugin: no need to reset the server to see the changes -> npm install -D nodemon
