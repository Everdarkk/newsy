'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NewsArticle } from "@/lib/types";

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
      <h1>NEWSY</h1>
      <br />

      <ul className="flex flex-col gap-5 m-3">
        {articles.map((article: NewsArticle) => (
          <li key={article.id} className="flex flex-col bg-neutral-700 justify-center items-center p-4 rounded-md gap-4">
            <Image
              src={article.image}
              alt={article.title}
              width={300}
              height={200}
              className="rounded-md"
            />
            <div className="flex flex-col gap-2">
              <h2>{article.title}</h2>
              <p>{article.content}</p>
              <Link className="place-self-center" href={`/article/${article.id}`}>READ</Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
