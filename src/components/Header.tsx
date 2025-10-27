import Image from "next/image"
import '../lib/styles/text.css';

export default function Header() {

    return (
        <div className="flex justify-center items-center gap-10 bg-neutral-900 border-t-2 border-b-2 border-t-neutral-600 border-b-neutral-600 w-full h-auto">
            <Image
                src={'/images/owl.png'}
                alt="Logo"
                width={420}
                height={420}
                className="w-[7rem]"
            />

            <div className="jersey-10-regular flex gap-3 text-sky-800 h-[8rem] items-center">
                <span className="key">N</span>
                <span className="key">E</span>
                <span className="key">W</span>
                <span className="key">S</span>
            </div>
        </div>
    )
}