const NIM_API_KEY = "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";
const NIM_BASE_URL = "https://integrate.api.nvidia.com/v1";

export async function callNIM<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${NIM_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NIM_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`NIM API error: ${res.status} - ${err}`);
  }
  return res.json();
}

export async function generateScript(prompt: string, model = "meta/llama-3.1-70b-instruct"): Promise<string> {
  const result = await callNIM<{ choices: Array<{ message: { content: string } }> }>("/chat/completions", {
    model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
    temperature: 0.7,
  });
  return result.choices[0].message.content;
}

export async function generateEmbedding(text: string, model = "nvidia/nv-embedqa-e5-v5"): Promise<number[]> {
  const result = await callNIM<{ data: Array<{ embedding: number[] }> }>("/embeddings", {
    model,
    input: text,
  });
  return result.data[0].embedding;
}

export async function generateTTS(text: string, model = "nvidia/tts-hifigan"): Promise<ArrayBuffer> {
  const result = await callNIM<{ audio: string }>("/audio/speech", {
    model,
    input: text,
    voice: "female",
    response_format: "mp3",
  });
  // NIM returns base64 encoded audio
  const binary = atob(result.audio);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export const TANIA_CONTEXT = `
Restaurant: Tania's Cuisine & Lounge
Parent: Tany's Ltd (est. 2018)
Location: M&M Plaza, Gishushu, Kigali, Rwanda
Hours: Mon-Sun 11:00-23:00, Daily Buffet 12:00-15:00 (12,000 RWF)
Phone: +250 789 289 450
Emails: hello@taniascuisine.rw, info@taniascuisine.rw, events@taniascuisine.rw
Capacity: 1,000 guests/event
Social: @LoungeTania (X), @taniacuisineandlounge (Instagram)
Cuisine: African fusion, grilled meats, fresh fish, vegetarian, cocktails
Vibe: Upscale casual, lounge atmosphere, catering specialist
`;

export async function generateMenuPromoScript(menuItems: string[]): Promise<string> {
  const prompt = `${TANIA_CONTEXT}

Create a 30-second promotional video script for Tania's menu showcase.
Feature these dishes: ${menuItems.join(", ")}.
Format: Scene-by-scene with visual cues and voiceover text.
Tone: Warm, inviting, authentic. Target: locals & tourists in Kigali.
Output as JSON: { scenes: [{ visual: "...", voiceover: "...", duration: 5 }] }`;
  return generateScript(prompt);
}

export async function generateDishDescription(dishName: string): Promise<string> {
  const prompt = `${TANIA_CONTEXT}

Write a mouth-watering 2-sentence description for "${dishName}" on Tania's menu.
Style: Sensory, authentic, appetizing.`;
  return generateScript(prompt);
}