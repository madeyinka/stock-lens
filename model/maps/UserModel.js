const _config = require('./../../config/app.json')
const Base = require('./../index'); Base.init()

const doc = {"index": _config.indices.user, "type": _config.doc_type.user}
const mapping = {
    "identity": {"type":"keyword"},
    "fname": {"type":"keyword"},
    "lname": {"type":"keyword"},
    "email": {"type":"text"},
    "phone": {"type":"keyword"},
    "password": {"type":"text"},
    "passkey": {"type":"keyword"},
    "role": {"type":"keyword"},
    "isAdmin": {"type": "boolean"},
    "branch_id": {"type": "keyword"},
    "station_id": {"type": "keyword"},
    "profile": {"type":"text"},
    "image_url": {"type":"keyword"},
    "status": {"type":"keyword"},
    "date_added": {"format": "strict_date_optional_time||epoch_millis","type": "date"},
    "date_updated": {"format": "strict_date_optional_time||epoch_millis","type": "date"}
}

module.exports = Base.model(doc,mapping)