const mongoose = require("mongoose");
const Course = require("../models/Course");
const User = require("../models/User");

// Helper function to get thumbnail from assets
function getThumbnailUrl(category) {
  const assetMap = {
    "Web Development": "/src/assets/webdev.webp",
    "Data Science": "/src/assets/datascience.webp",
    "JavaScript": "/src/assets/javascript.jpeg",
    "Machine Learning": "/src/assets/mlatoz.jpeg",
    "React": "/src/assets/react.webp",
    "Cloud Computing": "/src/assets/cloud1.webp",
    "Mobile Development": "/src/assets/mobile1.webp",
    "Cybersecurity": "/src/assets/cyber1.webp",
    "Design": "/src/assets/design2.webp",
    "Business": "/src/assets/business2.jpg",
    "Marketing": "/src/assets/digitalmarketing.jpg",
    "Photography": "/src/assets/photography.jpg",
    "Health & Fitness": "/src/assets/yoga.webp",
    "Programming": "/src/assets/python.webp",
    "AI": "/src/assets/aimystry.webp",
    "DevOps": "/src/assets/devop.webp"
  };
  return assetMap[category] || "/src/assets/webdev.webp";
}

const courses = [
  {
    instructorName: "Dr. Sarah Johnson",
    title: "Complete Web Development Bootcamp",
    category: "Web Development",
    level: "beginner",
    primaryLanguage: "English",
    subtitle: "Master Full-Stack Development: From Zero to Hero",
    description: "This comprehensive bootcamp covers everything you need to become a professional full-stack web developer. You'll learn HTML5, CSS3, JavaScript ES6+, React, Node.js, Express, MongoDB, and much more. Build real-world projects including e-commerce sites, social media platforms, and web applications. Get hands-on experience with modern development tools, version control with Git, deployment strategies, and best practices used by industry professionals.",
    objectives: "Build responsive websites with HTML5 and CSS3,Master JavaScript ES6+ and modern frameworks,Create dynamic web applications with React,Develop server-side applications with Node.js and Express,Work with databases using MongoDB and Mongoose,Implement authentication and authorization,Deploy applications to cloud platforms,Use Git for version control and collaboration,Apply modern development tools and workflows,Create portfolio-ready projects",
    image: getThumbnailUrl("Web Development"),
    pricing: 2999,
    curriculum: [
      {
        title: "Welcome to the Course - Introduction",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 15
      },
      {
        title: "Course Roadmap and Learning Path (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 10
      },
      {
        title: "Setting Up Your Development Environment",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 25
      },
      {
        title: "HTML5 Fundamentals - Complete Guide",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        type: "video",
        duration: 45
      },
      {
        title: "CSS3 Mastery - Styling and Layouts",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        type: "video",
        duration: 60
      },
      {
        title: "JavaScript ES6+ Complete Reference (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 30
      }
    ],
    modules: [
      {
        moduleId: "module1",
        title: "Frontend Fundamentals",
        lessons: [
          {
            lessonId: "lesson1",
            type: "video",
            title: "HTML5 Semantic Elements and Structure",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 45,
          },
          {
            lessonId: "lesson2",
            type: "video",
            title: "CSS3 Flexbox and Grid Layouts",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 60,
          },
          {
            lessonId: "lesson3",
            type: "video",
            title: "Responsive Design with Media Queries",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 40,
          },
          {
            lessonId: "lesson4",
            type: "pdf",
            title: "Frontend Best Practices Guide",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            duration: 20,
          }
        ],
      },
      {
        moduleId: "module2",
        title: "JavaScript Mastery",
        lessons: [
          {
            lessonId: "lesson5",
            type: "video",
            title: "JavaScript ES6+ Features and Syntax",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 90,
          },
          {
            lessonId: "lesson6",
            type: "video",
            title: "Asynchronous JavaScript and Promises",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 75,
          },
          {
            lessonId: "lesson7",
            type: "video",
            title: "DOM Manipulation and Event Handling",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 55,
          }
        ],
      },
      {
        moduleId: "module3",
        title: "React Development",
        lessons: [
          {
            lessonId: "lesson8",
            type: "video",
            title: "React Components and JSX",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 80,
          },
          {
            lessonId: "lesson9",
            type: "video",
            title: "State Management with Hooks",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 70,
          },
          {
            lessonId: "lesson10",
            type: "video",
            title: "React Router and Navigation",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 50,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Alex Thompson",
        studentEmail: "alex.thompson@email.com",
        paidAmount: 2999
      },
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Maria Garcia",
        studentEmail: "maria.garcia@email.com",
        paidAmount: 2999
      },
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "David Chen",
        studentEmail: "david.chen@email.com",
        paidAmount: 2999
      }
    ],
    date: new Date("2024-01-15"),
    isPublished: true,
  },
  {
    instructorName: "Prof. Michael Rodriguez",
    title: "Data Science with Python",
    category: "Data Science",
    level: "intermediate",
    primaryLanguage: "English",
    subtitle: "Complete Data Science Journey: Python, ML, and Analytics",
    description: "Master the complete data science workflow using Python. This comprehensive course covers data collection, cleaning, analysis, visualization, machine learning, and statistical modeling. Learn to work with real-world datasets, build predictive models, and create compelling data visualizations. Perfect for professionals looking to transition into data science or enhance their analytical skills.",
    objectives: "Master Python for data analysis and manipulation,Work with pandas, NumPy, and scikit-learn,Create compelling data visualizations with Matplotlib and Seaborn,Build and evaluate machine learning models,Perform statistical analysis and hypothesis testing,Handle real-world datasets and data cleaning,Implement data pipelines and automation,Present insights through storytelling,Apply advanced techniques like deep learning,Deploy models in production environments",
    image: getThumbnailUrl("Data Science"),
    pricing: 3499,
    curriculum: [
      {
        title: "Data Science Career Path and Opportunities",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 20
      },
      {
        title: "Python for Data Science Cheatsheet (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 15
      },
      {
        title: "Setting Up Your Data Science Environment",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 30
      },
      {
        title: "NumPy Fundamentals for Data Analysis",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        type: "video",
        duration: 50
      },
      {
        title: "Pandas Data Manipulation Mastery",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        type: "video",
        duration: 75
      }
    ],
    modules: [
      {
        moduleId: "module1",
        title: "Python Fundamentals for Data Science",
        lessons: [
          {
            lessonId: "lesson1",
            type: "video",
            title: "Python Basics and Data Types",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 60,
          },
          {
            lessonId: "lesson2",
            type: "video",
            title: "NumPy Arrays and Operations",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 70,
          },
          {
            lessonId: "lesson3",
            type: "video",
            title: "Pandas DataFrames and Series",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 80,
          }
        ],
      },
      {
        moduleId: "module2",
        title: "Data Visualization and Analysis",
        lessons: [
          {
            lessonId: "lesson4",
            type: "video",
            title: "Matplotlib and Seaborn Visualization",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 65,
          },
          {
            lessonId: "lesson5",
            type: "video",
            title: "Statistical Analysis with Python",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 55,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Jennifer Lee",
        studentEmail: "jennifer.lee@email.com",
        paidAmount: 3499
      },
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Robert Wilson",
        studentEmail: "robert.wilson@email.com",
        paidAmount: 3499
      }
    ],
    date: new Date("2024-02-01"),
    isPublished: true,
  },
  {
    instructorName: "Dr. Emily Chen",
    title: "JavaScript Essentials",
    category: "JavaScript",
    level: "beginner",
    primaryLanguage: "English",
    subtitle: "Master Modern JavaScript: From Basics to Advanced Concepts",
    description: "Learn JavaScript from the ground up with this comprehensive course. Cover everything from basic syntax to advanced concepts like closures, prototypes, async/await, and modern ES6+ features. Build interactive web applications, understand the JavaScript ecosystem, and prepare for frameworks like React, Vue, or Angular.",
    objectives: "Master JavaScript fundamentals and syntax,Understand ES6+ features and modern JavaScript,Work with DOM manipulation and events,Handle asynchronous programming with Promises and async/await,Learn about closures, prototypes, and advanced concepts,Build interactive web applications,Understand JavaScript modules and bundling,Apply best practices and design patterns,Debug and test JavaScript code,Prepare for modern JavaScript frameworks",
    image: getThumbnailUrl("JavaScript"),
    pricing: 1999,
    curriculum: [
      {
        title: "JavaScript: The Language of the Web",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 18
      },
      {
        title: "JavaScript Quick Reference Guide (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 12
      },
      {
        title: "Setting Up Your JavaScript Development Environment",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 22
      }
    ],
    modules: [
      {
        moduleId: "module1",
        title: "JavaScript Fundamentals",
        lessons: [
          {
            lessonId: "lesson1",
            type: "video",
            title: "Variables, Data Types, and Operators",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 45,
          },
          {
            lessonId: "lesson2",
            type: "video",
            title: "Functions and Scope",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 50,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Kevin Park",
        studentEmail: "kevin.park@email.com",
        paidAmount: 1999
      }
    ],
    date: new Date("2024-01-20"),
    isPublished: true,
  },
  {
    instructorName: "Dr. James Anderson",
    title: "Machine Learning A-Z",
    category: "Machine Learning",
    level: "intermediate",
    primaryLanguage: "English",
    subtitle: "Complete Machine Learning Course: From Theory to Practice",
    description: "Master machine learning algorithms and techniques with hands-on projects. Learn supervised and unsupervised learning, neural networks, deep learning, and model evaluation. Work with real datasets and build production-ready ML models using Python, scikit-learn, TensorFlow, and PyTorch.",
    objectives: "Understand machine learning concepts and algorithms,Implement supervised and unsupervised learning,Work with neural networks and deep learning,Evaluate and optimize model performance,Handle real-world datasets and preprocessing,Apply feature engineering techniques,Deploy machine learning models,Understand ensemble methods and advanced techniques,Work with TensorFlow and PyTorch,Create end-to-end ML projects",
    image: getThumbnailUrl("Machine Learning"),
    pricing: 3999,
    curriculum: [
      {
        title: "Introduction to Machine Learning",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 25
      },
      {
        title: "ML Algorithms Reference Guide (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 20
      }
    ],
    modules: [
      {
        moduleId: "module1",
        title: "Supervised Learning",
        lessons: [
          {
            lessonId: "lesson1",
            type: "video",
            title: "Linear and Logistic Regression",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 70,
          },
          {
            lessonId: "lesson2",
            type: "video",
            title: "Decision Trees and Random Forest",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 65,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Lisa Zhang",
        studentEmail: "lisa.zhang@email.com",
        paidAmount: 3999
      }
    ],
    date: new Date("2024-02-10"),
    isPublished: true,
  },
  {
    instructorName: "Sarah Williams",
    title: "React for Beginners",
    category: "React",
    level: "beginner",
    primaryLanguage: "English",
    subtitle: "Build Modern Web Applications with React",
    description: "Learn React from scratch and build modern, interactive web applications. Master components, state management, hooks, routing, and best practices. Create real-world projects and understand the React ecosystem including Redux, testing, and deployment.",
    objectives: "Master React fundamentals and JSX,Understand components and props,Learn state management with hooks,Implement routing and navigation,Build forms and handle user input,Work with APIs and data fetching,Apply React best practices and patterns,Test React applications,Deploy React apps to production,Understand the React ecosystem",
    image: getThumbnailUrl("React"),
    pricing: 2499,
    curriculum: [
      {
        title: "Why React? Introduction to Modern Web Development",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 20
      },
      {
        title: "React Components Cheatsheet (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 15
      }
    ],
    modules: [
      {
        moduleId: "module1",
        title: "React Fundamentals",
        lessons: [
          {
            lessonId: "lesson1",
            type: "video",
            title: "Components and JSX",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 55,
          },
          {
            lessonId: "lesson2",
            type: "video",
            title: "Props and State",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 60,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Mark Johnson",
        studentEmail: "mark.johnson@email.com",
        paidAmount: 2499
      }
    ],
    date: new Date("2024-01-25"),
    isPublished: true,
  }
];

// Generate additional courses with rich content
const additionalCourses = [
  {
    category: "Cloud Computing",
    title: "AWS Cloud Practitioner Certification",
    description: "Master Amazon Web Services and prepare for the AWS Cloud Practitioner certification. Learn core AWS services, security, architecture, pricing, and support. Build hands-on experience with EC2, S3, RDS, Lambda, and more. Perfect for beginners looking to start their cloud journey.",
    instructorName: "David Kumar",
    level: "beginner",
    pricing: 2999,
    image: getThumbnailUrl("Cloud Computing"),
    subtitle: "Complete AWS Cloud Journey: From Basics to Certification",
    objectives: "Understand AWS core services and architecture,Learn cloud computing fundamentals,Master EC2, S3, RDS, and Lambda,Implement security best practices,Understand AWS pricing and billing,Prepare for AWS Cloud Practitioner exam,Build real-world cloud projects,Learn monitoring and troubleshooting,Understand AWS support and documentation,Apply cloud best practices",
    curriculum: [
      {
        title: "Introduction to Cloud Computing and AWS",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 30
      },
      {
        title: "AWS Services Overview (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 25
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Amanda Foster",
        studentEmail: "amanda.foster@email.com",
        paidAmount: 2999
      }
    ]
  },
  {
    category: "Mobile Development",
    title: "Flutter Mobile App Development",
    description: "Build beautiful, native mobile applications for iOS and Android using Flutter. Learn Dart programming, widget-based UI development, state management, navigation, and app deployment. Create real-world mobile apps and publish them to app stores.",
    instructorName: "Rachel Green",
    level: "intermediate",
    pricing: 3499,
    image: getThumbnailUrl("Mobile Development"),
    subtitle: "Cross-Platform Mobile Development with Flutter",
    objectives: "Master Dart programming language,Learn Flutter widget system and UI development,Implement state management solutions,Build responsive and adaptive layouts,Handle navigation and routing,Integrate with APIs and databases,Implement authentication and security,Test and debug Flutter applications,Deploy apps to iOS and Android stores,Apply mobile development best practices",
    curriculum: [
      {
        title: "Introduction to Flutter and Dart",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 35
      },
      {
        title: "Flutter Widget Reference (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 20
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Tom Brown",
        studentEmail: "tom.brown@email.com",
        paidAmount: 3499
      }
    ]
  },
  {
    category: "Cybersecurity",
    title: "Ethical Hacking and Penetration Testing",
    description: "Learn ethical hacking techniques and penetration testing methodologies. Understand network security, vulnerability assessment, and defensive strategies. Master tools like Metasploit, Nmap, Wireshark, and Burp Suite. Prepare for cybersecurity certifications and careers.",
    instructorName: "Alex Thompson",
    level: "advanced",
    pricing: 4499,
    image: getThumbnailUrl("Cybersecurity"),
    subtitle: "Master Cybersecurity: Ethical Hacking and Defense",
    objectives: "Understand cybersecurity fundamentals and threats,Learn ethical hacking methodologies,Master penetration testing techniques,Use security tools and frameworks,Implement network security measures,Understand vulnerability assessment,Learn incident response and forensics,Apply security best practices,Prepare for cybersecurity certifications,Build defensive security strategies",
    curriculum: [
      {
        title: "Introduction to Ethical Hacking",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 40
      },
      {
        title: "Cybersecurity Tools Guide (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 30
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Sophie Miller",
        studentEmail: "sophie.miller@email.com",
        paidAmount: 4499
      }
    ]
  }
];

// Add additional courses to main courses array
additionalCourses.forEach(course => {
  courses.push({
    ...course,
    primaryLanguage: "English",
    modules: [
      {
        moduleId: `module_${course.category.replace(/\s+/g, '_').toLowerCase()}_1`,
        title: `${course.category} Fundamentals`,
        lessons: [
          {
            lessonId: `lesson_${course.category.replace(/\s+/g, '_').toLowerCase()}_1`,
            type: "video",
            title: `${course.category} Introduction`,
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 45,
          },
          {
            lessonId: `lesson_${course.category.replace(/\s+/g, '_').toLowerCase()}_2`,
            type: "video",
            title: `${course.category} Advanced Concepts`,
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 60,
          }
        ],
      }
    ],
    date: new Date("2024-02-15"),
    isPublished: true,
  });
});

// Add 20 more comprehensive courses
const moreCourses = [
  {
    instructorName: "Dr. Lisa Wang",
    title: "Python Programming Masterclass",
    category: "Programming",
    level: "beginner",
    primaryLanguage: "English",
    subtitle: "Complete Python Development: From Basics to Advanced Applications",
    description: "Master Python programming from fundamentals to advanced concepts. Learn object-oriented programming, data structures, algorithms, web development with Django/Flask, data analysis, automation, and more. Build real-world projects and prepare for Python certifications.",
    objectives: "Master Python syntax and fundamentals,Learn object-oriented programming concepts,Understand data structures and algorithms,Work with databases and APIs,Build web applications with Django/Flask,Perform data analysis with pandas and NumPy,Create automation scripts and tools,Implement testing and debugging techniques,Deploy Python applications,Apply Python best practices and design patterns",
    image: getThumbnailUrl("Programming"),
    pricing: 2799,
    curriculum: [
      {
        title: "Python: The Versatile Programming Language",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 25
      },
      {
        title: "Python Syntax Reference Guide (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 18
      }
    ],
    modules: [
      {
        moduleId: "module_python_1",
        title: "Python Fundamentals",
        lessons: [
          {
            lessonId: "lesson_python_1",
            type: "video",
            title: "Variables, Data Types, and Control Structures",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 50,
          },
          {
            lessonId: "lesson_python_2",
            type: "video",
            title: "Functions and Modules",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 45,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Daniel Kim",
        studentEmail: "daniel.kim@email.com",
        paidAmount: 2799
      }
    ],
    date: new Date("2024-02-20"),
    isPublished: true,
  },
  {
    instructorName: "Prof. Michael Brown",
    title: "UI/UX Design Fundamentals",
    category: "Design",
    level: "beginner",
    primaryLanguage: "English",
    subtitle: "Master User Interface and User Experience Design",
    description: "Learn the principles of UI/UX design and create beautiful, user-friendly interfaces. Master design tools like Figma, Adobe XD, and Sketch. Understand user research, wireframing, prototyping, and design systems. Build a professional design portfolio.",
    objectives: "Understand UI/UX design principles and methodologies,Master design tools like Figma and Adobe XD,Learn user research and persona development,Create wireframes and prototypes,Design responsive and accessible interfaces,Understand design systems and component libraries,Apply color theory and typography,Conduct usability testing and iteration,Build a professional design portfolio,Collaborate with developers and stakeholders",
    image: getThumbnailUrl("Design"),
    pricing: 2299,
    curriculum: [
      {
        title: "Introduction to UI/UX Design",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 30
      },
      {
        title: "Design Principles Handbook (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 25
      }
    ],
    modules: [
      {
        moduleId: "module_design_1",
        title: "Design Fundamentals",
        lessons: [
          {
            lessonId: "lesson_design_1",
            type: "video",
            title: "Design Principles and Visual Hierarchy",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 55,
          },
          {
            lessonId: "lesson_design_2",
            type: "video",
            title: "Color Theory and Typography",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 50,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Emma Davis",
        studentEmail: "emma.davis@email.com",
        paidAmount: 2299
      }
    ],
    date: new Date("2024-02-25"),
    isPublished: true,
  },
  {
    instructorName: "Dr. Sarah Martinez",
    title: "Digital Marketing Mastery",
    category: "Marketing",
    level: "intermediate",
    primaryLanguage: "English",
    subtitle: "Complete Digital Marketing Strategy and Implementation",
    description: "Master digital marketing strategies across all channels. Learn SEO, SEM, social media marketing, email marketing, content marketing, and analytics. Build and execute comprehensive digital marketing campaigns that drive results.",
    objectives: "Develop comprehensive digital marketing strategies,Master SEO and content marketing techniques,Implement effective social media marketing campaigns,Create and optimize email marketing campaigns,Understand paid advertising and PPC strategies,Analyze marketing data and ROI,Build brand awareness and customer engagement,Create compelling content and copy,Use marketing automation tools,Measure and optimize campaign performance",
    image: getThumbnailUrl("Marketing"),
    pricing: 2599,
    curriculum: [
      {
        title: "Digital Marketing Landscape Overview",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 35
      },
      {
        title: "Marketing Strategy Framework (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 20
      }
    ],
    modules: [
      {
        moduleId: "module_marketing_1",
        title: "Marketing Strategy",
        lessons: [
          {
            lessonId: "lesson_marketing_1",
            type: "video",
            title: "Market Research and Customer Personas",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 60,
          },
          {
            lessonId: "lesson_marketing_2",
            type: "video",
            title: "Content Strategy and Creation",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 55,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Chris Wilson",
        studentEmail: "chris.wilson@email.com",
        paidAmount: 2599
      }
    ],
    date: new Date("2024-03-01"),
    isPublished: true,
  },
  {
    instructorName: "Prof. David Lee",
    title: "Photography Masterclass",
    category: "Photography",
    level: "beginner",
    primaryLanguage: "English",
    subtitle: "Professional Photography: From Camera Basics to Advanced Techniques",
    description: "Learn professional photography techniques and master your camera. Cover composition, lighting, portrait photography, landscape photography, post-processing with Lightroom and Photoshop, and building a photography business.",
    objectives: "Master camera settings and technical fundamentals,Understand composition and visual storytelling,Learn lighting techniques for different scenarios,Develop skills in portrait and landscape photography,Master post-processing with Lightroom and Photoshop,Build a professional photography portfolio,Understand business aspects of photography,Learn about different photography genres,Develop your unique photographic style,Prepare for photography competitions and exhibitions",
    image: getThumbnailUrl("Photography"),
    pricing: 1999,
    curriculum: [
      {
        title: "Photography: Capturing Moments and Stories",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 28
      },
      {
        title: "Camera Settings Guide (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 22
      }
    ],
    modules: [
      {
        moduleId: "module_photography_1",
        title: "Camera Fundamentals",
        lessons: [
          {
            lessonId: "lesson_photography_1",
            type: "video",
            title: "Understanding Aperture, Shutter Speed, and ISO",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 65,
          },
          {
            lessonId: "lesson_photography_2",
            type: "video",
            title: "Composition and Rule of Thirds",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 50,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Jessica Taylor",
        studentEmail: "jessica.taylor@email.com",
        paidAmount: 1999
      }
    ],
    date: new Date("2024-03-05"),
    isPublished: true,
  },
  {
    instructorName: "Dr. Anna Rodriguez",
    title: "Yoga and Mindfulness",
    category: "Health & Fitness",
    level: "beginner",
    primaryLanguage: "English",
    subtitle: "Complete Yoga Practice: Physical, Mental, and Spiritual Wellness",
    description: "Discover the transformative power of yoga and mindfulness. Learn various yoga styles, breathing techniques, meditation practices, and how to integrate mindfulness into daily life. Improve flexibility, strength, and mental well-being.",
    objectives: "Master fundamental yoga poses and sequences,Learn proper breathing techniques and pranayama,Understand meditation and mindfulness practices,Develop flexibility, strength, and balance,Create a sustainable yoga practice routine,Understand the philosophy and history of yoga,Learn to modify poses for different abilities,Integrate mindfulness into daily life,Manage stress and improve mental well-being,Connect with your inner self and spirituality",
    image: getThumbnailUrl("Health & Fitness"),
    pricing: 1499,
    curriculum: [
      {
        title: "Introduction to Yoga and Mindfulness",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 32
      },
      {
        title: "Yoga Poses Reference Guide (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 28
      }
    ],
    modules: [
      {
        moduleId: "module_yoga_1",
        title: "Yoga Fundamentals",
        lessons: [
          {
            lessonId: "lesson_yoga_1",
            type: "video",
            title: "Basic Yoga Poses and Alignment",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 70,
          },
          {
            lessonId: "lesson_yoga_2",
            type: "video",
            title: "Breathing Techniques and Pranayama",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 45,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Ryan Anderson",
        studentEmail: "ryan.anderson@email.com",
        paidAmount: 1499
      }
    ],
    date: new Date("2024-03-10"),
    isPublished: true,
  },
  {
    instructorName: "Prof. James Wilson",
    title: "DevOps Engineering",
    category: "DevOps",
    level: "intermediate",
    primaryLanguage: "English",
    subtitle: "Complete DevOps Pipeline: CI/CD, Docker, Kubernetes, and Cloud",
    description: "Master DevOps practices and tools for modern software development. Learn Docker containerization, Kubernetes orchestration, CI/CD pipelines, infrastructure as code, monitoring, and cloud deployment strategies.",
    objectives: "Master Docker containerization and orchestration,Learn Kubernetes for container management,Implement CI/CD pipelines with Jenkins and GitLab,Understand infrastructure as code with Terraform,Master cloud platforms (AWS, Azure, GCP),Implement monitoring and logging solutions,Learn configuration management tools,Understand security in DevOps practices,Build scalable and reliable systems,Automate deployment and operations processes",
    image: getThumbnailUrl("DevOps"),
    pricing: 3799,
    curriculum: [
      {
        title: "Introduction to DevOps Culture and Practices",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 40
      },
      {
        title: "DevOps Tools Reference (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 30
      }
    ],
    modules: [
      {
        moduleId: "module_devops_1",
        title: "Containerization and Orchestration",
        lessons: [
          {
            lessonId: "lesson_devops_1",
            type: "video",
            title: "Docker Fundamentals and Best Practices",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 80,
          },
          {
            lessonId: "lesson_devops_2",
            type: "video",
            title: "Kubernetes Architecture and Deployment",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 90,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Michael Chen",
        studentEmail: "michael.chen@email.com",
        paidAmount: 3799
      }
    ],
    date: new Date("2024-03-15"),
    isPublished: true,
  },
  {
    instructorName: "Dr. Elena Petrov",
    title: "Artificial Intelligence Fundamentals",
    category: "AI",
    level: "intermediate",
    primaryLanguage: "English",
    subtitle: "Understanding AI: From Machine Learning to Deep Learning",
    description: "Explore the fascinating world of artificial intelligence. Learn about machine learning algorithms, neural networks, deep learning, natural language processing, computer vision, and AI ethics. Build AI applications and understand the future of AI.",
    objectives: "Understand AI concepts and applications,Master machine learning algorithms and techniques,Learn deep learning and neural networks,Explore natural language processing,Understand computer vision and image recognition,Learn about AI ethics and responsible AI,Build AI applications and models,Understand AI in business and industry,Explore emerging AI technologies,Prepare for AI career opportunities",
    image: getThumbnailUrl("AI"),
    pricing: 4299,
    curriculum: [
      {
        title: "AI Revolution: Past, Present, and Future",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 45
      },
      {
        title: "AI Algorithms Reference (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 35
      }
    ],
    modules: [
      {
        moduleId: "module_ai_1",
        title: "AI Fundamentals",
        lessons: [
          {
            lessonId: "lesson_ai_1",
            type: "video",
            title: "Introduction to Machine Learning",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 75,
          },
          {
            lessonId: "lesson_ai_2",
            type: "video",
            title: "Neural Networks and Deep Learning",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 85,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Sophie Johnson",
        studentEmail: "sophie.johnson@email.com",
        paidAmount: 4299
      }
    ],
    date: new Date("2024-03-20"),
    isPublished: true,
  },
  {
    instructorName: "Prof. Carlos Mendez",
    title: "Business Strategy and Entrepreneurship",
    category: "Business",
    level: "intermediate",
    primaryLanguage: "English",
    subtitle: "Building Successful Businesses: Strategy, Innovation, and Growth",
    description: "Learn the fundamentals of business strategy and entrepreneurship. Cover market analysis, business planning, financial management, marketing strategy, operations, and scaling businesses. Perfect for aspiring entrepreneurs and business professionals.",
    objectives: "Develop comprehensive business strategies,Understand market analysis and competitive positioning,Learn business planning and financial modeling,Master marketing and sales strategies,Understand operations and supply chain management,Learn about funding and investment strategies,Develop leadership and team management skills,Understand scaling and growth strategies,Learn about innovation and digital transformation,Prepare for entrepreneurial ventures",
    image: getThumbnailUrl("Business"),
    pricing: 2699,
    curriculum: [
      {
        title: "Entrepreneurship: From Idea to Success",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 38
      },
      {
        title: "Business Plan Template (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 25
      }
    ],
    modules: [
      {
        moduleId: "module_business_1",
        title: "Business Strategy",
        lessons: [
          {
            lessonId: "lesson_business_1",
            type: "video",
            title: "Market Analysis and Competitive Strategy",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 65,
          },
          {
            lessonId: "lesson_business_2",
            type: "video",
            title: "Financial Planning and Management",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 70,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Alex Thompson",
        studentEmail: "alex.thompson@email.com",
        paidAmount: 2699
      }
    ],
    date: new Date("2024-03-25"),
    isPublished: true,
  },
  {
    instructorName: "Dr. Priya Sharma",
    title: "Graphic Design Mastery",
    category: "Design",
    level: "beginner",
    primaryLanguage: "English",
    subtitle: "Professional Graphic Design: Adobe Creative Suite and Beyond",
    description: "Master professional graphic design using Adobe Creative Suite. Learn Photoshop, Illustrator, InDesign, and design principles. Create logos, branding materials, print designs, and digital graphics. Build a professional design portfolio.",
    objectives: "Master Adobe Photoshop for image editing and manipulation,Learn Adobe Illustrator for vector graphics and illustration,Understand Adobe InDesign for layout and publishing,Apply design principles and visual communication,Create professional logos and branding materials,Design print materials and publications,Develop digital graphics and web design elements,Build a comprehensive design portfolio,Understand color theory and typography,Learn about design trends and industry standards",
    image: getThumbnailUrl("Design"),
    pricing: 2199,
    curriculum: [
      {
        title: "Graphic Design: Visual Communication and Creativity",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 33
      },
      {
        title: "Design Software Guide (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 28
      }
    ],
    modules: [
      {
        moduleId: "module_graphic_1",
        title: "Design Software Mastery",
        lessons: [
          {
            lessonId: "lesson_graphic_1",
            type: "video",
            title: "Adobe Photoshop Fundamentals",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 75,
          },
          {
            lessonId: "lesson_graphic_2",
            type: "video",
            title: "Adobe Illustrator for Vector Graphics",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 80,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Maria Rodriguez",
        studentEmail: "maria.rodriguez@email.com",
        paidAmount: 2199
      }
    ],
    date: new Date("2024-03-30"),
    isPublished: true,
  },
  {
    instructorName: "Prof. Ahmed Hassan",
    title: "Social Media Marketing",
    category: "Marketing",
    level: "beginner",
    primaryLanguage: "English",
    subtitle: "Master Social Media: Strategy, Content, and Engagement",
    description: "Learn to create effective social media marketing campaigns across all major platforms. Master content creation, community management, influencer marketing, analytics, and paid advertising. Build brand awareness and drive engagement.",
    objectives: "Develop comprehensive social media strategies,Master content creation for different platforms,Learn community management and engagement tactics,Understand influencer marketing and partnerships,Implement paid advertising campaigns,Analyze social media metrics and ROI,Build brand awareness and customer loyalty,Create viral content and campaigns,Understand platform-specific best practices,Manage social media crises and reputation",
    image: getThumbnailUrl("Marketing"),
    pricing: 1899,
    curriculum: [
      {
        title: "Social Media: Connecting Brands with Audiences",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 28
      },
      {
        title: "Social Media Strategy Framework (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 22
      }
    ],
    modules: [
      {
        moduleId: "module_social_1",
        title: "Platform Mastery",
        lessons: [
          {
            lessonId: "lesson_social_1",
            type: "video",
            title: "Facebook and Instagram Marketing",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 60,
          },
          {
            lessonId: "lesson_social_2",
            type: "video",
            title: "LinkedIn and Twitter Strategies",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 55,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "David Kim",
        studentEmail: "david.kim@email.com",
        paidAmount: 1899
      }
    ],
    date: new Date("2024-04-01"),
    isPublished: true,
  },
  {
    instructorName: "Dr. Jennifer Liu",
    title: "Advanced Python for Data Science",
    category: "Data Science",
    level: "advanced",
    primaryLanguage: "English",
    subtitle: "Master Advanced Data Science Techniques with Python",
    description: "Take your data science skills to the next level with advanced Python techniques. Learn advanced pandas operations, machine learning pipelines, deep learning with TensorFlow, time series analysis, and big data processing. Work with real-world datasets and build production-ready data science applications.",
    objectives: "Master advanced pandas and NumPy operations,Implement machine learning pipelines with scikit-learn,Learn deep learning with TensorFlow and Keras,Perform time series analysis and forecasting,Work with big data using Dask and Spark,Implement advanced statistical modeling techniques,Create interactive visualizations with Plotly and Bokeh,Build production-ready data science applications,Understand MLOps and model deployment,Apply advanced feature engineering techniques",
    image: getThumbnailUrl("Data Science"),
    pricing: 4599,
    curriculum: [
      {
        title: "Advanced Data Science: Beyond the Basics",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 42
      },
      {
        title: "Advanced Python Libraries Reference (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 35
      },
      {
        title: "Setting Up Advanced Data Science Environment",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 38
      }
    ],
    modules: [
      {
        moduleId: "module_advanced_python_1",
        title: "Advanced Data Manipulation",
        lessons: [
          {
            lessonId: "lesson_advanced_1",
            type: "video",
            title: "Advanced Pandas Operations and Performance Optimization",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 85,
          },
          {
            lessonId: "lesson_advanced_2",
            type: "video",
            title: "NumPy Advanced Techniques and Vectorization",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 75,
          },
          {
            lessonId: "lesson_advanced_3",
            type: "video",
            title: "Data Cleaning and Preprocessing at Scale",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 90,
          }
        ],
      },
      {
        moduleId: "module_advanced_python_2",
        title: "Machine Learning and Deep Learning",
        lessons: [
          {
            lessonId: "lesson_advanced_4",
            type: "video",
            title: "Advanced Machine Learning Pipelines",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 95,
          },
          {
            lessonId: "lesson_advanced_5",
            type: "video",
            title: "Deep Learning with TensorFlow and Keras",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 100,
          },
          {
            lessonId: "lesson_advanced_6",
            type: "video",
            title: "Time Series Analysis and Forecasting",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 80,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Robert Kim",
        studentEmail: "robert.kim@email.com",
        paidAmount: 4599
      },
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Lisa Wang",
        studentEmail: "lisa.wang@email.com",
        paidAmount: 4599
      }
    ],
    date: new Date("2024-04-05"),
    isPublished: true,
  },
  {
    instructorName: "Prof. Marcus Johnson",
    title: "Full-Stack Web Development with Node.js",
    category: "Web Development",
    level: "intermediate",
    primaryLanguage: "English",
    subtitle: "Complete Full-Stack Development: Frontend to Backend",
    description: "Master full-stack web development using modern technologies. Learn React for frontend, Node.js and Express for backend, MongoDB for database, and deployment strategies. Build complete web applications from scratch and deploy them to production.",
    objectives: "Master React for building dynamic user interfaces,Learn Node.js and Express for server-side development,Understand MongoDB and database design,Implement authentication and authorization,Create RESTful APIs and GraphQL endpoints,Learn about microservices architecture,Master testing strategies for full-stack applications,Understand deployment and DevOps practices,Learn about performance optimization techniques,Build scalable and maintainable applications",
    image: getThumbnailUrl("Web Development"),
    pricing: 3299,
    curriculum: [
      {
        title: "Full-Stack Development: The Complete Picture",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 35
      },
      {
        title: "Full-Stack Architecture Guide (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 28
      },
      {
        title: "Setting Up Full-Stack Development Environment",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 32
      }
    ],
    modules: [
      {
        moduleId: "module_fullstack_1",
        title: "Frontend Development with React",
        lessons: [
          {
            lessonId: "lesson_fullstack_1",
            type: "video",
            title: "React Components and State Management",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 70,
          },
          {
            lessonId: "lesson_fullstack_2",
            type: "video",
            title: "React Hooks and Context API",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 65,
          },
          {
            lessonId: "lesson_fullstack_3",
            type: "video",
            title: "React Router and Navigation",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 55,
          }
        ],
      },
      {
        moduleId: "module_fullstack_2",
        title: "Backend Development with Node.js",
        lessons: [
          {
            lessonId: "lesson_fullstack_4",
            type: "video",
            title: "Node.js Fundamentals and Express Framework",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 80,
          },
          {
            lessonId: "lesson_fullstack_5",
            type: "video",
            title: "RESTful API Development and Testing",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 75,
          },
          {
            lessonId: "lesson_fullstack_6",
            type: "video",
            title: "Database Integration with MongoDB",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 85,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Sarah Chen",
        studentEmail: "sarah.chen@email.com",
        paidAmount: 3299
      }
    ],
    date: new Date("2024-04-10"),
    isPublished: true,
  },
  {
    instructorName: "Dr. Amanda Foster",
    title: "Advanced Machine Learning",
    category: "Machine Learning",
    level: "advanced",
    primaryLanguage: "English",
    subtitle: "Deep Dive into Advanced ML Algorithms and Techniques",
    description: "Master advanced machine learning concepts and algorithms. Learn ensemble methods, deep learning architectures, reinforcement learning, natural language processing, computer vision, and model optimization. Build sophisticated ML models for real-world applications.",
    objectives: "Master ensemble methods and advanced algorithms,Learn deep learning architectures and frameworks,Understand reinforcement learning concepts,Implement natural language processing techniques,Master computer vision and image recognition,Learn model optimization and hyperparameter tuning,Understand MLOps and model deployment,Apply advanced feature engineering techniques,Learn about model interpretability and explainability,Build production-ready ML systems",
    image: getThumbnailUrl("Machine Learning"),
    pricing: 4999,
    curriculum: [
      {
        title: "Advanced ML: Beyond Traditional Algorithms",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 48
      },
      {
        title: "Advanced ML Algorithms Reference (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 40
      },
      {
        title: "Setting Up Advanced ML Environment",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 45
      }
    ],
    modules: [
      {
        moduleId: "module_advanced_ml_1",
        title: "Ensemble Methods and Advanced Algorithms",
        lessons: [
          {
            lessonId: "lesson_advanced_ml_1",
            type: "video",
            title: "Random Forest and Gradient Boosting",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 90,
          },
          {
            lessonId: "lesson_advanced_ml_2",
            type: "video",
            title: "XGBoost and LightGBM Optimization",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 85,
          },
          {
            lessonId: "lesson_advanced_ml_3",
            type: "video",
            title: "Support Vector Machines and Kernel Methods",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 80,
          }
        ],
      },
      {
        moduleId: "module_advanced_ml_2",
        title: "Deep Learning and Neural Networks",
        lessons: [
          {
            lessonId: "lesson_advanced_ml_4",
            type: "video",
            title: "Convolutional Neural Networks (CNNs)",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 95,
          },
          {
            lessonId: "lesson_advanced_ml_5",
            type: "video",
            title: "Recurrent Neural Networks (RNNs) and LSTMs",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 100,
          },
          {
            lessonId: "lesson_advanced_ml_6",
            type: "video",
            title: "Transformer Architecture and Attention Mechanisms",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 110,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Kevin Park",
        studentEmail: "kevin.park@email.com",
        paidAmount: 4999
      },
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Emma Wilson",
        studentEmail: "emma.wilson@email.com",
        paidAmount: 4999
      }
    ],
    date: new Date("2024-04-15"),
    isPublished: true,
  },
  {
    instructorName: "Prof. Daniel Kim",
    title: "iOS App Development with Swift",
    category: "Mobile Development",
    level: "intermediate",
    primaryLanguage: "English",
    subtitle: "Build Native iOS Applications from Scratch",
    description: "Learn to build professional iOS applications using Swift and Xcode. Master iOS development fundamentals, UIKit, SwiftUI, Core Data, networking, and app store deployment. Create beautiful, functional iOS apps that users will love.",
    objectives: "Master Swift programming language fundamentals,Learn iOS development with UIKit and SwiftUI,Understand iOS app architecture and design patterns,Implement data persistence with Core Data,Learn networking and API integration,Master iOS user interface design principles,Understand app lifecycle and memory management,Learn about iOS security and best practices,Implement push notifications and background tasks,Deploy apps to the App Store",
    image: getThumbnailUrl("Mobile Development"),
    pricing: 3699,
    curriculum: [
      {
        title: "iOS Development: Building for Apple Ecosystem",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 40
      },
      {
        title: "iOS Development Guide (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 32
      },
      {
        title: "Setting Up iOS Development Environment",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 35
      }
    ],
    modules: [
      {
        moduleId: "module_ios_1",
        title: "Swift and iOS Fundamentals",
        lessons: [
          {
            lessonId: "lesson_ios_1",
            type: "video",
            title: "Swift Language Fundamentals and Syntax",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 75,
          },
          {
            lessonId: "lesson_ios_2",
            type: "video",
            title: "iOS App Architecture and MVC Pattern",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 70,
          },
          {
            lessonId: "lesson_ios_3",
            type: "video",
            title: "UIKit and Interface Builder",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 80,
          }
        ],
      },
      {
        moduleId: "module_ios_2",
        title: "Advanced iOS Development",
        lessons: [
          {
            lessonId: "lesson_ios_4",
            type: "video",
            title: "SwiftUI and Modern iOS Development",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 85,
          },
          {
            lessonId: "lesson_ios_5",
            type: "video",
            title: "Core Data and Data Persistence",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 90,
          },
          {
            lessonId: "lesson_ios_6",
            type: "video",
            title: "Networking and API Integration",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 75,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Jessica Lee",
        studentEmail: "jessica.lee@email.com",
        paidAmount: 3699
      }
    ],
    date: new Date("2024-04-20"),
    isPublished: true,
  },
  {
    instructorName: "Dr. Rachel Green",
    title: "Android App Development with Kotlin",
    category: "Mobile Development",
    level: "intermediate",
    primaryLanguage: "English",
    subtitle: "Master Android Development with Modern Kotlin",
    description: "Build professional Android applications using Kotlin and Android Studio. Learn Android development fundamentals, UI/UX design, data storage, networking, and Google Play Store deployment. Create engaging Android apps for millions of users.",
    objectives: "Master Kotlin programming language for Android,Learn Android development fundamentals and architecture,Understand Android UI/UX design principles,Implement data storage with Room database,Learn networking and API integration,Master Android app lifecycle and components,Understand Android security and permissions,Learn about background processing and services,Implement push notifications and Firebase integration,Deploy apps to Google Play Store",
    image: getThumbnailUrl("Mobile Development"),
    pricing: 3499,
    curriculum: [
      {
        title: "Android Development: Building for the World's Largest Platform",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 38
      },
      {
        title: "Android Development Guide (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 30
      },
      {
        title: "Setting Up Android Development Environment",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 33
      }
    ],
    modules: [
      {
        moduleId: "module_android_1",
        title: "Kotlin and Android Fundamentals",
        lessons: [
          {
            lessonId: "lesson_android_1",
            type: "video",
            title: "Kotlin Language Fundamentals for Android",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 80,
          },
          {
            lessonId: "lesson_android_2",
            type: "video",
            title: "Android App Architecture and Components",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 75,
          },
          {
            lessonId: "lesson_android_3",
            type: "video",
            title: "Android UI Design with XML and ConstraintLayout",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 70,
          }
        ],
      },
      {
        moduleId: "module_android_2",
        title: "Advanced Android Development",
        lessons: [
          {
            lessonId: "lesson_android_4",
            type: "video",
            title: "Room Database and Data Persistence",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 85,
          },
          {
            lessonId: "lesson_android_5",
            type: "video",
            title: "Retrofit and API Integration",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 80,
          },
          {
            lessonId: "lesson_android_6",
            type: "video",
            title: "Firebase Integration and Push Notifications",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 90,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Michael Brown",
        studentEmail: "michael.brown@email.com",
        paidAmount: 3499
      }
    ],
    date: new Date("2024-04-25"),
    isPublished: true,
  },
  {
    instructorName: "Prof. Lisa Martinez",
    title: "Advanced Cybersecurity",
    category: "Cybersecurity",
    level: "advanced",
    primaryLanguage: "English",
    subtitle: "Master Advanced Security Techniques and Threat Analysis",
    description: "Dive deep into advanced cybersecurity concepts and techniques. Learn advanced penetration testing, malware analysis, incident response, digital forensics, and security architecture. Prepare for senior cybersecurity roles and certifications.",
    objectives: "Master advanced penetration testing methodologies,Learn malware analysis and reverse engineering,Understand incident response and digital forensics,Implement advanced security architectures,Learn about threat hunting and intelligence,Master network security and monitoring,Understand cloud security and container security,Learn about security automation and orchestration,Implement zero-trust security models,Prepare for advanced cybersecurity certifications",
    image: getThumbnailUrl("Cybersecurity"),
    pricing: 5299,
    curriculum: [
      {
        title: "Advanced Cybersecurity: Protecting Against Sophisticated Threats",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 50
      },
      {
        title: "Advanced Security Tools Reference (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 42
      },
      {
        title: "Setting Up Advanced Security Lab Environment",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 45
      }
    ],
    modules: [
      {
        moduleId: "module_advanced_cyber_1",
        title: "Advanced Penetration Testing",
        lessons: [
          {
            lessonId: "lesson_advanced_cyber_1",
            type: "video",
            title: "Advanced Reconnaissance and Information Gathering",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 95,
          },
          {
            lessonId: "lesson_advanced_cyber_2",
            type: "video",
            title: "Exploit Development and Custom Payloads",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 100,
          },
          {
            lessonId: "lesson_advanced_cyber_3",
            type: "video",
            title: "Post-Exploitation and Persistence Techniques",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 90,
          }
        ],
      },
      {
        moduleId: "module_advanced_cyber_2",
        title: "Malware Analysis and Forensics",
        lessons: [
          {
            lessonId: "lesson_advanced_cyber_4",
            type: "video",
            title: "Static and Dynamic Malware Analysis",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 105,
          },
          {
            lessonId: "lesson_advanced_cyber_5",
            type: "video",
            title: "Digital Forensics and Evidence Collection",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 95,
          },
          {
            lessonId: "lesson_advanced_cyber_6",
            type: "video",
            title: "Incident Response and Threat Hunting",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 100,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Alex Thompson",
        studentEmail: "alex.thompson@email.com",
        paidAmount: 5299
      }
    ],
    date: new Date("2024-04-30"),
    isPublished: true,
  },
  {
    instructorName: "Dr. Thomas Anderson",
    title: "Cloud Architecture and AWS Solutions",
    category: "Cloud Computing",
    level: "advanced",
    primaryLanguage: "English",
    subtitle: "Design and Implement Scalable Cloud Solutions",
    description: "Master cloud architecture design and implementation using AWS services. Learn to design highly available, scalable, and cost-effective cloud solutions. Cover microservices, serverless architecture, containerization, and cloud security best practices.",
    objectives: "Design scalable and highly available cloud architectures,Master AWS core services and advanced features,Implement microservices and serverless architectures,Learn containerization with Docker and ECS/EKS,Understand cloud security and compliance requirements,Master cloud cost optimization strategies,Learn about cloud monitoring and observability,Implement CI/CD pipelines in the cloud,Understand disaster recovery and backup strategies,Design multi-region and hybrid cloud solutions",
    image: getThumbnailUrl("Cloud Computing"),
    pricing: 4199,
    curriculum: [
      {
        title: "Cloud Architecture: Building for Scale and Reliability",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 45
      },
      {
        title: "AWS Services Architecture Guide (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 38
      },
      {
        title: "Setting Up AWS Development Environment",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 40
      }
    ],
    modules: [
      {
        moduleId: "module_cloud_arch_1",
        title: "Cloud Architecture Fundamentals",
        lessons: [
          {
            lessonId: "lesson_cloud_arch_1",
            type: "video",
            title: "Cloud Architecture Principles and Design Patterns",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 90,
          },
          {
            lessonId: "lesson_cloud_arch_2",
            type: "video",
            title: "AWS Core Services and Networking",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 85,
          },
          {
            lessonId: "lesson_cloud_arch_3",
            type: "video",
            title: "Compute Services: EC2, Lambda, and ECS",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 95,
          }
        ],
      },
      {
        moduleId: "module_cloud_arch_2",
        title: "Advanced Cloud Solutions",
        lessons: [
          {
            lessonId: "lesson_cloud_arch_4",
            type: "video",
            title: "Microservices Architecture and API Gateway",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 100,
          },
          {
            lessonId: "lesson_cloud_arch_5",
            type: "video",
            title: "Serverless Architecture and Event-Driven Design",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 90,
          },
          {
            lessonId: "lesson_cloud_arch_6",
            type: "video",
            title: "Cloud Security and Compliance Implementation",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 85,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Jennifer Liu",
        studentEmail: "jennifer.liu@email.com",
        paidAmount: 4199
      }
    ],
    date: new Date("2024-05-05"),
    isPublished: true,
  },
  {
    instructorName: "Prof. Maria Santos",
    title: "Digital Marketing Analytics",
    category: "Marketing",
    level: "intermediate",
    primaryLanguage: "English",
    subtitle: "Data-Driven Marketing: Analytics and Optimization",
    description: "Learn to measure, analyze, and optimize digital marketing campaigns using data analytics. Master Google Analytics, social media analytics, conversion tracking, A/B testing, and marketing automation. Make data-driven decisions to improve ROI and campaign performance.",
    objectives: "Master Google Analytics and advanced tracking,Learn social media analytics and reporting,Implement conversion tracking and attribution modeling,Understand A/B testing and statistical significance,Master marketing automation and lead nurturing,Learn about customer journey analytics,Understand predictive analytics for marketing,Implement marketing dashboards and KPIs,Learn about privacy regulations and data compliance,Optimize marketing campaigns based on data insights",
    image: getThumbnailUrl("Marketing"),
    pricing: 2399,
    curriculum: [
      {
        title: "Marketing Analytics: Turning Data into Insights",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 32
      },
      {
        title: "Marketing Analytics Tools Guide (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 26
      },
      {
        title: "Setting Up Analytics and Tracking",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 28
      }
    ],
    modules: [
      {
        moduleId: "module_marketing_analytics_1",
        title: "Analytics Fundamentals",
        lessons: [
          {
            lessonId: "lesson_marketing_analytics_1",
            type: "video",
            title: "Google Analytics Setup and Configuration",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 70,
          },
          {
            lessonId: "lesson_marketing_analytics_2",
            type: "video",
            title: "Conversion Tracking and Goal Setting",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 65,
          },
          {
            lessonId: "lesson_marketing_analytics_3",
            type: "video",
            title: "Attribution Modeling and Customer Journey",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 75,
          }
        ],
      },
      {
        moduleId: "module_marketing_analytics_2",
        title: "Advanced Analytics and Optimization",
        lessons: [
          {
            lessonId: "lesson_marketing_analytics_4",
            type: "video",
            title: "A/B Testing and Statistical Analysis",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 80,
          },
          {
            lessonId: "lesson_marketing_analytics_5",
            type: "video",
            title: "Marketing Automation and Lead Scoring",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 75,
          },
          {
            lessonId: "lesson_marketing_analytics_6",
            type: "video",
            title: "Predictive Analytics and Machine Learning for Marketing",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 85,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "David Rodriguez",
        studentEmail: "david.rodriguez@email.com",
        paidAmount: 2399
      }
    ],
    date: new Date("2024-05-10"),
    isPublished: true,
  },
  {
    instructorName: "Dr. Sarah Kim",
    title: "Advanced React Development",
    category: "React",
    level: "advanced",
    primaryLanguage: "English",
    subtitle: "Master Advanced React Patterns and Performance Optimization",
    description: "Take your React skills to the next level with advanced patterns, performance optimization, and modern development practices. Learn advanced hooks, context optimization, code splitting, testing strategies, and build scalable React applications.",
    objectives: "Master advanced React hooks and custom hooks,Learn performance optimization techniques,Understand advanced state management patterns,Implement code splitting and lazy loading,Master React testing strategies and tools,Learn about React internals and reconciliation,Understand advanced routing and navigation,Implement accessibility best practices,Learn about React security considerations,Build scalable and maintainable React applications",
    image: getThumbnailUrl("React"),
    pricing: 2899,
    curriculum: [
      {
        title: "Advanced React: Beyond the Basics",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 38
      },
      {
        title: "Advanced React Patterns Guide (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 32
      },
      {
        title: "Setting Up Advanced React Development Environment",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 35
      }
    ],
    modules: [
      {
        moduleId: "module_advanced_react_1",
        title: "Advanced React Patterns",
        lessons: [
          {
            lessonId: "lesson_advanced_react_1",
            type: "video",
            title: "Advanced Hooks and Custom Hook Patterns",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 85,
          },
          {
            lessonId: "lesson_advanced_react_2",
            type: "video",
            title: "Context Optimization and State Management",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 80,
          },
          {
            lessonId: "lesson_advanced_react_3",
            type: "video",
            title: "Render Props and Higher-Order Components",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 75,
          }
        ],
      },
      {
        moduleId: "module_advanced_react_2",
        title: "Performance and Optimization",
        lessons: [
          {
            lessonId: "lesson_advanced_react_4",
            type: "video",
            title: "React Performance Optimization Techniques",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 90,
          },
          {
            lessonId: "lesson_advanced_react_5",
            type: "video",
            title: "Code Splitting and Lazy Loading",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 70,
          },
          {
            lessonId: "lesson_advanced_react_6",
            type: "video",
            title: "React Testing with Jest and React Testing Library",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 85,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Emily Chen",
        studentEmail: "emily.chen@email.com",
        paidAmount: 2899
      }
    ],
    date: new Date("2024-05-15"),
    isPublished: true,
  },
  {
    instructorName: "Prof. James Wilson",
    title: "Blockchain Development",
    category: "Programming",
    level: "intermediate",
    primaryLanguage: "English",
    subtitle: "Build Decentralized Applications with Blockchain Technology",
    description: "Learn blockchain development from fundamentals to advanced concepts. Master smart contracts, decentralized applications (DApps), cryptocurrency development, and blockchain security. Build real-world blockchain applications and understand the future of decentralized technology.",
    objectives: "Understand blockchain fundamentals and architecture,Master smart contract development with Solidity,Learn to build decentralized applications (DApps),Understand cryptocurrency and token development,Learn about blockchain security and best practices,Master Web3.js and blockchain interaction,Understand DeFi and NFT development,Learn about blockchain testing and deployment,Understand consensus mechanisms and mining,Explore blockchain use cases and applications",
    image: getThumbnailUrl("Programming"),
    pricing: 3999,
    curriculum: [
      {
        title: "Blockchain: The Future of Decentralized Technology",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 42
      },
      {
        title: "Blockchain Development Guide (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 35
      },
      {
        title: "Setting Up Blockchain Development Environment",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 38
      }
    ],
    modules: [
      {
        moduleId: "module_blockchain_1",
        title: "Blockchain Fundamentals",
        lessons: [
          {
            lessonId: "lesson_blockchain_1",
            type: "video",
            title: "Blockchain Architecture and Consensus Mechanisms",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 90,
          },
          {
            lessonId: "lesson_blockchain_2",
            type: "video",
            title: "Cryptocurrency and Digital Wallets",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 85,
          },
          {
            lessonId: "lesson_blockchain_3",
            type: "video",
            title: "Ethereum and Smart Contract Basics",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 95,
          }
        ],
      },
      {
        moduleId: "module_blockchain_2",
        title: "Smart Contract Development",
        lessons: [
          {
            lessonId: "lesson_blockchain_4",
            type: "video",
            title: "Solidity Programming Language",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 100,
          },
          {
            lessonId: "lesson_blockchain_5",
            type: "video",
            title: "DApp Development with Web3.js",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 90,
          },
          {
            lessonId: "lesson_blockchain_6",
            type: "video",
            title: "DeFi and NFT Development",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 95,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Michael Johnson",
        studentEmail: "michael.johnson@email.com",
        paidAmount: 3999
      }
    ],
    date: new Date("2024-05-20"),
    isPublished: true,
  },
  {
    instructorName: "Dr. Anna Petrov",
    title: "Advanced Photography Techniques",
    category: "Photography",
    level: "intermediate",
    primaryLanguage: "English",
    subtitle: "Master Professional Photography: Advanced Techniques and Business",
    description: "Elevate your photography skills with advanced techniques, professional workflows, and business strategies. Learn advanced lighting, composition, post-processing, and how to build a successful photography business. Perfect for aspiring professional photographers.",
    objectives: "Master advanced lighting techniques and studio photography,Learn professional composition and visual storytelling,Understand advanced camera settings and manual controls,Master post-processing with Lightroom and Photoshop,Learn about different photography genres and specializations,Understand photography business and marketing,Learn about client management and pricing,Master portfolio development and presentation,Understand copyright and legal aspects,Learn about photography equipment and gear selection",
    image: getThumbnailUrl("Photography"),
    pricing: 2199,
    curriculum: [
      {
        title: "Advanced Photography: Beyond the Basics",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 35
      },
      {
        title: "Advanced Photography Techniques Guide (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 28
      },
      {
        title: "Setting Up Professional Photography Workflow",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 32
      }
    ],
    modules: [
      {
        moduleId: "module_advanced_photo_1",
        title: "Advanced Photography Techniques",
        lessons: [
          {
            lessonId: "lesson_advanced_photo_1",
            type: "video",
            title: "Advanced Lighting Techniques and Studio Setup",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 85,
          },
          {
            lessonId: "lesson_advanced_photo_2",
            type: "video",
            title: "Professional Composition and Visual Storytelling",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 80,
          },
          {
            lessonId: "lesson_advanced_photo_3",
            type: "video",
            title: "Advanced Camera Settings and Manual Controls",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 75,
          }
        ],
      },
      {
        moduleId: "module_advanced_photo_2",
        title: "Post-Processing and Business",
        lessons: [
          {
            lessonId: "lesson_advanced_photo_4",
            type: "video",
            title: "Advanced Post-Processing with Lightroom and Photoshop",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 90,
          },
          {
            lessonId: "lesson_advanced_photo_5",
            type: "video",
            title: "Photography Business and Client Management",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 85,
          },
          {
            lessonId: "lesson_advanced_photo_6",
            type: "video",
            title: "Portfolio Development and Marketing Strategies",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 80,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Sophie Anderson",
        studentEmail: "sophie.anderson@email.com",
        paidAmount: 2199
      }
    ],
    date: new Date("2024-05-25"),
    isPublished: true,
  },
  {
    instructorName: "Prof. Carlos Mendez",
    title: "Advanced Business Analytics",
    category: "Business",
    level: "advanced",
    primaryLanguage: "English",
    subtitle: "Data-Driven Business Decisions and Strategic Analytics",
    description: "Master advanced business analytics to drive strategic decisions and business growth. Learn predictive analytics, business intelligence, data visualization, and how to build analytics-driven organizations. Perfect for business leaders and analysts.",
    objectives: "Master advanced business analytics and statistical methods,Learn predictive analytics and forecasting techniques,Understand business intelligence and data warehousing,Master data visualization and dashboard creation,Learn about customer analytics and segmentation,Understand financial analytics and risk management,Learn about operational analytics and optimization,Master analytics project management,Understand data governance and quality management,Build analytics-driven business strategies",
    image: getThumbnailUrl("Business"),
    pricing: 3199,
    curriculum: [
      {
        title: "Business Analytics: Driving Strategic Decisions",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 40
      },
      {
        title: "Business Analytics Framework Guide (PDF)",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        type: "pdf",
        duration: 33
      },
      {
        title: "Setting Up Business Analytics Environment",
        videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        freePreview: true,
        type: "video",
        duration: 37
      }
    ],
    modules: [
      {
        moduleId: "module_business_analytics_1",
        title: "Advanced Analytics Methods",
        lessons: [
          {
            lessonId: "lesson_business_analytics_1",
            type: "video",
            title: "Predictive Analytics and Statistical Modeling",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 90,
          },
          {
            lessonId: "lesson_business_analytics_2",
            type: "video",
            title: "Customer Analytics and Segmentation",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 85,
          },
          {
            lessonId: "lesson_business_analytics_3",
            type: "video",
            title: "Financial Analytics and Risk Management",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 80,
          }
        ],
      },
      {
        moduleId: "module_business_analytics_2",
        title: "Business Intelligence and Strategy",
        lessons: [
          {
            lessonId: "lesson_business_analytics_4",
            type: "video",
            title: "Business Intelligence and Data Warehousing",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 95,
          },
          {
            lessonId: "lesson_business_analytics_5",
            type: "video",
            title: "Data Visualization and Dashboard Creation",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 85,
          },
          {
            lessonId: "lesson_business_analytics_6",
            type: "video",
            title: "Analytics-Driven Business Strategy",
            fileUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
            duration: 90,
          }
        ],
      }
    ],
    students: [
      {
        studentId: new mongoose.Types.ObjectId(),
        studentName: "Robert Davis",
        studentEmail: "robert.davis@email.com",
        paidAmount: 3199
      }
    ],
    date: new Date("2024-05-30"),
    isPublished: true,
  }
];

// Add the additional 20 courses to the main courses array
moreCourses.forEach(course => {
  courses.push(course);
});

async function seedCourses() {
  try {
    require("dotenv").config({ path: "../.env" });
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/mern-lms";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding courses");

    await Course.deleteMany({});
    console.log("Cleared existing courses");

    // Get a teacher user to assign as teacherId
    const teacher = await User.findOne({ role: 'teacher' });
    if (!teacher) {
      console.log("No teacher found, creating a default teacher...");
      const defaultTeacher = new User({
        name: "Default Teacher",
        email: "teacher@example.com",
        password: "hashedpassword",
        role: "teacher"
      });
      await defaultTeacher.save();
      console.log("Created default teacher");
    }

    const teacherUser = await User.findOne({ role: 'teacher' });

    // Add teacherId to all courses
    const coursesWithTeacher = courses.map(course => ({
      ...course,
      teacherId: teacherUser._id
    }));

    await Course.insertMany(coursesWithTeacher);
    console.log(`Successfully seeded ${courses.length} courses with rich content`);

    // Log course details
    courses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title} by ${course.instructorName}`);
      console.log(`   - Category: ${course.category}`);
      console.log(`   - Price: ₹${course.pricing}`);
      console.log(`   - Students: ${course.students.length}`);
      console.log(`   - Modules: ${course.modules.length}`);
      console.log(`   - Curriculum Items: ${course.curriculum.length}`);
      console.log(`   - Thumbnail: ${course.image}`);
      console.log("");
    });

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding courses:", error);
    process.exit(1);
  }
}

seedCourses();