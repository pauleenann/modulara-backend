// this basically checks the access token first before executing the controllers
import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate = async (req, res, next) =>{
    try {
        // get the token from headers->authorization
        const authHeader = req.headers.authorization;

        // check if authHeader has value or has correct string
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({
                message: 'Access token required',
                code: 'TOKEN_MISSING'
            })
        }

        // store access token
        const token = authHeader.substring(7)
        console.log('Authenticate access token: ', token)

        // verify token
        const decoded = verifyAccessToken(token);

        // include decoded in req
        req.decoded = decoded;

        // proceed to next
        next()
    } catch (error) {
      console.log(error)
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
              message: 'Access token expired',
              code: 'TOKEN_EXPIRED'
            });
          }
          if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
              message: 'Invalid access token',
              code: 'TOKEN_INVALID'
            });
          }
          return res.status(500).json({ message: 'Authentication error' });
    }
}