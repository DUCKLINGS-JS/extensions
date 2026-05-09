const fs = require('fs');
const https = require('https');

const API_KEY = process.env.REFINER_API_KEY;

function refine(text) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      contents: [{ parts: [{ text: `Evaluate this user prompt.
If the prompt is a complex task, coding request, or technical investigation, rewrite it to be professional, structured, and clear.
If the prompt is a simple question or conversational input, return the original text exactly as it is.
Output ONLY the resulting prompt:

${text}` }] }],
      generationConfig: { temperature: 0.2 }
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
        } catch { resolve(text); }
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
    const refined = await refine(inputData.prompt || '');
    process.stdout.write(JSON.stringify({ prompt: refined }));
  } catch (e) {
    process.stderr.write(`Hook Error: ${e.message}\n`);
    process.exit(1);
  }
});
