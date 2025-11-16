import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 8000,
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  embeddingModel: 'text-embedding-3-small',
  chatModel: 'gpt-4o-mini',
  defaultTopK: 3,
  embeddingsCacheFile: './data/embeddings.json',
  datasetFile: './data/dataset.json',
};

if (!config.openaiApiKey) {
  console.warn('⚠️  OPENAI_API_KEY not set. Please set it in .env file');
}

