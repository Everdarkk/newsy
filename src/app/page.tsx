'use client';

import useSWR from 'swr';
import Link from "next/link";
import Image from "next/image";
import { NewsArticle } from "@/lib/types";
import Header from "@/components/Header";

// swr fetcher
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Home() {
    const { data: articles, error } = useSWR<NewsArticle[]>('/api/news', fetcher, {
        revalidateOnFocus: true,
    });

    if (error) return <div className="text-center mt-20">Помилка завантаження новин.</div>;

    if (!articles) return <div className="min-h-screen flex justify-center items-center">Завантаження...</div>;

  return (
    <>
      <Header />
      <br />

      <ul className="grid grid-cols-2 gap-10 m-3 justify-center mx-auto max-w-5xl">
        {articles.map((article: NewsArticle) => (
          <li key={article.id} className="flex flex-col bg-neutral-900 justify-between items-center p-4 border-double gap-4 max-w-lg hover:scale-102  grayscale hover:grayscale-0 transition-transform shadow-[5px_5px_15px_rgba(20,20,20,0.5)]">
            <Image
              src={article.image}
              alt={article.title}
              width={300}
              height={200}
              className="owl"
            />

            <div className="flex flex-col gap-2">
              <h2 className="text-2xl text-center">{article.title}</h2>

              <p className="p-4 bg-neutral-800">{article.content.split('...')[0] + '...'}</p>  
            </div>

            <div className="flex w-full justify-around">
              <Link
                target="_blank"
                rel="noopener noreferrer"
                className="place-self-center p-3 bg-neutral-800"
                href={article.url}
              >
                <Image
                  src={'/images/source.png'}
                  alt={'SRC'}
                  width={50}
                  height={50}
                  className=" transition-all hover:scale-[1.05] opacity-50 hover:opacity-100"
                />
              </Link>
              <Link
                className="place-self-center p-3 bg-neutral-800"
                href={`/article/${article.id}`}
              >
                <Image
                  src={'/images/ai.png'}
                  alt={'AI'}
                  width={50}
                  height={50}
                  className="transition-all hover:scale-[1.05] opacity-50 hover:opacity-100"
                />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
