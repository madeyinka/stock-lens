const winston = require('winston')
const Util = require('./Utility')

const Logger = {
    init: function(param){
        var _date = Util.date_time(new Date())
        if(!param.type) param.type = "info";
        (param.data) ? param.data.log_date =  _date : param.data = {log_date: _date}
        winston.log(param.type, param.msg, param.data)
    }
}

module.exports = Logger