const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

const AuthUser = {

    authenticateUser: function(req, res, next) {
        if (!req.headers.authorization) {
            return res.status(401).json({message: "Authorization header is required"})
        }
        let splitHeader = req.headers.authorization.split(' ')
        if (splitHeader[0] !== 'Bearer') {
            return res.status(401).json({message: "Invalid token format"})
        }
        let token = splitHeader[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) return res.status(500).json({err})
            if (!decodedToken) {
                return res.status(401).json({message: "Invalid authorization token"})
            }
            req.userInfo = decodedToken
        })
        next()
    },
    
    checkAdmin: function(req, res, next) {
        //check if user role is admin
    }
}

module.exports = AuthUser