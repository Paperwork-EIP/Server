const { Router } = require('express');
const router = new Router();
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const ses = new AWS.SES();

router.get('/sendEmail', async (request, response) => {
    try {
        const { email, content, name } = request.query;
        if (!email || !content || !name) {
            return response.status(400).json({ message: 'Missing parameters.' });
        }
        const params = {
            Destination: {
                ToAddresses: ['emma.rulliere@epitech.eu']
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Process proposal</title></head><body><h1>Process proposition send by ${name}, email: ${email}</h1><p>${content}</p></body></html>`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "Process proposition"
                }
            },
            Source: process.env.EMAIL
        };
        await ses.sendEmail(params).promise();
        return response.status(200).json({ message: 'Email send.' });
    }
    catch (error) {
        console.log(error);
        return response.status(500).json({ message: 'System error.' });
    }
});

module.exports = router;