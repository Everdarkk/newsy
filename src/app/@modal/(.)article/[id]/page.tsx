'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { NewsArticle } from "@/lib/types";

export default function ArticleModalPage() {
    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [generatedContent, setGeneratedContent] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const router = useRouter();
    const { id } = useParams();
    const generatedOnce = useRef(false);

    // Scroll blocking (без змін)
    useEffect(() => {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        return () => {
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = "0";
        };
    }, []);

    // Fetching single article based on id
    useEffect(() => {
        if (!id) return;

        fetch('/api/news/')
            .then(res => res.json())
            .then((data: NewsArticle[]) => {
                const foundArticle = data.find(article => article.id === id);
                setArticle(foundArticle || null);
            })
            .catch((error) => console.error('Error fetching article:', error));
    }, [id]);

    // fetching generated content
    useEffect(() => {
        if (!article?.url) return;
        if (generatedOnce.current) return;

        generatedOnce.current = true;

        const cacheKey = `generated_${article.id}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
            setGeneratedContent(cached);
            setLoading(false);
            return;
        }

        const MAX_RETRIES = 3;
        const DELAY_MS = 1000;

        const generate = async () => {
            setLoading(true);
            setGeneratedContent(''); // clearing content before generation
            let fullResponse = ''; // for caching the full response
            
            for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
                try {
                    const res = await fetch('/api/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: article.url }),
                    });

                    if (!res.ok || !res.body) {
                        throw new Error(`Помилка: ${res.status}`);
                    }

                    // reading streamed response
                    const reader = res.body.getReader();
                    const decoder = new TextDecoder('utf-8');
                    const TYPING_DELAY_MS = 5; // 👈 Затримка між символами (можна налаштувати)
                    let currentDisplayContent = '';

                    while (true) {
                      const { done, value } = await reader.read();
                      if (done) break;

                      const chunk = decoder.decode(value, { stream: true });
                      fullResponse += chunk;
    
                      // splitting chunk into characters for typing effect
                      const chars = chunk.split('');

                      for (const char of chars) {
                          // updating inner content character by character
                          currentDisplayContent += char;

                          // state update to trigger re-render
                          setGeneratedContent(currentDisplayContent);

                          // timeout for typing effect
                          await new Promise(resolve => setTimeout(resolve, TYPING_DELAY_MS));
                      }
                    }

                    // successful generation, caching result
                    localStorage.setItem(cacheKey, fullResponse);
                    setLoading(false);
                    return; 

                } catch (error) {
                    console.error(`Attempt ${attempt} failed with error:`, error);
                    // if error on last attempt, clear content
                    setGeneratedContent(null);
                }

                if (attempt < MAX_RETRIES) {
                    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
                }
            }
            
            // if all attempts fail
            console.error(`Failed to generate content after ${MAX_RETRIES} attempts.`);
            setLoading(false);
            setGeneratedContent('Щось точно пішло не за планом. Спробуйте оновити сторінку.');
        };

        generate();
    }, [article]);

    const handleClose = () => {
        router.back();
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={handleClose}
        >
            <div
                className="relative bg-neutral-900 text-neutral-100 p-6 rounded-2xl max-w-3xl w-[90%] shadow-2xl overflow-y-auto max-h-[90vh] border border-neutral-700"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-gray-300 hover:text-white transition-colors"
                >
                    ✕
                </button>

                <div className="flex items-center justify-center">
                    {loading && !generatedContent 
                        ?
                        <div className="flex flex-col gap-5 justify-center items-center">
                            <div>
                                <h2 className="text-lg text-center">Треба трохи зачекати, поки я роблю для Вас статтю.</h2>
                            </div>
                            <div className="flex ai-thinking min-h-[400px]">
                                <span className="ai-dot"></span>
                                <span className="ai-dot"></span>
                                <span className="ai-dot"></span>
                            </div>
                        </div>
                        :
                        <div className="flex flex-col min-h-[400px] gap-5 justify-center items-center">
                            <h2 className="text-xl font-bold mb-2 text-center">
                                {article?.title}
                            </h2>

                            <p>
                                {generatedContent ?? 'Щось точно пішло не за планом. Спробуйте оновити сторінку.'}
                            </p>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}