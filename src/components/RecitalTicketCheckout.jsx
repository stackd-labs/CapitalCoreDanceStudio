import { useEffect, useMemo, useRef, useState } from 'react'
import { ACCENTS } from '../lib/pageAccents'
import { onAccent } from '../lib/accentContrast'
import { computeOrder, MAX_PER_TYPE, validatePromo } from '../lib/recitalTickets'

// Holiday Remix 2026 ticket checkout, PayPal. Lives inside the /recital tickets section
// and reuses the contact form's field styling. Orders are recorded by api/notify.js
// (studio email + buyer receipt); there is no database.
const ACCENT = ACCENTS.gold
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const TIERS = [
  { key: 'adult', price: '$25', label: 'Adult', note: 'General admission' },
  { key: 'kid', price: '$15', label: 'Ages 4 to 11', note: 'Kids ticket' },
  { key: 'child', price: 'Free', label: '3 and under', note: 'No ticket cost' },
]

const labelClass = 'font-body text-[11px] font-semibold tracking-[0.16em] uppercase text-mist-500'
const inputClass =
  'h-[46px] border border-white/20 bg-white/[0.04] px-4 font-body text-sm text-white placeholder:text-mist-500 focus:outline-none focus:border-white focus:bg-white/[0.08] transition-colors'
const stepBtn =
  'w-11 h-11 border border-ink-base/40 text-ink-base font-body font-bold text-xl leading-none hover:border-ink-base disabled:opacity-30 disabled:hover:border-ink-base/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-base'

