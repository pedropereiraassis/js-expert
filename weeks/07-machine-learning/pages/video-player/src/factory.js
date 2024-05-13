import Camera from "../../../lib/shared/camera.js"
import { supportsWorkerType } from "../../../lib/shared/util.js"
import Controller from "./controller.js"
import Service from "./service.js"
import View from "./view.js"

async function getWorker() {
  if (supportsWorkerType()) {
    console.log('This browser supports type module')
    const worker = new Worker(`./src/worker.js`, { type: 'module' })
    return worker
  }

  const workerMock = {
    async postMessage() { },
    onmessage(msg) { }
  }
  console.log('This browser does not support type module')
  return workerMock
}

const worker = await getWorker()
worker.postMessage('hey from factory')

const camera = await Camera.init()
const [rootPath] = window.location.href.split('/pages/')

const factory = {
  async initialize() {
    return Controller.initialize({
      view: new View(),
      service: new Service({})
    })
  }
}

export default factory