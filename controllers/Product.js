const _config = require('./../config/app.json')
const Resp = require('./Response')
const Util = require('./../libraries/Utility')
const productModel = require('./../model/maps/ProductModel')
const urlSlug = require('url-slug')

var init = {

    create: function(param, callback) {
        var error = []
        if (!param.label)error.push('Provide label for product')
        if (!param.unit)error.push('Select a unit measurement for product')
        if (!param.price)error.push('Provide price for product')

        if (error.length == 0) {
            var data = {
                identity: Util.uuid(param.label),
                label: param.label,
                slug: urlSlug(param.label),
                code: param.code,
                image: param.image,
                unit: param.unit,
                price: param.price,
                description: param.description
            }
            productModel.find(data.identity, (state) => {
                if (state && !state.error) {
                    return callback(Resp.error({msg: "Product with information already exists."}))
                }else{
                    productModel.save(data.identity, data, (resp) => {
                        if (resp && !resp.error) {
                            return callback(Resp.success({msg:"Product successfully created.", resp:resp}))
                        } else 
                            return callback(Resp.error({msg:"Error encountered saving information"}))
                    })
                }
            })
        } else 
            return callback(Resp.error({msg:"Invalid Parameter", resp:error}))
    },

    update: function(param, callback) {
        var error = []
        if (!param.identity)error.push('Provide identity for product')

        if (error.length == 0) {
            var data = {
                label: param.label,
                slug: urlSlug(param.label),
                code: param.code,
                image:param.image,
                unit: param.unit,
                price: param.price,
                description: param.description
            }
            productModel.update(data, param.identity, (resp) => {
                if (!resp.identity)
                    return callback(Resp.error({msg:"Error encountered while updating information"}))
                else
                    return callback(Resp.success({msg:"Product information updated successfully.", resp: resp}))
            })
        }
    },

    pull: function(param, callback) {
        productModel.search(param, _config.api_query_limit, (state) => {
            if (state && state.error == null ) {
                return callback(Resp.success({msg:"search result", resp: state}))
            } else 
                return callback(Resp.error({msg: "No record found for query", resp:null}))
        })
    },

    by_identity: function(param, callback) {
        productModel.find(param, (state) => {
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
            productModel.find(param.identity, (state) => {
                if (state && !state.error) {
                    productModel.remove(param.identity, (resp) => {
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