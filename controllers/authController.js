import admin from "../config/firebase-admin.js";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from "../utils/jwt.js";
import { getDeviceInfo } from "../routes/userAgent.js";
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../utils/cookies.js";

export const signInWithGoogle = async (req,res)=>{
    try {
        if(!req.decoded){
            return res.status(500).json({
                message: 'Token is missing'
            })
        }

        // destructure
        const {uid, name, email} = req.decoded;
        console.log(email)

        // check user if exist
        let user = await User.findOne({email: email});

        // if user does not exist or no user found, create user
        if(!user){
            try {
                // store recent user in user
                user = await User.create({
                    firstName: name.split(' ')[0],
                    lastName: name.split(' ')[1],
                    email: email
                })
            } catch (error) {
                return res.status(500).json({
                    message: 'Cannot create user'
                })
            }
        }

        // generate access token and refresh token
        const accessToken = generateAccessToken({userId: user._id, role: user.role});
        const refreshToken = generateRefreshToken({userId: user._id, role: user.role});
        const expirationTime = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

        // get device info
        const deviceInfo = getDeviceInfo(req);
        console.log(refreshToken)
        // store refresh token to database
        if(refreshToken){
            try {
                await RefreshToken.create({
                    userId: user._id,
                    token: refreshToken,
                    expiresAt:new Date(expirationTime),
                    deviceInfo: deviceInfo
                })
            } catch (error) {
                console.log(error)
                return res.status(500).json({
                    message: 'Cannot store refresh token'
                })
            }
        }

        // store refresh token to cookies
        setRefreshTokenCookie(res, refreshToken);

        res.status(200).json({
            accessToken,
            user:{
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Cannot sign in with google'
        })
    }
}

export const signup = async (req, res)=>{
    try {
        if(!req.decoded){
            return res.status(500).json({
                message: 'Token is missing'
            })
        }

        // destructure
        const {firstName, lastName} = req.body;
        const {uid, email} = req.decoded;
        console.log(email)

        // check user if exist
        let user = await User.findOne({email: email});

        // if user does not exist or no user found, create user
        if(!user){
            try {
                // store recent user in user
                user = await User.create({
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email,
                    signInMethod: 'email & password',
                })
            } catch (error) {
                return res.status(500).json({
                    message: 'Cannot create user'
                })
            }
        }

        // generate access token and refresh token
        const accessToken = generateAccessToken({userId: user._id, role: user.role});
        const refreshToken = generateRefreshToken({userId: user._id, role: user.role});
        const expirationTime = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

        // get device info
        const deviceInfo = getDeviceInfo(req);
        console.log(refreshToken)
        // store refresh token to database
        if(refreshToken){
            try {
                await RefreshToken.create({
                    userId: user._id,
                    token: refreshToken,
                    expiresAt:new Date(expirationTime),
                    deviceInfo: deviceInfo
                })
            } catch (error) {
                console.log(error)
                return res.status(500).json({
                    message: 'Cannot store refresh token'
                })
            }
        }

        // store refresh token to cookies
        setRefreshTokenCookie(res, refreshToken);

        res.status(200).json({
            accessToken,
            user:{
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Cannot sign up'
        })
    }
}

export const login = async(req,res)=>{
    try {
        if(!req.decoded){
            return res.status(500).json({
                message: 'Token is missing'
            })
        }

        // destructure
        const {email} = req.decoded;
        console.log(email)

        // check user if exist
        let user = await User.findOne({email: email});

        // if user does not exist or no user found, create user
        if(!user){
            return res.status(500).json({
                message: 'User not found'
            })
        }

        // generate access token and refresh token
        const accessToken = generateAccessToken({userId: user._id, role: user.role});
        const refreshToken = generateRefreshToken({userId: user._id, role: user.role});
        const expirationTime = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

        // get device info
        const deviceInfo = getDeviceInfo(req);
        console.log(refreshToken)
        // store refresh token to database
        if(refreshToken){
            try {
                await RefreshToken.create({
                    userId: user._id,
                    token: refreshToken,
                    expiresAt:new Date(expirationTime),
                    deviceInfo: deviceInfo
                })
            } catch (error) {
                console.log(error)
                return res.status(500).json({
                    message: 'Cannot store refresh token'
                })
            }
        }

        // store refresh token to cookies
        setRefreshTokenCookie(res, refreshToken);

        res.status(200).json({
            accessToken,
            user:{
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        })
    } catch (error) {
        
    }
}

export const signOut = async (req, res)=>{
    try {
        // delete refresh token in db first
        const token = req.cookies.refreshToken;
        console.log("refresh token: ", token);
    
        if (!token) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        await RefreshToken.deleteOne({token:token})

        // delete in cookie
        clearRefreshTokenCookie(res)


        return res.status(200).json({ message: 'Refresh token deleted successfully' });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Cannot sign out'
        })
    }
}

export const refreshAccessToken = async (req, res) => {
    try {
      const token = req.cookies.refreshToken;
      console.log("refresh token: ", token);
  
      if (!token) {
        return res.status(401).json({ message: "No refresh token provided" });
      }
  
      // Verify refresh token
      const isValid = verifyRefreshToken(token);
      if (!isValid) {
        return res.status(401).json({ 
            message: "Refresh token is invalid",
            code: 'REFRESH_TOKEN_EXPIRED'
        });
      }
  
      // Find token in database
      const refreshInfo = await RefreshToken.findOne({ token });
      if (!refreshInfo) {
        return res.status(401).json({ message: "Refresh token not found" });
      }
  
      // Find user
      const user = await User.findById(refreshInfo.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Generate new access token
      const newAccessToken = generateAccessToken({ userId: user._id, role: user.role });
  
      return res.status(200).json({ 
        accessToken: newAccessToken,
        user:{
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        }
    });
  
    } catch (error) {
      console.error("Error during token refresh:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

export const testController = ()=>{
    console.log('Access token valid');
}