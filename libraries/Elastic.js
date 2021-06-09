require('array.prototype.flatmap').shim()
const Connector = require('./Connector')

class Elastic {

    constructor(){
        this.client = Connector.Elastic()
    }

    ensure_index(param,map,callback){
        this.client.indices.getMapping({
            index: param.index
        }, (err,response) => {
            if(err != null){
                let mappings =  {}; mappings[param.type] = {properties:map}; 
                this.client.indices.create({
                    index: param.index,
                    body: {mappings: mappings},
                }, {ignore:[400]}, (err,response) => { //console.log("Create Mapping Response",response) //console.log("Create Mapping Error",err); 
                    if(err == null && !response.body.error) return callback(true)
                    else return callback(false)  
                })
            }else
                return callback(true)
        });
    }


    create_index(param,callback){
        this.client.indices.create({index:param.index}, (err,response) => {
            if(err) return callback(this.handleError(err));
            else  return callback(this.handleSuccess(response.body));
        });
    }

    get(param,id,callback){
        this.client.get({
            index: param.index,
            type: param.type,
            id: id
        }, (err,response) => {
            if(err) return callback(this.handleError(err));
            else  return callback(this.handleSuccess(response.body));
        });
    }

    save(param,id,data,callback){
        this.client.create({
            index: param.index,
            type: param.type,
            id: id,
            body: data
        },(err,response) => {
            if(err) return callback(this.handleError(err));
            else return callback(this.handleSuccess(response.body));
        });
    }

    update(param,id,data, callback){
        this.client.update({
                index : param.index,
                type : param.type,
                id:id,
                body:{doc:data}
            }, (err, response) => {
                if (err) return callback(this.handleError(err));
                else return callback(this.handleSuccess(response.body));
            });
    }

    count(param,data,callback){
        this.client.count({
            index: param.index,
            type: param.type,
            body: data
        },(err,response) => {
            if(err) return callback(this.handleError(err));
            else return callback(this.handleSuccess(response.body));
        });
    }

    get_bulk(param,search,callback){
        this.client.search({
            index: param.index,
            type: param.type,
            body: search
        },  (err, response) => {
            if(err) return callback(this.handleError(err));
            else return callback(this.handleSuccess(response.body));
        });
    }

    save_bulk(param,body,callback){
        const _body = body.flatMap(doc => [{index:{_index:param.index,_type:param.type,_id:doc.identity}}, doc])
        this.client.bulk({
            body: _body
          }, (err, response) => {
            if(err) return callback(this.handleError(err));
            else return callback(this.handleSuccess(response.body));
          })
    }

    update_bulk(param,query,data,callback){
        this.client.updateByQuery({
            index : param.index,
            type : param.type,
            q: query,
            body:data   //{doc:data}
        }, (err, response) => {
            if (err) return callback(this.handleError(err));
            else return callback(this.handleSuccess(response.body));
        });
    }

    scroll(param,search,limit, callback){
        var data = [];
        this.client.search({
           index: param.index,
            type: param.type,
            body: search,
            scroll: '30s'
        },function returnInfo(err,response){
            var in_data = []
            if(response && response.hits) {
                response.hits.hits.forEach(function (hit) {
                    data.push(hit)
                    in_data.push(hit)
                });

                var total = data.length
                if (limit) total = limit

                if (response.hits.total !== data.length) {
                    Elastic._client.scroll({
                        scrollId: response._scroll_id,
                        scroll: '30s'
                    }, returnInfo);
                }
                return callback({data: in_data, scroll_id: response._scroll_id})
            }else
                return callback(null)
        })
    }


    close() {
        this.client.close();
    }

    remove(param,id,callback){
        this.client.delete({
            index: param.index,
            type: param.type,
            id: id
        },(err,response) => {
            if(err) return callback(this.handleError(err));
            else return callback(this.handleSuccess(response.body));
        });
    }

    delete (param,callback){
        this.client.indices.delete({
            index : param.index,
            ignore_unavailable: true,
            allow_no_indices: true
        },(err,response) => {
            if(err) return callback(this.handleError(err));
            else return callback(this.handleSuccess(response.body));
        });
    }

    handleError(report){
        return {error:true,response:(report && report.meta && report.meta.body) ? (report.meta.body) : JSON.stringify(report)};
    }

    handleSuccess(body){
        return {error:false,response:body}
    }

};

module.exports = Elastic;