import { loadDataset } from './rag/dataset';
import {
  loadEmbeddings,
  createEmbeddingsForDocuments,
  createEmbeddingsForMissingDocuments,
  saveEmbeddings,
} from './rag/embeddings';
import { InMemoryVectorStore } from './rag/vectorStore';
import { Retriever } from './rag/retriever';
import { RAGService } from './rag/ragService';
import { createApp, startServer } from './server';

async function bootstrap() {
  console.log('🚀 Starting Optibus RAG Backend...\n');

  // Step 1: Load dataset
  console.log('📚 Loading dataset...');
  const documents = await loadDataset();
  console.log(`✅ Loaded ${documents.length} documents\n`);

  // Step 2: Load or create embeddings
  console.log('🔍 Loading embeddings...');
  let embeddedDocs = loadEmbeddings();

  if (!embeddedDocs) {
    console.log('⚠️  No cached embeddings found. Creating new embeddings...');
    embeddedDocs = await createEmbeddingsForDocuments(documents);
    saveEmbeddings(embeddedDocs);
    console.log('✅ Embeddings created and cached\n');
  } else {
    console.log('✅ Embeddings loaded from cache');
    
    // Check for new documents and embed missing ones
    const previousCount = embeddedDocs.length;
    embeddedDocs = await createEmbeddingsForMissingDocuments(documents, embeddedDocs);
    
    // Save updated embeddings if new ones were added
    if (embeddedDocs.length > previousCount) {
      saveEmbeddings(embeddedDocs);
      console.log(`✅ Added embeddings for ${embeddedDocs.length - previousCount} new documents\n`);
    } else {
      console.log('✅ All documents already embedded\n');
    }
  }

  // Step 3: Initialize vector store
  console.log('Initializing vector store...');
  const vectorStore = new InMemoryVectorStore();
  vectorStore.upsertDocuments(embeddedDocs);
  console.log('✅ Vector store initialized\n');

  // Step 4: Initialize RAG components
  const retriever = new Retriever(vectorStore);
  const ragService = new RAGService(retriever);

  // Step 5: Create and start server
  const app = createApp(vectorStore, ragService);
  startServer(app);
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});


