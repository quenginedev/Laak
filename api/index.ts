import express from 'express'
import {connect} from 'mongoose'
import Request from "../api/composition/Request";
import DocGen from "../api/docGen";
import bodyParser from 'body-parser'

const mongo_uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/laak'
const server_port = process.env.SERVER_PORT || 5000

connect(mongo_uri, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  autoIndex: true,
}).then(() => {
  console.log('mongodb connected')
}).catch(error => {
  console.error(error)
})

let api = express()
const docGen = new DocGen('/api')

api.use(bodyParser.json())

//Routes
api.use('/request', new Request().execute(docGen))

// Default Routes
api.get('/', (_, res) => {
  res.json({message: 'welcome to Laak api. for all available routes go to api/all_routes'})
})
api.get('/all_routes', (_, res) => {
  res.json(docGen.getDoc())
})
api.use('/*', (_, res) => {
  res.status(404).json({error: 'Api route not found'})
})

console.log('api initiated')
export default api
