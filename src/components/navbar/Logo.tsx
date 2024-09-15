"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Logo() {
    const router = useRouter();
    
    return (
        <h1 className="text-black dark:text-white font-semibold text-2xl">NewNews</h1>
    );
}
