import fs from "fs";

const CLOUDFLARE_ACCOUNT_ID = process.env.CFACCOUNTID;
const CLOUDFLARE_API_TOKEN = process.env.CFAPITOKEN;

async function generateImage(prompt: string) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/bytedance/seedream-5-lite`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        seed: Math.floor(Math.random() * 1000000),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Cloudflare API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // Cloudflare AI API returns binary image data directly
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    fs.writeFileSync("output.png", buffer);
    console.log("Image saved as output.png");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}

generateImage("Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme");