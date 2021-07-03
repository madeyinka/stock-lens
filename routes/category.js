const express = require('express')
const router = express.Router()
const Util = require('./../libraries/Utility')
const categoryController = require('../controllers/Category')

router.post('/create', (req, res) => {
    categoryController.create(Util.extract_param(req), (state) => {
        Util.resp(res).json(state)
    })
})

router.post('/modify', (req, res) => {
    categoryController.update(Util.extract_param(req), (state) => {
        Util.resp(res).json(state)
    })
})

router.get('/pull', (req, res) => {
    categoryController.pull(req.query, (state) => {
        Util.resp(res).json(state)
    })
})

router.get('/by-identity', (req, res) => {
    categoryController.by_identity(req.query.identity, (state) => {
        Util.resp(res).json(state)
    })
})

router.get('/delete', (req, res) => {
    categoryController.del(req.query, (state) => {
        Util.resp(res).json(state)
    })
})

module.exports = router;