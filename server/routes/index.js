//import axios from 'axios'
const {Router} = require('express')
const router = Router()

const users = require('./users')
const list = require('./list')

/**
 * 路由
 */
router.use('/users',users)
router.use('/list',list)


module.exports = router
