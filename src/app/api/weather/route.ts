import { NextRequest } from "next/server";

const key = process.env.WEATHER_API_KEY;

export async function GET(request: NextRequest) {
    if (!key) {
        return new Response('API key is missing', {status: 500});
    }

    // fetching params from URL
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');

    if (!city) {
        return new Response('Missing city parameter', { status: 400 });
    }
    
    const encodedCity = encodeURIComponent(city);
    const weatherApiUrl = `http://api.weatherapi.com/v1/current.json?key=${key}&q=${encodedCity}`;

    try {
        const response = await fetch(weatherApiUrl, {
            next: { revalidate: 900 }
        });

        if (!response.ok) {
            // error handling
            const errorData = await response.json();
            return new Response(JSON.stringify({ error: 'Failed to fetch weather data', details: errorData }), { status: response.status });
        }

        const data = await response.json();

        // returning data
        return Response.json({
            temp_c: data.current.temp_c,
            condition: data.current.condition.text,
            icon: data.current.condition.icon,
            location_name: data.location.name,
            wind: data.current.wind_kph
        });

    } catch (error) {
        console.error("Weather API error:", error);
        return new Response('Internal Server Error', { status: 500 });
    }
}