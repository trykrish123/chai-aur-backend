import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiRespones } from "../utils/ApiResponse.js"
import { use } from "react"


const genrateAccessAndRefreshTokens = async(UserId) => {
    try {
        const user = await User.findById(userId)
        const accesToken = user.genrateAccessToken()
        const refreshToken = user.genrateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforesave: false })
    
        return {accesToken, refreshToken}

    } catch (error) {
        throw new ApiError(404,"something went while genrating Access and refresh token")
    }
}

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

    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409 , "username and email already exist")
    }

    // const avatarLocalpath = req.files?.avatar[0]?.path
    // const coverImageLocalpath = req.files?.coverImage[0]?.path
    
    // if(!avatarLocalpath){
    //     throw new ApiError(400, "avatar image is reqiuired")
    // }

    // const avatar = await uploadOnCloudinary(avatarLocalpath)
    // const coverImage = await uploadOnCloudinary(coverImageLocalpath)

    // if(!avatar){
    //     throw new ApiError(400, "avatar image is reqiuired")
    // }

    const user = await User.create({
        fullname,
        // avatar: avatar.url || "", 
        // coverImage: coverImage.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refereshToken")

    if(!createdUser){
        throw new ApiError(500, "something went wrong while registering the user")

    }

    return res.status(201).json(
        new ApiRespones(200 , "user register succesfully ")
    )
})


const loginUser = asyncHandler (async (req, res) =>{
    // get email and password from frontend 
    // validation
    
    // req.body -> data 
    // username and email 
    // find the user 
    // password check 
    // access and refresh token 
    // send cookies 

    const {email, username, password} = req.body

    if(!username || !email ){
        throw new ApiError(400 , "username and email required ")
    }

    const user = User.findOne({$or:[{email},{username}]})

    if(!user){
        throw new ApiError(404, "user does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401 , "invalid user credentials ")
    }

    const {accesToken, refreshToken} = await genrateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken", accesToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(new ApiRespones(
            200, 
            {
                user: loggedInUser, accesToken, refreshToken 
            },
            "User logged in successfully "
        ) 
    )

})

const logoutUser = asyncHandler (async(req, res) =>{
    await User.findByIdAndUpdate(
        req.user._id, 
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const option = {
        httpOnly: true,
        secure: true 
    }

    return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiRespones(200, {}, "user loggedout succesfully "))


})
export { registerUser , loginUser, logoutUser}