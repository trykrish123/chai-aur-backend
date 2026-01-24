import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


const userSchema = new Schema(
    {
        username: {
            type: String,
            require: true,
            unique: true,
            lowerCase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            require: true,
            unique: true,
            lowerCase: true,
            trim: true,
        },
        fullname: {
            type: String,
            require: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, //cloudinary 
            require: true,
        },
        coverImage: {
            type: String, //cloudinary
        },
        watchHistory: [
            {
                type: Schema.type.ObjectId,
                ref: "video"
            }
        ],
        password:{
            type: String,
            require: [true ,"password is requred"]
        },
        refereshToken: {
            type: String
        }
        

    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next()
    
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function name(password) {
    return  await bcrypt.compare(password , this.password)
}

userSchema.methods.genrateAccessToken = async function name(params) {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            password: this.password,
            fullname: this.fullname,
        },process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.genrateRefreshToken = async function name(params) {
    return jwt.sign(
        {
            _id: this._id,
        },process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)