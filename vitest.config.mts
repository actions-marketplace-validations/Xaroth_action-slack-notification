import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Mirrors the tsconfig `baseUrl`, so non-relative imports like `utils/state` resolve.
  resolve: {
    alias: {
      utils: resolve(import.meta.dirname, 'src/utils'),
    },
  },
  test: {
    coverage: {
      provider: 'v8',
      reportsDirectory: 'test-results/coverage-results',
      reporter: ['text', 'json', 'json-summary'],
    },
  },
})
