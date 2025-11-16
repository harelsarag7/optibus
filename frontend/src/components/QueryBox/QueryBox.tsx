import { Box, Paper, Typography, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useQuery } from './useQuery';
import { If } from '../../utils/Conditional';
import { QueryForm } from './QueryForm.tsx';
import { QueryResults } from './QueryResults.tsx';
import { AnswerSkeleton } from './AnswerSkeleton';
import { DocumentsSkeleton } from './DocumentsSkeleton';
import './QueryBox.css';

export const QueryBox = () => {
  const { t } = useTranslation();
  const { query, topK, loading, response, error, handleQueryChange, handleTopKChange, submitQuery } = useQuery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuery();
  };

  return (
    <Box className="query-box">
      <Paper className="query-box-header">
        <Typography variant="h6" className="query-box-title">
          {t('queryBox.title')}
        </Typography>
      </Paper>

      <Paper className="query-box-form-container">
        <QueryForm
          query={query}
          topK={topK}
          loading={loading}
          onQueryChange={handleQueryChange}
          onTopKChange={handleTopKChange}
          onSubmit={handleSubmit}
        />
      </Paper>

      <If condition={!!error}>
        <Alert severity="error" className="query-box-error">
          {error}
        </Alert>
      </If>

      <If condition={loading}>
        <AnswerSkeleton />
        <DocumentsSkeleton count={topK} />
      </If>

      <If condition={!loading && !!response}>
        <QueryResults response={response!} />
      </If>
    </Box>
  );
};
