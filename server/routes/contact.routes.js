import express from "express";
const router = express.Router()
import contactUsController from "../controller/Contactus.js";

router.post("/contact", contactUsController)

export default router;