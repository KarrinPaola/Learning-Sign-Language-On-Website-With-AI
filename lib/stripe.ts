import Stripe from "stripe"

export const stripe = new Stripe (process.env.STRIPE_API_KEY!, {
    apiVersion: "2025-02-24.acacia",
    typescript: true
})

export function absoluteUrl(path: string){
    return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}