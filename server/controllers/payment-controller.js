const Stripe = require("stripe");
const Enrollment = require("../models/Enrollment");
const Order = require("../models/Order");
const Course = require("../models/Course");

// Initialize Stripe only if secret key is provided
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Create Stripe payment intent
const createStripePaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "usd", courseId, userId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency,
      metadata: {
        courseId,
        userId,
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      courseId,
      userId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create Stripe payment intent",
    });
  }
};

// Handle Stripe webhook
const handleStripeWebhook = async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const { courseId, userId } = paymentIntent.metadata;

      // Create enrollment
      const enrollment = new Enrollment({
        userId,
        courseId,
        paymentStatus: "success",
      });
      await enrollment.save();

      console.log("Enrollment created for successful Stripe payment");
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Webhook handling error",
    });
  }
};

module.exports = {
  createStripePaymentIntent,
  handleStripeWebhook,
  // Create a Checkout Session (no webhooks required)
  createStripeCheckoutSession: async (req, res) => {
    try {
      if (!stripe) {
        return res.status(400).json({ 
          success: false, 
          message: "Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables." 
        });
      }
      
      const { amount, courseId, userId, courseTitle } = req.body;
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              unit_amount: Math.round((Number(amount) || 0) * 100),
              product_data: {
                name: courseTitle || "Course",
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.CLIENT_URL}/payment-return?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
        metadata: { courseId, userId },
      });
      res.status(200).json({ success: true, url: session.url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to create Stripe Checkout session" });
    }
  },
  // Verify Checkout Session after redirect and enroll student
  verifyStripeCheckoutSuccess: async (req, res) => {
    try {
      if (!stripe) {
        return res.status(400).json({ 
          success: false, 
          message: "Stripe is not configured." 
        });
      }
      
      const { session_id } = req.query;
      if (!session_id) return res.status(400).json({ success: false, message: "Missing session_id" });
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status === "paid") {
        const courseId = session.metadata.courseId;
        const userId = session.metadata.userId;
        const course = await Course.findById(courseId);
        
        // Create an enrollment if not exists
        const existing = await Enrollment.findOne({ userId, courseId });
        if (!existing) {
          await new Enrollment({ userId, courseId, paymentStatus: "success" }).save();
        }

        // Also update StudentCourses model for consistency
        const StudentCourses = require("../models/StudentCourses");
        const studentCourses = await StudentCourses.findOne({ userId });
        
        if (studentCourses) {
          // Check if course is already in the list
          const courseExists = studentCourses.courses.some(c => c.courseId === courseId);
          if (!courseExists) {
            studentCourses.courses.push({
              courseId: courseId,
              title: course?.title || "",
              instructorId: course?.teacherId || "",
              instructorName: "",
              dateOfPurchase: new Date(),
              courseImage: course?.image || "",
            });
            await studentCourses.save();
          }
        } else {
          // Create new StudentCourses entry
          const newStudentCourses = new StudentCourses({
            userId: userId,
            courses: [{
              courseId: courseId,
              title: course?.title || "",
              instructorId: course?.teacherId || "",
              instructorName: "",
              dateOfPurchase: new Date(),
              courseImage: course?.image || "",
            }],
          });
          await newStudentCourses.save();
        }

        // Track order minimally
        await new Order({
          userId,
          userName: "",
          userEmail: "",
          orderStatus: "confirmed",
          paymentMethod: "stripe",
          paymentStatus: "paid",
          orderDate: new Date(),
          instructorId: course?.teacherId,
          instructorName: "",
          courseImage: course?.image,
          courseTitle: course?.title,
          courseId: courseId,
          coursePricing: (session.amount_total || 0) / 100,
        }).save().catch(() => {});

        return res.status(200).json({ success: true, courseId });
      }
      res.status(200).json({ success: false, message: "Payment not completed" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Verification failed" });
    }
  },
};
