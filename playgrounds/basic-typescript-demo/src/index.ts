import { fibonacci } from './math'

export { cube } from './math'

export function fibonacciMinusOne(n: number): number {
  return fibonacci(n - 1)
}

export class Hello {
  constructor(public name: string) {}

  sayHello() {
    return `Hello, ${this.name}!`
  }
}
