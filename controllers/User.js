const _config = require('./../config/app.json')
const Resp = require('./Response')
const Util = require('./../libraries/Utility')
const userModel = require('./../model/maps/UserModel')
const { response } = require('express')

var init = {

    update: function(param, callback) {
        var error = []
        if (!param.identity)error.push("Provide an identity")

        if (error.length == 0) {
            var data = {
                fname: param.fname,
                lname: param.lname,
                email: param.email,
                role: param.role,
                phone: param.phone,
                password: param.password,
                branch_id: param.branch_id,
                station_id: param.station_id,
                profile: param.profile,
                image_url: param.image_url,
                status: param.status
            }
            userModel.update(data, param.identity, (resp) => {
                if (!resp.identity) {
                    return callback(Resp.error({msg:"Error encountered while updaing information"}))
                } else {
                    return callback(Resp.success({msg:"User information updated successfully.", resp: resp}))
                }
            })
        } else {
            return callback(Resp.error({msg:"Invalid Parameter", resp:error}))
        }
    },

    pull: function(param, callback) {
        userModel.search(param, _config.api_query_limit, (state) => {
            if (state && state.error == null ) {
                return callback(Resp.success({msg:"search result", resp: state}))
            } else 
                return callback(Resp.error({msg: "No record found for query", resp:null}))
        })
    },

    by_identity: function(param, callback) {
        userModel.find(param, (state) => {
            if (state && !state.error) {
                return callback(Resp.success({msg: "data result found", resp: state}))
            } else {
                return callback(Resp.error({msg: "No record found for query", resp:null}))
            }
        })
    },

    del: function(param, callback) {
        var error = []
        if (!param.identity)error.push("Provide identity")

        if (error.length == 0) {
            userModel.find(param.identity, (state) => {
                if (state && !state.error) {
                    userModel.remove(param.identity, (resp) => {
                        if (resp)
                            return callback(Resp.success({msg: "Record deleted successfully"}))
                        else 
                            return callback(Resp.error({msg:"Error encountered in deleting data"}))
                    })
                } else 
                    return callback(Resp.error({msg:"Record does not exists"}))
            })
        } else 
            return callback(Resp.error({msg: "Invalid Parameter", resp: error}))
    }
}

module.exports = init;