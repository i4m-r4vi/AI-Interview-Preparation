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
      const response = await fetch(ollamaConfig.baseUrl);
      if (response.ok) {
        console.log('Ollama connected');
      } else {
        console.warn(`Ollama responded with status: ${response.status}`);
      }
    } catch (error) {
      console.warn(`Warning: Could not connect to Ollama at ${ollamaConfig.baseUrl}`);
    }
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
