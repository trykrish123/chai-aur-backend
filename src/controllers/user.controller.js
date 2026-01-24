import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"

const registerUser = asyncHandler (async (req, res) =>{
    
    // get user details from frontend 
    // validation -- not empty
    // check if user already exist : username, email 

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

    
})

export { registerUser }