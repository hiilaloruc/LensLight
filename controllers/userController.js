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
  const user = await User.findById({ _id: req.res.locals.user._id }).populate([
    "followers",
    "followings",
  ]);
  res.render("dashboard", {
    link: "dashboard",
    photos,
    user,
  });
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: res.locals.user._id } }); // $ne: not equal
    res.status(200).render("users", {
      users,
      link: "users",
    });
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};

const getAUser = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });

    const inFollowers = user.followers.some((follower) => {
      return follower.equals(res.locals.user._id);
    });

    const photos = await Photo.find({ user: user._id });
    res.status(200).render("user", {
      user,
      photos,
      link: "users",
      inFollowers,
    });
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};
const follow = async (req, res) => {
  try {
    //update the one who I followed
    let user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: { followers: res.locals.user._id },
      },
      { new: true } // return new version of user obj
    );
    user = await User.findByIdAndUpdate(
      //update my own following info as well
      { _id: res.locals.user._id },
      {
        $push: { followings: req.params.id },
      },
      { new: true }
    );
    res.status(200).redirect(`/users/${req.params.id}`);
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};

const unfollow = async (req, res) => {
  try {
    //update the one who I followed
    let user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $pull: { followers: res.locals.user._id },
      },
      { new: true } // return new version of user obj
    );
    user = await User.findByIdAndUpdate(
      //update my own following info as well
      { _id: res.locals.user._id },
      {
        $pull: { followings: req.params.id },
      },
      { new: true }
    );
    res.status(200).redirect(`/users/${req.params.id}`);
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};

export {
  createUser,
  loginUser,
  getDashboardPage,
  getAllUsers,
  getAUser,
  follow,
  unfollow,
};
