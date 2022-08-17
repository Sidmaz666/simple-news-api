const express = require('express'); 
const get_news = require('./functions/main')
const cors = require('cors')

const server = express()

server.use(cors())

const port = process.env.PORT || 3020 

server.get('/', (req,res) => {
  const page = req.query.page || 1
  get_news.latest_news(res,page)
})


server.use( '/*', function(req,res){
  	res.status(404).json({ message : "Error 404" })
})

server.listen(port, 
  () => {
    console.log(`http://localhost:${port}`)
  })
