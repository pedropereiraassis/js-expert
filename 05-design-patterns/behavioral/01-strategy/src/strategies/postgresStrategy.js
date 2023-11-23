import knex from 'knex'

export default class PostgresStrategy {
  #instance
  constructor(connectionString) {
    this.connectionString = connectionString
    this.table = 'warriors'
  }

  async connect() {
    this.#instance = knex({
      client: 'pg',
      connection: this.connectionString,
    })

    return await this.#instance.raw('SELECT 1+1 AS result')
  }

  async create(item) {
    return await this.#instance
      .insert(item)
      .into(this.table)
  }

  async read(item) {
    return await this.#instance
      .select()
      .from(this.table)
  }
}