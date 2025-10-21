export interface NewsArticle {
  content: string;
  description: string;
  id: string;
  image: string;
  lang: string;
  publishedAt: string;
  source: {
    country: string;
    id: string;
    name: string;
    url: string;
  };
  title: string;
  url: string;
}