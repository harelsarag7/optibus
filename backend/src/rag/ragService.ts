import OpenAI from 'openai';
import { Retriever } from './retriever';
import { QueryRequest, QueryResponse } from '../types/Query';
import { config } from '../config';

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

export class RAGService {
  constructor(private retriever: Retriever) {}

  async query(request: QueryRequest): Promise<QueryResponse> {
    const topK = request.top_k || config.defaultTopK;

    // Step 1: Retrieve relevant documents
    const retrievedDocs = await this.retriever.retrieve(request.query, topK);

    // Step 2: Build context from retrieved documents
    const context = retrievedDocs
      .map((doc, idx) => `[${idx + 1}] ${doc.module} - ${doc.id}: ${doc.text}`)
      .join('\n\n');

    // Step 3: Create prompt for LLM
    const systemPrompt = `You are a helpful assistant for Optibus, a public transportation planning and operations platform. 
Answer questions based ONLY on the provided context. If the context doesn't contain enough information to answer the question, 
say that you don't have enough information. Be concise and accurate.`;

    const userPrompt = `Context:
${context}

Question: ${request.query}

Answer:`;

    // Step 4: Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: config.chatModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const answer = completion.choices[0]?.message?.content || 'No answer generated';

    return {
      retrieved_docs: retrievedDocs,
      answer,
    };
  }
}

