import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { QueryResponse } from '../../types';
import { queryRAG } from '../../api/client';
import { DEFAULT_TOP_K } from '../../constants/values';

export const useQuery = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [topK, setTopK] = useState(DEFAULT_TOP_K);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const handleTopKChange = useCallback((value: number) => {
    setTopK(value);
  }, []);

  const submitQuery = useCallback(async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const result = await queryRAG({ query, top_k: topK });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('queryBox.error'));
    } finally {
      setLoading(false);
    }
  }, [query, topK, t]);

  const resetQuery = useCallback(() => {
    setQuery('');
    setResponse(null);
    setError(null);
  }, []);

  return {
    query,
    topK,
    loading,
    response,
    error,
    handleQueryChange,
    handleTopKChange,
    submitQuery,
    resetQuery,
  };
};

