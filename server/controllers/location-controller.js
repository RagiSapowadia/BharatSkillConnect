const Location = require("../models/Location");
const User = require("../models/User");

// Update user location
exports.updateLocation = async (req, res) => {
  try {
    const { latitude, longitude, address, city, state, country, isPublic = true } = req.body;
    const userId = req.user._id;

    // Check if location already exists for user
    let location = await Location.findOne({ userId });

    if (location) {
      // Update existing location
      location.latitude = latitude;
      location.longitude = longitude;
      location.address = address;
      location.city = city;
      location.state = state;
      location.country = country;
      location.isPublic = isPublic;
      location.lastUpdated = new Date();
    } else {
      // Create new location
      location = new Location({
        userId,
        latitude,
        longitude,
        address,
        city,
        state,
        country,
        isPublic,
      });
    }

    await location.save();

    res.json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update location" 
    });
  }
};

// Get user location
exports.getUserLocation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const location = await Location.findOne({ userId }).populate("userId", "name email");

    if (!location) {
      return res.status(404).json({ 
        success: false, 
        message: "Location not found" 
      });
    }

    // Check if location is public or if user is requesting their own location
    if (!location.isPublic && location.userId._id.toString() !== currentUserId) {
      return res.status(403).json({ 
        success: false, 
        message: "Location is private" 
      });
    }

    res.json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.error("Error fetching location:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch location" 
    });
  }
};

// Get all public locations
exports.getPublicLocations = async (req, res) => {
  try {
    const locations = await Location.find({ isPublic: true })
      .populate("userId", "name email role")
      .sort({ lastUpdated: -1 });

    res.json({
      success: true,
      data: locations,
    });
  } catch (error) {
    console.error("Error fetching public locations:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch locations" 
    });
  }
};

// Get locations for course instructors
exports.getInstructorLocations = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Get course instructors
    const Course = require("../models/Course");
    const course = await Course.findById(courseId).populate("instructorId", "name email");
    
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: "Course not found" 
      });
    }

    // Get instructor location
    const instructorLocation = await Location.findOne({ 
      userId: course.instructorId._id,
      isPublic: true 
    });

    res.json({
      success: true,
      data: {
        instructor: course.instructorId,
        location: instructorLocation,
      },
    });
  } catch (error) {
    console.error("Error fetching instructor locations:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch instructor locations" 
    });
  }
};

// Toggle location privacy
exports.toggleLocationPrivacy = async (req, res) => {
  try {
    const userId = req.user._id;

    const location = await Location.findOne({ userId });
    if (!location) {
      return res.status(404).json({ 
        success: false, 
        message: "Location not found" 
      });
    }

    location.isPublic = !location.isPublic;
    await location.save();

    res.json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.error("Error toggling location privacy:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to toggle location privacy" 
    });
  }
};
