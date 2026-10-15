import dotenv from 'dotenv';
dotenv.config();

let baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
let token = process.env.OLLAMA_TOKEN || '';

try {
  const parsed = new URL(baseUrl);
  const tokenParam = parsed.searchParams.get('token');
  if (tokenParam) {
    if (!token) token = tokenParam;
    parsed.searchParams.delete('token');
    baseUrl = parsed.origin + parsed.pathname.replace(/\/+$/, '');
  } else {
    baseUrl = baseUrl.replace(/\/+$/, '');
  }
} catch {
  baseUrl = baseUrl.replace(/\/+$/, '');
}

export const ollamaConfig = {
  baseUrl,
  model: process.env.OLLAMA_MODEL || 'mistral',
  token,
};

