import {Router} from "express";
import RestComposer from "../api/RestComposer";

export default class {
  private router: Router
  private composers: RestComposer[] = []
  constructor(router: Router, composers: RestComposer[]) {
    composers.forEach(composer=>{
      this.composers.push(composer)
      router.use(`/${composer.name}`, composer.execute())
    })
    this.router = router
  }

  getComposers(): RestComposer[]{
    return this.composers
  }

  getRouter(): Router{
    return this.router
  }
}
