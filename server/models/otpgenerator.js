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
    expires: 5 * 60 * 1000,
  },
});
//function -> to send emails
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from studyNotion",
      otpTemplate(otp)
    )
      .then(() => {
        console.log("Mail sent successfully");
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(email);
    console.log("otp send successfully at email", mailResponse);
  } catch (error) {
    console.log("error occured while sending mails");
    console.error(error);
  }
}
otpSchema.pre("save", async function (next) {
  //Only send an email when an new document is created

  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});
export const otpgenerator = mongoose.model("otp", otpSchema);
