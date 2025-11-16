import { Paper, Skeleton, Box } from '@mui/material';
import './QueryBox.css';

export const AnswerSkeleton = () => {
  return (
    <Paper className="query-box-answer">
      <Skeleton variant="text" width="20%" height={32} />
      <Box>
        <Skeleton variant="text" width="95%" height={24} />
      </Box>
    </Paper>
  );
};

