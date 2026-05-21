import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.getenv("NVIDIA_NIM_API_KEY"),
)

def list_models():
    try:
        models = client.models.list()
        sorted_models = sorted(models.data, key=lambda x: x.id)
        for model in sorted_models:
            print(model.id)
    except Exception as error:
        print(f'Error: {error}')

if __name__ == '__main__':
    list_models()
