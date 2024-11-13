const {check} = require("express-validator")

const signupValidator = [
    check("name")
    .notEmpty().withMessage("Name is required")
    .isLength({ min:3 }).withMessage("Username should be more than 3 letters"),

    check("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid crediential"),

    check("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password should be strong"),

    check("unit")
    .notEmpty().withMessage("Unit is required")

    
]

const signinValidator = [
    check("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid credentials"),

    check("password")
    .notEmpty().withMessage("Password is required")
    
]

const emailValidator = [
    check("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
];


const verifyUserValidator = [
    check("email")
    .isEmail().withMessage("Invalid email")
    .notEmpty().withMessage("Email is required"),

    check("code")
    .notEmpty().withMessage("Code is required")
]

const recoverPasswordValidator = [
    check("email")
    .isEmail().withMessage("Invalid email")
    .notEmpty().withMessage("Email is required"),

    check("code")
    .notEmpty().withMessage("Code is required"),

    check("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password should be strong"),
]

const changedPasswordValidator = [
    check("oldPassword")
    .notEmpty().withMessage("Old password is required"),

    check("newPassword")
    .notEmpty().withMessage("New password is required")
]



module.exports = {
    signupValidator,
    signinValidator,
    emailValidator,
    verifyUserValidator,
    recoverPasswordValidator,
    changedPasswordValidator
}