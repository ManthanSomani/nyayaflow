
import { GoogleGenAI, Type } from "@google/genai";
import { CourtCase } from "../types";

// Always use named parameter for apiKey and assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCaseWithAI = async (caseData: Partial<CourtCase>) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this Indian court case for NyayaFlow ODR platform. Use the provided description to assess complexity and suitability for Online Dispute Resolution.
      
      Case Details:
      - Type: ${caseData.type}
      - Description: ${caseData.description}
      - Age: ${caseData.ageDays} days
      - Claim: ₹${caseData.claimAmount}
      - Adjournments: ${caseData.previousAdjournments}
      - Witness Required: ${caseData.witnessRequired}
      
      Based on the description and metadata, provide:
      1. Settlement probability (0 to 1): Higher for simple civil/family disputes.
      2. Reasoning for ODR vs Trial: Specifically mention how the description influences this.
      3. Predicted duration of the hearing in minutes.
      4. Risk of delay (0 to 1).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            settlementProbability: { type: Type.NUMBER },
            odrReasoning: { type: Type.STRING },
            predictedDuration: { type: Type.NUMBER },
            delayRisk: { type: Type.NUMBER },
            suggestedMediatorProfile: { type: Type.STRING }
          },
          required: ["settlementProbability", "odrReasoning", "predictedDuration", "delayRisk"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return null;
  }
};

export const generateMediationAgreement = async (caseData: CourtCase, notes: string = "") => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a professional draft for a Mediation Settlement Agreement (Indian Law format) for a ${caseData.type} case.
      
      Parties:
      - Petitioner: ${caseData.petitioner}
      - Respondent: ${caseData.respondent}
      - Case Ref: ${caseData.id}
      - Claim Amount: ₹${caseData.claimAmount}
      - Case Context: ${caseData.description}
      
      Specific Settlement Terms negotiated by Mediator: 
      "${notes}"
      
      Format the response with a formal court header, sections for Recitals, Agreed Terms, and Finality. Use clear headings.`,
    });
    return response.text || "Failed to generate agreement content.";
  } catch (error) {
    console.error("Mediation Agreement Generation Error:", error);
    return "Failed to generate agreement template.";
  }
};
