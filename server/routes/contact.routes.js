import express from "express";
const router = express.Router()
import contactUsController from "../controller/contactus.controller"

router.post("/contact-us", contactUsController)

export default router;