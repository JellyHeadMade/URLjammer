const express = require('express')
const bodyParser = require('body-parser')
const redis = require('redis')
const cors = require('cors')
var morgan = require('morgan')
const { response } = require('express')

// Create Redis Client
let client = redis.createClient()
client.on('connect', () => {
  console.log('Connected to Redis...')
})

// Set Port
const port = 5000

// Init app
const app = express()
app.use(cors())
app.use(morgan('dev'));

// body-parser
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Get all links
app.get('/links', (req, res) => {

  client.HGETALL("links", (err, response) => {
    res.json(response)
    // res.send(response);
  })

})

// Add a new link
app.post('/link/add', (req, res) => {
  let short = Math.random().toString(36).slice(2);
  let long = req.body.long
  console.log(long)
  // let short = Buffer.from(long).toString('base64')

  client.hmset("links", [short, long]

  , (err, reply) => {
    if(err){
      console.log(err)
    }
    console.log(reply)
    res.json(short)
  })
})

// Get link by base64
app.get("/:shortened", (req, res) => {
  let short = req.params.shortened
  client.hget("links", short, function (err, obj) {
    res.redirect(obj)
    // res.json(obj)
    console.log(obj)
 });
})

app.listen(port, () => {
  console.log('Server started on port ' + port)
})
