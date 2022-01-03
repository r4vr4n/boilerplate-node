import express from "express";
import UserSignIn from "../controllers/userAuth/UserSignIn.js";
import UserSignOut from "../controllers/userAuth/UserSignOut.js";
import GetUserProfile from "../controllers/userProfile/GetUserProfile.js";
import VerifyAccessToken from "../helpers/tokens/VerifyAccessToken.js";

const router = express.Router();

router.get("/:id", VerifyAccessToken, GetUserProfile);

router.patch("/:id", VerifyAccessToken, UserSignIn);

router.delete("/:id", VerifyAccessToken, UserSignOut);

export default router;