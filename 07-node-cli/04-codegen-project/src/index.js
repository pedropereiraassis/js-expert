#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { createLayerIfNotExists } from './createLayers.js'
import { createFiles } from './createFiles.js'

const { argv: { componentName } } = yargs(hideBin(process.argv))
  .command('skeleton', 'create project skeleton', (builder) => {
    return builder.option('component-name', {
      alias: 'c',
      demandOption: true,
      describe: 'component\'s name',
      type: 'array',
    })
      .example('skeleton --component-name product', 'creates a project with a single domain')
      .example('skeleton -c product -c person -c color', 'creates a project with a list of domains')
  })
  .epilog('copyright 2023 - Pedro Assis Corporation')

const env = process.env.NODE_ENV
const defaultMainFolder = env === 'dev' ? 'tmp' : 'src'

const layers = ['factory', 'repository', 'service']
const config = {
  layers,
  defaultMainFolder,
  mainPath: '.',
}

await createLayerIfNotExists(config)

const pendingPromises = []

for (const domain of componentName) {
  const result = createFiles({
    ...config,
    componentName: domain
  })
  pendingPromises.push(result)
}

await Promise.all(pendingPromises)