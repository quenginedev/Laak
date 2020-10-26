import {SchemaDefinition} from "mongoose";

interface DocGenConfig {
  [name: string]: {
    [callback: string]: { method: string, full_path: string, description?: string }[]
  }
}


export default class DocGen {
  base: string

  constructor(baseUrl: string = '') {
    this.base = baseUrl
  }

  doc: DocGenConfig = {}

  addPath(name: string, route: { path: string, method: string, description?: string }) {
    if (!this.doc[name])
      this.doc[name] = {}

    if (!this.doc[name][route.path] || !Array.isArray(this.doc[name][route.path]))
      this.doc[name][route.path] = []

    this.doc[name][route.path].push({
      method: route.method.toUpperCase(),
      full_path: `${this.base}/${name}${route.path}`,
      description: route.description
    })
  }

  getDoc(): DocGenConfig {
    return this.doc
  }
}
