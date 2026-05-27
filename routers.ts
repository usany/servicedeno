import { GoogleGenAI, Type } from '@google/genai';

// Configure the client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Define the function declaration for the model
const getWeekdaysMenuFunctionDeclaration = {
  name: 'get_weekdays_menu',
  description: 'get weekdays menu list from the image in Korean please.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      attendees: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'List of people attending the meeting.',
      },
      date: {
        type: Type.STRING,
        description: 'Date of the meeting (e.g., "2024-07-29")',
      },
      time: {
        type: Type.STRING,
        description: 'Time of the meeting (e.g., "15:00")',
      },
      topic: {
        type: Type.STRING,
        description: 'The subject or topic of the meeting.',
      },
    },
    required: ['attendees', 'date', 'time', 'topic'],
  },
};

// Actual function implementation
async function getWeekdaysMenu(args: { attendees: string[], date: string, time: string, topic: string }) {
  console.log('Getting weekdays menu with args:', args);
  // TODO: Implement actual logic to extract menu from image
  return {
    menu: 'Menu items would be extracted from image here',
    ...args
  };
}

// Send request with function declarations
const response = await ai.models.generateContent({
  model: 'gemini-3.5-flash',
  contents: 'get weekdays menu list from the image in Korean please.',
  config: {
    tools: [{
      functionDeclarations: [getWeekdaysMenuFunctionDeclaration]
    }],
  },
});

// Check for function calls in the response
if (response.functionCalls && response.functionCalls.length > 0) {
  const functionCall = response.functionCalls[0]; // Assuming one function call
  console.log(`Function to call: ${functionCall.name}`);
  console.log(`ID: ${functionCall.id}`);
  console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
  // In a real app, you would call your actual function here:
  if (functionCall.args) {
    const result = await getWeekdaysMenu(functionCall.args as { attendees: string[], date: string, time: string, topic: string });
    console.log('Function result:', result);
  }
} else {
  console.log("No function call found in the response.");
  console.log(response.text);
}