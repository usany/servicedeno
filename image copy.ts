import fs from "fs";
import { InferenceClient } from "@huggingface/inference";

const HF_TOKEN = process.env.HF_API_KEY; // Replace with your Hugging Face token

async function generateImage(prompt) {
  const client = new InferenceClient(HF_TOKEN);
  
  try {
    const result = await client.textToImage({
      model: "black-forest-labs/FLUX.1-dev",
    //   model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: prompt,
    });

    // Handle both Blob and URL responses
    let arrayBuffer;
    if (typeof result === 'string') {
      const response = await fetch(result);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      arrayBuffer = await response.arrayBuffer();
    } else {
      // Type assertion for Blob
      arrayBuffer = await (result as Blob).arrayBuffer();
    }

    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync("output.png", buffer);
    console.log("Image saved as output.png");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}

generateImage("Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme");