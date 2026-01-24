import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiRespones } from "../utils/ApiResponse.js"

const registerUser = asyncHandler (async (req, res) =>{
    
    // get user details from frontend 
    // validation -- not empty
    // check if user already exist : username, email 
    // check for images , check for avatar 
    // upload them on cloudingary  , avatar 
    // create user object - create in db
    // remove password and referesh token from response 
    // check for user creation 
    // return res 


    const {username, email, fullname, password } = req.body
    console.log(email);

    if([username, email, fullname, password].some((filed) => filed?.trim()=== "" )){
        throw new ApiError(404, "all fields are required")
    }

    const existedUser = User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409 , "username and email already exist")
    }

    const avatarLocalpath = req.files?.avatar[0]?.path
    const coverImageLocalpath = req.files?.coverImage[0]?.path
    
    if(!avatarLocalpath){
        throw new ApiError(400, "avatar image is reqiuired")
    }

    const avatar = await uploadOnCloudinary(avatarLocalpath)
    const coverImage = await uploadOnCloudinary(coverImageLocalpath)

    if(!avatar){
        throw new ApiError(400, "avatar image is reqiuired")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refereshToken")

    if(!createdUser){
        throw new ApiError(500, "something went wrong while registering the user")

    }

    return res.status(200).json(
        new ApiRespones(200 , "user register succesfully ")
    )
})

export { registerUser }