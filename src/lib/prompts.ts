export function THREAD_TITLE_PROMPT(prompt: string) {
  return `
    Summarize the following text into a concise title of 3 to 7 words. Ensure the title captures the main idea effectively and is suitable for use as a thread title. 
    Examples:
      Input: 'A detailed guide on how to bake a cake.' Output: 'Guide to Baking a Cake'
      Input: 'Exploring the wonders of the Amazon rainforest.' Output: 'Amazon Rainforest Wonders'
      Input: 'Tips for improving productivity while working remotely.' Output: 'Remote Work Productivity Tips' 
    Now, summarize: ${prompt}.`.trim();
}
