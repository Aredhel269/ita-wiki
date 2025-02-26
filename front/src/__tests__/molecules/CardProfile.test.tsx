import { screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { render } from '../test-utils'
import { CardProfile } from '../../components/molecules/CardProfile'

const mockLogOut = vi.fn()

describe('CardProfile', () => {
  it('renders correctly with all given props', () => {
    render(
      <CardProfile
        img="/test-img.jpg"
        userName="test-name"
        email="test@test.com"
        contributions={3}
        votes={23}
        favorites={15}
        handleLogOut={mockLogOut}
        resourcesError={false}
        favsError={false}
      />
    )

    const image: HTMLImageElement = screen.getByAltText(/test-name/i)
    expect(image).toHaveAttribute('src', '/test-img.jpg')

    expect(screen.getByText(/test-name/i)).toBeInTheDocument()

    expect(screen.getByText(/test@test.com/i)).toBeInTheDocument()

    const button: HTMLButtonElement = screen.getByRole('button')
    expect(button).toHaveTextContent(/tanca sessió/i)
    fireEvent.click(button)
    expect(mockLogOut).toHaveBeenCalled()

    expect(screen.getByTestId(/aportacions/i)).toHaveTextContent('3')
    expect(screen.getByText(/aportacions/i)).toBeInTheDocument()

    expect(screen.getByTestId(/vots rebuts/i)).toHaveTextContent('23')
    expect(screen.getByText(/vots rebuts/i)).toBeInTheDocument()

    expect(screen.getByTestId(/recursos preferits/i)).toHaveTextContent('15')
    expect(screen.getByText(/recursos preferits/i)).toBeInTheDocument()
  })
  it('renders correctly server errors', () => {
    render(
      <CardProfile
        img="/test-img.jpg"
        userName="test-name"
        email="test@test.com"
        contributions={3}
        votes={23}
        favorites={15}
        handleLogOut={mockLogOut}
        resourcesError
        favsError
      />
    )

    const notAvailableTexts = screen.getAllByText('n/d')
    expect(notAvailableTexts).toHaveLength(3)

    expect(screen.queryByText(3)).not.toBeInTheDocument()
    expect(screen.getByText(/aportacions/i)).toBeInTheDocument()

    expect(screen.queryByText(23)).not.toBeInTheDocument()
    expect(screen.getByText(/vots rebuts/i)).toBeInTheDocument()

    expect(screen.queryByText(15)).not.toBeInTheDocument()
    expect(screen.getByText(/recursos preferits/i)).toBeInTheDocument()
  })
})
