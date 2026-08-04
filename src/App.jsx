import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Classes from './pages/Classes'
import ClassLevels from './pages/ClassLevels'
import AdultClasses from './pages/AdultClasses'
import LittleMovers from './pages/LittleMovers'
import About from './pages/About'
import Tuition from './pages/Tuition'
// Summer 2026 programming retired after the season (switched to Fall on 2026-07-23).
// Page files are preserved — re-import and re-add the routes below to restore next summer.
// import Camps from './pages/Camps'
// import CampForm from './pages/CampForm'
// import CampPayment from './pages/CampPayment'
// import CampThankYou from './pages/CampThankYou'
// import MiniSeries from './pages/MiniSeries'
// import SummerClasses from './pages/SummerClasses'
// import SummerClassesForm from './pages/SummerClassesForm'
// import SummerClassesPayment from './pages/SummerClassesPayment'
// import SummerClassesThankYou from './pages/SummerClassesThankYou'
// import AdultSummerSeries from './pages/AdultSummerSeries'
// import AdultSeriesForm from './pages/AdultSeriesForm'
// import AdultSeriesPayment from './pages/AdultSeriesPayment'
// import AdultSeriesThankYou from './pages/AdultSeriesThankYou'
import DanceCompany from './pages/DanceCompany'
import Birthdays from './pages/Birthdays'
// On-site birthday booking retired 2026-08-03 — party requests now go to the studio
// portal at https://studio.capitalcoredance.com/party-request, linked from Birthdays.jsx.
// Page files are preserved; to restore, re-add these imports and the routes below, and
// recover BirthdayForm.test.jsx from git history.
// import BirthdayForm from './pages/BirthdayForm'
// import BirthdayPayment from './pages/BirthdayPayment'
// import BirthdayThankYou from './pages/BirthdayThankYou'
import Contact from './pages/Contact'
// Recital pages removed from the public site after the June 2026 recital wrapped.
// Page files are preserved — re-import and re-add the routes below to restore.
// import Recital from './pages/Recital'
// import RecitalShirts from './pages/RecitalShirts'
// import RecitalShirtThankYou from './pages/RecitalShirtThankYou'
// import RecitalShop from './pages/RecitalShop'
// import RecitalShopThankYou from './pages/RecitalShopThankYou'
import FAQ from './pages/FAQ'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Orders from './pages/Orders'
import CookieBanner from './components/CookieBanner'

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
        {/* Summer 2026 routes retired 2026-07-23. Restore by uncommenting these
            and the imports above when summer registration reopens.
        <Route path="/camps" element={<Camps />} />
        <Route path="/camp-registration" element={<CampForm />} />
        <Route path="/camp-payment" element={<CampPayment />} />
        <Route path="/pay/camp/:registrationId" element={<CampPayment />} />
        <Route path="/camp-thankyou" element={<CampThankYou />} />
        <Route path="/mini-series" element={<MiniSeries />} />
        <Route path="/summer-classes" element={<SummerClasses />} />
        <Route path="/summer-classes/signup" element={<SummerClassesForm />} />
        <Route path="/summer-classes/payment" element={<SummerClassesPayment />} />
        <Route path="/summer-classes/thankyou" element={<SummerClassesThankYou />} />
        <Route path="/adult-summer-series" element={<AdultSummerSeries />} />
        <Route path="/adult-summer-series/signup" element={<AdultSeriesForm />} />
        <Route path="/adult-summer-series/payment" element={<AdultSeriesPayment />} />
        <Route path="/adult-summer-series/thankyou" element={<AdultSeriesThankYou />} />
        */}
        <Route path="/birthdays" element={<Birthdays />} />
        {/* On-site birthday booking retired 2026-08-03 (see imports above). Requests now
            go to the studio portal. These paths were live and may be bookmarked or sitting
            in old emails, and this app has no catch-all route — without these redirects an
            old link renders a blank white page. Restore the flow by uncommenting the
            original routes below and the imports above, and deleting these redirects. */}
        <Route path="/birthday-booking" element={<Navigate to="/birthdays" replace />} />
        <Route path="/birthday-payment" element={<Navigate to="/birthdays" replace />} />
        <Route path="/birthday-thankyou" element={<Navigate to="/birthdays" replace />} />
        {/*
        <Route path="/birthday-booking" element={<BirthdayForm />} />
        <Route path="/birthday-payment" element={<BirthdayPayment />} />
        <Route path="/birthday-thankyou" element={<BirthdayThankYou />} />
        */}
        <Route path="/contact" element={<Contact />} />
        {/* Recital routes removed after the June 2026 recital. Restore by
            uncommenting these and the imports above.
        <Route path="/recital" element={<Recital />} />
        <Route path="/recital/shirts" element={<RecitalShirts />} />
        <Route path="/recital/shirts/thankyou" element={<RecitalShirtThankYou />} />
        <Route path="/recitalshop" element={<RecitalShop />} />
        <Route path="/recitalshop/thankyou" element={<RecitalShopThankYou />} />
        */}
        <Route path="/faq" element={<FAQ />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
      <CookieBanner />
    </BrowserRouter>
  )
}
