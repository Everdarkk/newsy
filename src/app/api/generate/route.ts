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
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        };

    } catch (error) {
        console.error("Reading JSON body error:", error);
        return NextResponse.json(
            { error: "Невірний JSON тіла запиту." }, 
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // generating article content
    try {
        const prompt = `Оброби статтю за посиланням та зроби з неї резюме до 2000 символів. Зберігай офіційний стиль та атрибути новини, контекст. Зроби все у вигляді чистого тексту щоб гарно виглядало у параграфі. ВАЖЛИВО: НЕ РОБИ З ЗІРОЧКАМИ НАЗВУ СТАТТІ, потрібен тільки сам текст, а також максимально уважно та чітко обстежуй статтю за посиланням. Відповідь має бути українською мовою! Ось посилання: ${url}`;
        const response = await ai.models.generateContentStream({
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

        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of response) {
                    // sending chunks as they are received
                    controller.enqueue(chunk.text);
                }
                // closing generation flow
                controller.close();
            }
        })
        
        // returning response
        return new Response(stream, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
        });

    } catch (error) {
        return NextResponse.json(
            { error: error },
            { status: 400 }
        );
    }

    
}