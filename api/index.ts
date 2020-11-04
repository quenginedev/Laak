import express from 'express'
import {connect} from 'mongoose'
import DocGen from "../api/docGen";
import bodyParser from 'body-parser'
import PubSub from 'pubsub-js'

import RouteComposer from "../api/RouteComposer";
import Request from "../api/composition/Request";
import User from '../api/composition/User'
import TestComposer from "../api/composition/test";

const mongo_uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/laak'

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
api.use((req, res, next)=>{
  res.locals.pubsub = PubSub
  next()
})
//Routes

const routeComposer = new RouteComposer(express.Router(), [
  new Request({
    docGen,
    pubsub: PubSub
  }),
  new User({
    docGen,
    pubsub: PubSub
  })
])

api.use(routeComposer.getRouter())

// Default Routes
api.get('/', (_, res) => {
  res.json({message: 'welcome to Laak api. for all available routes go to api/all_routes'})
})

api.get('/all_routes', (_, res) => {
  console.log(docGen.getDoc())
  res.json(docGen.getDoc())
})

api.use('/*', (_, res) => {
  res.status(404).json({error: 'Api route not found'})
})

export const composers = routeComposer.getComposers()
export const pubsub = PubSub
export default api
