// This function acts as a proxy to bypass CORS issues with the radio API.

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
    // Using a static JSON file which should be more reliable than the PHP/API endpoints.
    const response = await fetch('https://www.mp3quran.net/api/radios/radio_arabic.json', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });
    
    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: `Upstream API error: ${response.statusText}` }),
      };
    }

    const data = await response.json();

    // The static JSON file does not have IDs, which the frontend expects.
    // We add an ID based on the array index.
    if (data && data.radios && Array.isArray(data.radios)) {
        const radiosWithIds = data.radios.map((radio: any, index: number) => ({
            ...radio,
            id: index + 1, // Use a 1-based index for the ID
        }));
        
        return {
          statusCode: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({ radios: radiosWithIds }),
        };
    }

    // If the structure is not as expected, return an error.
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid data structure from radio API." }),
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