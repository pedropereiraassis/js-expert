const { evaluateRegex } = require("./util")

class Person {
  // (\w+):\s.*, replace by $1,

  constructor([
    name,
    country,
    civilState,
    document,
    street,
    number,
    neighbourhood,
    state,
  ]) {
    // ^ -> since beginning of string
    // + -> one or more occurrencies
    // (\w{1}) -> only first letter and put it in a group
    // ([a-zA-Z]) -> all upper and lower case letters, adding + to catch all until the special character
    // /g -> all occurrencies
    const firstLetterExp = evaluateRegex(/^(\w{1})([a-zA-Z]+$)/g)
    const formatFirstLetter = (prop) => {
      return prop.replace(firstLetterExp, (fullMatch, group1, group2, index) => {
        return `${group1.toUpperCase()}${group2.toLowerCase()}`
      })
    }

    // (\w+), replace by this.$1 = $1
    this.name = name
    this.country = formatFirstLetter(country)
    this.civilState = formatFirstLetter(civilState)

    // \D -> everything that's not a digit
    // /g -> match all occurrencies
    this.document = document.replace(evaluateRegex(/\D/g), '')

    // starts to look after the ' a ' and catch everything ahead
    // (?<= ignore everything behind the match)
    // known as positive look behind
    this.street = street.match(evaluateRegex(/(?<=\sa\s).*$/)).join()
    this.number = number

    // starts to loof after the space and take any letter or digit until end of line (could be .* as well)
    this.neighbourhood = neighbourhood.match(evaluateRegex(/(?<=\s).*$/)).join()

    // remove . literal from end of string
    this.state = state.replace(evaluateRegex(/\.$/), '')
  }
}

module.exports = Person