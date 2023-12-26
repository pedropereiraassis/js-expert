import { expect, describe, test, jest, beforeEach } from '@jest/globals'
import templates from '../../src/templates/index.js'
import { repositoryTemplateMock } from './mocks/index.js'

const { repositoryTemplate } = templates

describe('#Codegen 3-layers arch', () => {
  const componentName = 'product'
  const repositoryName = `${componentName}Repository`

  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  test.todo('#should generate repository template')
  test.todo('#should generate service template')
  test.todo('#should generate factory template')
})