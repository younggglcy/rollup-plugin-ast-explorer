export const square = (x: number) => x * x

export const cube = (x: number) => x * x * x

export function fibonacci(n: number): number {
  if (n <= 1) {
    return 1
  }
  return fibonacci(n - 1) + fibonacci(n - 2)
}
