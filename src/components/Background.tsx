'use client';

import { useEffect, useRef } from 'react';

export default function Background() {
    // link to the pixel grid div
    const pixelGridRef = useRef<HTMLDivElement>(null); 
    
    // storing timeout IDs to clear them on unmount
    const timeoutIdsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    // colors and pixel size
    const colors = ['#222222', '#333333', '#444444'];
    const pixelSize = 40;

    // Main effect to create and manage the pixel grid
    useEffect(() => {
        
        // fetching the pixel grid element
        const pixelGrid: any = pixelGridRef.current;
        if (!pixelGrid) return; // safety check

        function schedulePixelChange(pixel: HTMLDivElement) {
            const randomInterval = Math.random() * (3000 - 300) + 300;

            const timeoutId = setTimeout(() => {
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                const randomTransitionDuration = Math.random() * (1.5 - 0.3) + 0.3;

                pixel.style.transition = `background-color ${randomTransitionDuration}s ease-in-out`;
                pixel.style.backgroundColor = randomColor;

                schedulePixelChange(pixel);
            }, randomInterval);

            // store timeout ID for cleanup
            timeoutIdsRef.current.push(timeoutId);
        }

        function createGrid() {
            // clear existing timeouts
            timeoutIdsRef.current.forEach(clearTimeout);
            timeoutIdsRef.current = []; // Очищуємо масив ID

            // clearing existing grid
            pixelGrid.innerHTML = '';

            const cols = Math.ceil(window.innerWidth / pixelSize);
            const rows = Math.ceil(window.innerHeight / pixelSize);

            pixelGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
            pixelGrid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

            for (let i = 0; i < cols * rows; i++) {
                const pixel = document.createElement('div');
                pixel.classList.add('pixel');
                pixel.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                pixelGrid.appendChild(pixel);

                schedulePixelChange(pixel);
            }
        }

        // creating the initial grid
        createGrid();

        // event listener for window resize
        window.addEventListener('resize', createGrid);

        // unmount cleanup
        return () => {
            window.removeEventListener('resize', createGrid);
            // clearing timeouts
            timeoutIdsRef.current.forEach(clearTimeout);
        };

    }, []);

    return (
        <div 
            id="pixels" 
            ref={pixelGridRef}
            className="fixed top-0 left-0 w-full h-full grid -z-10"
        ></div>
    );
}