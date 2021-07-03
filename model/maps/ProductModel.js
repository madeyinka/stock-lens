const _config = require('./../../config/app.json')
const Base = require('./../index'); Base.init()

const doc = {"index": _config.indices.product, "type": _config.doc_type.product}
const mapping = {
    "identity": {"type":"keyword"},
    "label": {"type":"keyword"},
    "slug": {"type":"keyword"},
    "code": {"type": "keyword"},
    "image": {"type":"keyword"},
    "price": {"type":"integer"},
    "unit": {"type":"keyword"},
    "description": {"type":"keyword"},
    "status": {"type":"keyword"},
    "date_added": {"format": "strict_date_optional_time||epoch_millis","type": "date"},
    "date_updated": {"format": "strict_date_optional_time||epoch_millis","type": "date"}
}

module.exports = Base.model(doc,mapping)