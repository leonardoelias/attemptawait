const { expect } = require('chai')
const { gte }    = require('ramda')
const prop   = require('prop-factory')

const attemptawait = require('../index')

const res = prop()

const fails = times => {
  let count = 0
  return () =>
    ++count < times
      ? Promise.reject(count)
      : Promise.resolve(count)
}

const opts = { time: 16, tries: 5 }

const defaulted   = attemptawait(undefined, fails(1))
const sure        = attemptawait(opts, fails(0))
const failsLittle = attemptawait(opts, fails(3))
const ugry        = attemptawait(opts, fails(10))
const isWhen      = attemptawait({ time: 16, tries: 5, when: gte(2) }, fails(10))

describe('attemptawait', () => {
  
  describe('with no options', () => {
    beforeEach(() =>
      defaulted('a').then(res)
    )

    it('has safe defaults', () =>
      expect(res()).to.equal(1)
    )
  })

  describe('when function succeeds', () => {
    beforeEach(() =>
      sure('a').then(res)
    )

    it('only runs once', () =>
      expect(res()).to.equal(1)
    )
  })

  describe('when function fails a little', () => {
    beforeEach(() =>
      failsLittle('a').then(res)
    )

    it('retries until success', () =>
      expect(res()).to.equal(3)
    )
  })

  describe('when functions fails a lot', () => {
    beforeEach(() =>
      ugry('a').catch(res)
    )

    it('retries the max number of times before rejecting', () =>
      expect(res()).to.equal(5)
    )
  })

  describe('when attemptawait predicate supplied', () => {
    beforeEach(() =>
      isWhen('a').catch(res)
    )

    it('retries only when predicate passes', () =>
      expect(res()).to.equal(3)
    )
  })
})