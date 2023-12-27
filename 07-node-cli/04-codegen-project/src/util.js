export default class Util {
  static #transform(str, upperCase = true) {
    const [first, ...rest] = str

    if (!first) {
      return ''
    }
    
    const firstLetter = upperCase ?
      first.toUpperCase() :
      first.toLowerCase()

    return [firstLetter, ...rest].join('')
  }

  static upperCaseFirstLetter(str) {
    return Util.#transform(str)
  }

  static lowerCaseFirstLetter(str) {
    return Util.#transform(str, false)
  }
}