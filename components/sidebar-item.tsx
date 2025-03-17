"use client";

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
type Props = {
    label: string;
    iconScr: string;
    href: string;
}

export const SidebarItem = ({
    label, iconScr, href
}: Props) => {
    const pathname = usePathname();
    const active = pathname === href;
    return (
        <Link href={href} >
            <Button
                variant={active ? "sidebarOutline" : "sidebar"}
                className="justify-start h-[52px] w-full"
            >

                <Image
                    src={iconScr}
                    alt={label}
                    className="mr-5 inline"
                    height={32}
                    width={32}
                />
                {label}
            </Button>
        </Link>
    )
}