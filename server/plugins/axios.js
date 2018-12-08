const axios = require('axios')

//import axios from 'axios'

let options = {}
// The server-side needs a full url to works
options.baseURL = 'https://cnodejs.org/api/v1'

module.exports =  axios.create(options)
