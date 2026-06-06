import { User } from "../models/User.js";
import { otpgenerator } from "../models/otpgenerator.js";
import { Profile } from "../models/Profile.js";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import jwt from "jsonwebtoken";
import mailSender from "../utils/mailsender.js";
import mongoose from "mongoose";

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    let otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    let result = await otpgenerator.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      result = await otpgenerator.findOne({ otp });
    }

    await otpgenerator.create({ email, otp });

    return res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending OTP",
    });
  }
};

const signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    if (
      [firstName, lastName, email, password, confirmPassword, accountType, otp].some(
        (element) => !element || element === ""
      )
    ) {
      return res.status(403).json({ success: false, message: "Please fill all entries" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and ConfirmPassword do not match",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    const recentOTP = await otpgenerator.findOne({ email }).sort({ createdAt: -1 });

    if (!recentOTP) {
    
      return res.status(400).json({ success: false, message: "OTP not found" });
    }

    if (recentOTP.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const approved = accountType !== "Instructor";

    const ProfileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      approved,
      additionalDetails: ProfileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

     
    user.password = undefined;

    return res.status(201).json({
      success: true,
      user,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Password is incorrect" });
    }

    const payload = { email: user.email, id: user.id, accountType: user.accountType };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

    user.token = token;
    user.password = undefined;

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    return res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user,
      message: "Logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Login failed, please try again" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(401).json({ success: false, message: "Please fill all entries" });
    }

    const user = await User.findById(new mongoose.Types.ObjectId(req.user.id));
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Old password is incorrect" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(401).json({ success: false, message: "Passwords do not match" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await mailSender(
      req.user.email,
      "Password changed successfully",
      "Your password has been changed. If this was not you, please alert us immediately."
    );

    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Could not change the password" });
  }
};

export { login, signUp, sendOTP, changePassword };