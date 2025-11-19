import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock environment variables for tests
process.env.DRUPAL_API_URL = 'https://api.kcvvelewijt.be'
process.env.FOOTBALISTO_API_URL = 'https://footbalisto.be'
process.env.NEXT_PUBLIC_TYPEKIT_ID = 'cvo5raz'
