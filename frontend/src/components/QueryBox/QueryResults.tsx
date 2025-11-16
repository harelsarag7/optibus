import { memo, useMemo } from 'react';
import { Box, Paper, Typography, Stack, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { QueryResponse, RetrievedDocument } from '../../types';
import { COLORS } from '../../constants/colors';
import './QueryBox.css';

interface QueryResultsProps {
  response: QueryResponse;
}

export const QueryResults = memo(({ response }: QueryResultsProps) => {
  const { t } = useTranslation();
  const documentCount = useMemo(() => response.retrieved_docs.length, [response.retrieved_docs.length]);

  return (
    <Box>
      <Paper className="query-box-answer">
        <Typography variant="h6" className="query-box-answer-title">
          {t('queryBox.answerTitle')}
        </Typography>
        <Typography variant="body1" className="query-box-answer-text">
          {response.answer}
        </Typography>
      </Paper>

      <Paper className="query-box-results-container">
        <Typography variant="h6" className="query-box-results-title">
          {t('queryBox.retrievedDocumentsTitle')} ({documentCount})
        </Typography>
        <Stack spacing={2} className="query-box-documents-list">
          {response.retrieved_docs.map((doc: RetrievedDocument, idx: number) => (
            <Card
              key={doc.id}
              className="query-box-document-card"
              sx={{
                bgcolor: COLORS.WHITE,
                color: COLORS.TEXT_PRIMARY,
                border: `1px solid ${COLORS.PRIMARY_LIGHT}`,
                '& .MuiCardContent-root': {
                  bgcolor: COLORS.WHITE,
                  color: COLORS.TEXT_PRIMARY,
                },
              }}
            >
              <CardContent>
                <Box className="query-box-document-header">
                  <Box className="query-box-document-info">
                    <Typography variant="subtitle2" className="query-box-document-id">
                      #{idx + 1} - {doc.id}
                    </Typography>
                    <Typography variant="caption" className="query-box-document-module">
                      ({doc.module})
                    </Typography>
                  </Box>
                  <Typography variant="caption" className="query-box-document-score">
                    {t('queryBox.scoreLabel')} {doc.score.toFixed(3)}
                  </Typography>
                </Box>
                <Typography variant="body2" className="query-box-document-text">
                  {doc.text}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
});

QueryResults.displayName = 'QueryResults';
