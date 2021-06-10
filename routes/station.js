const express = require('express')
const router = express.Router()
const Util = require('./../libraries/Utility')
const stationController = require('../controllers/Station')

router.post('/create', (req, res) => {
    stationController.create(Util.extract_param(req), (state) => {
        Util.resp(res).json(state)
    })
})

router.post('/modify', (req, res) => {
    stationController.update(Util.extract_param(req), (state) => {
        Util.resp(res).json(state)
    })
})

router.get('/pull', (req, res) => {
    stationController.pull(req.query, (state) => {
        Util.resp(res).json(state)
    })
})

router.get('/by-identity', (req, res) => {
    stationController.by_identity(req.query.identity, (state) => {
        Util.resp(res).json(state)
    })
})

router.get('/delete', (req, res) => {
    stationController.del(req.query, (state) => {
        Util.resp(res).json(state)
    })
})

module.exports = router;