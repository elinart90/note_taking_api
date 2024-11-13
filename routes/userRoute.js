const express = require("express")
const router = express.Router()

const userController = require('../controller/userController')
const { signupValidator, signinValidator, emailValidator, verifyUserValidator, recoverPasswordValidator, changedPasswordValidator} = require('../validator/userValidator')
const validate = require('../validator/validator')
const isAuth = require("../middleware/isAuth")



router.post("/signup",signupValidator,validate, userController.signup)


router.post("/signin", signinValidator, validate, userController.signin)

router.post("/sendcode", emailValidator, validate, userController.verify )


router.post("/verify-user", verifyUserValidator, validate, userController.verifyUserCode)

router.post("/forgotpassword", emailValidator, validate, userController.forgotCode)


router.post("/recoverpassword", recoverPasswordValidator, validate, userController.recoverPassword)

router.put("/changepassword", changedPasswordValidator, validate, isAuth, userController.changePassword)


module.exports = router