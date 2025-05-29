import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    
    return (
        <Link href="/" className="group flex flex-row items-center gap-2">
            <Image src="/logo.JPG" alt="Zsar Zsar" className='rounded-md' width={30} height={30} />
            <h1 className={`text-xl font-bold tracking-tight transition-all duration-300 cursor-pointer relative`}>
                Zsar Zsar
            </h1>
        </Link>
    )
}