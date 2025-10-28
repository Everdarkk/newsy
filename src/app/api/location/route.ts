export async function GET() {

    const response = await fetch(
        'https://get.geojs.io/v1/ip/geo.json', 
        { 
            next: { revalidate: 900 } // Next.js HTTP Caching and tag for latest data fetch
        }
    );

    if (!response.ok) {
        // error handling
        return new Response('Failed to fetch location data', { status: response.status });
    }

    const data = await response.json();

    return Response.json(data);
}