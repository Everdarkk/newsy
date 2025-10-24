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

  // fetching generated content (тільки один раз)
  useEffect(() => {
    if (!article?.url) return;
    if (generatedOnce.current) return; // вже генерували

    generatedOnce.current = true; // flag established

    const cacheKey = `generated_${article.id}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      setGeneratedContent(cached);
      setLoading(false);
      return;
    }

    const generate = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: article.url }),
        });

        if (!res.ok) throw new Error(`Помилка: ${res.status}`);
        const data = await res.json();

        setGeneratedContent(data);
        localStorage.setItem(cacheKey, data);
      } catch (error) {
        console.error('Error generating content:', error);
      } finally {
        setLoading(false);
      }
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

        <h2 className="text-xl font-bold mb-2">{article?.title}</h2>
        <div>
          {loading 
            ? <p>Generating...</p> 
            : <p>{generatedContent ?? 'No data'}</p>
          }
        </div>
      </div>
    </div>
  );
}
