const express = require('express')
const router = express.Router()
const Util = require('./../libraries/Utility')
const branchController = require('../controllers/Branch')
const { authenticateUser } = require('../middleware/Authenticate')

router.post('/create', (req, res) => {
    branchController.create(Util.extract_param(req), (state) => {
        Util.resp(res).json(state)
    })
})

router.post('/modify', (req, res) => {
    branchController.update(Util.extract_param(req), (state) => {
        Util.resp(res).json(state)
    })
})

router.get('/pull', authenticateUser, (req, res) => {
    branchController.pull(req.query, (state) => {
        Util.resp(res).json(state)
    })
})

router.get('/by-identity', (req, res) => {
    branchController.by_identity(req.query.identity, (state) => {
        Util.resp(res).json(state)
    })
})

router.get('/delete', (req, res) => {
    branchController.del(req.query, (state) => {
        Util.resp(res).json(state)
    })
})

module.exports = router;