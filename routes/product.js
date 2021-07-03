const express = require('express')
const router = express.Router()
const Util = require('./../libraries/Utility')
const productController = require('../controllers/Product')

router.post('/create', (req, res) => {
    productController.create(Util.extract_param(req), (state) => {
        Util.resp(res).json(state)
    })
})

router.post('/modify', (req, res) => {
    productController.update(Util.extract_param(req), (state) => {
        Util.resp(res).json(state)
    })
})

router.get('/pull', (req, res) => {
    productController.pull(req.query, (state) => {
        Util.resp(res).json(state)
    })
})

router.get('/by-identity', (req, res) => {
    productController.by_identity(req.query.identity, (state) => {
        Util.resp(res).json(state)
    })
})

router.get('/delete', (req, res) => {
    productController.del(req.query, (state) => {
        Util.resp(res).json(state)
    })
})

module.exports = router;