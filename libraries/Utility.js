const dotenv = require('dotenv').config()
const _config = require('./../config/app.json')
const Utility = {
    rand_str:function(len,charset){
        if(!len) len = 3;
        if(!charset) charset = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";
        var text = "";
        for( var i=0; i < len; i++ )
            text += charset.charAt(Math.floor(Math.random() * charset.length));
        return text;
    },
    date_time: function(dt){
        var moment = require('moment-timezone');
        return moment.tz(dt, "Africa/Lagos").format('YYYY-MM-DD HH:mm:ss');
    },
    extract_param: function(req){
        var data = {}
        if (req.field) {
            data = req.field
        } else if(req.body){
            data = req.body
        }
        return data;
    },
    resp: function(res){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        return res;
    },
    get_hash: function(value) {
        const bcrypt = require('bcrypt')
        const saltRounds = bcrypt.genSaltSync(_config.bcrypt._rounds)
        return bcrypt.hashSync(value, saltRounds)    
    },
    generate_token:  function(payload) {
        const jwt = require('jsonwebtoken')
        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRY})
        return token;
    },
    check_password: function(value1, value2) {
        const bcrypt = require('bcrypt')
        const result = bcrypt.compareSync(value1, value2)
        return result
    },
    encode_url: function(string) {
        var sha = require('sha256')
        const encrypt = sha.x2(string)
        return encrypt
    },
    compare_param: function(a,b) {
        if (a == b){
            return true;
        } else 
            return false;
    }
}

module.exports = Utility