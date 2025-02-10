import { Button } from "@/components/ui/button"
import Image from "next/image"

export const Footer = () => {
    return (
        <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
            <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
                <Button size="lg" variant="ghost" className="w-auto">
                    <Image src="CN - China.svg" alt="Chinese" height={32} width={40} className="mr-4 rounded-md shrink-0" />
                    Chinese
                </Button>
                <Button size="lg" variant="ghost" className="w-auto">
                    <Image src="GB-UKM - United Kingdom.svg" alt="English" height={32} width={40} className="mr-4 rounded-md shrink-0" />
                    English
                </Button>
                <Button size="lg" variant="ghost" className="w-auto">
                    <Image src="DE - Germany.svg" alt="Germany" height={32} width={40} className="mr-4 rounded-md shrink-0" />
                    German
                </Button>
                <Button size="lg" variant="ghost" className="w-auto">
                    <Image src="FR - France.svg" alt="France" height={32} width={40} className="mr-4 rounded-md shrink-0" />
                    French
                </Button>
                <Button size="lg" variant="ghost" className="w-auto">
                    <Image src="VN - Vietnam.svg" alt="Vietnam" height={32} width={40} className="mr-4 rounded-md shrink-0" />
                    Vietnamese
                </Button>
            </div>
        </footer>
    )
}