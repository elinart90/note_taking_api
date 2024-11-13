const isAdmin = (req, res, next) => {
    try {
        if(req.user.role === "admin") {
            next()
        }else {
            return res.status(401).json({
                message: "Permission denied"
            })
        }
        
    } catch (error) {
        next(error)
    }
}

module.exports = isAdmin