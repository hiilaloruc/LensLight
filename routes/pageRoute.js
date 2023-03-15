import express from "express";
import * as PageController from "../controllers/pageController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(PageController.getIndexPage);
router.route("/about").get(PageController.getAboutPage);
router.route("/register").get(PageController.getRegisterPage);
router.route("/login").get(PageController.getLoginPage);
router.route("/logout").get(PageController.getLogout);
router.route("/contact").get(PageController.getContact);
router.route("/contact").post(PageController.sendMail);

export default router;
