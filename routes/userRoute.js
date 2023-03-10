import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.route("/register").post(userController.createUser); //triggers -> POST request came to localhost/users/register
router.route("/login").post(userController.loginUser); //triggers -> POST request came to localhost/users/login
export default router;
