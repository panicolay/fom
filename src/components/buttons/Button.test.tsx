import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Hello component', () => {
  it('renders the name', () => {
    render(<Button />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
