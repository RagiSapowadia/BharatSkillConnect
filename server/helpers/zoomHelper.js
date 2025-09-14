// server/helpers/zoomHelper.js

const axios = require('axios');
const qs = require('qs');

/**
 * Retrieves a Zoom access token using the Server-to-Server OAuth flow.
 * @returns {string} The access token.
 */
const getZoomAccessToken = async () => {
    try {
        const payload = qs.stringify({
            grant_type: 'account_credentials',
            account_id: process.env.ZOOM_ACCOUNT_ID
        });

        const token = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64');

        const response = await axios.post('https://zoom.us/oauth/token', payload, {
            headers: {
                'Authorization': `Basic ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return response.data.access_token;

    } catch (error) {
        console.error('Error getting Zoom access token:', error.response ? error.response.data : error.message);
        throw new Error('Failed to get Zoom access token.');
    }
};

/**
 * Creates a scheduled Zoom meeting.
 * @param {object} options - Meeting details.
 * @param {string} options.topic - The meeting topic.
 * @param {string} options.startTime - The meeting start time (ISO 8601 format).
 * @param {number} options.duration - The meeting duration in minutes.
 * @param {string} options.hostEmail - The email of the host.
 * @returns {object} An object containing the join and start URLs.
 */
const createZoomMeeting = async ({ topic, startTime, duration, hostEmail }) => {
    try {
        const accessToken = await getZoomAccessToken();
        const response = await axios.post(
            `https://api.zoom.us/v2/users/${hostEmail}/meetings`,
            {
                topic: topic,
                type: 2, // Scheduled meeting
                start_time: startTime,
                duration: duration,
                timezone: 'Asia/Kolkata', // Set your timezone
                settings: {
                    host_video: true,
                    participant_video: true,
                    join_before_host: true
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return {
            joinUrl: response.data.join_url,
            startUrl: response.data.start_url
        };
    } catch (error) {
        console.error('Error creating Zoom meeting:', error.response ? error.response.data : error.message);
        throw new Error('Failed to create Zoom meeting.');
    }
};

module.exports = {
    createZoomMeeting
};
