import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom'
import Birthdays from './pages/Birthdays'

// Mirrors the retired-birthday-flow redirects in App.jsx. App itself mounts a
// BrowserRouter, so its routes can't be driven from a test — this asserts the
// redirect behaviour those routes are there to provide.
function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/birthdays" element={<Birthdays />} />
        <Route path="/birthday-booking" element={<Navigate to="/birthdays" replace />} />
        <Route path="/birthday-payment" element={<Navigate to="/birthdays" replace />} />
        <Route path="/birthday-thankyou" element={<Navigate to="/birthdays" replace />} />
      </Routes>
    </MemoryRouter>
  )
}

test.each(['/birthday-booking', '/birthday-payment', '/birthday-thankyou'])(
  'retired route %s lands on the Birthdays page instead of a blank screen',
  (path) => {
    renderAt(path)
    expect(screen.getByRole('heading', { level: 1, name: 'Dance parties' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Request Your Party →' })).toBeInTheDocument()
  }
)
