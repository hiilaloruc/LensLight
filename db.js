import mongoose from "mongoose";

const conn = () => {
  mongoose
    .connect(process.env.DB_URI, {
      dbName: "lenslight",
      useNewUrlParser: true,
      //useUnifinedTopology: true,
    })
    .then(() => {
      console.log("Connected to lenslight successfully! :)");
    })
    .catch((err) => {
      console.log(`Error occured while connecting to DB : ${err} `);
    });
};

export default conn;
