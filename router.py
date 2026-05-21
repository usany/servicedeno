import os
import base64
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

img_path = os.path.join(os.getcwd(), 'downloads', 'p.png')

client = OpenAI(
    # base_url="https://integrate.api.nvidia.com/v1",
    # api_key=os.getenv("NVIDIA_NIM_API_KEY"),
    base_url='https://openrouter.ai/api/v1',
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

# selection = "nvidia/nemotron-nano-12b-v2-vl"
selection = "google/gemma-4-26b-a4b-it:free"

def main():
    # completion = client.chat.completions.create(
    #     model=selection,
    #     messages=[
    #         {
    #             'role': 'user',
    #             'content': 'What is Deepseek in short?',
    #         },
    #     ],
    # )
    # print(completion.choices[0].message)

    with open(img_path, "rb") as image_file:
        base64_image = base64.b64encode(image_file.read()).decode('utf-8')
    
    try:
        response = client.chat.completions.create(
            model=selection,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "get weekdays menu list from the image in Korean please."},
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                        },
                    ],
                },
            ],
        )
        print(response.choices[0].message.content)
    except Exception as err:
        print(f"Error: {err}")

if __name__ == '__main__':
    main()
