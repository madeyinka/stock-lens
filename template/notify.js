const _config = require('./../config/app.json')
const dotenv = require('dotenv')

const Template = {

    verify_msg: function(options) {
        const html = `
            <p>Dear ${options.fname},</p>
            <p>Use the link below to set your secured password and activate your account.</p>
            <p><a href="${'http://'+_config.app_url+':'+process.env.PORT+_config.app_base+_config.api._url+_config.api._version+'/auth/verify?user='+options.identity+'&passkey='+options.passkey}">Verify</a></p>
        `
        return html
    },

    confirm_msg: function(user) {
        const html = `
            <h5>Hi ${user.name}!</h5>
            <p>Your account have been verified</p>
            <p>Your password is: ${user.password} </p>
            <p>You are required to change your password upon login.</p>
            <p>Cheers!</p>
        `
        return html
    }

}

module.exports = Template;