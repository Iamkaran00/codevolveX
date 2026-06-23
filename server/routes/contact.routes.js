import express from "express";
const router = express.Router()
import contactUsController from "../controller/contactus.js"

router.post("/contact-us", contactUsController)

export default router;