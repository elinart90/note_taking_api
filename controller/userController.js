const User = require('../models/userModel')
const comparePassword = require('../utilities/comparePassword')
const generateCode = require('../utilities/generateCode')
const generateToken = require('../utilities/generateToken')
const hashPassword = require('../utilities/hashPassword')
const sendEmail = require("../utilities/sendEmail")


//*Sing up
const signup = async (req, res, next) => {
    try {
        const { name, email, password, unit } = req.body

        //*Check if email already exist 
        const isEmailExist = await User.findOne({ email })
        if(isEmailExist) {
            return res.status(400).json({
                message: "Email already Exist"
            })
        }

        //* Creating a strong password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
        if (!passwordRegex.test(password)) {
            res.status(400).json({
                message: "Password must be at least 6 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character."
            });
            return;
        }
        
        const hashedPassword = await hashPassword(password)

        //* Create the new user and hash password
        const newUser = new User({ name, email, unit,password:hashedPassword})
        await newUser.save()

        //*Send a successful message after siging up
        res.status(200).json({
            code: 200,
            status: true,
            message: "User registered successfully"
        })
        
    } catch (error) {
        next(error)
    }
}


const signin = async(req, res, next) =>{
    try {
        const { email, password } = req.body

        //*Find user by email
        const user = await User.findOne({ email })
        if(!user) {
            return res.status(401).json({
                code: 401,
                status: false,
                message: "Invalid credentials"
            })
        }

        //*Validate password
        const isPasswordValid = await comparePassword(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({
                code: 401,
                status: false,
                message: "Invalide credentials"
            })
        }

        //* Generate jwt
        const token = generateToken(user)

        res.status(200).json({
            code: 200,
            status: true,
            message: 'User sign in successfully',
            token
        })
        
    } catch (error) {
        next(error)
    }
}


const verify = async (req, res, next) => {
    try {
        const { email } = req.body;

        //* Check email 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        //* Check if user is already verified
        if (user.isVerified) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        //* Generate code
        const code = generateCode(6);
        user.verificationCode = code;
        await user.save();

        //* Send Email
        await sendEmail({
            emailTo: user.email,
            subject: "Email verification code",
            code,
            content: "Verify your account"
        });

        //* Send a successful message
        res.status(200).json({
            code: 200,
            status: true,
            message: "User verification code sent successfully"
        });
        
    } catch (error) {
        next(error);
    }
};



const verifyUserCode = async(req, res, next) =>{
    try {
        const { code, email } = req.body

        //*Find user by email
        const user = await User.findOne({ email })
        if(!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }

        //* check if the verification code matches
        if(user.verificationCode !== code) {
            return res.status(400).json({
                message: "Invalid code"
            })
        }

        //*Mark the user as verified and save
        user.isVerified = true
        user.verificationCode = null
        await user.save()

        //* Send success response 
        res.status(200).json({
            code: 200,
            status: true,
            message: 'Verification successful'
        })
        
    } catch (error) { 
        next(error)
    }
}


const forgotCode = async(req, res, next) => {
    try {
        const { email } = req.body

        //*Check if email is valid
        const user = await User.findOne({ email })
        if(!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const code = generateCode(8)

        user.forgotPassword = code
        await user.save()

        await sendEmail({
            emailTo: user.email,
            subject: 'Forget password code',
            code,
            content: "Change your password"
        })

        res.status(200).json({
            code: 200,
            status: true,
            message: "Forget password code sent successfully"
        })
        
    } catch (error) {
        next(error)
    }
}


const recoverPassword = async(req, res, next) =>{
    try {
        const { email, code, password } = req.body

        const user = await User.findOne({ email })
        if(!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        //* check if the sent code is valid
        if(user.forgotPassword !== code) {
            return res.status(400).json({
                message: "Invalid code"
            })
        }

        //* hash password and save new user
        const hashedPassword = await hashPassword(password)
        user.password = hashedPassword
        user.forgotPassword= null
        await user.save()

        res.status(200).json({
            code: 200,
            status: true,
            message: "New password set successfully"
        })
        
    } catch (error) {
        next(error)
    }
}


const changePassword = async(req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body
        const { _id } = req.user

        //*Check if id matches
        const user = await User.findById(_id)
        if(!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const match = await comparePassword(oldPassword, user.password)
        if(!match) {
            return res.status(400).json({
                message: "You are providing an old password"
            })
        }

        const hashedPassword = await hashPassword(newPassword)
        user.password = hashedPassword
        await user.save()

        res.status(200).json({
            code: 200,
            status: true,
            message: "Password changed successfull"
        })
        
    } catch (error) {
       next(error) 
    }
}

 
module.exports = {
    signup,
    signin, 
    verify,
    verifyUserCode,
    forgotCode,
    recoverPassword,
    changePassword
    
}