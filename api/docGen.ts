import { Model, SchemaDefinition } from 'mongoose'

interface DocGenConfig {
  [name: string]: DocGenField
}

interface DocGenField {
  fields: string[]
  routes: {[name: string]: DocGenRoute[]}
}
interface DocGenRoute { method: string, full_path: string, description?: string }


export default class DocGen {
  base: string

  constructor(baseUrl: string = '') {
    this.base = baseUrl
  }

  doc: DocGenConfig = {}

  addPath(name: string, route: { path: string, method: string, description?: string }) {
    if (!this.doc[name]){
      throw {message: `${name} schema not set`}
    }

    if (!this.doc[name].routes[route.path] || !Array.isArray(this.doc[name].routes[route.path])){
      this.doc[name].routes[route.path] = []
    }

    this.doc[name].routes[route.path].push({
      method: route.method.toUpperCase(),
      full_path: `${this.base}/${name}${route.path}`,
      description: route.description
    })
  }

  addType(name: string, model: Model<any>){
    if (!this.doc[name]){
      const fields: string[] = []
      model.schema.eachPath((path) => {
        if (!(
          // path == '_id' ||
          path == '__v' ||
          path == 'createdAt' ||
          path == 'updatedAt'
        ))
          fields.push(path)
      })
      this.doc[name] = {
        fields,
        routes: {}
      }
    }
  }

  getDoc(): DocGenConfig {
    return this.doc
  }
}
