import {model, Model, SchemaDefinition, HookNextFunction, Schema} from 'mongoose'
import {Router, Request, Response, RequestHandler} from 'express'
import DocGen from "../api/docGen"
import PubSub = PubSubJS.Base;
import { doc } from 'prettier'

export interface IRestComposerOpt {
  docGen?: DocGen
  pubsub?: PubSub
  middleware?: { hook: MiddlewareHook, event: MiddlewareEvent, callback: (next: HookNextFunction) => any }[]
}

interface QueryData {
  filter: any
}

enum MiddlewareEvent {
  SAVE = 'save',
  INIT = 'init',
  VALIDATE = 'validate',
  REMOVE = 'remove',
}

enum MiddlewareHook {
  PRE = 'pre',
  POST = 'post',
}

enum RequestMethod {
  POST = 'post',
  GET = 'get',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete'
}

export default class RestComposer {
  routes: { path: string, request: RequestHandler, method: RequestMethod, description?: string }[] = []
  model: Model<any>
  name: string
  private router: Router
  private cxt?: {
    pubsub?: PubSub,
    docGen?: DocGen
  } = {}

  constructor(name: string, schemaDefinition: SchemaDefinition, options?: IRestComposerOpt) {
    if (!name)
      throw {message: 'schema name undefined'}
    this.name = name
    if (!schemaDefinition)
      throw {message: 'schema undefined'}


    const schema = new Schema(schemaDefinition, {
      timestamps: true
    })

    if (options?.middleware && Array.isArray(options.middleware)) {
      options.middleware.forEach(middleware => {
        // @ts-ignore TODO find a way out
        schema[middleware.hook](middleware.event, middleware.callback)
      })
    }

    this.cxt = options

    this.router = Router()
    this.model = model(name, schema)
    this.cxt?.docGen?.addType(name, this.model)
    this.addCustomRoute('/', RequestMethod.GET, this.find, `${name} find many`)
    this.addCustomRoute('/count', RequestMethod.GET, this.count, `${name} count`)
    this.addCustomRoute('/one', RequestMethod.GET, this.findOne, `${name} find one`)
    this.addCustomRoute('/:id', RequestMethod.GET, this.findById, `${name} find by ID`)
    this.addCustomRoute('/:ids', RequestMethod.GET, this.findByIds, `${name} find IDs`)


    this.addCustomRoute('/', RequestMethod.PUT, this.updateOne, `${name} update one`)
    this.addCustomRoute('/many', RequestMethod.PUT, this.updateMany, `${name} update many`)
    this.addCustomRoute('/', RequestMethod.POST, this.createOne, `${name} create one`)
    this.addCustomRoute('/many', RequestMethod.POST, this.createMany, `${name} create many`)
    this.addCustomRoute('/', RequestMethod.DELETE, this.deleteOne, `${name} delete one`)
    this.addCustomRoute('/many', RequestMethod.DELETE, this.deleteMany, `${name} delete many`)
  }

  addCustomRoute(path: string, method: RequestMethod, request: RequestHandler, description?: string): void {
    this.routes.push({path, method, request, description})
  }

  execute(): Router {
    this.routes.forEach(({method, request, path, description}) => {
      if (this.cxt?.docGen){
        this.cxt.docGen.addPath(this.name, {method, path, description})
      }
      this.router[method](path, request)
    })

    return this.router
  }

  private count = (req:Request, res:Response)=> {

    let { where }: any = this.parseQuery(req.query)
    // this.model.find().exec((error, res)=>{
    //   console.log({ where, res, error })
    // })

    this.model.countDocuments(where, (err, number) => {
      if (err)
      res.status(500).json({ error: err.message })
      else{
        res.json(number)
      }
    })
  }

  private find = (req: Request, res: Response) => {
    let {where, sort, limit}: any = this.parseQuery(req.query)

    let query = this.model.find(where)

    if (sort)
      query.sort(sort)
    console.log({sort})

    if (limit)
      query.limit(limit)

    query.then(data => {
      res.json(data)
    }).catch(error => {
      res.status(500).json({error: error.message})
    })
  }
  private findOne = (req: Request, res: Response) => {
    const {where}: any = req.query
    this.model.findOne(where)
      .then(data => {
        res.json(data)
      }).catch(error => {
      res.status(500).json({error: error.message})
    })
  }
  private findById = (req: Request, res: Response) => {
    const {id}: any = req.params
    this.model.findById(id)
      .then(data => {
        res.json(data)
      }).catch(error => {
      res.status(500).json({error: error.message})
    })
  }
  private findByIds = (req: Request, res: Response) => {
    const {ids = []}: any = req.query
    this.model.find({_id: {$in: ids}})
      .then(data => {
        res.json(data)
      }).catch(error => {
      res.status(500).json({error: error.message})
    })
  }

  private updateMany = (req: Request, res: Response) => {
    const {where, data}: any = req.body
    this.model.updateMany(where, data)
      .then(data => {
        this.cxt?.pubsub?.publish(this.name, {
          type: 'UPDATE',
          data
        })
        res.json(data)
      }).catch(error => {
      res.status(500).json({error: error.message})
    })

  }
  private updateOne = (req: Request, res: Response) => {
    const {where, data}: any = req.body
    this.model.updateOne(where, data)
      .then(data => {
        this.cxt?.pubsub?.publish(this.name, {
          type: 'UPDATE',
          data
        })
        res.json(data)
      }).catch(error => {
      res.status(500).json({error: error.message})
    })

  }
  private createOne = async (req: Request, res: Response) => {
    const {data} = req.body

    let doc = new this.model(data)
    await doc.save()
      .then((data: any) => {
        this.cxt?.pubsub?.publish(this.name, {
          type: 'CREATE',
          data
        })
        res.json(data)
      }).catch((err: any) => {
      res.status(500).json(err)
    })
  }

  private createMany = (req: Request, res: Response) => {
    const {data} = req.body
    this.model.bulkWrite(data)
      .then(data => {
        this.cxt?.pubsub?.publish(this.name, {
          type: 'CREATE',
          data
        })
        res.json(data)
      }).catch(err => {
      res.status(500).json(err)
    })
  }
  private deleteOne = (req: Request, res: Response) => {
    const {data} = req.body
    this.model.deleteOne(data)
      .then(data => {
        this.cxt?.pubsub?.publish(this.name, {
          type: 'DELETE',
          data
        })
        res.json(data)
      }).catch(err => {
      res.status(500).json(err)
    })
  }
  private deleteMany = (req: Request, res: Response) => {
    const {data} = req.body
    this.model.deleteMany(data)
      .then(data => {
        this.cxt?.pubsub?.publish(this.name, {
          type: 'DELETE',
          data
        })
        res.json(data)
      }).catch(err => {
      res.status(500).json(err)
    })
  }

  private parseQuery(query: any): Object{
    if (typeof query ==='string')
     query = JSON.parse(query)

    if (query.where && typeof query.where === 'string')
      query.where = JSON.parse(query.where)

    if (query.sort && typeof query.sort === 'string')
      query.sort = JSON.parse(query.sort)

    return query
  }
}
