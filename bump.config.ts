import { env } from 'node:process'
import { defineConfig } from 'bumpp'

export default defineConfig({
  recursive: true,
  noVerify: env.CI === 'true',
})
