/**
 * ResponsibilityFinder Component Tests
 *
 * Comprehensive test suite covering:
 * - Rendering and display
 * - User interactions
 * - Search functionality
 * - Accessibility
 * - Edge cases
 */


import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ResponsibilityFinder } from './ResponsibilityFinder'
import { responsibilityPaths } from '@/data/responsibility-paths'

describe('ResponsibilityFinder', () => {
  describe('Rendering', () => {
    it('renders the component', () => {
      render(<ResponsibilityFinder />)
      expect(screen.getByText(/IK BEN/i)).toBeInTheDocument()
    })

    it('renders all role buttons', () => {
      render(<ResponsibilityFinder />)

      expect(screen.getByRole('button', { name: /SPELER/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /OUDER/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /TRAINER/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /SUPPORTER/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /NIET-LID/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /ANDERE/i })).toBeInTheDocument()
    })

    it('does not show question input initially', () => {
      render(<ResponsibilityFinder />)
      expect(screen.queryByPlaceholderText(/typ je vraag/i)).not.toBeInTheDocument()
    })

    it('renders in compact mode when prop is true', () => {
      const { container } = render(<ResponsibilityFinder compact />)
      expect(container.querySelector('.compact')).toBeInTheDocument()
    })
  })

  describe('Role Selection', () => {
    it('shows question input after selecting a role', async () => {
      const user = userEvent.setup()
      render(<ResponsibilityFinder />)

      const spelerButton = screen.getByRole('button', { name: /SPELER/i })
      await user.click(spelerButton)

      expect(screen.getByPlaceholderText(/typ je vraag/i)).toBeInTheDocument()
    })

    it('highlights selected role button', async () => {
      const user = userEvent.setup()
      render(<ResponsibilityFinder />)

      const spelerButton = screen.getByRole('button', { name: /SPELER/i })
      await user.click(spelerButton)

      expect(spelerButton).toHaveClass('bg-green-main')
    })

    it('can change selected role', async () => {
      const user = userEvent.setup()
      render(<ResponsibilityFinder />)

      const spelerButton = screen.getByRole('button', { name: /SPELER/i })
      const ouderButton = screen.getByRole('button', { name: /OUDER/i })

      await user.click(spelerButton)
      expect(spelerButton).toHaveClass('bg-green-main')

      await user.click(ouderButton)
      expect(ouderButton).toHaveClass('bg-green-main')
      expect(spelerButton).not.toHaveClass('bg-green-main')
    })

    it('focuses input after role selection', async () => {
      const user = userEvent.setup()
      render(<ResponsibilityFinder />)

      const spelerButton = screen.getByRole('button', { name: /SPELER/i })
      await user.click(spelerButton)

      await waitFor(() => {
        const input = screen.getByPlaceholderText(/typ je vraag/i)
        expect(input).toHaveFocus()
      })
    })
  })

  describe('Search Functionality', () => {
    it('shows suggestions when typing', async () => {
      const user = userEvent.setup()
      render(<ResponsibilityFinder />)

      const spelerButton = screen.getByRole('button', { name: /SPELER/i })
      await user.click(spelerButton)

      const input = screen.getByPlaceholderText(/typ je vraag/i)
      await user.type(input, 'ongeval')

      await waitFor(() => {
        const elements = screen.getAllByText(/ongeval/i)
        expect(elements.length).toBeGreaterThan(0)
      })
    })

    it('filters suggestions by selected role', async () => {
      const user = userEvent.setup()
      render(<ResponsibilityFinder />)

      const ouderButton = screen.getByRole('button', { name: /OUDER/i })
      await user.click(ouderButton)

      const input = screen.getByPlaceholderText(/typ je vraag/i)
      await user.type(input, 'inschrijven')

      await waitFor(() => {
        // Should show registration question which is available for "ouder"
        const suggestions = screen.queryAllByText(/inschrijven/i)
        expect(suggestions.length).toBeGreaterThan(0)
      })
    })

    it('shows maximum 6 suggestions', async () => {
      const user = userEvent.setup()
      render(<ResponsibilityFinder />)

      const spelerButton = screen.getByRole('button', { name: /SPELER/i })
      await user.click(spelerButton)

      const input = screen.getByPlaceholderText(/typ je vraag/i)
      await user.type(input, 'w') // Broad search

      await waitFor(() => {
        const suggestionContainer = screen.getByRole('textbox').parentElement?.querySelector('.absolute')
        expect(suggestionContainer).toBeInTheDocument()
        const buttons = suggestionContainer!.querySelectorAll('button')
        expect(buttons.length).toBeLessThanOrEqual(6)
      })
    })

    it('clears search when clicking clear button', async () => {
      const user = userEvent.setup()
      render(<ResponsibilityFinder />)

      const spelerButton = screen.getByRole('button', { name: /SPELER/i })
      await user.click(spelerButton)

      const input = screen.getByPlaceholderText(/typ je vraag/i)
      await user.type(input, 'test')

      const clearButton = screen.getByLabelText(/clear search/i)
      await user.click(clearButton)

      expect(input).toHaveValue('')
    })

    it('hides suggestions when clicking outside', async () => {
      const user = userEvent.setup()
      render(<ResponsibilityFinder />)

      const spelerButton = screen.getByRole('button', { name: /SPELER/i })
      await user.click(spelerButton)

      const input = screen.getByPlaceholderText(/typ je vraag/i)
      await user.type(input, 'ongeval')

      // Click outside
      await user.click(document.body)

      await waitFor(() => {
        const suggestions = document.querySelector('.absolute.z-50')
        expect(suggestions).not.toBeInTheDocument()
      })
    })
  })

  describe('Result Selection', () => {
    it('shows result card when clicking suggestion', async () => {
      const user = userEvent.setup()
      render(<ResponsibilityFinder />)

      const spelerButton = screen.getByRole('button', { name: /SPELER/i })
      await user.click(spelerButton)

      const input = screen.getByPlaceholderText(/typ je vraag/i)
      await user.type(input, 'ongeval')

      const suggestions = await screen.findAllByRole('button', { name: /ongeval/i })
      const suggestion = suggestions[0]
      await user.click(suggestion)

      await waitFor(() => {
        expect(screen.getByText(/Contactpersoon/i)).toBeInTheDocument()
      })
    })

    it('calls onResultSelect callback', async () => {
      const onResultSelect = vi.fn()
      const user = userEvent.setup()
      render(<ResponsibilityFinder onResultSelect={onResultSelect} />)

      const spelerButton = screen.getByRole('button', { name: /SPELER/i })
      await user.click(spelerButton)

      const input = screen.getByPlaceholderText(/typ je vraag/i)
      await user.type(input, 'ongeval')

      const suggestions = await screen.findAllByRole('button', { name: /ongeval/i })
      const suggestion = suggestions[0]
      await user.click(suggestion)

      await waitFor(() => {
        expect(onResultSelect).toHaveBeenCalled()
      })
    })

    it('displays all result card sections', async () => {
      const user = userEvent.setup()
      render(<ResponsibilityFinder />)

      const spelerButton = screen.getByRole('button', { name: /SPELER/i })
      await user.click(spelerButton)

      const input = screen.getByPlaceholderText(/typ je vraag/i)
      await user.type(input, 'ongeval')

      const suggestions = await screen.findAllByRole('button', { name: /ongeval/i })
      const suggestion = suggestions[0]
      await user.click(suggestion)

      await waitFor(() => {
        expect(screen.getByText(/Contactpersoon/i)).toBeInTheDocument()
        expect(screen.getByText(/Wat moet je doen/i)).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<ResponsibilityFinder />)

      const spelerButton = screen.getByRole('button', { name: /SPELER/i })
      expect(spelerButton).toBeInTheDocument()
    })

    it('is keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<ResponsibilityFinder />)

      const spelerButton = screen.getByRole('button', { name: /SPELER/i })

      spelerButton.focus()
      expect(spelerButton).toHaveFocus()

      await user.keyboard('{Enter}')

      await waitFor(() => {
        const input = screen.getByPlaceholderText(/typ je vraag/i)
        expect(input).toBeInTheDocument()
      })
    })

    it('input has placeholder text', async () => {
      const user = userEvent.setup()
      render(<ResponsibilityFinder />)

      const spelerButton = screen.getByRole('button', { name: /SPELER/i })
      await user.click(spelerButton)

      const input = screen.getByPlaceholderText(/typ je vraag/i)
      expect(input).toHaveAttribute('placeholder')
    })
  })

  describe('Edge Cases', () => {
    it('handles no search results gracefully', async () => {
      const user = userEvent.setup()
      render(<ResponsibilityFinder />)

      const spelerButton = screen.getByRole('button', { name: /SPELER/i })
      await user.click(spelerButton)

      const input = screen.getByPlaceholderText(/typ je vraag/i)
      await user.type(input, 'xyzabc123notfound')

      // Should not crash, no suggestions shown
      const suggestions = screen.queryByRole('button', { name: /xyzabc/i })
      expect(suggestions).not.toBeInTheDocument()
    })

    it('handles empty search gracefully', async () => {
      const user = userEvent.setup()
      render(<ResponsibilityFinder />)

      const spelerButton = screen.getByRole('button', { name: /SPELER/i })
      await user.click(spelerButton)

      const input = screen.getByPlaceholderText(/typ je vraag/i)
      await user.clear(input)

      // Should not show suggestions for empty query
      expect(input).toHaveValue('')
    })

    it('handles rapid role switching', async () => {
      const user = userEvent.setup()
      render(<ResponsibilityFinder />)

      const roles = ['SPELER', 'OUDER', 'TRAINER', 'SUPPORTER']

      for (const role of roles) {
        const button = screen.getByRole('button', { name: new RegExp(role, 'i') })
        await user.click(button)
        expect(button).toHaveClass('bg-green-main')
      }
    })
  })

  describe('Data Integration', () => {
    it('uses real responsibility paths data', () => {
      render(<ResponsibilityFinder />)

      // Should have access to the imported data
      expect(responsibilityPaths).toBeDefined()
      expect(responsibilityPaths.length).toBeGreaterThan(0)
    })

    it('matches against keywords correctly', async () => {
      const user = userEvent.setup()
      render(<ResponsibilityFinder />)

      const spelerButton = screen.getByRole('button', { name: /SPELER/i })
      await user.click(spelerButton)

      const input = screen.getByPlaceholderText(/typ je vraag/i)

      // Search by keyword (not exact question text)
      await user.type(input, 'blessure')

      await waitFor(() => {
        // Should find questions with "blessure" in keywords
        const results = screen.queryAllByText(/blessure|herstel/i)
        expect(results.length).toBeGreaterThan(0)
      })
    })
  })
})
