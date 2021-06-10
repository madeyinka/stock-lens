const _config = require('./../../config/app.json')
const Base = require('./../index'); Base.init()

const doc = {"index": _config.indices.branch, "type": _config.doc_type.branch}
const mapping = {
    "identity": {"type":"keyword"},
    "label": {"type":"keyword"},
    "slug": {"type":"keyword"},
    "region": {"type":"keyword"},
    "state": {"type":"keyword"},
    "date_added": {"format": "strict_date_optional_time||epoch_millis","type": "date"},
    "date_updated": {"format": "strict_date_optional_time||epoch_millis","type": "date"}
}

module.exports = Base.model(doc,mapping)