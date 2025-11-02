// utils/gemini.js
const fetch = require('node-fetch');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // set in .env

/**
 * embedText - sends text to Gemini and returns embedding vector (array of numbers)
 * @param {string} text
 */
async function embedText(text) {
  if (!GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY in env');

  // Example REST call pattern — adapt to the exact Gemini endpoint you have access to.
  // If you're using Google Cloud Vertex AI, use the Vertex AI REST endpoint or client library instead.
  const url = 'https://api.google.com/v1/embeddings:generate'; // <-- adapt to the correct endpoint for your account

  const body = {
    // these keys depend on the exact Gemini API contract. Example:
    model: 'gemini-embedding-1', 
    input: text
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GEMINI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Gemini embedding failed: ${res.status} ${txt}`);
  }

  const json = await res.json();
  // adapt based on response shape. Example below assumes json.data[0].embedding
  const embedding = (json.data && json.data[0] && json.data[0].embedding) || json.embedding;
  if (!embedding) throw new Error('No embedding received from Gemini.');
  return embedding;
}

module.exports = { embedText };
