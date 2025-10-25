import Image from "next/image"
import '../lib/styles/text.css';
import { CustomCSSProperties } from "@/lib/types";

export default function Header() {
    const layersCount = 24;
    const layerOffset = 1;
    const layers = Array.from({ length: layersCount }, (_, i) => i + 1);

    return (
        <div className="flex justify-center items-center gap-10 bg-neutral-900">
            <Image
                src={'/images/logo.png'}
                alt="Logo"
                width={420}
                height={420}
                className="w-[7rem]"
            />

            <div className="bg-neutral-900 text-white grid place-items-center text-[100px] overflow-visible">
                <div className="scene perspective-[400px]">
        
                    <div 
                        className="layeredText relative font-['Montserrat'] font-black"
                        style={{ 
                            '--layers-count': layersCount, 
                            '--layer-offset': `${layerOffset}px`, 
                        } as CustomCSSProperties}
                    >
          
                        <span className="text-transparent animate-shadow-custom font-['Modak']">NEWS</span>
          
    
                        <div className="layers transform-3d absolute inset-0 animate-hover-custom" aria-hidden="true">
                            {layers.map((i) => {
                                const n = i / layersCount;
              
                                return (
                                    <div
                                        key={i}
                                        className="layer absolute inset-0 font-['Unlock'] text-neutral-700"
                                        style={{
                                                '--i': i,
                                                transform: `translateZ(${i * layerOffset}px)`
                                        } as CustomCSSProperties}
                                    >
                                        NEWS
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}