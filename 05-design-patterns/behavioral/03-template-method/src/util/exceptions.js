class NotImplementedException extends Error {
  constructor(message) {
    super(`${message} has called without implementation`)
    this.name = 'NotImplementedException'
  }
}

export { NotImplementedException }