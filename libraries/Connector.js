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
            //const { AmazonConnection } = require('aws-elasticsearch-connector')
           //connect to elastic cloud
            Connector._elastic = new Client({
                cloud: {id: _config.elastic.id}, 
                auth: {username: _config.elastic.user, password:_config.elastic.pass}
            })
           
        }

        return Connector._elastic;
    }
    
}

module.exports = Connector;