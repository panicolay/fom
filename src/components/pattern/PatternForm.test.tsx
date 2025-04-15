import { EmptyBar } from '../../types/patternTypes'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
// TODO: faire un helper global pour QueryClientProvider ?
vi.mock('../../hooks/usePatternMutation', () => ({
  usePatternMutation: () => ({
    createPattern: vi.fn(),
    updatePattern: vi.fn(),
    deletePattern: vi.fn(),
    isLoading: false,
  }),
}))
import { PatternForm } from './PatternForm'
import userEvent from '@testing-library/user-event'

describe('Pattern form', () => {
  it("When I'm setting a pattern length by typing a value, the app prevents me from setting it longer than the song", async () => {
    // Given
    const selectedEmptyBar: EmptyBar = {
      type: 'empty',
      start: 0,
    }
    render(
      <PatternForm
        totalBars={10}
        trackId={'trackId'}
        timelineItem={selectedEmptyBar}
        patterns={[]}
        isOpen={true}
        onClose={vi.fn()}
        onFormDataChange={vi.fn()}
      />,
    )

    const lengthInput = screen.getByRole('spinbutton', { name: 'length' })
    expect(lengthInput).toHaveValue(1)

    await userEvent.click(lengthInput)

    // When
    await userEvent.type(lengthInput, '11')

    // Then
    expect(lengthInput).toHaveValue(10)
  })

  it("When I'm setting a pattern number of repetition, the app prevents me from setting it longer than the song", async () => {
    // Given
    const selectedEmptyBar: EmptyBar = {
      type: 'empty',
      start: 0,
    }
    render(
      <PatternForm
        totalBars={10}
        trackId={'trackId'}
        timelineItem={selectedEmptyBar}
        patterns={[]}
        isOpen={true}
        onClose={vi.fn()}
        onFormDataChange={vi.fn()}
      />,
    )
    const lengthInput = screen.getByRole('spinbutton', { name: 'length' })
    await userEvent.click(lengthInput)
    await userEvent.keyboard('backspace')
    await userEvent.type(lengthInput, '5')

    const repsInput = screen.getByRole('spinbutton', { name: 'reps.' })
    expect(repsInput).toHaveValue(1)
    await userEvent.click(repsInput)
    // When
    await userEvent.keyboard('backspace')
    await userEvent.type(repsInput, '3')
    // Then
    expect(repsInput).toHaveValue(2)
  })

  it('When I change the starter point of a pattern, the app prevents me from setting it longer than the song', async () => {
    // Given
    const selectedEmptyBar: EmptyBar = {
      type: 'empty',
      start: 0,
    }
    render(
      <PatternForm
        totalBars={10}
        trackId={'trackId'}
        timelineItem={selectedEmptyBar}
        patterns={[]}
        isOpen={true}
        onClose={vi.fn()}
        onFormDataChange={vi.fn()}
      />,
    )
    const lengthInput = screen.getByRole('spinbutton', { name: 'length' })
    await userEvent.click(lengthInput)
    await userEvent.keyboard('backspace')
    await userEvent.type(lengthInput, '5')

    const startInput = screen.getByRole('spinbutton', { name: 'start' })
    expect(startInput).toHaveValue(0)

    await userEvent.click(startInput)
    // When
    await userEvent.keyboard('backspace')
    await userEvent.type(startInput, '6')

    // Then
    expect(startInput).toHaveValue(5)
  })
})
