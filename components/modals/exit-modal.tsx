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

import { useExitModal } from "@/use/use-exit-modal"

export const ExitModal = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false)
    const { isOpen, close } = useExitModal()

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
                            src={"/lingo-sad.svg"}
                            alt="Duolingo"
                            height={80}
                            width={80}
                        />
                    </div>
                    <DialogTitle className="text-center font-bold text-2xl">
                        Wait, don&apos;t go!
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        You are about too leave the lesson. Are you sure?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mb-4">
                    <div className="flex flex-col gap-y-4 w-full">
                        <Button variant="primary" className="w-full" size="lg" onClick={close}>
                            Keep learning
                        </Button>
                        <Button variant="dangerOutline" className="w-full" size="lg" onClick={() => {
                            close()
                            router.push("/learn")
                        }}>
                            End Session
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}