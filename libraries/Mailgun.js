const mailgun = require('mailgun-js')
const dotenv = require('dotenv')

const MailGun = {

    sendMail: function(options, callback) {
        const _client = mailgun({ apiKey: process.env.MAILGUN_KEY, domain: process.env.MAILGUN_DOMAIN})
        const mailOption = {
            from: process.env.ADMIN_EMAIL,
            to: options.email,
            subject: options.subject,
            html: options.message
        }
        _client.messages().send(mailOption, (err,response) => {
            if (err){
                return callback(false)
            }else {
                return callback(true)
            }
        })
    }
}

module.exports = MailGun;