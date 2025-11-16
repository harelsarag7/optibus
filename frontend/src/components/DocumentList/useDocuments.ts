import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { Document } from '../../types';
import { fetchDocuments } from '../../api/client';

export const useDocuments = () => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const docs = await fetchDocuments();
      setDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('documentList.error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { documents, loading, error, refetch: loadDocuments };
};

