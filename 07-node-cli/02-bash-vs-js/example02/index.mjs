$.verbose = false

import { setTimeout } from 'timers/promises'
import isRegexSafe from 'safe-regex'

await $`docker run -p '8080:80' -d nginx`
await setTimeout(500)

await $`curl --silent localhost:8080`

const containers = await $`docker ps`
const exp = /(?<containerId>\w+)\W+(?=nginx)/

if (!isRegexSafe(exp)) {
  throw new Error('unsage regex')
}

const { groups: { containerId } } = containers.toString().match(exp)
console.log(containerId)

const logs = await $`docker logs ${containerId}`
console.log('logs\n', logs.stdout)

const rm = await $`docker rm -f ${containerId}`
console.log('rm\n', rm.stdout)