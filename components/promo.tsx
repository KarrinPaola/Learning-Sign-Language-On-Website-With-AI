"use client"

import Image from 'next/image';
import { Button } from './ui/button';
import  Link  from 'next/link';
import { Separator } from './ui/separator';

export const Promo = () => {
    return (
        <div className="border-2 rounded-xl p-4 space-y-4">
            
            <div className="space-y-2">
                <div className="flex items-center gap-x-2">
                    <Image
                        src={"/infinity.svg"}
                        alt='infinity'
                        width={26}
                        height={26}
                    />
                    <h3 className='font-bold text-lg'>
                        Upgrade to Pro
                    </h3>
                </div>
                <p className='text-muted-foreground pb-3'>
                    Get infinite hearts and more.
                </p>
                <Link href='/shop'>
                    <Button
                        variant={"super"}
                        className='w-full'
                        size={"lg"}
                    >
                        Upgrade today
                    </Button>
                </Link>
            </div>
        </div>
    )
}