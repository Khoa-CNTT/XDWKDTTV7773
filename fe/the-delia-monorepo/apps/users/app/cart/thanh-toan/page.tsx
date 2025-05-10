"use client";

import CheckoutPageClient from './CheckoutPageClient'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutPageClient />
    </Elements>
  )
} 