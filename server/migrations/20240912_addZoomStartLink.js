// server/migrations/20240912_addZoomStartLink.js

const mongoose = require('mongoose');
const LiveSession = require('../models/LiveSession');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the root folder
dotenv.config({ path: path.join(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGO_URI;

const runMigration = async () => {
    // Check if the URI is defined before connecting
    if (!MONGODB_URI) {
        console.error('Error: MONGODB_URI is not defined in the .env file.');
        console.error('Please ensure your .env file is at the root of your project and contains the MONGODB_URI variable.');
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected for migration.');

        const updateResult = await LiveSession.updateMany(
            { zoomStartLink: { $exists: false } }, // Find documents without the new field
            { $set: { zoomStartLink: null } }      // Set a default value of null
        );

        console.log(`Migration successful! Updated ${updateResult.nModified} documents.`);

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        mongoose.disconnect();
    }
};

runMigration();
