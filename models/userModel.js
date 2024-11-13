const mongoose = require("mongoose")


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    unit: {
        type: String,
        required: true
    },
    verificationCode: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    forgotPassword: {
        type: String
    },
    role: {
        type: String,
        enum: ["admin", "employee"],
        default: "employee"
    }
}, {timestamps: true}, {strict: true} )


const User = mongoose.model("User", userSchema)

module.exports = User