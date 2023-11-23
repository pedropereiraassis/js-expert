import { MongoClient } from 'mongodb'

export default class MongoDBStrategy {
  #instance
  constructor(connectionString) {
    const { pathname: dbName } = new URL(connectionString)
    this.connectionString = connectionString.replace(dbName, '')
    this.db = dbName.replace(/\W/, '')
    this.collection = 'warriors'
  }

  async connect() {
    const client = new MongoClient(this.connectionString)
    await client.connect()
    this.#instance = client.db(this.db).collection(this.collection)
  }

  async create(item) {
    return await this.#instance.insertOne(item)
  }

  async read(item) {
    return await this.#instance.find().toArray()
  }
}