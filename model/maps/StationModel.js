const _config = require('./../../config/app.json')
const Base = require('./../index'); Base.init()

const doc = {"index": _config.indices.station, "type": _config.doc_type.station}
const mapping = {
    "identity": {"type":"keyword"},
    "label": {"type":"keyword"},
    "slug": {"type":"keyword"},
    "branch_id": {"type":"keyword"},
    "pms_pump": {"type":"integer"},
    "ago_pump": {"type":"integer"},
    "dpk_pump": {"type":"integer"},
    "pms_storage": {"type":"integer"},
    "ago_storage": {"type":"integer"},
    "dpk_storage": {"type":"integer"},
    "date_added": {"format": "strict_date_optional_time||epoch_millis","type": "date"},
    "date_updated": {"format": "strict_date_optional_time||epoch_millis","type": "date"}
}

module.exports = Base.model(doc,mapping)