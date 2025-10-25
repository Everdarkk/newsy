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
  const generatedOnce = useRef(false); // flag to ensure single generation

  // scroll blocking
  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0";
    };
  }, []);

  // fetching single article based on id
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

    const MAX_RETRIES = 3; // reties number
    const DELAY_MS = 1000; // 1 sec delay before retry

    const generate = async () => {
      setLoading(true);
      
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: article.url }),
          });

          // successful response
          if (res.ok) {
            const data = await res.json();

            setGeneratedContent(data);
            localStorage.setItem(cacheKey, data);
            
            setLoading(false);
            return; 
          }
          
          // unsuccessful response
          console.warn(`Attempt ${attempt} failed with status: ${res.status}`);
          
        } catch (error) {
          // netork or other errors
          console.error(`Attempt ${attempt} failed with error:`, error);
        }

        // waiting till next attempt
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        }
      }
      
      // if all attempts failed
      console.error(`Failed to generate content after ${MAX_RETRIES} attempts.`);
      setLoading(false);
      setGeneratedContent(null);
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
        className="relative bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 p-6 rounded-2xl max-w-3xl w-[90%] shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
        >
          ✕
        </button>

        <div>
          {loading 
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
                {generatedContent ? article?.title : null}
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
