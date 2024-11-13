const bcrypt = require("bcryptjs")
//const hashPassword = require("./hashPassword")


const comparePassword = async(password, hashedPassword) =>{
    return await bcrypt.compare(password, hashedPassword )
}

module.exports = comparePassword