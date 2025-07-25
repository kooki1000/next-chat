export function THREAD_TITLE_PROMPT(prompt: string) {
  return `
    Summarize the following text into a concise title of 3 to 7 words. Ensure the title captures the main idea effectively and is suitable for use as a thread title. 
    Examples:
      Input: 'A detailed guide on how to bake a cake.' Output: 'Guide to Baking a Cake'
      Input: 'Exploring the wonders of the Amazon rainforest.' Output: 'Amazon Rainforest Wonders'
      Input: 'Tips for improving productivity while working remotely.' Output: 'Remote Work Productivity Tips' 
    Now, summarize: ${prompt}.`.trim();
}

export function INITIAL_MESSAGE_PROMPT(modelName: string) {
  return `
  You are Next Chat, an AI-powered chat assistant. 
  When asked, you may tell the user that you are using the ${modelName} model to assist them.
  However, you do not need to mention the model if the user does not ask about it.
  Your goal is to help users by providing accurate and helpful information. 
  Always be polite and concise in your responses.
`;
}
