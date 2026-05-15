import 'dotenv/config';

async function test() {
  const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.NVIDIA_NIM_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemma-3-12b-it",
      messages: [{ role: "user", content: "Hello" }]
    })
  });
  
  console.log('Status:', response.status);
  const data = await response.json();
  console.log('Data:', JSON.stringify(data, null, 2));
}

test();
