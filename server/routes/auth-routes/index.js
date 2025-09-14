const express = require("express");
const {
  registerUser,
  loginUser,
  updateUserProfile,
} = require("../../controllers/auth-controller/index");
const authenticateMiddleware = require("../../middleware/auth-middleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authenticateMiddleware, (req, res) => {
  // For now, just return success since we're using sessionStorage
  // In production, you might want to implement token blacklisting
  res.status(200).json({
    success: true,
    message: "Logged out successfully!",
  });
});
router.get("/check-auth", authenticateMiddleware, (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    data: {
      user,
    },
  });
});

router.put("/update-profile/:userId", authenticateMiddleware, updateUserProfile);

module.exports = router;
