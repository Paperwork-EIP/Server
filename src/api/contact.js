const { Router } = require('express');
const router = new Router();
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const ses = new AWS.SES();

router.get('/sendEmail', async (request, response) => {
    try {
        const { email, description, name } = request.query;
        if (!email || !description || !name) {
            return response.status(400).json({ message: 'Missing parameters.' });
        }
        const params = {
            Destination: {
                ToAddresses: ['paperwork_2024@labeip.epitech.eu']
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: `<!DOCTYPE html><html lang="en\"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${name}</title></head><body><h1>Process proposition send by ${email}</h1><p>${description}</p></body></html>`
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