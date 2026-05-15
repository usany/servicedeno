import 'dotenv/config';
import OpenAI from 'openai';
import fs from 'node:fs';
import path from 'node:path';
const img = path.join(process.cwd(), 'public', 'applicationImage.jpg');
const openai = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_NIM_API_KEY,
  // baseURL: 'https://openrouter.ai/api/v1',
  // apiKey: process.env.OPENROUTER_API_KEY,
});

const selection = "nvidia/nvidia-nemotron-nano-9b-v2"
// const selection = "google/gemma-4-26b-a4b-it:free"
async function main() {

  const completion = await openai.chat.completions.create({
    model: selection,
    messages: [
      {
        role: 'user',
        content: 'What is Deepseek in short?',
      },
    ],
  });
  console.log(completion.choices[0].message);

  // const imagePath = img;
  // const base64Image = fs.readFileSync(imagePath, "base64");

  // const response = await openai.responses.create({
  //   model: selection,
  //   input: [
  //     {
  //       role: "user",
  //       content: [
  //         { type: "input_text", text: "what's in this image?" },
  //         {
  //           type: "input_image",
  //           image_url: `data:image/jpeg;base64,${base64Image}`,
  //         },
  //       ],
  //     },
  //   ],
  // });

  // console.log(response.output_text);

}
main()
export default main
