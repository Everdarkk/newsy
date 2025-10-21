let cache: any[] = [];
let lastFetched = 0;

const MAX_ARTICLES = 100;
const CACHE_TTL = 1000 * 60 * 15;

export async function GET() {
    const key = process.env.GNEWS_API_KEY;
    const now = Date.now();
    
    // cache check
    if (cache.length === 0 || now - lastFetched > CACHE_TTL) {
      const data = await fetch(
          `https://gnews.io/api/v4/top-headlines?category=general&lang=uk&apikey=${key}`, { next: { revalidate: 900 } }
      ).then(res => res.json());
        
      cache = data.articles.slice(0, MAX_ARTICLES);
      lastFetched = now;
    } else {
      console.log('Cache data returning');
    }

    return Response.json(cache);
}

export async function POST(request: Request) {
  const article = await request.json();

  const exists = cache.some((item) => item.url === article.url);
  if (exists) {
    return Response.json({ ok: false, message: "Article already exists" });
  }

  cache.unshift(article);

  if (cache.length > MAX_ARTICLES) {
    cache = cache.slice(0, MAX_ARTICLES);
  }

  return Response.json({ ok: true, count: cache.length });
}
