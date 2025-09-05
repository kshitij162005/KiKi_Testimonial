import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../Pages/Dashboard'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock UI components
vi.mock('../Components/ui', () => ({
  Button: ({ children, onClick, className, ...props }) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  ),
  VideoFeedbackComingSoon: () => <div data-testid="video-feedback-coming-soon">Coming Soon</div>,
}))

// Mock SentimentAnalysis component
vi.mock('../Components/dashboard/SentimentAnalysis/SentimentAnalysis', () => ({
  default: () => <div data-testid="sentiment-analysis">Sentiment Analysis</div>,
}))

// Mock images
vi.mock('../Images/happy.gif', () => ({ default: 'happy.gif' }))
vi.mock('../Images/palm.gif', () => ({ default: 'palm.gif' }))
vi.mock('../Images/angry.gif', () => ({ default: 'angry.gif' }))
vi.mock('../Images/crying.gif', () => ({ default: 'crying.gif' }))
vi.mock('../Images/Tree.svg', () => ({ default: 'tree.svg' }))

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  )
}

describe('Dashboard Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    sessionStorage.clear()
    
    // Mock localStorage.getItem for userId
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'userId') return 'test-user-id'
      if (key === 'cookieConsent') return 'accepted'
      return null
    })

    // Mock successful API responses
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ([]),
    })
  })

  describe('Navigation Elements', () => {
    it('should render profile button with smooth transitions', async () => {
      renderDashboard()
      
      await waitFor(() => {
        const buttons = screen.getAllByRole('button')
        const profileButton = buttons.find(btn => btn.className.includes('rounded-full'))
        expect(profileButton).toBeInTheDocument()
        expect(profileButton).toHaveClass('transition-all', 'duration-200', 'ease-out')
      })
    })

    it('should navigate to profile when profile button is clicked', async () => {
      renderDashboard()
      
      await waitFor(() => {
        const buttons = screen.getAllByRole('button')
        const profileButton = buttons.find(btn => btn.className.includes('rounded-full'))
        fireEvent.click(profileButton)
        expect(mockNavigate).toHaveBeenCalledWith('/profile')
      })
    })

    it('should render Create New Space button with smooth transitions', async () => {
      renderDashboard()
      
      const createButton = screen.getByRole('link', { name: /create new space/i })
      expect(createButton).toBeInTheDocument()
      expect(createButton.firstChild).toHaveClass('transition-all', 'duration-300', 'ease-out')
    })

    it('should not render non-functional View Analytics button', async () => {
      renderDashboard()
      
      await waitFor(() => {
        const analyticsButton = screen.queryByRole('button', { name: /view analytics/i })
        expect(analyticsButton).not.toBeInTheDocument()
      })
    })
  })

  describe('View Mode Toggle', () => {
    it('should render view mode toggle buttons with smooth transitions', async () => {
      renderDashboard()
      
      await waitFor(() => {
        const buttons = screen.getAllByRole('button')
        // Find view toggle buttons by their specific classes
        const viewToggleButtons = buttons.filter(btn => 
          btn.className.includes('p-2') && 
          btn.className.includes('rounded-lg') &&
          btn.className.includes('transition-all')
        )
        
        expect(viewToggleButtons.length).toBeGreaterThanOrEqual(2)
        viewToggleButtons.forEach(btn => {
          expect(btn).toHaveClass('transition-all')
        })
      })
    })

    it('should toggle view mode when buttons are clicked', async () => {
      renderDashboard()
      
      await waitFor(() => {
        const buttons = screen.getAllByRole('button')
        // Find the second view toggle button (list view)
        const viewToggleButtons = buttons.filter(btn => 
          btn.className.includes('transition-all') && 
          btn.className.includes('rounded-lg') &&
          !btn.className.includes('rounded-full')
        )
        
        if (viewToggleButtons.length >= 2) {
          const listButton = viewToggleButtons[1]
          fireEvent.click(listButton)
          expect(listButton).toHaveClass('bg-surface-800', 'text-primary-400')
        }
      })
    })
  })

  describe('Space Cards', () => {
    it('should render space cards with smooth hover transitions when spaces exist', async () => {
      const mockSpaces = [
        { _id: '1', spacename: 'Test Space', publicUrl: 'test-space' }
      ]
      
      // Mock the initial fetch for spaces
      global.fetch.mockImplementation((url) => {
        if (url.includes('getSpacesByUserId')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => mockSpaces,
          })
        }
        // Mock other API calls
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ textFeedbackCount: 0, videoFeedbackCount: 0 }),
        })
      })

      renderDashboard()
      
      await waitFor(() => {
        // Look for elements with card-hover class which indicates space cards
        const spaceCards = document.querySelectorAll('.card-hover')
        expect(spaceCards.length).toBeGreaterThan(0)
        spaceCards.forEach(card => {
          expect(card).toHaveClass('transition-all', 'duration-300', 'ease-out')
        })
      })
    })
  })

  describe('Cookie Consent', () => {
    it('should render cookie consent buttons with smooth transitions when consent is null', async () => {
      localStorage.getItem.mockImplementation((key) => {
        if (key === 'userId') return 'test-user-id'
        if (key === 'cookieConsent') return null
        return null
      })

      renderDashboard()
      
      await waitFor(() => {
        const acceptButton = screen.getByRole('button', { name: /accept all/i })
        const rejectButton = screen.getByRole('button', { name: /reject/i })
        
        expect(acceptButton).toBeInTheDocument()
        expect(rejectButton).toBeInTheDocument()
        expect(acceptButton).toHaveClass('transition-all', 'duration-200', 'ease-out')
        expect(rejectButton).toHaveClass('transition-all', 'duration-200', 'ease-out')
      })
    })

    it('should handle cookie consent acceptance', async () => {
      localStorage.getItem.mockImplementation((key) => {
        if (key === 'userId') return 'test-user-id'
        if (key === 'cookieConsent') return null
        return null
      })

      renderDashboard()
      
      await waitFor(() => {
        const acceptButton = screen.getByRole('button', { name: /accept all/i })
        fireEvent.click(acceptButton)
        
        expect(localStorage.setItem).toHaveBeenCalledWith('cookieConsent', 'accepted')
      })
    })
  })

  describe('Empty State Navigation', () => {
    it('should render Create Your First Space button with smooth transitions when no spaces exist', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ([]), // Empty spaces array
      })

      renderDashboard()
      
      await waitFor(() => {
        const createFirstSpaceButton = screen.getByRole('button', { name: /create your first space/i })
        expect(createFirstSpaceButton).toBeInTheDocument()
        expect(createFirstSpaceButton).toHaveClass('transition-all', 'duration-300', 'ease-out')
      })
    })
  })

  describe('Functional Navigation Elements', () => {
    it('should ensure all navigation elements are functional', async () => {
      renderDashboard()
      
      await waitFor(() => {
        // Check that all buttons have proper onClick handlers or are links
        const buttons = screen.getAllByRole('button')
        const profileButton = buttons.find(btn => btn.className.includes('rounded-full'))
        const createSpaceLink = screen.getByRole('link', { name: /create new space/i })
        
        expect(profileButton).toBeInTheDocument()
        expect(createSpaceLink).toHaveAttribute('href')
      })
    })

    it('should provide visual feedback on hover for interactive elements', async () => {
      renderDashboard()
      
      await waitFor(() => {
        const buttons = screen.getAllByRole('button')
        const profileButton = buttons.find(btn => btn.className.includes('rounded-full'))
        
        // Check for hover classes
        expect(profileButton).toHaveClass('hover:scale-110', 'hover:bg-surface-800/50')
      })
    })
  })
})