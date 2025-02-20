"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogHeader,
    DialogFooter
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { usePractiseModal } from "@/store/use-practise-modal"

export const PractiseModal = () => {
    const [isClient, setIsClient] = useState(false)
    const { isOpen, close } = usePractiseModal()

    useEffect(() => setIsClient(true), [])


    if (!isClient) {
        return null
    }

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center w-full justify-center mb-5">
                        <Image
                            src={"/heart.svg"}
                            alt="heart"
                            height={100}
                            width={100}
                        />
                    </div>
                    <DialogTitle className="text-center font-bold text-2xl">
                        Practise lesson
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        Use practise lesson to regain hearts and points. You cannot loose hearts in practise lesson.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mb-4">
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button variant="primary" className="w-full" size="lg" onClick={close}>
                            I understand
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}