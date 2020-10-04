const express = require('express');
const sendEmail = require('../mailer/mailer');
const router = express.Router();

router.post('/sendmail', async (req, res) => {
    try {
        const result = await sendEmail(req.body);
        
        res.json({
            status: true,
            playload: result
        });
    } catch(error) {
        console.error(error.message);
        res.json({
            status: false,
            playload: "Something went wrong in sending the email."
        });
    }
});

module.exports = router; 