"use client";

import CheckoutPageClient from './CheckoutPageClient'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Suspense } from 'react';

// Add fallback for STRIPE_PUBLISHABLE_KEY to prevent errors
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export default function CheckoutPage() {
  return (
    <Suspense>
      <Elements stripe={stripePromise}>
        <CheckoutPageClient />
      </Elements>
    </Suspense>
  )
} 