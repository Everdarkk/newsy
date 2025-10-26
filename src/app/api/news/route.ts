
const MAX_ARTICLES = 100;

export async function GET() {
    const key = process.env.GNEWS_API_KEY;

    const response = await fetch(
        `https://gnews.io/api/v4/top-headlines?category=general&lang=uk&apikey=${key}`, 
        { 
            next: { revalidate: 900, tags: ['gnews-latest'] } // Next.js HTTP Caching and tag for latest data fetch
        }
    );

    if (!response.ok) {
        // error handling
        return new Response('Failed to fetch articles', { status: response.status });
    }

    const data = await response.json();
    const articles = data.articles.slice(0, MAX_ARTICLES);

    return Response.json(articles);
}


