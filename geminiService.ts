
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, RiskScore, GroundingSource } from "../types";

const SYSTEM_INSTRUCTION = `You are ScamGuard, a veteran Cybersecurity Analyst and Social Engineer detector. Your goal is to protect vulnerable users.

When given an image, text, or URL:
1. Analyze the content for signs of fraud (e.g., mismatched URLs, urgency, grammar errors, pixelated logos, requests for money/gift cards).
2. For URLs: Use Google Search to investigate if the domain is legitimate, if it's a known phishing site, or if there are reports of scams associated with it. Cross-reference with the real official website of the organization it claims to be.
3. Identify the specific scam technique (e.g., 'Pig Butchering', 'IRS Impersonation', 'Tech Support Fraud', 'Phishing', 'Safe').

Output your response in a strict JSON structure.
Keep your tone empathetic but firm. If the content is safe, reassure the user. Use "Safe" or "No Scam Detected" for scam_type if low risk.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    risk_score: {
      type: Type.STRING,
      description: "Must be 'High', 'Medium', or 'Low'",
    },
    scam_type: {
      type: Type.STRING,
      description: "The name of the detected scam or 'Legitimate' if safe",
    },
    red_flags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of specific suspicious elements discovered",
    },
    advice: {
      type: Type.STRING,
      description: "Clear instructions for the user",
    },
  },
  required: ["risk_score", "scam_type", "red_flags", "advice"],
};

export const analyzeContent = async (
  input: string,
  mode: 'text' | 'image' | 'link'
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  let contents: any;
  let config: any = {
    systemInstruction: SYSTEM_INSTRUCTION,
    responseMimeType: "application/json",
    responseSchema: RESPONSE_SCHEMA,
  };

  if (mode === 'image') {
    contents = {
      parts: [
        { inlineData: { data: input.split(',')[1], mimeType: 'image/jpeg' } },
        { text: "Analyze this image for any potential scams or fraudulent activity." }
      ]
    };
  } else if (mode === 'link') {
    contents = {
      parts: [{ text: `Investigate this URL for safety and legitimacy: ${input}. Use Google Search to verify if this is the official site of the entity it claims to represent or if it is a scam/phishing link.` }]
    };
    config.tools = [{ googleSearch: {} }];
  } else {
    contents = {
      parts: [{ text: `Analyze the following message for scams:\n\n${input}` }]
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config,
    });

    const result = JSON.parse(response.text || "{}") as AnalysisResult;
    
    // Extract grounding sources if they exist
    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || 'Search Result',
            uri: chunk.web.uri
          });
        }
      });
    }
    
    // Filter duplicates and add to result
    if (sources.length > 0) {
      const uniqueSources = Array.from(new Map(sources.map(s => [s.uri, s])).values());
      result.sources = uniqueSources;
    }

    // Safety check for risk score formatting
    if (![RiskScore.HIGH, RiskScore.MEDIUM, RiskScore.LOW].includes(result.risk_score)) {
      const lower = result.risk_score.toLowerCase();
      if (lower.includes('high')) result.risk_score = RiskScore.HIGH;
      else if (lower.includes('medium')) result.risk_score = RiskScore.MEDIUM;
      else result.risk_score = RiskScore.LOW;
    }

    return result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze content. Please try again.");
  }
};
