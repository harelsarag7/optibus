import { IVectorStore } from './vectorStore';
import { createEmbedding } from './embeddings';
import { RetrievedDocument } from '../types/Query';

export class Retriever {
  constructor(private vectorStore: IVectorStore) {}

  async retrieve(query: string, topK: number): Promise<RetrievedDocument[]> {
    // Create embedding for the query
    const queryEmbedding = await createEmbedding(query);

    // Find similar documents
    const results = this.vectorStore.querySimilar(queryEmbedding, topK);

    // Map to RetrievedDocument format
    return results.map((result) => ({
      id: result.document.id,
      module: result.document.module,
      text: result.document.text,
      score: result.score,
    }));
  }
}

