const express = require("express");
const router = express.Router();
const { updateLocation, getUserLocation, getPublicLocations, getInstructorLocations, toggleLocationPrivacy } = require("../controllers/location-controller");
const authenticate = require("../middleware/auth-middleware");

router.use(authenticate);

router.post("/update", updateLocation);
router.get("/user/:userId", getUserLocation);
router.get("/public", getPublicLocations);
router.get("/instructor/:courseId", getInstructorLocations);
router.put("/toggle-privacy", toggleLocationPrivacy);

module.exports = router;
