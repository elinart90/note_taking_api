const jwt = require('jsonwebtoken');

const isAuth = async (req, res, next) => {
  try {
    //* Check for authorization header
    const authorization = req.headers.authorization && req.headers.authorization.split(" ");
    
    //* Ensure token exists and format is correct
    if (authorization && authorization.length === 2) {
      const token = authorization[1]; // Get token part

      //* Verify token
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      if (payload) {
        //* Attach user info from payload to request object
        req.user = {
          _id: payload._id,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          unit: payload.unit
        };
        next(); //* Proceed to the next middleware
      } else {
        //* If payload verification fails, throw unauthorized error
        return res.status(401).json({
          message: "Unauthorized access - invalid token"
        });
      }
    } else {
      //* If no token provided or incorrect format
      return res.status(400).json({
        message: "Token is required"
      });
    }

  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      //* Handle invalid JWT errors (e.g., token is malformed)
      return res.status(401).json({
        message: "Invalid token"
      });
    } else if (error.name === "TokenExpiredError") {
      //* Handle token expiration
      return res.status(401).json({
        message: "Token has expired"
      });
    } else {
      //* Handle other unexpected errors
      next(error); // Pass to next error handler
    }
  }
};

module.exports = isAuth;
