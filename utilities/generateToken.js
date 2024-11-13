const jwt = require('jsonwebtoken')


const generateToken = (name) => {
    const token = jwt.sign({
        _id: name._id,
        name: name.name,
        email: name.email,
        role: name.role,
        unit: name.unit
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
)
return token
}


module.exports = generateToken