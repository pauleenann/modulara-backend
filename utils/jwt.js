import jwt from 'jsonwebtoken';

export const generateAccessToken = (payload) =>{
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.JWT_ACCESS_EXPIRE})
}

export const generateRefreshToken = (payload)=>{
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: process.env.JWT_REFRESH_EXPIRE})
}

export const verifyAccessToken = (token)=>{
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
}

export const verifyRefreshToken = (token)=>{
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
}

// TOKEN EXPIRATION TIME
export const getTokenExpiry = (token)=>{
    try {
        const decoded = jwt.decode(token);
        return decoded.exp * 1000; //convert to milliseconds
    } catch (error) {
        return null
    }
}

