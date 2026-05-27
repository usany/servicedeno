import 'dotenv/config';
import OpenAI from 'openai';
import * as fs from 'node:fs';
import path from 'node:path';

const openai = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_NIM_API_KEY,
});

async function testVision() {
  const imgPath = path.join(process.cwd(), 'downloads', 'c.png');
  if (!fs.existsSync(imgPath)) {
    console.error("Image not found:", imgPath);
    return;
  }
  const base64Image = fs.readFileSync(imgPath, "base64");

  try {
    console.log("Testing Vision with moonshotai/kimi-k2.6...");
    const response = await openai.chat.completions.create({
      model: "moonshotai/kimi-k2.6",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What is written in this image? Summarize it briefly." },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 100,
    });
    console.log("Vision Response:", response.choices[0].message.content);
  } catch (err) {
    console.error("Vision Error:", err.message);
    if (err.response) {
        console.error("Response Data:", err.response.data);
    }
  }
}

testVision();
