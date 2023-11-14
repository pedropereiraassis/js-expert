// Fluent API's objective is to execute tasks as a pipeline, step by step
// and at the end call the build method. Very similar to Builder pattern
// where the difference is that here is about processes (chains) and the
// Builder is about objects construction
class TextProcessorFluentAPI {
  // private property
  #content
  constructor(content) {
    this.#content = content
  }

  extractPeopleData() {
    // ?<= extracts the data that comes after this group
    // [contratante|contratada] or one or another (and has the 'i' flag at the end to say its case insensitive)
    // :\s{1} looks for literal character ':' followed up by a 'space'
    // everything above inside a parenthesis to 'get from ahead of this'

    // (?!\s) negative look around, will ignore all 'space' after that first 'space' (ignore 'contratantes' at the end 
    // of file that only has space ahead them)
    // .*\n get anything until the first '\n' (new line)
    // .*? non greedy, this '?' makes it stop on first occurence, that way it avoids loops
    
    // $ informs that the search ends at the end of line
    // g -> global
    // m -> multiline
    // i -> insensitive

    const matchPersonRegex = /(?<=[contratante|contratada]:\s{1})(?!\s)(.*\n.*?)$/gmi
    
    // the match() method finds the entire string that has the data we need (always returning array with matches)
    const onlyPerson = this.#content.match(matchPersonRegex)
    // console.log('onlyPerson', matchPersonRegex.test(this.#content))
    this.#content = onlyPerson
    return this
  }

  build() {
    return this.#content
  }
}

module.exports = TextProcessorFluentAPI