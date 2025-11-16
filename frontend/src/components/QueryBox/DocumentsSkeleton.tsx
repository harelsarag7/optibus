import { Paper, Stack, Card, CardContent, Skeleton, Box } from '@mui/material';
import { DEFAULT_TOP_K } from '../../constants/values';
import { COLORS } from '../../constants/colors';
import './QueryBox.css';

export const DocumentsSkeleton = ({ count = DEFAULT_TOP_K }: { count?: number }) => {
  return (
    <Paper className="query-box-results-container">
      <Skeleton variant="text" width="50%" height={32} sx={{ mb: 2 }} />
      <Stack spacing={2} className="query-box-documents-list">
        {Array.from({ length: count }).map((_, idx) => (
          <Card
            key={idx}
            className="query-box-document-card"
            sx={{
              bgcolor: COLORS.WHITE,
              border: `1px solid ${COLORS.PRIMARY_LIGHT}`,
            }}
          >
            <CardContent>
              <Box className="query-box-document-header">
                <Box className="query-box-document-info" sx={{ flex: 1, gap: 1, display: 'flex', alignItems: 'center' }}>
                  <Skeleton variant="text" width="25%" height={20} />
                  <Skeleton variant="text" width="15%" height={16} />
                </Box>
                <Skeleton variant="text" width="20%" height={16} />
              </Box>
              <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="90%" height={20} />
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Paper>
  );
};

