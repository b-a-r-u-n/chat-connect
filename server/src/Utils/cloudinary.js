import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath)
            return null;
        const uploadResult = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto",
            quality: "auto:low",  // Automatically reduces quality to a low level
            format: "webp",       // Converts the image to WebP for better compression
            transformation: [
                { fetch_format: "auto", quality: "auto:low" }  // Ensures better optimization
            ]
        })
        fs.unlinkSync(localFilePath);
        
        return uploadResult;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}

const deleteFromCloudinary = async (url) => {
    try {
        if(!url)
            return null;
        const publicId = url.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
        // return result;
    } catch (error) {
        console.log(error);      
        return null;
    }
}

export {uploadOnCloudinary, deleteFromCloudinary}