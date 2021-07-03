const express = require('express')
const router = express.Router()
const Util = require('./../libraries/Utility')
const inventoryController = require('../controllers/Inventory')
const { authenticateUser } = require('../middleware/Authenticate')

router.post('/create', authenticateUser, (req, res) => {
    //console.log(req.userInfo)
    inventoryController.create(req, (state) => {
        Util.resp(res).json(state)
    })
})

router.post('/modify', authenticateUser, (req, res) => {
    inventoryController.update(req, (state) => {
        Util.resp(res).json(state)
    })
})

router.get('/pull', (req, res) => {
    inventoryController.pull(req.query, (state) => {
        Util.resp(res).json(state)
    })
})

router.get('/by-identity', (req, res) => {
    inventoryController.by_identity(req.query.identity, (state) => {
        Util.resp(res).json(state)
    })
})

router.get('/delete', (req, res) => {
    inventoryController.del(req.query, (state) => {
        Util.resp(res).json(state)
    })
})

module.exports = router;