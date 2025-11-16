export interface QueryRequest {
  query: string;
  top_k?: number;
}

export interface RetrievedDocument {
  id: string;
  module: string;
  text: string;
  score: number;
}

export interface QueryResponse {
  retrieved_docs: RetrievedDocument[];
  answer: string;
}

