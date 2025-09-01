// check first if firebase token is valid
import admin from "../config/firebase-admin.js";

export const authenticateFirebase = async (req, res, next)=>{
    try {
         // get the firebase token from headers->authorization
         const authHeader = req.headers.authorization;

         // check if authHeader has value or has correct string
         if(!authHeader || !authHeader.startsWith('Bearer ')){
             return res.status(401).json({
                 message: 'Access token required',
                 code: 'TOKEN_MISSING'
             })
         }
 
         // store firebase token
         const token = authHeader.substring(7)

        //  verify token
         try {
            // check if token exists
            if(!token){
                return res.status(401).json({ 
                    error: 'Missing token' 
                });
            }

            const decoded = await admin.auth().verifyIdToken(token);

            // store decoded in request
            req.decoded = decoded
            next()

         } catch (error) {
            return res.status(500).json({error: error})
         }
        

    } catch (error) {
        return res.status(500).json({error: error})
    }
}