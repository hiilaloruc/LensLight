import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  try {
    //const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1]; // [0] -> Bearer , [1] -> Token
    const token = req.cookies.jwt;

    if (!token) {
      /*return res.status(401).json({
        succeeded: false,
        error: "Missing user token.",
      });*/
      res.redirect("/login");
    } else {
      // token is encrypted form of userId - tokenCreationDate - tokenExpirationDate
      jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) {
          console.log(err.message);
          res.redirect("/login");
        } else {
          next(); //no problem
        }
      });
    }
  } catch (error) {
    res.status(401).json({
      succeeded: false,
      error: "Not authorized (Invalid user token.)",
    });
  }
};

export { authenticateToken };
