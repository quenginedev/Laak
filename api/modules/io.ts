import http from 'http'
import socketIO from 'socket.io'
import {NuxtOptionsRender} from "@nuxt/types/config/render";
import {pubsub, composers} from '../index'
import {matches} from 'lodash'

export default function () {
  // @ts-ignore
  this.nuxt.hook('render:before', (renderer: NuxtOptionsRender) => {
    // @ts-ignore
    const server = http.createServer(this.nuxt.renderer.app)
    const io = socketIO(server)

    // overwrite nuxt.server.listen()
    // @ts-ignore
    this.nuxt.server.listen = (port: number, host: string) => new Promise(resolve => server.listen(port || 3000, host || 'localhost', resolve))
    // close this server on 'close' event
    // @ts-ignore
    this.nuxt.hook('close', () => new Promise(server.close))

    // let counter = 0
    // setInterval(() => {
    //   pubsub.publish('topic', {
    //     name: 'counter',
    //     data: counter++
    //   })
    // }, 3000)
    // Add socket.io events
    io.on('connection', (socket) => {
      console.log('user connected')
      composers.forEach((composer)=>{
        socket.on(composer.name, (where)=>{
          console.log('listening to', composer.name)
          pubsub.subscribe(composer.name, (msg: string, res: any)=>{
            let is_matches = matches(where)(res)
            console.log({is_matches})
            if (is_matches){
              socket.emit(`on_${composer.name}`, res)
            }
          })
        })
      })
    })
  })
}
