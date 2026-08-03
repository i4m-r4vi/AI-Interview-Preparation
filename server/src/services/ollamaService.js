import { ollamaConfig } from '../config/ollama.js';
import { AppError } from '../middleware/errorHandler.js';

function extractJson(text) {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error('No valid JSON found in response');
  }
}

export async function ollamaGenerate(prompt, { json = false } = {}) {
  const url = `${ollamaConfig.baseUrl}/api/generate`;

  const body = {
    model: ollamaConfig.model,
    prompt,
    stream: false,
    options: { temperature: 0.4 },
  };

  if (json) {
    body.format = 'json';
  }

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new AppError(
      'Cannot connect to Ollama. Ensure Ollama is running and mistral model is pulled.',
      503
    );
  }

  if (!response.ok) {
    throw new AppError(`Ollama request failed: ${response.statusText}`, 503);
  }

  const data = await response.json();
  const text = data.response || '';

  if (json) {
    return extractJson(text);
  }

  return text;
}

export async function ollamaGenerateWithRetry(prompt, options = {}, maxRetries = 2) {
  let lastError;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await ollamaGenerate(prompt, options);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}
