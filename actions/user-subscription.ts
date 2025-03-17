"use server"
import { currentUser, auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import { absoluteUrl } from '@/lib/stripe';
import { getUserSubscription } from '@/db/queries';

const returnUrl = absoluteUrl("/shop")

export const createStripeUrl = async () => {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
        throw new Error("Unauthorized")
    }

    const userSubscription = await getUserSubscription()

    if (userSubscription && userSubscription.stripeSubscriptionId) {
        const stripeSession = await stripe.billingPortal.sessions.create({
            customer: userSubscription.stripeCustomerId,
            return_url: returnUrl,
        })
        return { data: stripeSession.url }
    }

    const stripeSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: user.emailAddresses[0].emailAddress,
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: "USD",
                    product_data:
                    {
                        name: "Duolingo",
                        description: "Infinite Hearts"
                    },
                    unit_amount: 500,
                    recurring: {
                        interval: "month"
                    }
                }
            }
        ],
        metadata: {
            userId,
        },
        success_url: returnUrl,
        cancel_url: returnUrl,
    })
    return {
        data: stripeSession.url
    }
}