import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_CLOUD_KEY, 
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        
        if(!localFilePath) return null
        //  upload file to cloudinary 
        const respose = await cloudinary.uploader.upload(localFilePath, {resource_type: "auto"})
        //  file uploaded succesfully 
        console.log(`uploaded file url ${respose.url}`)
        return respose
    
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the local save temp file 
        return null 
    }
    
    
}


cloudinary.v2.uploader.upload(
           'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', 
           {    public_id: 'shoes',},
           function(error, result) {console.log(result)});
