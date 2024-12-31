// Import required libraries
const express = require('express');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const cors = require('cors');
const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const moment = require('moment');
const qs = require('qs');

// Initialize Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Update this to your frontend origin
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type,Authorization'
}));

// ZaloPay configuration
const config = {
  app_id: process.env.ZALOPAY_APP_ID || "2553",
  key1: process.env.ZALOPAY_KEY1 || "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: process.env.ZALOPAY_KEY2 || "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

// Payment route
app.post('/payment/zalo', async (req, res) => {
    const { amount, description } = req.body; // Get amount and description from request body
    const embed_data = {
      redirecturl: 'http://localhost:3000/success',
    };
  
    const items = [];
    const transID = Math.floor(Math.random() * 1000000);
  
    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
      app_user: 'user123',
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: amount || 50000, // Use the amount from request body or default to 50000
      callback_url: 'https://f137-116-96-47-40.ngrok-free.app/callback',
      description: description || `Payment for order #${transID}`,
      bank_code: '',
    };
  
    const data =
      config.app_id +
      '|' +
      order.app_trans_id +
      '|' +
      order.app_user +
      '|' +
      order.amount +
      '|' +
      order.app_time +
      '|' +
      order.embed_data +
      '|' +
      order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
  
    try {
      const result = await axios.post(config.endpoint, null, { params: order });
      return res.status(200).json(result.data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Payment request failed' });
    }
});

// Callback route for ZaloPay
app.post('/callback', (req, res) => {
    let result = {};
    console.log(req.body);
    try {
      let dataStr = req.body.data;
      let reqMac = req.body.mac;
  
      let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
      console.log('mac =', mac);
  
      if (reqMac !== mac) {
        result.return_code = -1;
        result.return_message = 'mac not equal';
      } else {
        let dataJson = JSON.parse(dataStr);
        console.log("update order's status = success where app_trans_id =", dataJson['app_trans_id']);
  
        result.return_code = 1;
        result.return_message = 'success';
      }
    } catch (ex) {
      console.log('error:::' + ex.message);
      result.return_code = 0;
      result.return_message = ex.message;
    }
  
    res.json(result);
});

// Check status route
app.post('/check-status-order', async (req, res) => {
    const { app_trans_id } = req.body;
  
    let postData = {
      app_id: config.app_id,
      app_trans_id,
    };
  
    let data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1;
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
  
    let postConfig = {
      method: 'post',
      url: 'https://sb-openapi.zalopay.vn/v2/query',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify(postData),
    };
  
    try {
      const result = await axios(postConfig);
      console.log(result.data);
      return res.status(200).json(result.data);
    } catch (error) {
      console.log('error');
      console.log(error);
      return res.status(500).json({ error: 'Failed to check order status' });
    }
});

// Email configuration
const APP_PORT = process.env.APP_PORT || 4000;
const APP_HOST = process.env.APP_HOST || 'localhost';
const GOOGLE_MAILER_CLIENT_ID = process.env.GOOGLE_MAILER_CLIENT_ID || '902591770184-19tnt5arl18kctg6er347p2veisl9btf.apps.googleusercontent.com';
const GOOGLE_MAILER_CLIENT_SECRET = process.env.GOOGLE_MAILER_CLIENT_SECRET || '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';
const GOOGLE_MAILER_REFRESH_TOKEN = process.env.GOOGLE_MAILER_REFRESH_TOKEN || '1//04ZVy6OXlUDWUCgYIARAAGAQSNwF-L9IrEado31PCkSkQPb388_4JnvGWRswsth1PImLCh7WT7IV3kBFAiFrS9PX4EXEV_6auQLQ';
const ADMIN_EMAIL_ADDRESS = process.env.ADMIN_EMAIL_ADDRESS || 'nhatyhnl1258@gmail.com';

const myOAuth2Client = new OAuth2Client(
  GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_MAILER_CLIENT_SECRET
);

myOAuth2Client.setCredentials({
  refresh_token: GOOGLE_MAILER_REFRESH_TOKEN
});

app.post('/email/send', async (req, res) => {
  try {
    const { email, subject, content } = req.body;
    if (!email || !subject || !content) throw new Error('Please provide email, subject and content!');

    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    const myAccessToken = myAccessTokenObject?.token;

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: ADMIN_EMAIL_ADDRESS,
        clientId: GOOGLE_MAILER_CLIENT_ID,
        clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
        refreshToken: GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: myAccessToken
      }
    });

    const mailOptions = {
      to: email,
      subject: subject,
      html: `<h3>${content}</h3>`
    };

    await transport.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Error in /email/send:', error);
    res.status(500).json({ errors: error.message });
  }
});

// Start server
app.listen(APP_PORT, APP_HOST, () => {
  console.log(`Server running at ${APP_HOST}:${APP_PORT}/`);
});
