import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadImage = async (imageString) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(imageString, {
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

export default cloudinary;
