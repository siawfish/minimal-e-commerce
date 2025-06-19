import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    
    return (
        <Link href="/" className="group flex justify-center items-center flex-row">
            <Image src="/logo.png" className="sm:hidden" alt="Zsar Zsar" width={50} height={50} />
            <Image src="/logo.png" className="hidden sm:block" alt="Zsar Zsar" width={60} height={60} />
            <div className="w-full h-6 text-black font-bold text-xl sm:text-2xl">Zsar Zsar</div>
        </Link>
    )
}