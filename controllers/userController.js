import User from "../models/userModel.js";
import bcrypt from "bcrypt";
//create new photoBox object

const createUser = async (req, res) => {
  try {
    console.log("User Create Request Body: ", req.body);
    const user = await User.create(req.body);
    res.status(201).json({
      succeeded: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log("User Login Request Body: ", req.body);

    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    let same = false;

    if (user) {
      same = await bcrypt.compare(password, user.password); //user.password is hashed version on db
    } else {
      return res.status(401).json({
        //return: because if no user exists why to check password ??
        succeeded: false,
        error: "No user found for this username.",
      });
    }

    if (same) {
      //successfully logged in
      res.status(200).send("You have successfully logged in!");
    } else {
      //wrong password
      res.status(401).json({
        succeeded: false,
        error: "Invalid password..",
      });
    }
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};

export { createUser, loginUser };
