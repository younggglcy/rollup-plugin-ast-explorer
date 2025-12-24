import { add, multiply } from './math.js'

export function calculate(x, y) {
  const sum = add(x, y)
  const product = multiply(x, y)
  return { sum, product }
}

const result = calculate(5, 3)
// eslint-disable-next-line no-console
console.log('Result:', result)
