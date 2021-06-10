const _config = require('./../config/app.json')
const Resp = require('./Response')
const Util = require('./../libraries/Utility')
const stationModel = require('./../model/maps/StationModel')
const urlSlug = require('url-slug')

var init = {

    create: function(param, callback) {
        var error = []
        if (!param.label)error.push('Provide a label')
        if (!param.branch_id)error.push('Select a branch')
        if (!param.pms_pump)error.push('Provide number of PMS pumps')
        if (!param.ago_pump)error.push('Provide number of AGO pumps')
        if (!param.dpk_pump)error.push('Provide number of DPK pumps')
        if (!param.pms_storage)error.push('Provide number of PMS storages')
        if (!param.ago_storage)error.push('Provide number of AGO storages')
        if (!param.dpk_storage)error.push('Provide number of DPK storages')

        if (error.length == 0) {
            var data = {
                identity: Util.uuid(param.label),
                label: param.label,
                slug: urlSlug(param.label),
                branch_id: param.branch_id,
                pms_pump: param.pms_pump,
                ago_pump: param.ago_pump,
                dpk_pump: param.dpk_pump,
                pms_storage: param.pms_storage,
                ago_storage: param.ago_storage,
                dpk_storage: param.dpk_storage
            }
            stationModel.find(data.identity, (state) => {
                if (state && !state.error) {
                    return callback(Resp.error({msg: "Station with information already exists"}))
                }else{
                    stationModel.save(data.identity, data, (resp) => {
                        if (resp && !resp.error) {
                            return callback(Resp.success({msg:"Station successfully created.", resp:resp}))
                        } else
                            return callback(Resp.error({msg:"Error encountered saving information"}))
                    })
                }
            })
        } else  
            return callback(Resp.error({msg: "Invalid Parameter", resp: error}))
    },

    update: function (param, callback) {
        var error = []
        if (!param.identity) error.push("Provide an identity")

        if (error.length == 0) {
            var data = {
                label: param.label,
                slug: urlSlug(param.label),
                branch_id: param.branch_id,
                pms_pump: param.pms_pump,
                ago_pump: param.ago_pump,
                dpk_pump: param.dpk_pump,
                pms_storage: param.pms_storage,
                ago_storage: param.ago_storage,
                dpk_storage: param.dpk_storage
            }
            stationModel.update(data, param.identity, (resp) => {
                if (!resp.identity) {
                    return callback(Resp.error({msg:"Error encountered while updaing information"}))
                } else 
                    return callback(Resp.success({msg:"Station information updated successfully.", resp: resp}))
            })
        } else {
            return callback(Resp.error({msg:"Invalid Parameter", resp:error}))
        }
    },

    pull: function(param, callback){
        stationModel.search(param, _config.api_query_limit, (state) => {
            if (state && state.error == null ) {
                return callback(Resp.success({msg:"search result", resp: state}))
            } else 
                return callback(Resp.error({msg: "No record found for query", resp:null}))
        })
    },

    by_identity: function (param, callback) {
        stationModel.find(param, (state) => {
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
            stationModel.find(param.identity, (state) => {
                if (state && !state.error) {
                    stationModel.remove(param.identity, (resp) => {
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