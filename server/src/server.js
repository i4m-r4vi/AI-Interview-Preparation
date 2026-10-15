import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

import { ollamaConfig } from './config/ollama.js';

const start = async () => {
  await connectDB();
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    
    try {
      let pingUrl = ollamaConfig.baseUrl;
      const headers = {};
      if (ollamaConfig.token) {
        pingUrl += `/?token=${encodeURIComponent(ollamaConfig.token)}`;
        headers['Authorization'] = `Bearer ${ollamaConfig.token}`;
      }
      const response = await fetch(pingUrl, { headers });
      if (response.ok) {
        console.log('Ollama connected');
      } else {
        console.warn(`Ollama responded with status: ${response.status}`);
      }
    } catch (error) {
      console.warn(`Warning: Could not connect to Ollama at ${ollamaConfig.baseUrl}: ${error.message}`);
    }
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
