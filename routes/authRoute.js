const express = require('express')
const router = express.Router()
const Util = require('./../libraries/Utility')
const authController = require('./../controllers/Auth')

router.post('/register', (req, res) => { 
    authController.register(Util.extract_param(req), function(state){
        Util.resp(res).json(state)
    })
})

router.post('/login', (req, res) => {
    authController.login(Util.extract_param(req), function(state){
        Util.resp(res).json(state)
    })
})

router.get('/verify', (req, res) => {
    authController.verify(req.query, function(state){
        Util.resp(res).json(state)
    })
})

router.post('/reset', (req, res) => {
    authController.reset_link(Util.extract_param(req), function(state){
        Util.resp(res).json(state)
    })
})

// router.get('/', (req, res) => {
//     res.send('Home page')
// }) 

module.exports = router