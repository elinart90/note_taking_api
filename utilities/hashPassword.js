const bcrypt = require("bcryptjs")


const hashPassword = async(password) => {
    try {
        
        //*Generate a salt with 12 rounds
        const salt = await bcrypt.genSalt(12)

        //* hash the password
        const hashedPassword = await bcrypt.hash(password, salt)
        return hashedPassword
    } catch (error) {
        throw new Error("Error hashing password: "+ error.message)
    }
}


module.exports = hashPassword