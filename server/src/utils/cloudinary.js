import { v2 } from "cloudinary";
import fs from "fs";

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// uploads a file to Cloudinary and returns the URL
const uploadToCloudinary = async (filePath) => {
    try {
        if(!filePath) return null;

        const result = await v2.uploader.upload(filePath, { resource_type: "auto" });
        console.log("Cloudinary upload result:", result.secure_url);

        return result.secure_url;
    } catch (error) {
        fs.unlinkSync(filePath); // Delete the local file in case of error
        console.error("Error uploading to Cloudinary:", error);
        return null;   
    }
};

export { uploadToCloudinary };