export default function RecitalTicketCheckout() {
  const [qty, setQty] = useState({ adult: 0, kid: 0, child: 0 })
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [ack, setAck] = useState(false)
  const [touched, setTouched] = useState({ name: false, email: false })
  const [promoInput, setPromoInput] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [promoError, setPromoError] = useState('')
  const [ccdRef, setCcdRef] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | done | error
  const [errorMsg, setErrorMsg] = useState('')
  const [paypalReady, setPaypalReady] = useState(false)
  const [done, setDone] = useState(null)
  const openedAt = useRef(Date.now())

  const order = useMemo(
    () => computeOrder({ adultQty: qty.adult, kidQty: qty.kid, childQty: qty.child, promoCode }),
    [qty, promoCode],
  )
  const formValid = order.ticketCount > 0 && name.trim().length > 1 && EMAIL_RE.test(email.trim()) && ack
  const needsPayment = order.total > 0
  const nameBad = touched.name && name.trim().length < 2
  const emailBad = touched.email && !EMAIL_RE.test(email.trim())

  // Latest values for the PayPal callbacks, which are bound once.
  const live = useRef({})
  live.current = { order, name, email, ccdRef, formValid, promoCode }

  async function submitOrder(paypalOrderId) {
    const { order: o, name: n, email: e, ccdRef: ref, promoCode: pc } = live.current
    setStatus('submitting')
    setErrorMsg('')
    try {
      const r = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'recital_tickets',
          name: n.trim(),
          email: e.trim(),
          adultQty: o.adult,
          kidQty: o.kid,
          childQty: o.child,
          promoCode: pc,
          paypalOrderId: paypalOrderId || null,
          ccd_ref: ref,
          elapsedMs: Date.now() - openedAt.current,
        }),
      })
      if (!r.ok) throw new Error(`notify ${r.status}`)
      setDone({ name: n.trim(), email: e.trim(), order: o, paid: !!paypalOrderId })
      setStatus('done')
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMsg(
        paypalOrderId
          ? `Your payment went through (PayPal order ${paypalOrderId}) but we could not record the order. Please email info@capitalcoredance.com with that number and we will confirm your tickets.`
          : 'Something went wrong. Please try again or email info@capitalcoredance.com.',
      )
    }
  }

  // PayPal SDK
  useEffect(() => {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID
    if (!clientId) return
    if (window.paypal) { setPaypalReady(true); return }
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&disable-funding=card,paylater`
    script.async = true
    script.onload = () => setPaypalReady(true)
    script.onerror = () => console.error('Failed to load PayPal SDK')
    document.head.appendChild(script)
  }, [])

  const finished = status === 'done'
  const showPay = needsPayment && formValid && status !== 'submitting'

  // Mount the buttons only while they are visible (PayPal cannot size itself inside a
  // display:none box). Callbacks read the latest order from `live`, so quantity changes
  // do not remount them.
  useEffect(() => {
    if (!paypalReady || finished || !showPay) return
    const container = document.getElementById('pp-tickets')
    if (!container) return
    let buttons
    try {
      buttons = window.paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay', height: 50 },
        onClick: (_d, actions) => (live.current.formValid ? actions.resolve() : actions.reject()),
        createOrder: (_d, actions) =>
          actions.order.create({
            purchase_units: [{
              description: 'Capital Core Dance Studio: Holiday Remix 2026 recital tickets',
              amount: { value: live.current.order.total.toFixed(2), currency_code: 'USD' },
            }],
          }),
        onApprove: async (_d, actions) => {
          const captured = await actions.order.capture()
          await submitOrder(captured?.id)
        },
        onError: (err) => {
          console.error('PayPal error:', err)
          setStatus('error')
          setErrorMsg('Payment could not be completed. Please try again or contact the studio.')
        },
      })
      buttons.render('#pp-tickets')
    } catch (err) {
      console.error(err)
    }
    return () => {
      try { Promise.resolve(buttons?.close()).catch(() => {}) } catch { /* already gone */ }
    }
  }, [paypalReady, finished, showPay])

  function step(key, delta) {
    setQty((q) => ({ ...q, [key]: Math.min(MAX_PER_TYPE, Math.max(0, q[key] + delta)) }))
  }

  function applyPromo() {
    const p = validatePromo(promoInput)
    if (p) { setPromoCode(p.code); setPromoError('') } else { setPromoCode(''); setPromoError('That code is not valid.') }
  }

  if (finished && done) {
    const lines = [
      done.order.adult ? `Adult × ${done.order.adult}` : null,
      done.order.kid ? `Ages 4 to 11 × ${done.order.kid}` : null,
      done.order.child ? `3 and under × ${done.order.child}` : null,
    ].filter(Boolean)
    return (
      <div data-testid="ticket-confirmation" className="mt-10 border-l-4 bg-white/[0.04] px-6 py-6 max-w-[60ch]" style={{ borderColor: ACCENT }}>
        <div className="font-display uppercase text-white text-[28px] leading-none mb-3">You&apos;re all set, {done.name}</div>
        <p className="font-body text-mist-300 text-[16px] leading-relaxed m-0">
          {lines.join(' · ')}
          {done.paid ? ` · $${done.order.total.toFixed(2)} paid` : ' · free'}
        </p>
        <p className="font-body text-mist-300 text-[16px] leading-relaxed mt-3 mb-0">
          A confirmation is on its way to {done.email}. Keep it and show it at the door on Saturday,
          December 19 at 2:00 PM. Tickets are general admission and non-refundable.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-10" data-testid="ticket-checkout">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        {TIERS.map((t) => (
          <div
            key={t.key}
            data-testid="recital-ticket"
            className="bg-white border border-white px-[26px] pt-[26px] pb-[30px] border-t-[3px]"
            style={{ borderTopColor: ACCENT }}
          >
            <div className="font-display uppercase text-[56px] leading-none text-ink-base">{t.price}</div>
            <div className="font-display uppercase text-ink-base text-[24px] leading-none mt-4 mb-2">{t.label}</div>
            <div className="font-body text-[14.5px] leading-[1.55] text-ink-base/70">{t.note}</div>
            <div className="flex items-center gap-4 mt-5" role="group" aria-label={`${t.label} tickets`}>
              <button type="button" className={stepBtn} onClick={() => step(t.key, -1)} disabled={qty[t.key] === 0} aria-label={`Remove one ${t.label} ticket`}>−</button>
              <span data-testid={`qty-${t.key}`} className="font-body font-bold text-ink-base text-xl w-8 text-center tabular-nums" aria-live="polite">{qty[t.key]}</span>
              <button type="button" className={stepBtn} onClick={() => step(t.key, 1)} disabled={qty[t.key] >= MAX_PER_TYPE} aria-label={`Add one ${t.label} ticket`}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 max-w-[640px]">
        <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
          <label htmlFor="tix_ccd_ref">Leave this blank</label>
          <input id="tix_ccd_ref" name="ccd_ref" type="text" tabIndex={-1} autoComplete="off" value={ccdRef} onChange={(e) => setCcdRef(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="tix-name" className={labelClass}>Your name <span aria-hidden="true">*</span></label>
            <input
              id="tix-name"
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              autoComplete="name"
              required
              aria-required="true"
              aria-invalid={nameBad}
              aria-describedby={nameBad ? 'tix-name-err' : undefined}
            />
            {nameBad && <span id="tix-name-err" role="alert" className="font-body text-[13px] text-[#ff8c8c]">Please enter your name.</span>}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="tix-email" className={labelClass}>Email for your confirmation <span aria-hidden="true">*</span></label>
            <input
              id="tix-email"
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              autoComplete="email"
              required
              aria-required="true"
              aria-invalid={emailBad}
              aria-describedby={emailBad ? 'tix-email-err' : undefined}
            />
            {emailBad && <span id="tix-email-err" role="alert" className="font-body text-[13px] text-[#ff8c8c]">Please enter a valid email address.</span>}
          </div>
        </div>

        <p className="font-body text-[12px] text-mist-400 mt-3 mb-0">* Required</p>

        <div className="mt-5 flex flex-col gap-2 max-w-[320px]">
          <label htmlFor="tix-promo" className={labelClass}>Promo code (optional)</label>
          <div className="flex gap-2">
            <input id="tix-promo" className={`${inputClass} flex-1 min-w-0`} value={promoInput} onChange={(e) => setPromoInput(e.target.value)} />
            <button
              type="button"
              onClick={applyPromo}
              className="px-5 font-body font-bold text-[14px] border border-white/40 text-white hover:border-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Apply
            </button>
          </div>
          {promoError && <span role="alert" className="font-body text-[13px] text-[#ff8c8c]">{promoError}</span>}
          {order.promo && <span className="font-body text-[13px] text-mist-300">Promo code {order.promo.code} applied</span>}
        </div>

        <label className="mt-6 flex items-start gap-3 font-body text-[14px] text-mist-300 leading-relaxed cursor-pointer">
          <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} className="mt-1 w-4 h-4" />
          <span>I understand tickets are general admission and non-refundable once purchased.</span>
        </label>

        <div className="mt-6 border-t-[3px] pt-4" style={{ borderColor: ACCENT }} data-testid="ticket-total">
          <div className="font-body text-mist-300 text-[15px]">
            {order.ticketCount === 0 ? 'Choose your tickets above.' : `${order.ticketCount} ticket${order.ticketCount === 1 ? '' : 's'}`}
            {order.discount > 0 && ` · promo discount −$${order.discount.toFixed(2)}`}
          </div>
          <div className="font-display uppercase text-white text-[40px] leading-none mt-2">${order.total.toFixed(2)}</div>
        </div>

        {status === 'submitting' && <p role="status" className="font-body text-mist-300 mt-4">Recording your order, please do not close this page…</p>}
        {status === 'error' && <p role="alert" className="font-body text-[#ff8c8c] mt-4 leading-relaxed">{errorMsg}</p>}

        {order.ticketCount > 0 && !formValid && (
          <p className="font-body text-[13px] text-mist-400 mt-4">Add your name, a valid email and tick the box to continue to payment.</p>
        )}

        {/* Free-only orders skip PayPal. */}
        {!needsPayment && order.ticketCount > 0 && (
          <button
            type="button"
            disabled={!formValid || status === 'submitting'}
            onClick={() => submitOrder(null)}
            className="mt-5 inline-flex items-center font-body font-bold text-[15px] px-8 py-[17px] disabled:opacity-40 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ background: ACCENT, color: onAccent(ACCENT) }}
          >
            Reserve free tickets
          </button>
        )}

        {showPay && <div id="pp-tickets" className="mt-5" />}
        {!import.meta.env.VITE_PAYPAL_CLIENT_ID && needsPayment && (
          <p className="font-body text-[13px] text-mist-400 mt-4">Online payment is not available right now. Please contact the studio.</p>
        )}
      </div>
    </div>
  )
}
