//const Elastic = require('../libraries/Elastic')

class Model {

    constructor(es,schema,property){
        this._schema = schema;
        this.Elastic = es;
        this._mapping = property
        if(property){
            this.Elastic.ensure_index(schema,property,(state) => {})
        }
    }

    count(param,callback){
        const _query = this._extract_search(param)
        this.Elastic.count(this._schema,{query:_query.query},(state) => {
            if(state && state.response){
                return callback(state.response.count);
            }else
                return callback(false)
        })
    }

    find(_id, callback) {
        this.Elastic.get(this._schema,_id,(state) => {
            if(state && !state.error && state.response.found)
                return callback(state.response._source)
            else
                return callback(false)
        })
    }

    search(param,size=20,callback){
        this.Elastic.get_bulk(this._schema,this._extract_search(param,size),(state) => {
            if(state && !state.error && state.response.hits.total > 0)
                return callback(this._respond_search(param,state.response))
            else
                return callback(false)
        })
    }

     
    save(identity,data, callback){
        data.identity = identity
        data.date_added = this._date_time()
        this.Elastic.ensure_index(this._schema,this._mapping, (e) => {
            if(e){
                this.Elastic.save(this._schema,identity,data, (state) => {
                    if(!state.error){
                        return callback(data)
                    }else
                        return callback(state) 
                })
            }else
               return callback(false)
        })
    }

    bulksave(data,callback){
        this.Elastic.ensure_index(this._schema,this._mapping ,(e) => {
            if(e){
                this.Elastic.save_bulk(this._schema,data, (state) => {
                    if(!state.error){
                        return callback(data)
                    }else
                        return callback(state) 
                })
            }else
                return callback(false)
        })
    }


    update(data,identity,callback){
        data.date_updated = this._date_time()
        this.Elastic.update(this._schema,identity,data, (state) => {
            if(!state.error){
                this.Elastic.get(this._schema,identity, (info) => {
                    return callback(info.response._source)
                })
            }else
                return callback(state) 
        })
    }

    bulkupdate(data,callback){
        this.Elastic.update_bulk(this._schema,data, (state) => {
            return callback(state)
        })
    }

    delete(callback){
        this.Elastic.delete(this._schema, (state) => {
            return callback(state)
        })
    }

    remove(identity,callback){
        this.Elastic.remove(this._schema,identity, (state) => {
            if(state && !state.error)
                return callback(state.response)
            else
                return callback(false)
        })
    }


    filter(param,callback){
        this.Elastic.get_bulk(this._schema,param, (state) => {
            if(state && !state.error && state.response.hits.total > 0)
                return callback(state.response)
            else
                return callback(false)
        })
    }

    //private methods...

