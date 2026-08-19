import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Classes from './pages/Classes'
import ClassLevels from './pages/ClassLevels'
import AdultClasses from './pages/AdultClasses'
import LittleMovers from './pages/LittleMovers'
import About from './pages/About'
import Tuition from './pages/Tuition'
import DanceCompany from './pages/DanceCompany'
import Birthdays from './pages/Birthdays'
import Contact from './pages/Contact'
import Careers from './pages/Careers'
import FAQ from './pages/FAQ'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'
import CookieBanner from './components/CookieBanner'

// Cleared out 2026-08-19 at the studio's request: everything not part of the Fall
// season and beyond is gone rather than commented out. Deleted with their page files
// were the 2026 summer programmes (camps, summer classes, the adult summer series, the
// mini series), the June 2026 recital and its shop, the on-site birthday booking flow
// (party requests go to the studio portal now), and the recital orders viewer.
//
// The studio expects to run recitals and summer programmes again, and the recital pages
// in particular are being rebuilt from scratch rather than restored. Anything needed
// from the old versions is in git history at 2165126.
//
// Their URLs are not gone: vercel.json 308s each retired path to its closest live page,
// which is what actually clears them out of a search index. Anything else unmatched
// falls through to the catch-all at the bottom of this file.

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/tuition" element={<Tuition />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/class-levels" element={<ClassLevels />} />
        <Route path="/adult-classes" element={<AdultClasses />} />
        <Route path="/little-movers" element={<LittleMovers />} />
        <Route path="/dance-company" element={<DanceCompany />} />
        <Route path="/competition-team" element={<DanceCompany />} />
        <Route path="/birthdays" element={<Birthdays />} />
        {/* The on-site birthday booking flow was retired 2026-08-03 and its pages are
            now deleted. These three paths were live for months and are sitting in old
            emails, so they land on the Birthdays page rather than the 404. Kept here
            rather than in vercel.json only because they redirect within the app to a
            page a visitor still wants, not out of a section that no longer exists. */}
        <Route path="/birthday-booking" element={<Navigate to="/birthdays" replace />} />
        <Route path="/birthday-payment" element={<Navigate to="/birthdays" replace />} />
        <Route path="/birthday-thankyou" element={<Navigate to="/birthdays" replace />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        {/* Catch-all, added 2026-08-19. Without it an unmatched URL rendered the app
            shell and nothing else: a blank white page returning HTTP 200, which gives
            a visitor no way onward and reads to a search engine as a soft 404.
            Keep this route LAST. */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CookieBanner />
    </BrowserRouter>
  )
}
