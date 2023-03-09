import express from "express";
import * as PageController from "../controllers/pageController.js";

const router = express.Router();

router.route("/").get(PageController.getIndexPage);
router.route("/about").get(PageController.getAboutPage);
router.route("/register").get(PageController.getRegisterPage);

export default router;
