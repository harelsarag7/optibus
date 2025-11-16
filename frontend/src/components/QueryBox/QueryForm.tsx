import { memo, useCallback } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Stack, Box, CircularProgress } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TOP_K_OPTIONS } from '../../constants/values';
import { COLORS } from '../../constants/colors';
import './QueryBox.css';

interface QueryFormProps {
  query: string;
  topK: number;
  loading: boolean;
  onQueryChange: (value: string) => void;
  onTopKChange: (value: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const QueryForm = memo(({ query, topK, loading, onQueryChange, onTopKChange, onSubmit }: QueryFormProps) => {
  const { t } = useTranslation();

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onQueryChange(e.target.value);
    },
    [onQueryChange]
  );

  const handleTopKChange = useCallback(
    (e: SelectChangeEvent<number>) => {
      onTopKChange(Number(e.target.value));
    },
    [onTopKChange]
  );

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={2}>
        <TextField
          fullWidth
          label={t('queryBox.queryLabel')}
          value={query}
          onChange={handleQueryChange}
          placeholder={t('queryBox.queryPlaceholder')}
          multiline
          rows={3}
          disabled={loading}
          className="query-box-textfield"
        />
        <Box className="query-box-controls">
          <FormControl className="query-box-select">
            <InputLabel>{t('queryBox.topKLabel')}</InputLabel>
            <Select value={topK} label={t('queryBox.topKLabel')} onChange={handleTopKChange} disabled={loading} className="query-box-select-input">
              {TOP_K_OPTIONS.map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !query.trim()}
            className="query-box-submit-button"
            style={{
              backgroundColor: COLORS.PRIMARY,
            }}
          >
            {loading ? <CircularProgress size={24} style={{ color: COLORS.WHITE }} /> : t('queryBox.submitButton')}
          </Button>
        </Box>
      </Stack>
    </form>
  );
});

QueryForm.displayName = 'QueryForm';
