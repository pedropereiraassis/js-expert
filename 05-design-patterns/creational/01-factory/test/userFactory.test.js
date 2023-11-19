const rewiremock = require('rewiremock/node')
const { deepStrictEqual } = require('assert')

// could be in another file
const dbData = [{ name: 'Jane' }, { name: 'John' }]
class MockDatabase {
  connect = () => this
  find = async (query) => dbData
}
// could be in another file

rewiremock(() => require('../src/util/database')).with(MockDatabase)

;(async () => {
    // not 'accessing' database (with mock)
  {
    const expected = [{ name: 'JANE' }, { name: 'JOHN' }]
    rewiremock.enable()
    const UserFactory = require('../src/factory/userFactory')

    const userFactory = await UserFactory.createInstance()
    const result = await userFactory.find()
    deepStrictEqual(result, expected)

    rewiremock.disable()
  }

  // 'accessing' database (without mock)
  {
    const expected = [{ name: 'PEDROASSIS' } ]
    const UserFactory = require('../src/factory/userFactory')

    const userFactory = await UserFactory.createInstance()
    const result = await userFactory.find()
    deepStrictEqual(result, expected)
  }
})()