import { Router, Request, Response } from 'express';
import { IVectorStore } from '../rag/vectorStore';

export function createDocumentsRouter(vectorStore: IVectorStore): Router {
  const router = Router();

  router.get('/', (req: Request, res: Response) => {
    try {
      const documents = vectorStore.getAllDocuments();
      
      // Return documents without embeddings for the frontend
      const documentsWithoutEmbeddings = documents.map(({ embedding, ...doc }) => doc);
      
      res.json({ documents: documentsWithoutEmbeddings });
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({ error: 'Failed to fetch documents' });
    }
  });

  return router;
}


