/**
 * Gemini 3.8 Flash Client-Side Advisory Service
 * Injected with deep Mount Cameroon agronomic domain knowledge, volcanic soil dynamics,
 * NASA IMERG rainfall telemetry, and Cameroon Pidgin English comprehension.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AQ.Ab8RN6IF5vSP7VnHnJuYcdryFWjNzATQJqnbQ7P0NILGhXRb0Q';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function askGeminiAgronomist(query, conversationHistory = [], farmerContext = {}) {
  const locName = farmerContext?.location?.name || 'Buea';
  const elev = farmerContext?.location?.elevation || 620;
  const slope = farmerContext?.location?.slope || '8–12% volcanic slope';
  const fieldSize = farmerContext?.fieldSize || 1.5;
  const rainExp = farmerContext?.rainExp || 'good';

  // System instructions tailored for Mount Cameroon agricultural extension
  const systemInstruction = 
    `You are YENLU AI, an expert agricultural extension agronomist advising smallholder farmers on the volcanic slopes of Mount Cameroon (Buea, Fako Division, Southwest Region, Cameroon).

ENVIRONMENT CONTEXT:
- Target area: Buea slopes (Quarters: Muea, Bokwango, Bonakanda, Lysoka, Bova, Tole, Molyko, Great Soppo).
- Agro-ecology: High elevation slopes (300m - 1,200m).
- Soils: Mount Cameroon Volcanic Andosols (pH ~5.4, 7.9% Soil Organic Carbon). Rapid water infiltration, fertile, but highly vulnerable to nutrient leaching (N, K) and slope splash erosion during intense deluges.
- Rainfall: Typical Buea wet season delivers ~2,500 - 3,000mm/year, with intense single-day downpours (>100mm/day).
- Currency: ALL currency MUST be expressed in FCFA / XAF (Central African Franc). NEVER use USD ($).
- Languages: Understand and respond comfortably in English, French, or Cameroon Pidgin English (if the farmer asks or speaks Pidgin, respond in natural, friendly Cameroon Pidgin English).

CURRENT FARMER PLOT CONTEXT:
- Location: ${locName} (Elevation: ${elev}m, Slope: ${slope})
- Field Size: ${fieldSize} hectares (${(fieldSize * 2.471).toFixed(1)} acres)
- Rainfall Outlook: ${rainExp === 'good' ? 'Good / Heavy typical Buea rains (~2,800mm)' : rainExp === 'uncertain' ? 'Uncertain / Erratic' : 'Low / Delayed onset'}

CORE ADVISORY PRINCIPLES:
1. Avoid continuous monoculture (e.g. Maize after Maize). Recommend alternating heavy nitrogen feeders (Maize, Potato) with nitrogen-fixing legumes (Groundnut/Arachide, Common Bush Beans, Cowpea).
2. Waterlogging & Slope Management: Advise planting on 25-30cm raised contour ridges (billons) on slopes > 10% to prevent root rot and soil erosion.
3. Local Markets: Reference Buea Town Market, Muea Market, and Mutengene Market prices in FCFA.
4. Keep advice clear, empathetic, respectful, and direct. Use bullet points for steps.`;

  // Format messages into Gemini contents array
  const formattedContents = [
    {
      role: 'user',
      parts: [{ text: `${systemInstruction}\n\nAcknowledge your role in 1 friendly sentence.` }]
    },
    {
      role: 'model',
      parts: [{ text: `Greetings! I am your YENLU agricultural advisor for ${locName} on Mount Cameroon. How can I help your farm thrive this season?` }]
    }
  ];

  // Append recent conversation
  conversationHistory.slice(-6).forEach(msg => {
    formattedContents.push({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    });
  });

  // Append current user query
  formattedContents.push({
    role: 'user',
    parts: [{ text: query }]
  });

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: formattedContents,
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 800,
          topP: 0.85
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Empty response part from Gemini candidate');
    }

    return candidateText;
  } catch (error) {
    console.warn('Gemini 3.8 Flash live call failed, falling back to local Buea model:', error);
    throw error;
  }
}
