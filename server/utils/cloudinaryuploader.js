import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises"; // Use promise-based fs methods
import dotenv from "dotenv";

dotenv.config({
  path: './.env',
});

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload function
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      throw new Error("File path is missing");
    }

    // Check if file exists
    await fs.access(localFilePath);

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Automatically handles images, videos, etc.
    });

    // Clean up the local file after successful upload
    await fs.unlink(localFilePath);

    console.log("File uploaded successfully:", response.secure_url);
    return response; // Return the Cloudinary response object
  } catch (error) {
    console.error("Error during file upload:", error.message);

    // Clean up the local file if it exists
    try {
      await fs.unlink(localFilePath);
    } catch (cleanupError) {
      console.error("Error during cleanup:", cleanupError.message);
    }

    return {
      success: false,
      message: error.message,
    };
  }
};

export { uploadOnCloudinary };
