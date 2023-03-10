import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Photo from "../models/photoModel.js";
//create new photoBox object

const createUser = async (req, res) => {
  try {
    console.log("User Create Request Body: ", req.body);
    const user = await User.create(req.body);
    //res.redirect("/login");
    res.status(201).json({ user: user._id });
  } catch (error) {
    let errorsArr = {};
    if (error.code === 11000) {
      // same email exists
      errorsArr.email = "Email already registered.";
    }
    if (error.name === "ValidationError") {
      Object.keys(error.errors).forEach((key) => {
        errorsArr[key] = error.errors[key].message;
      });
    }
    console.log(errorsArr);
    res.status(400).json(errorsArr);
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
      //res.status(200).send("You have successfully logged in!");
      /*res.status(200).json({
        user,
        token: createToken(user._id),
      });*/
      const token = createToken(user._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // a day
      });
      res.redirect("/users/dashboard");
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

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const getDashboardPage = async (req, res) => {
  const photos = await Photo.find({ user: res.locals.user._id });
  res.render("dashboard", {
    link: "dashboard",
    photos,
  });
};

export { createUser, loginUser, getDashboardPage };
