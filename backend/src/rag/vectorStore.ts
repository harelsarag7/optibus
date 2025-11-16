import { EmbeddedDocument } from '../types/Document';

export interface IVectorStore {
  upsertDocuments(documents: EmbeddedDocument[]): void;
  querySimilar(embedding: number[], topK: number): Array<{ document: EmbeddedDocument; score: number }>;
  getAllDocuments(): EmbeddedDocument[];
}

export class InMemoryVectorStore implements IVectorStore {
  private documents: EmbeddedDocument[] = [];

  upsertDocuments(documents: EmbeddedDocument[]): void {
    this.documents = documents;
  }

  querySimilar(queryEmbedding: number[], topK: number): Array<{ document: EmbeddedDocument; score: number }> {
    const similarities = this.documents.map((doc) => {
      const score = cosineSimilarity(queryEmbedding, doc.embedding);
      return { document: doc, score };
    });

    // Sort by score descending and take top K
    similarities.sort((a, b) => b.score - a.score);
    
    return similarities.slice(0, topK);
  }

  getAllDocuments(): EmbeddedDocument[] {
    return this.documents;
  }
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  
  if (denominator === 0) {
    return 0;
  }

  return dotProduct / denominator;
}

