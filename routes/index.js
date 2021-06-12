const express = require('express')
const _config = require('./../config/app.json')
const router = express.Router()

const api_url = _config.app_base+_config.api._url+_config.api._version
const api_auth_url = _config.app_base+_config.api._url+_config.api._version+_config.api._auth

/**  API routes **/
router.use(api_auth_url, require('./authRoute'))
router.use(api_url+'/branch', require('./branch'))
router.use(api_url+'/station', require('./station'))
router.use(api_url+'/user', require('./user'))

module.exports = router