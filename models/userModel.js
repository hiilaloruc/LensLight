import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    //Schema = table
    username: {
      type: String,
      required: [true, "Username should be provided."],
      lowercase: true,
      validate: [
        validator.isAlphanumeric,
        "Special characters are not allowed for username.",
      ],
    },
    email: {
      type: String,
      required: [true, "Email should be provided."],
      unique: true,
      validate: [validator.isEmail, "Invalid email address."],
    },
    password: {
      type: String,
      required: [true, "Password should be provided."],
      minLength: [4, "Minimum password length is 4."],
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, //mongodb automatically adds createdAt and updatedAt
  }
);

userSchema.pre("save", function (next) {
  const user = this;
  console.log("user password 1: ", user.password);
  bcrypt.hash(user.password, 10, (err, hash) => {
    user.password = hash;
    console.log("user password 2: ", user.password);
    next();
  });
});

const User = mongoose.model("User", userSchema);
export default User;
