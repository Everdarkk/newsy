import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({});

export async function POST(request: NextRequest) {
    let url: string;

    // extracting url
    try {
        const body = await request.json();
        url = body.url;

        if (!url) {
            return NextResponse.json(
                { error: "Відсутній аргумент в тілі запиту." },
                { status: 400 }
            );
        };

    } catch (error) {
        console.error("Reading JSON body error:", error);
        return NextResponse.json(
            { error: "Невірний JSON тіла запиту." }, 
            { status: 400 }
        );
    }

    // generating article content
    try {
        const prompt = `Оброби статтю за посиланням та зроби з неї резюме до 2000 символів. Зберігай офіційний стиль та атрибути новини, контекст. Зроби все у вигляді чистого тексту щоб гарно виглядало у параграфі. ВАЖЛИВО: НЕ РОБИ З ЗІРОЧКАМИ НАЗВУ СТАТТІ, тільки сам текст, а також максимально уважно та чіко парсь саме посилання. Ось посилання: ${url}`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            config: {
                tools: [
                    {urlContext: {}},
                    {googleSearch: {}}
                ],
                thinkingConfig: {
                    thinkingBudget: 0,
                },
            systemInstruction: "Ти сутність новинного сайту. Ти відповідальний за контент, маєш бути послідовним та чітким у виконанні своїх дій. ",
            },
        contents: prompt
        });
        
        return Response.json(response.text);

    } catch (error) {
        return NextResponse.json(
            { error: error },
            { status: 400 }
        );
    }

    
}