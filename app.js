import express from "express";

const app = express();
const port = 3000;

//Nodejs Web application consists of a "request and response" loop...
app.get("/", (req, res) => {
  res.send("Hello nodeJsss! :)");
});

app.listen(port, () => {
  console.log(`app listening on port : ${port}`);
});
//nodemon plugin: no need to reset the server to see the changes -> npm install -D nodemon
