'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NewsArticle } from "@/lib/types";
import Header from "@/components/Header";

export default function Home() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        setArticles(data);
        console.log('Fetched articles:', data);
      })
      .catch(err => console.error('Error fetching articles:', err));
  }, []);


  return (
    <>
      <Header />
      <br />

      <ul className="grid grid-cols-2 gap-10 m-3 justify-center mx-auto max-w-5xl">
        {articles.map((article: NewsArticle) => (
          <li key={article.id} className="flex flex-col bg-neutral-900 justify-center items-center p-4 rounded-md gap-4 max-w-lg hover:scale-102 transition-transform shadow-[5px_5px_15px_rgba(20,20,20,0.5)]">
            <Image
              src={article.image}
              alt={article.title}
              width={300}
              height={200}
              className="rounded-md"
            />
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl text-center">{article.title}</h2>

              <p>{article.content.split('...')[0] + '...'}</p>

              <Link 
                target="_blank" 
                rel="noopener noreferrer" 
                className="place-self-center" 
                href={article.url}
              >
                SOURCE
              </Link>

              <Link
                className="place-self-center" 
                href={`/article/${article.id}`}
              >
                AI SUM
              </Link>

            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
