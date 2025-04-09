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
import { Response } from '@dnd-kit/core/dist/sensors/types'

describe('Pattern form', () => {
  it("When I'm setting a pattern length, the app prevents me from setting it longer than the song", async () => {
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
    // Todo: trouver comment simuler un appui sur la flèche du haut
    // await userEvent.keyboard('[ArrowUp]')
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
})
