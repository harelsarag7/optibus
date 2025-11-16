import { Router, Request, Response } from 'express';
import { RAGService } from '../rag/ragService';
import { QueryRequest } from '../types/Query';

export function createQueryRouter(ragService: RAGService): Router {
  const router = Router();

  router.post('/', async (req: Request, res: Response) => {
    try {
      const request: QueryRequest = req.body;

      if (!request.query || typeof request.query !== 'string') {
        return res.status(400).json({ error: 'Query is required and must be a string' });
      }

      const response = await ragService.query(request);
      res.json(response);
    } catch (error) {
      console.error('Error processing query:', error);
      res.status(500).json({ error: 'Failed to process query' });
    }
  });

  return router;
}


