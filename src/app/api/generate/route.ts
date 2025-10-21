import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({});

export async function POST(request: NextRequest) {
    let text: string;

    try {
        const body = await request.json();
        text = body.text;

        if (!text) {
            return NextResponse.json(
                { error: "Відсутній аргумент в тілі запиту." },
                { status: 400 }
            );
        };

    } catch (error) {
        console.error("Помилка читання тіла запиту:", error);
        return NextResponse.json(
            { error: "Невірний JSON тіла запиту." }, 
            { status: 400 }
        );
    }

    try {
        const prompt = `Оброби дані які я тобі запропоную, твоя робота - зробити з них новинну статтю зберігаючи офіційний новииний стіль та основний контекст та достовірність інформації. Стаття має бути до 1000 символів. Ось дані: ${text}`;
        const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
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