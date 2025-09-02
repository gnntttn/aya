// This function is called by the frontend to determine if AI features should be enabled.

interface HandlerResponse {
  statusCode: number;
  headers?: { [key: string]: string };
  body: string;
}

export const handler = async (): Promise<HandlerResponse> => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*", // Allow requests from any origin
    },
    // Respond with a boolean indicating if the API key is present in the server's environment.
    body: JSON.stringify({ hasApiKey: !!process.env.API_KEY }),
  };
};
