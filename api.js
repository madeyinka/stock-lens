const express = require('express')
const bodyParser = require('body-parser')
const _config = require('config.json')('./config/app.json')
const Logger = require('./libraries/Logger')
const cors = require('cors')
const { PORT } = process.env
require('dotenv').config()

const app = express()

//middlewares + routes
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())
app.use(require('./routes'))

app.listen(PORT, () => {
    Logger.init({msg:_config.app_name+ ' version '+_config.app_version+ ' Listening on http://[:]'+PORT+_config.app_base+_config.api._url+_config.api._version })
})