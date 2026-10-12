import { Link } from 'react-router-dom'

/**
 * Tiny per-form privacy notice. Drop above the submit button on every form
 * that collects personal information (names, contact info, dancer details).
 */
export default function PrivacyNotice({ className = '' }) {
  return (
    <p className={`text-mist-400 text-xs leading-relaxed ${className}`}>
      By submitting, you agree to our{' '}
      <Link to="/privacy" className="text-white underline hover:underline">
        Privacy Policy
      </Link>{' '}
      and consent to Capital Core Dance Studio using the information you provide to
      respond to your inquiry, process your registration or order, and operate the studio.
    </p>
  )
}
