import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { prompt, systemInstruction, format } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { success: false, error: "Prompt is required" },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { success: false, error: "AI Service Configuration Error: API Key missing" },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        const defaultSystemInstruction = format === 'json_blocks'
            ? "You are a professional blog architect. You only output valid JSON arrays of block objects. Each block must have 'type' and properties like 'content', 'level', 'url', 'cards', etc. Block types: heading, paragraph, image, button, cardGrid, cta, faq, divider, table. For 'cta', if it is a promo, use variant: 'simple-green' and include a 'features' array of strings."
            : "You are a helpful assistant.";

        const generateWithModel = async (modelName: string) => {
            const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: { role: 'system', parts: [{ text: systemInstruction || defaultSystemInstruction }] }
            });
            const result = await model.generateContent(prompt);
            return result.response.text();
        };

        let text: string;
        try {
            text = await generateWithModel("gemini-2.5-flash");
        } catch (error: any) {
            // If quota error, try fallback to 1.5-flash
            if (error.message?.includes("quota") || error.message?.includes("429")) {
                console.warn(`Gemini 2.0-flash quota hit, falling back to 1.5-flash...`);
                try {
                    text = await generateWithModel("gemini-1.5-flash");
                } catch (fallbackError: any) {
                    throw fallbackError; // Re-throw if fallback also fails
                }
            } else {
                throw error;
            }
        }

        if (format === 'json_blocks') {
            try {
                // Remove markdown code blocks if AI included them
                const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim();
                const blocks = JSON.parse(cleanJson);
                return NextResponse.json({ success: true, blocks });
            } catch (e) {
                console.error("Failed to parse AI-generated JSON:", text);
                return NextResponse.json({ success: false, error: "AI generated invalid JSON format" }, { status: 500 });
            }
        }

        return NextResponse.json({ success: true, text });

    } catch (error: any) {
        console.error("AI Generation Error:", error);

        // Handle Gemini Safety/Quota errors gracefully
        let errorMessage = error.message || "Failed to generate content";

        if (errorMessage.includes("quota") || errorMessage.includes("429")) {
            errorMessage = "Free tier limit reached. Please wait a minute before trying again.";
        } else if (errorMessage.includes("safety")) {
            errorMessage = "The prompt was flagged by AI safety filters. Please try rephrasing.";
        }

        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
