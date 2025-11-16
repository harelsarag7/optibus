import express, { Express } from 'express';
import cors from 'cors';
import { config } from './config';
import { createDocumentsRouter } from './routes/documents';
import { createQueryRouter } from './routes/query';
import { IVectorStore } from './rag/vectorStore';
import { RAGService } from './rag/ragService';
import { Retriever } from './rag/retriever';

export function createApp(vectorStore: IVectorStore, ragService: RAGService): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (req: express.Request, res: express.Response) => {
    res.json({ status: 'ok' });
  });

  app.use('/documents', createDocumentsRouter(vectorStore));
  app.use('/query', createQueryRouter(ragService));

  return app;
}

export function startServer(app: Express): void {
  const port = config.port;
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

