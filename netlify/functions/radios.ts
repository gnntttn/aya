import type { RadioStation } from '../../types';

interface HandlerEvent {
  httpMethod: string;
}

interface HandlerResponse {
  statusCode: number;
  headers?: { [key: string]: string };
  body: string;
}

export const handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };
  
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  try {
    const response = await fetch('https://mp3quran.net/api/v3/radios', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AYA-Islamic-App/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch radios: ${response.status} ${response.statusText}`);
    }

    // First, get the response as text to handle potential malformations (like BOMs or extra characters)
    const responseText = await response.text();
    // Then, parse the text. This is more robust than response.json() for some APIs.
    const data = JSON.parse(responseText.trim());

    if (!data || !Array.isArray(data.radios)) {
      throw new Error('Invalid data structure from radio API');
    }

    // Map to the structure expected by the frontend for robustness
    const stations: RadioStation[] = data.radios.map((s: any) => ({
      id: s.id.toString(),
      name: s.name,
      url: s.url,
    }));
    
    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ radios: stations }),
    };
  } catch (e) {
    console.error("Error in radios function:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown server error occurred.";
    return { 
      statusCode: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: errorMessage }) 
    };
  }
};
