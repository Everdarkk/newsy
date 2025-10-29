'use client';

import useSWR from 'swr';
import Image from "next/image";
import '../lib/styles/text.css';

// swr fetcher
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Header() {
    const { data } = useSWR('/api/location', fetcher, {
        revalidateOnFocus: true,
    });
    const city = data?.city
    const country = data?.country

    const {temp_c, wind} = useSWR(
        city ? `/api/weather?city=${city}` : null,
        fetcher,
        { revalidateOnFocus: true }
    ).data || {};
    const temp = temp_c ? `${temp_c}°C` : 'Loading...';
    
    function getWindScale(speed: number): string {
    if (speed < 1) {
        return "Штиль"; 
    } else if (speed >= 1 && speed <= 5) {
        return "Легкий вітер";
    } else if (speed > 5 && speed <= 11) {
        return "Слабкий вітер";
    } else if (speed > 11 && speed <= 19) {
        return "Помірний вітер";
    } else if (speed > 19 && speed <= 28) {
        return "Свіжий вітер";
    } else if (speed > 28 && speed <= 38) {
        return "Сильний вітер";
    } else if (speed > 38 && speed <= 49) {
        return "Міцний вітер";
    } else if (speed > 49 && speed <= 61) {
        return "Дуже міцний вітер";
    } else if (speed > 61 && speed <= 74) {
        return "Шторм";
    } else if (speed > 74 && speed <= 87) {
        return "Жорстокий шторм";
    } else if (speed > 87 && speed <= 102) {
        return "Ураганний вітер";
    } else {
        return "Небезпечний ураган";
    }
}
    const windCondition = wind ? getWindScale(wind) : 'Loading...';

    return (
        <div className="header flex justify-around items-center gap-10 bg-neutral-900 border-double w-auto h-auto">
            <div className='flex flex-col'>
                <p>{city}</p>
                <p>{country}</p>
                <p>{temp}</p>
                <p>{windCondition}</p>
            </div>

            <div className='flex items-center'> 
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
        </div>
    )
}