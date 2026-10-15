import { ollamaConfig } from '../config/ollama.js';
import { AppError } from '../middleware/errorHandler.js';

function extractJson(text) {
  const cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error('No valid JSON found in response');
  }
}

export async function ollamaGenerate(prompt, { json = false } = {}) {
  let url = `${ollamaConfig.baseUrl}/api/generate`;
  if (ollamaConfig.token) {
    url += `?token=${encodeURIComponent(ollamaConfig.token)}`;
  }

  const body = {
    model: ollamaConfig.model,
    prompt,
    stream: false,
    options: { temperature: 0.4 },
  };

  if (json) {
    body.format = 'json';
  }

  const headers = { 'Content-Type': 'application/json' };
  if (ollamaConfig.token) {
    headers['Authorization'] = `Bearer ${ollamaConfig.token}`;
  }

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new AppError(
      `Cannot connect to Ollama (${err.message}). Ensure Ollama is running and ${ollamaConfig.model} model is available.`,
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
