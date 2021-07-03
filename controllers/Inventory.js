const _config = require('./../config/app.json')
const Resp = require('./Response')
const Util = require('./../libraries/Utility')
const inventoryModel = require('./../model/maps/InventoryModel')
const urlSlug = require('url-slug')

var init = {

    create: function(param, callback) {
        console.log(param.id)
        var error = []
        if (!param.body.label)error.push('Provide a label for inventory record')
        if (!param.body.product_id)error.push('You must select a product')

        if (error.length == 0) {
           var data = {
               identity: Util.uuid(param.body.label),
               label: param.body.label,
               product_id: param.body.product_id,
               pms_meter: param.body.pms_meter,
               ago_meter: param.body.ago_meter,
               dpk_meter: param.body.dpk_meter,
               pms_storage: param.body.pms_storage,
               ago_storage: param.body.ago_storage,
               dpk_storage: param.body.dpk_storage,
               user_id: param.userInfo.id,
               username: param.userInfo.name,
               station_id: param.userInfo.station_id,
               branch_id: param.userInfo.branch_id
           }
           inventoryModel.find(data.identity, (state) => {
               if (state && !state.error) {
                   return callback(Resp.error({msg: "Inventory with information already exists."}))
               } else {
                    inventoryModel.save(data.identity, data, (resp) => {
                        if (resp && !resp.error) {
                            return callback(Resp.success({msg:"Inventory successfully created.", resp:resp}))
                        } else 
                            return callback(Resp.error({msg:"Error encountered saving information"}))
                    })
               }
           })
        } else {
            return callback(Resp.error({msg:"Invalid Parameter", resp:error}))
        }
    },
    
    update: function(param, callback) {
        var error = []
        if (!param.body.identity)error.push('Provide an identity for inventory')

        if (error.length == 0) {
            var data = {
                label: param.body.label,
                product_id: param.body.product_id,
                pms_meter: param.body.pms_meter,
                ago_meter: param.body.ago_meter,
                dpk_meter: param.body.dpk_meter,
                pms_storage: param.body.pms_storage,
                ago_storage: param.body.ago_storage,
                dpk_storage: param.body.dpk_storage,
                user_id: param.userInfo.id,
                username: param.userInfo.name,
                station_id: param.userInfo.station_id,
                branch_id: param.userInfo.branch_id
            }
            inventoryModel.update(data, param.body.identity, (resp) => {
                if (!resp.identity)
                    return callback(Resp.error({msg:"Error encountered while updating information"}))
                else
                    return callback(Resp.success({msg:"Inventory information updated successfully.", resp: resp}))
            })
        } else {
            return callback(Resp.error({msg:"Invalid Parameter", resp:error}))
        }
    },

    by_identity: function(param, callback) {
        inventoryModel.find(param, (state) => {
            if (state && !state.error) {
                return callback(Resp.success({msg: "data result found", resp: state}))
            } else {
                return callback(Resp.error({msg: "No record found for query", resp:null}))
            }
        })
    },
    
    pull: function(param, callback) {
        inventoryModel.search(param, _config.api_query_limit, (state) => {
            if (state && state.error == null ) {
                return callback(Resp.success({msg:"search result", resp: state}))
            } else 
                return callback(Resp.error({msg: "No record found for query", resp:null}))
        })
    },

    del: function(param, callback) {
        var error = []
        if (!param.identity)error.push("Provide identity")

        if (error.length == 0) {
            inventoryModel.find(param.identity, (state) => {
                if (state && !state.error) {
                    inventoryModel.remove(param.identity, (resp) => {
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

module.exports = init