    _extract_search(param,limit){
        const _excluded_key = ["exclude","sort","from","size","aggs","range","count","search","not_exist","geo"]
        const esb = require('elastic-builder')
        let request = esb.requestBodySearch()
        let boolQuery = esb.boolQuery(), wildCard = []
        if(param.size) limit = param.size

        Object.entries(param).forEach(([key,value]) => {
            if(_excluded_key.indexOf(key) == -1){ //value.toString() != "" &&
                if(param.search) wildCard.push(esb.termQuery(key,value)) //esb library wildcardsearch
                else boolQuery.must(esb.matchQuery(key,value)) 
            }else{
                if(key == "exclude"){
                    const _exclude = JSON.parse(decodeURIComponent(value))
                    _exclude.forEach((excludeObj) => {
                        const _key = Object.keys(excludeObj)
                        boolQuery.mustNot(esb.termQuery(_key,excludeObj[_key]))
                    })
                }

                if(key == "geo"){
                    boolQuery.filter(esb.geoDistanceQuery(value.field, esb.geoPoint().lat(parseFloat(value.lat)).lon(parseFloat(value.lon))).distance(value.distance))
                }

                if(key == "range"){
                    const _range = JSON.parse(decodeURIComponent(value))
                    Object.entries(_range).forEach(([_rkey,_rvalue]) => {
                        let _inRange = esb.rangeQuery(_rkey)
                        Object.entries(_rvalue).forEach(([_inkey,_invalue]) =>{
                            _inRange[_inkey](_invalue)
                        })
                        boolQuery.filter(_inRange)
                    })
                }

                if(key == "not_exist"){
                    const _not_exist = JSON.parse(decodeURIComponent(value))
                    _not_exist.forEach((field) => {
                        boolQuery.mustNot(esb.existsQuery(field))
                    })
                }
            }
        })

        if(param.aggs){
            limit = 0
            const _aggs = JSON.parse(decodeURIComponent(param.aggs))
            _aggs.forEach((_agg) => {
                Object.entries(_agg).forEach(([_fkey,_fvalue]) => {
                    let _fAgg = esb
                    if(["dateHistogram"].includes(_fkey)){
                        //three attributes aggregation here...
                        _fAgg = _fAgg[_fkey+'Aggregation'](_fvalue.label,_fvalue.field,_fvalue.interval)
                        if(_fvalue.format) _fAgg = _fAgg.format(_fvalue.format)
                        if(_fvalue.agg) {
                            _fvalue.agg.forEach((_inagg) => {
                                Object.entries(_inagg).forEach(([_fInkey,_fInvalue]) => {
                                    let _fInAgg = esb
                                    Object.entries(_fInvalue).forEach(([_sInkey,_sInvalue]) => {
                                        _fInAgg = _fInAgg[_fInkey+'Aggregation'](_sInkey,_sInvalue)
                                    })
                                    _fAgg = _fAgg.agg(_fInAgg)
                                })
                            })
                        }
                    }else{
                         //two attributes aggregation here...
                        Object.entries(_fvalue).forEach(([_skey,_svalue]) => {
                            if((["include","size","sort","agg"]).includes(_skey)){
                                if(_skey == "size") _fAgg = _fAgg.size(parseInt(_svalue))
                                if(_skey == "include" && (["topHits"]).includes(_fkey)) _fAgg = _fAgg.source({includes:_svalue.split(',')})
                                
                                //if(_skey == "interval" && (["dateHistogram"]).includes(_fkey)) _fAgg = "" 
                                
                                if(_skey == "sort" && (["topHits"]).includes(_fkey)) {
                                    Object.entries(_svalue).forEach(([_sortKey,_sortValue]) => {
                                        _fAgg = _fAgg.sort(esb.sort(_sortKey,_sortValue))
                                    })
                                }
                                if(_skey == "agg"){
                                    _svalue.forEach((_inagg) => {
                                        Object.entries(_inagg).forEach(([_fInkey,_fInvalue]) => {
                                            let _fInAgg = esb
                                            Object.entries(_fInvalue).forEach(([_sInkey,_sInvalue]) => {
                                                _fInAgg = _fInAgg[_fInkey+'Aggregation'](_sInkey,_sInvalue)
                                            })
                                            _fAgg = _fAgg.agg(_fInAgg)
                                        })
                                    })
                                }
                            }else{
                                _fAgg = _fAgg[_fkey+'Aggregation'](_skey,_svalue)
                            }
                        })
                    }
                    request = request.agg(_fAgg)
                })
            })
        }

        if(wildCard.length > 0) boolQuery.should(wildCard) //all should query

        if(param.count) limit = 1
        request =  request.size(parseInt(limit))
        if(param.from) request = request.from(parseInt(param.from))
        if(param.sort){
            const _sort = JSON.parse(decodeURIComponent(param.sort))
            Object.entries(_sort).forEach(([key,value]) => {
                request = request.sort(esb.sort(key,value))
            })
        }
        request = request.query(boolQuery)
        //console.log("REQUEST",JSON.stringify(request.toJSON()))
        return  request.toJSON()
    }

    _respond_search(param,state){
        let _response = false
        if(param.aggs && param.aggs.length > 0){
           const _buckets = state.aggregations//['top-terms-aggregation']['buckets']
            _response = {msg: Object.keys(_buckets).length +" aggregriated sections found", resp:_buckets}
        }else{
            const _count = state.hits.total
            if(state.hits.total > 0 && state.hits.hits.length > 0){
                let _data = (param.count) ? _count : state.hits.hits.map(data => data._source)
                _response = {msg:_count+" data found",resp:_data}
            }
        }
        return _response
    }

    _date_time(dt){
        var moment = require('moment-timezone');
        dt = (!dt) ? dt : moment().toISOString();
        return moment.tz(dt, "Africa/Lagos").toISOString()
    }

}

module.exports = Model;