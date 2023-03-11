import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  try {
    const token =
      req.headers["authorization"] &&
      req.headers["authorization"].split(" ")[1]; // [0] -> Bearer , [1] -> Token
    if (!token) {
      return res.status(401).json({
        succeeded: false,
        error: "Missing user token.",
      });
    }
    //if token exists
    req.user = User.findById(jwt.verify(token, process.env.JWT_SECRET).userId); //because token is encrypted form of userId - tokenCreationDate - tokenExpirationDate
    next();
  } catch (error) {
    res.status(401).json({
      succeeded: false,
      error: "Not authorized (Invalid user token.)",
    });
  }
};

export { authenticateToken };
