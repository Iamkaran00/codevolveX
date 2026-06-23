import { Schema, mongoose } from "mongoose";
import mailSender from "../utils/mailsender.js";
import otpTemplate from "../mail/templates/emailVerificationTemplate.js";

const otpSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 15000,
  },
});
 
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from codevolveX",
      otpTemplate(otp)
    )
  } catch (error) {
    console.log("error occurred while sending mails")
    console.error(error)
  }
}
otpSchema.pre("save", async function (next) {

  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});
export const otpgenerator = mongoose.model("otp", otpSchema);
