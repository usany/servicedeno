import 'dotenv/config';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_NIM_API_KEY,
});

async function listModels() {
  try {
    const list = await openai.models.list();
    list.data.sort((a, b) => a.id.localeCompare(b.id)).forEach(m => console.log(m.id));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
