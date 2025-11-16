import type { Document, QueryRequest, QueryResponse, DocumentsResponse } from '../types';

// Use environment variable if set, otherwise default based on mode
// In production (Docker), use /api proxy. In dev, use direct backend URL
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // In development, use direct backend URL
  // In production (Docker), use /api which will be proxied by nginx
  return import.meta.env.DEV ? 'http://localhost:8000' : '/api';
};

const API_BASE_URL = getApiBaseUrl();

export async function fetchDocuments(): Promise<Document[]> {
  const response = await fetch(`${API_BASE_URL}/documents`);
  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }
  const data: DocumentsResponse = await response.json();
  return data.documents;
}

export async function queryRAG(request: QueryRequest): Promise<QueryResponse> {
  const response = await fetch(`${API_BASE_URL}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to process query' }));
    throw new Error(error.error || 'Failed to process query');
  }
  
  return response.json();
}

