import express from "express";
const router = express.Router()
import contactUsController from "../controller/Contactus.js";

router.post("/contact-us", contactUsController)

export default router;