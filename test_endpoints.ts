import 'dotenv/config';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_NIM_API_KEY,
});

async function checkEndpoints() {
  try {
    console.log("Checking /chat/completions with moonshotai/kimi-k2.6...");
    const completion = await openai.chat.completions.create({
      model: "moonshotai/kimi-k2.6",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 5
    });
    console.log("Chat Completion Success:", completion.choices[0].message.content);
  } catch (err: any) {
    console.error("Chat Completion Error:", err.message);
  }

  console.log("\nNote: Image generation is not tested here as moonshotai/kimi-k2.6 is a chat/vision model and NVIDIA NIM integrated API might not support /images/generations.");
}

checkEndpoints();
