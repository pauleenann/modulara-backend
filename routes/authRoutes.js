import express from "express";
import { refreshAccessToken, signInWithGoogle, signOut, signup, testController } from "../controllers/authController.js";
import { authenticateFirebase } from "../middleware/firebaseAuth.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router()

router.post('/signin-google', authenticateFirebase, signInWithGoogle);
router.post('/signup', authenticateFirebase, signup);
router.post('/login', authenticateFirebase, signup);
router.get('/refresh', refreshAccessToken);
router.post('/signout', signOut);

router.post('/test', authenticate, testController);
export default router
