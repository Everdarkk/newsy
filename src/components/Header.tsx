'use client';

import useSWR from 'swr';
import Image from "next/image";
import '../lib/styles/text.css';

// swr fetcher
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Header() {
    const { data} = useSWR('/api/location', fetcher, {
        revalidateOnFocus: true,
    });

    const city = data?.city
    const country = data?.country

    return (
        <div className="header flex justify-center items-center gap-10 bg-neutral-900 border-double w-auto h-auto">
            <div>
                <p>{city}</p>
                <p>{country}</p>
            </div>

            <Image
                src={'/images/explore.gif'}
                alt="Logo"
                width={420}
                height={420}
                className="w-[7rem]"
            />
            

            <div className="jersey-10-regular flex gap-5 text-green-300 h-[8rem] items-center">
                <span className="key">N</span>
                <span className="key">E</span>
                <span className="key">W</span>
                <span className="key">S</span>
            </div>
        </div>
    )
}