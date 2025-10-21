'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { NewsArticle } from "@/lib/types";

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = useParams();
    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [generatedContent, setGeneratedContent] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

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
        // extracting prompt text
        const promptText = (article?.content)?.split("...")[0];
        if (!promptText) return;

         const generate = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: promptText }),
                });
                console.log(res);
                if (!res.ok) throw new Error(`Помилка: ${res.status}`);
                const data = await res.json();
                setGeneratedContent(data);
            } catch (error) {
                console.error('Error generating content:', error);
            } finally {
                setLoading(false);
            }
        };

        generate();
    }, [article])

    return (
        <div>
            <h1>ARTICLE</h1>
            <h2>📰 Згенерована стаття:</h2>
            {loading ? <p>Generating...</p> : <p>{generatedContent ?? 'No data'}</p>}
        </div>
    )
}