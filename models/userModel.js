import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    //Schema = table
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
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
