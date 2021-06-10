require('dotenv').config()
const _config = require('./../config/app.json')

let Connector = {
    _elastic: null,
    /**
     * @return {null}
     */

    Elastic: function(){
        if(Connector._elastic == null){
            const { Client } = require('@elastic/elasticsearch')
            const { AmazonConnection } = require('aws-elasticsearch-connector')
            Connector._elastic = new Client({ node: process.env.ELASTICSEARCH,
                Connection: AmazonConnection,
                awsConfig: {
                    credentials: {accessKeyId: process.env.ACCESS_KEY,secretAccessKey: process.env.SECRET_KEY}
                }
            })
        }

        return Connector._elastic;
    }
    
}

module.exports = Connector;