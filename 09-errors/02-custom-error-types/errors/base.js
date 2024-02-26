export default class extends Error {
  constructor({ name, message }) {
    super(message)
    this.name = name
  }
}