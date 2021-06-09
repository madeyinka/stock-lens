const Model = require('./BaseModel')
const Elastic = require('./../libraries/Elastic')

let client = null

const ESClient = {

    init: function(){
        client = new Elastic()
    },

    model: function(doc, mapping){
        return new Model(client,doc,mapping)
    }
}

module.exports = ESClient;
