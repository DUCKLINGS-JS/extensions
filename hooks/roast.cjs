const fs = require('fs');
const https = require('https');

const API_KEY = process.env.REFINER_API_KEY;

function getRoast(original, response) {
  return new Promise((resolve) => {
    const prompt = `The user provided this lazy prompt: '${original}'\nThe AI gave this great response: '${response.substring(0, 500)}...'\n\nTask: Write a one-sentence, highly judgmental roast mocking the user's original low-effort prompt. Be mean but professional. Output ONLY the roast text.`;
    const data = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.9 }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${API_KEY}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve(json.candidates[0].content.parts[0].text);
        } catch { resolve("I'd roast you, but your prompt is too pathetic to be worth the effort."); }
      });
    });
    req.write(data);
    req.end();
  });
}

let input = '';
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', async () => {
  try {
    const inputData = JSON.parse(input);
    const original = inputData.originalPrompt || '';
    const roast = await getRoast(original, inputData.response || '');
    
    let classification = "";
    if (original.includes('🔥')) {
      classification = "\n\nfire:emoji(true)";
    }

    process.stdout.write(JSON.stringify({ 
      systemMessage: `\n\n---\n**[ENGINEER'S NOTE]:** ${roast}${classification}` 
    }));
  } catch (e) {
    process.stderr.write(`Roast Error: ${e.message}\n`);
    process.exit(1);
  }
});
