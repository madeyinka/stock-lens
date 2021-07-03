const Resp = require('./Response')
const Util = require('../libraries/Utility')
const userModel = require('../model/maps/UserModel')
const _config = require('../config/app.json')
const mailgun = require('../libraries/Mailgun')
const { verify_msg, confirm_msg } = require('../template/notify')


var initAuth = {

    register: function(param, callback) {
        var error = []
        if(!param.fname)error.push('Provide First Name')
        if(!param.lname)error.push('Provide Last Name')
        if(!param.email)error.push('Provide email address')
        if(!param.phone)error.push('Provide Phone Number')
        if(!param.role)error.push('Select User Role')
        if(!param.station_id)error.push('User must be assigned to station')
        if(!param.branch_id)error.push('Station should have a branch')
        
        if (error.length == 0) {
            var data = {
                identity: Util.uuid(param.email),
                fname: param.fname,
                lname: param.lname,
                email: param.email,
                passkey:Util.rand_str(25),
                role: param.role,
                phone: param.phone,
                station_id: param.station_id,
                branch_id: param.branch_id
            }
            userModel.find(data.identity, function(state){
                if (!state) {
                    userModel.save(data.identity, data, (resp) => {
                        if (resp.identity && !resp.error) {
                            const options = {
                                email:resp.email,
                                subject:_config.mail_subject.verify,
                                message: verify_msg(resp)
                            }
                            mailgun.sendMail(options, (state) => {
                                if (state){
                                    return callback(Resp.success({msg: "Check your email for verification", resp:resp}))
                                } else {
                                    return callback(Resp.error({msg: "Something went wrong while saving data", resp:{}}))
                                }
                            })
                        } 
                    })
                } else {
                    return callback(Resp.error({msg: "User already exists!"}))
                }
                          
            })
        }
    },

    verify: function(req, callback) {
        var query_id = req.user, query_key = req.passkey;
        if (query_id && query_key) {
            userModel.find(query_id, (state) => {
                if (state){
                    const validate = Util.compare_param(query_key, state.passkey)
                    if (validate) {
                        const password = Util.rand_str(10)
                        var data = {password: Util.get_hash(password), passkey:Util.rand_str(25), status:"active"}
                        userModel.update(data, query_id, (resp) =>{
                            if (resp && !resp.error) {
                                const options = {
                                    email:resp.email,
                                    subject:_config.mail_subject.confirm,
                                    message:confirm_msg({name: resp.fname, password: password})
                                }
                                mailgun.sendMail(options, (state) => {
                                    if(state){
                                        return callback(Resp.success({msg:"Account Activated.", resp:resp}))
                                    } else {
                                        return callback(Resp.error({msg:"Network error encountered"}))
                                    }
                                })
                            }
                        })
                    } else{
                        return callback(Resp.error({msg:"Link is no longer valid"}))
                    }
                } else{
                    return callback(Resp.error({msg: "User does not exists"}))
                }
            })
        } else {
            return callback(Resp.error({msg:"Invalid or Expired Link"}))
        }
    },

    login: function(param, callback) {
        var error = []
        if(!param.email)error.push("Provide email")
        if(!param.password) error.push("Provide password")

        if (error.length == 0) {
            userModel.find(Util.uuid(param.email), (user) => {
               if (user && !user.error) {
                   if (user.status == 'active'){
                       var match = Util.check_password(param.password, user.password)
                       if (match){
                           const payload = {id:user.identity,name:user.fname,email:user.email,role:user.role,station_id:user.station_id,branch_id:user.branch_id}
                           const token = Util.generate_token(payload)
                           return callback(Resp.success({msg:"Login Successful", resp:token}))
                       } else {
                           return callback(Resp.error({msg: "Incorrect Password"}))
                       }
                   }else {
                       return callback(Resp.error({msg:"Account not activated, check your mail."}))
                   }
               }else {
                   return callback(Resp.error({msg:"User does not exist."}))
               }
            })
        }else {
            return callback(Resp.error({msg:"Invalid Parameter", resp:error}))
        }
    },

    reset_link: function(param, callback) {
        var error = []
        if (!param.email) error.push("Provide email")

        if (error.length == 0) {
            userModel.find(Util.uuid(param.email), (userInfo) => {
                if (userInfo) {
                    const mailOption = {
                        email: userInfo.email,
                        subject: _config.mail_subject.verify,
                        message:verify_msg(userInfo)
                    }
                    mailgun.sendMail(mailOption, (state)=>{
                        if (state)
                            return callback(Resp.success({msg:"Link sent to your email"}))
                        else
                            return callback(Resp.error({msg:"Error Encountered"}))
                    })
                } else {
                    return callback(Resp.error({msg:"User not found"}))
                }
            })
        } else {
            return callback(Resp.error({msg:"Invalid Parameter", resp:error}))
        }
    }

}

module.exports = initAuth;
