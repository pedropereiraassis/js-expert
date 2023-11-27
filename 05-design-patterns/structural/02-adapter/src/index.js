import RickAndMortyBRLAdapter from "./business/adapters/rickAndMortyBRLAdapter.js";
import RickAndMortyUSAAdapter from "./business/adapters/rickAndMortyUSAAdapter.js";

const data = [
  RickAndMortyBRLAdapter,
  RickAndMortyUSAAdapter,
].map((integration) => integration.getCharacters())

const allResults = await Promise.allSettled(data)

const successes = allResults
  .filter(({ status }) => status === 'fulfilled')
  .flatMap(({ value }) => value)

const errors = allResults.filter(({ status }) => status === 'rejected')

console.table(successes)
console.table(errors)