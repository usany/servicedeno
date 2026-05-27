import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";
import fs from 'node:fs';
import path from 'node:path';

const img = path.join(process.cwd(), 'downloads', 'p.png');
const genAI = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY});

const selection = "gemini-2.0-flash-exp"

async function main() {
  const imagePath = img;
  const imageData = fs.readFileSync(imagePath);

  try {
    const response = await genAI.models.generateContent({
      model: selection,
      contents: [
        "get weekdays menu list from the image in Korean please.",
        {
          inlineData: {
            data: imageData.toString('base64'),
            mimeType: 'image/png',
          },
        },
      ],
    });
    
    console.log(response.text);
  } catch (err) {
    console.error(err);
  }
}

main()
export default main
