const _config = require('./../config/app.json')
const Resp = require('./Response')
const Util = require('./../libraries/Utility')
const categoryModel = require('./../model/maps/CategoryModel')
const urlSlug = require('url-slug')

var init = {

    create: function(param, callback) {
        var error = []
        if (!param.label)error.push('Provide label for category')

        if (error.length == 0) {
            var data = {
                identity: Util.uuid(param.label),
                label: param.label,
                slug: urlSlug(param.label),
                description: param.description
            }
            categoryModel.find(data.identity, (state) => {
                if (state && !state.error) {
                    return callback(Resp.error({msg: "Category with information already exists."}))
                }else{
                    categoryModel.save(data.identity, data, (resp) => {
                        if (resp && !resp.error) {
                            return callback(Resp.success({msg:"Category successfully created.", resp:resp}))
                        } else 
                            return callback(Resp.error({msg:"Error encountered saving information"}))
                    })
                }
            })
        } else 
            return callback(Resp.error({msg: "Invalid Parameter", resp: error}))
    },

    update: function(param, callback) {
        var error = []
        if (!param.identity)error.push('Provide identity for category')

        if (error.length == 0) {
            var data = {
                label: param.label,
                slug: urlSlug(param.label),
                description: param.description
            }
            categoryModel.update(data, param.identity, (resp) => {
                if (!resp.identity) 
                    return callback(Resp.error({msg:"Error encountered while updating information"}))
                else 
                    return callback(Resp.success({msg:"Category information updated successfully.", resp: resp}))
            })
        } else 
            return callback(Resp.error({msg: "Invalid Parameter", resp: error}))    
    },

    pull: function(param, callback) {
        categoryModel.search(param, _config.api_query_limit, (state) => {
            if (state && state.error == null ) {
                return callback(Resp.success({msg:"search result", resp: state}))
            } else 
                return callback(Resp.error({msg: "No record found for query", resp:null}))
        })
    },

    by_identity: function (param, callback) {
        categoryModel.find(param, (state) => {
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
            categoryModel.find(param.identity, (state) => {
                if (state && !state.error) {
                    categoryModel.remove(param.identity, (resp) => {
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