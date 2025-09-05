// This function acts as a proxy to bypass CORS issues with the mp3quran.net API.

interface HandlerResponse {
  statusCode: number;
  headers?: { [key: string]: string };
  body: string;
}

export const handler = async (): Promise<HandlerResponse> => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  try {
    const response = await fetch('https://www.mp3quran.net/api/v3/radios/radio_ar.json');
    
    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: `Upstream API error: ${response.statusText}` }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

  } catch (e) {
    console.error("Radio proxy function error:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown server error occurred.";
    return { 
      statusCode: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: errorMessage }) 
    };
  }
};
