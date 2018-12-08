const {Router} = require('express')
const router = Router()
const axios = require('../plugins/axios')
//import axios from '../plugins/axios'

/* GET users listing. */
router.get('/', function (req, res, next) {
    axios.get('/topics').then(data=>{
        res.json(data.data.data)
    });
})

module.exports = router
