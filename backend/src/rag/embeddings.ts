import OpenAI from 'openai';
import { Document, EmbeddedDocument } from '../types/Document';
import { config } from '../config';
import * as fs from 'fs';
import * as path from 'path';

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

export async function createEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: config.embeddingModel,
    input: text,
  });

  return response.data[0].embedding;
}

export async function createEmbeddingsForDocuments(
  documents: Document[]
): Promise<EmbeddedDocument[]> {
  console.log(`Creating embeddings for ${documents.length} documents...`);
  
  const embeddedDocs: EmbeddedDocument[] = [];
  
  for (const doc of documents) {
    const embedding = await createEmbedding(doc.text);
    embeddedDocs.push({
      ...doc,
      embedding,
    });
  }
  
  return embeddedDocs;
}

export function saveEmbeddings(embeddedDocs: EmbeddedDocument[]): void {
  const cachePath = path.resolve(__dirname, '../../', config.embeddingsCacheFile);
  const dir = path.dirname(cachePath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(cachePath, JSON.stringify(embeddedDocs, null, 2));
  console.log(`Saved embeddings to ${cachePath}`);
}

export function loadEmbeddings(): EmbeddedDocument[] | null {
  const cachePath = path.resolve(__dirname, '../../', config.embeddingsCacheFile);
  
  if (!fs.existsSync(cachePath)) {
    return null;
  }
  
  const fileContent = fs.readFileSync(cachePath, 'utf-8');
  const embeddedDocs: EmbeddedDocument[] = JSON.parse(fileContent);
  console.log(`Loaded ${embeddedDocs.length} embeddings from cache`);
  
  return embeddedDocs;
}

export function findMissingDocuments(
  documents: Document[],
  embeddedDocs: EmbeddedDocument[]
): Document[] {
  const embeddedIds = new Set(embeddedDocs.map((doc) => doc.id));
  const missing = documents.filter((doc) => !embeddedIds.has(doc.id));
  return missing;
}

export async function createEmbeddingsForMissingDocuments(
  documents: Document[],
  existingEmbeddedDocs: EmbeddedDocument[]
): Promise<EmbeddedDocument[]> {
  const missingDocs = findMissingDocuments(documents, existingEmbeddedDocs);
  
  if (missingDocs.length === 0) {
    return existingEmbeddedDocs;
  }
  
  console.log(`Found ${missingDocs.length} new documents to embed...`);
  const newEmbeddedDocs = await createEmbeddingsForDocuments(missingDocs);
  
  // Merge existing with new embeddings
  const allEmbeddedDocs = [...existingEmbeddedDocs, ...newEmbeddedDocs];
  return allEmbeddedDocs;
}


