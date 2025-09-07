import { GoogleGenAI, Modality } from "@google/genai";

const PROMPT_TEMPLATE = `# ROLE
You are an advanced AI photo editor specializing in digital privacy.

# OBJECTIVE
Given an input photograph and optional user instructions, output a “safe” version where Personally Identifiable Information (PII) is realistically removed or replaced, EXCEPT for elements the user explicitly asks to preserve.

# PRESERVATION REQUESTS (User Instructions)
The user has requested to keep the following elements visible. DO NOT anonymize these specific items. If a description matches a person's face, keep that face visible.
- {{PRESERVE_ELEMENTS}}

# CRITICAL RULES
1) FACE ANONYMIZATION (MANDATORY, unless specified in Preservation Requests):
   - For every real human face NOT described in the Preservation Requests, you MUST anonymize it. This includes partials, side profiles, and reflections.
   - METHOD: Use a high-quality, aesthetically pleasing method such as realistic inpainting, artistic blur, or subtle distortion. The goal is total privacy without looking jarring. Avoid simple black boxes or coarse pixelation.
   - The effect must blend seamlessly with the original image's lighting, color, and grain.

2) GENERAL PII REDACTION:
   - Make all other PII unreadable using realistic inpainting or high-quality blurring.
   - TARGETS:
     - Vehicle license plates.
     - Addresses and house numbers.
     - Text on documents, screens, packages, and ID badges.
     - Credit cards, QR codes, and barcodes.

3) MAINTAIN REALISM & QUALITY:
   - The final image's composition, lighting, shadows, color grade, and grain must match the original.
   - Do not crop, resize, or change the aspect ratio.
   - Output only the edited image. No watermarks, captions, or commentary.

# FINAL INSTRUCTION
Return ONLY the edited image as the primary output.`;

export const makeImageSafe = async (base64ImageData: string, mimeType: string, preserveElements: string): Promise<string | null> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const finalPrompt = PROMPT_TEMPLATE.replace(
    '{{PRESERVE_ELEMENTS}}', 
    preserveElements || "No preservation requests provided. Anonymize all PII and faces."
  );

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: finalPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

    if (imagePart && imagePart.inlineData) {
      return imagePart.inlineData.data;
    } else {
      const textPart = response.candidates?.[0]?.content?.parts?.find(part => part.text);
      if (textPart && textPart.text) {
          console.warn("API returned text instead of an image:", textPart.text);
      }
      return null;
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to process image with the AI service.");
  }
};