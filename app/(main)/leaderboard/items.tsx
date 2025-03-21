"use client"

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useTransition } from 'react';
import { refillHearts } from '@/actions/user-progress';
import { toast } from 'sonner';
import { createStripeUrl } from '@/actions/user-subscription';
import { POINTS_TO_REFILL } from '@/constrants';



type Props = {
    hearts: number;
    points: number;
    hasActiveSubscription: boolean;
}

export const Items = ({
    hearts,
    points,
    hasActiveSubscription
}: Props) => {
    const [pending, startTransition] = useTransition();

    const onRefillHearts = () => {
        if (pending || hearts === 5 || points < POINTS_TO_REFILL) {
            return;
        }
        startTransition(() => {
            // refill hearts
            refillHearts()
                .catch(() => toast.error("Something went wrong. LeaderBoard"))
        })
    }

    const onUpgrade = () => {
        startTransition(() => {
            createStripeUrl()
                .then((response) => {
                    if (response.data) {
                        window.location.href = response.data;
                    }
                })
                .catch(() => toast.error("Something went wrong. LeaderBoard2"))
        })
    }
    return (
        <ul className="w-full">
            <div className="flex items-center w-full p-4 gap-x-4 border-t-2">
                <Image src="heart.svg" alt="heart" width={60} height={60} />
                <div className="flex-1">
                    <p className="text-neutral-700 text-base lg:text-xl font-bold">
                        Refill Hearts
                    </p>
                </div>
                <Button
                    onClick={onRefillHearts}
                    disabled={pending || hearts === 5 || points < POINTS_TO_REFILL}
                >
                    {hearts === 5
                        ? "Full"
                        : (
                            <div className="flex items-center">
                                <Image
                                    src={"/points.svg"}
                                    alt="points"
                                    width={20}
                                    height={20}
                                />
                                <p>
                                    {POINTS_TO_REFILL}
                                </p>
                            </div>
                        )
                    }
                </Button>
            </div>
            <div className='flex items-center w-full p-4 gap-x-4 border-t-2 pt-8'>
                <Image
                    src={"/infinity.svg"}
                    alt='infinity'
                    height={60}
                    width={60}
                />
                <div className='flex-1'>
                    <p className='text-neutral-700 text-base lg:text-xl font-bold'>
                        Infinite hearts
                    </p>
                </div>
                <Button
                    onClick={onUpgrade}
                    disabled={pending}
                >
                    {hasActiveSubscription ? 'settings' : 'upgrade'}
                </Button>
            </div>
        </ul>
    )
}