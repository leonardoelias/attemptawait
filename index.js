const apply  = require('ramda/src/apply')
const curry  = require('ramda/src/curry')
const ifElse = require('ramda/src/ifElse')
const T      = require('ramda/src/T')

const reject = Promise.reject.bind(Promise)

const attemptawait = (opts={}, func) => {
  const {
    time  = 150,
    tries = 10,
    when  = T
  } = opts

  const attemptAwait = (...args) => {
    let count = 0

    const attempt = _ =>
      new Promise((response, reject) => {
        setTimeout(_ => {
          run().then(response, reject)
        }, delay(time, count))
      })

    const run = _ =>
      Promise.resolve(args)
        .then(apply(func))
        .catch(ifElse(when, tryAgain, reject))

    const tryAgain = err =>
      ++count < tries ? attempt() : reject(err)

    return run()
  }

  return attemptAwait
}

const delay = (time, count) =>
  count && randBetween(0, time * Math.pow(2, count))

const randBetween = (min, max) =>
  min + Math.random() * (max - min)

module.exports = curry(attemptawait)