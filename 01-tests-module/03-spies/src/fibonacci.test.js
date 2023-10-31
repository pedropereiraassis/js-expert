// Fibonacci: next number is the sum of the 2 previous number
// input: 3
// 0,1,1
// input: 5
// 0,1,1,2,3
const { createSandbox } = require('sinon');
const Fibonacci = require('./fibonacci');
const assert = require('assert');

const sinon = createSandbox()
  
  ;(async () => {
  {
    const fibonacci = new Fibonacci()
    const spy = sinon.spy(
      fibonacci,
      fibonacci.execute.name
    )
    
    for (const _sequence of fibonacci.execute(3)) {}
    const expectedCallCount = 4
    assert.strictEqual(spy.callCount, expectedCallCount)
  }
  
  {
    const fibonacci = new Fibonacci()
    const spy = sinon.spy(
      fibonacci,
      fibonacci.execute.name
    )

    const results = [...fibonacci.execute(5)]
    const expectedCallCount = 6
    assert.strictEqual(spy.callCount, expectedCallCount)

    const { args } = spy.getCall(2)
    const expectedParams = [3, 1, 2]
    assert.deepStrictEqual(args, expectedParams)

    const expectedResults = [0, 1, 1, 2, 3]
    assert.deepStrictEqual(results, expectedResults)
  }
})()