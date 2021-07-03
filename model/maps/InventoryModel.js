const _config = require('./../../config/app.json')
const Base = require('./../index'); Base.init()

const doc = {"index": _config.indices.inventory, "type": _config.doc_type.inventory}
const mapping = {
    "identity": {"type": "keyword"},
    "pms_meter": {"type": "nested"},
    "ago_meter": {"type": "nested"},
    "dpk_meter": {"type": "nested"},
    "pms_storage": {"type": "nested"},
    "ago_storage": {"type": "nested"},
    "dpk_storage": {"type": "nested"},
    "user_id": {"type": "keyword"},
    "product_id": {"type": "keyword"},
    "station_id": {"type": "keyword"},
    "branch_id": {"type": "keyword"},
    "date_added": {"format": "strict_date_optional_time||epoch_millis","type": "date"},
    "date_updated": {"format": "strict_date_optional_time||epoch_millis","type": "date"}
}

module.exports = Base.model(doc,mapping)