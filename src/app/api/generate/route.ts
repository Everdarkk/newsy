import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({});

export async function POST(request: NextRequest) {
    let url: string;

    try {
        const body = await request.json();
        url = body.text;

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

    try {
        const prompt = `Оброби статтю за посиланням та зроби з неї саммарі до 2000 символів. Зберігай офіційний стиль та атрибути новини, контекст. ось посилання: ${url}`;
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
            systemInstruction: "Ти сутність новинного сайту NEWSWEN. Ти робиш контент і живеш всередині сайту.",
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