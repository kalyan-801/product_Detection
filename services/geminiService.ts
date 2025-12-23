
import { GoogleGenAI, Type } from "@google/genai";
import { DetectionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function detectProductsInFrame(base64Image: string): Promise<DetectionResult> {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    You are an expert shopping assistant and visual recognition AI. 
    Analyze the provided image frame from a video.
    Identify all recognizable commercial products (clothing, bags, shoes, electronics, accessories, etc.).
    For each product:
    1. Provide a concise label.
    2. Provide a bounding box in normalized coordinates [ymin, xmin, ymax, xmax] where each value is between 0 and 1000.
    3. Generate a direct, relevant search or shopping link for that specific item on a major e-commerce platform like Amazon, Nike, Myntra, or similar.
    4. Provide a confidence score between 0 and 1.
    
    Return the result strictly as JSON.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: [
      {
        parts: [
          { text: "Detect products in this image and provide shopping links." },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          }
        ]
      }
    ],
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          products: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                label: { type: Type.STRING },
                box: {
                  type: Type.OBJECT,
                  properties: {
                    ymin: { type: Type.NUMBER },
                    xmin: { type: Type.NUMBER },
                    ymax: { type: Type.NUMBER },
                    xmax: { type: Type.NUMBER }
                  },
                  required: ["ymin", "xmin", "ymax", "xmax"]
                },
                shoppingUrl: { type: Type.STRING },
                confidence: { type: Type.NUMBER }
              },
              required: ["id", "label", "box", "shoppingUrl"]
            }
          }
        },
        required: ["products"]
      }
    }
  });

  try {
    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text) as DetectionResult;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    return { products: [] };
  }
}
