import 'dotenv/config';
import OpenAI from 'openai';
import fs from 'node:fs';
import path from 'node:path';
const img = path.join(process.cwd(), 'downloads', 'p.png');
const openai = new OpenAI({
  // baseURL: "https://integrate.api.nvidia.com/v1",
  // apiKey: process.env.NVIDIA_NIM_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

// const selection = "nvidia/nemotron-nano-12b-v2-vl"
const selection = "google/gemma-4-26b-a4b-it:free"
async function main() {

  // const completion = await openai.chat.completions.create({
  //   model: selection,
  //   messages: [
  //     {
  //       role: 'user',
  //       content: 'What is Deepseek in short?',
  //     },
  //   ],
  // });
  // console.log(completion.choices[0].message);

  const imagePath = img;
  const base64Image = fs.readFileSync(imagePath, "base64");
  try {

    const response = await openai.chat.completions.create({
      model: selection,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "get weekdays menu list from the image in Korean please." },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${base64Image}` },
            },
          ],
        },
      ],
    });
    console.log(response.choices[0].message.content);
  } catch (err) {
    console.error(err.error.message);
  }

}
main()
export default main
