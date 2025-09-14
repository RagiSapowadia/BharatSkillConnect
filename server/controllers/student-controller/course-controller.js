const Course = require("../../models/Course");
const Enrollment = require("../../models/Enrollment");

/**
 * Handles all filtering, sorting, and searching for student-facing course view.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const getAllStudentViewCourses = async (req, res) => {
  try {
    const {
      category: categoryQuery,
      level: levelQuery,
      primaryLanguage: primaryLanguageQuery,
      sortBy = "price-lowtohigh",
      q = "",
      page = 1,
      limit = 10,
    } = req.query;

    console.log(req.query, "req.query");

    // Debug: Check what categories and levels exist in the database
    if (categoryQuery || levelQuery) {
      const allCourses = await Course.find({}, 'category level primaryLanguage');
      const uniqueCategories = [...new Set(allCourses.map(c => c.category))];
      const uniqueLevels = [...new Set(allCourses.map(c => c.level))];
      const uniqueLanguages = [...new Set(allCourses.map(c => c.primaryLanguage))];
      console.log("Categories in database:", uniqueCategories);
      console.log("Levels in database:", uniqueLevels);
      console.log("Languages in database:", uniqueLanguages);
    }

    // Parse pagination parameters
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Initialize the main filters object
    let filters = {};
    const andConditions = [];

    // --- Category Filtering ---
    if (categoryQuery && categoryQuery.length) {
      const categories = categoryQuery
        .split(",")
        .map((cat) => cat.toLowerCase());
      const categoryRegexes = categories.flatMap((cat) => {
        // Handle both hyphenated and spaced formats
        const normalizedCat = cat.replace(/-/g, " ").toLowerCase();

        // Expanded alias map to handle more variations
        const aliasMap = {
          "artificial intelligence": ["artificial intelligence", "ai", "artificial-intelligence"],
          "data science": ["data science", "ds", "data-science"],
          "web development": ["web development", "web dev", "web-development"],
          "machine learning": ["machine learning", "ml", "machine-learning"],
          "cloud computing": ["cloud computing", "cloud", "cloud-computing"],
          "cyber security": ["cyber security", "cyber", "cyber-security", "cybersecurity"],
          "mobile development": ["mobile development", "mobile", "mobile-development"],
          "game development": ["game development", "gaming", "game-development"],
          "software engineering": ["software engineering", "se", "software-engineering"],
          "health & fitness": ["health & fitness", "health", "fitness", "health-&-fitness"],
          "programming": ["programming", "prog"],
          "design": ["design", "graphic design"],
          "business": ["business", "entrepreneurship"],
          "ai": ["ai", "artificial intelligence"],
          "cloud": ["cloud", "cloud computing"],
          "mobile apps": ["mobile apps", "mobile development"],
          "cybersecurity": ["cybersecurity", "cyber security"],
          "devops": ["devops", "devops crash course"],
          "music": ["music", "guitar"],
          "photography": ["photography", "digital photography"],
          "marketing": ["marketing", "digital marketing"],
        };

        // Use aliases if they exist, otherwise use the original category
        const aliases = aliasMap[normalizedCat] || [normalizedCat, cat];
        return aliases.map((alias) => new RegExp(`${alias.replace(/-/g, " ")}`, "i"));
      });
      andConditions.push({ category: { $in: categoryRegexes } });
    }

    // --- Level Filtering ---
    if (levelQuery && levelQuery.length) {
      console.log("Level query received:", levelQuery);
      const levels = levelQuery.split(",");
      console.log("Level filters:", levels);
      andConditions.push({ level: { $in: levels } });
    }

    // --- Primary Language Filtering ---
    if (primaryLanguageQuery && primaryLanguageQuery.length) {
      console.log("Language query received:", primaryLanguageQuery);
      const languages = primaryLanguageQuery.split(",");
      console.log("Language filters:", languages);
      andConditions.push({ primaryLanguage: { $in: languages } });
    }

    // --- Search Query Filtering ---
    if (q && q.trim().length > 0) {
      const regex = new RegExp(q.trim(), "i");
      andConditions.push({
        $or: [{ title: regex }, { description: regex }],
      });
    }

    // Always filter for published courses only
    andConditions.push({ isPublished: true });

    console.log("All conditions:", andConditions);

    if (andConditions.length > 0) {
      filters.$and = andConditions;
    }

    console.log("Final MongoDB filters:", JSON.stringify(filters, null, 2));

    // --- Sorting ---
    let sortParam = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sortParam.price = 1;
        break;
      case "price-hightolow":
        sortParam.price = -1;
        break;
      case "title-atoz":
        sortParam.title = 1;
        break;
      case "title-ztoa":
        sortParam.title = -1;
        break;
      default:
        sortParam.price = 1;
        break;
    }

    // Get total count for pagination
    const totalCourses = await Course.countDocuments(filters);

    // Find courses based on filters, sorting, and pagination
    console.log("Final filters:", JSON.stringify(filters, null, 2));
    console.log("Sort params:", sortParam);
    console.log("Limit:", limitNum, "Skip:", skip);

    const coursesList = await Course.find(filters)
      .sort(sortParam)
      .populate("teacherId", "name")
      .skip(skip)
      .limit(limitNum);

    console.log("Total courses in DB:", await Course.countDocuments());
    console.log("Courses matching filters:", await Course.countDocuments(filters));

    console.log("Found courses count:", coursesList.length);
    console.log("Courses found:", coursesList.map(c => ({
      title: c.title,
      category: c.category,
      level: c.level,
      primaryLanguage: c.primaryLanguage
    })));

    const transformedCourses = coursesList.map((course) => ({
      ...course.toObject(),
      instructorName: course.teacherId ? course.teacherId.name : "N/A",
      pricing: course.pricing || course.price || 0, // Use pricing field first, fallback to price, then 0
    }));

    // Calculate pagination info
    const totalPages = Math.ceil(totalCourses / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.status(200).json({
      success: true,
      data: transformedCourses,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCourses,
        hasNextPage,
        hasPrevPage,
        limit: limitNum,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getStudentViewCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id).populate(
      "teacherId",
      "name"
    );

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "No course details found",
        data: null,
      });
    }

    // Transform the data to include instructorName and proper pricing
    const transformedCourseDetails = {
      ...courseDetails.toObject(),
      instructorName: courseDetails.teacherId ? courseDetails.teacherId.name : "N/A",
      pricing: courseDetails.pricing || courseDetails.price || 0,
    };

    res.status(200).json({
      success: true,
      data: transformedCourseDetails,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const checkCoursePurchaseInfo = async (req, res) => {
  try {
    const { id, studentId } = req.params;
    
    // Check both Enrollment and StudentCourses models
    const enrollment = await Enrollment.findOne({
      userId: studentId,
      courseId: id,
      paymentStatus: "success",
    });

    const StudentCourses = require("../../models/StudentCourses");
    const studentPurchasedCourses = await StudentCourses.findOne({ userId: studentId });
    const isInStudentCourses = studentPurchasedCourses?.courses?.findIndex(
      (item) => item.courseId === id
    ) > -1;

    const ifStudentAlreadyBoughtCurrentCourse = !!enrollment || isInStudentCourses;
    res.status(200).json({
      success: true,
      data: ifStudentAlreadyBoughtCurrentCourse,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  getAllStudentViewCourses,
  getStudentViewCourseDetails,
  checkCoursePurchaseInfo,
}
