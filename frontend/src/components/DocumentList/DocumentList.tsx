import { useState } from 'react';
import { Box, Paper, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { useDocuments } from './useDocuments';
import { useResponsive } from '../../utils/useResponsive';
import { If } from '../../utils/Conditional';
import type { Document } from '../../types';
import { TABLE_CONFIG, TEXT_CLAMP } from '../../constants/values';
import { TableSize } from '../../constants/enums';
import { COLORS } from '../../constants/colors';
import './DocumentList.css';

export const DocumentList = () => {
  const { t } = useTranslation();
  const { documents, loading, error } = useDocuments();
  const { isMobile } = useResponsive();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  return (
    <Box className="document-list">
      <Paper className="document-list-header">
        <Typography variant="h6" className="document-list-title">
          {t('documentList.title')} ({documents.length})
        </Typography>
      </Paper>

      <If condition={loading}>
        <Paper className="document-list-loading">
          <CircularProgress className="document-list-spinner" />
        </Paper>
      </If>

      <If condition={!loading && !!error}>
        <Paper className="document-list-error">
          <Alert severity="error" className="document-list-alert">
            {error}
          </Alert>
        </Paper>
      </If>

      <If condition={!loading && !error}>
        <TableContainer
          component={Paper}
          className="document-list-table-container"
          style={{
            maxHeight: isMobile ? TABLE_CONFIG.MOBILE_MAX_HEIGHT : TABLE_CONFIG.DESKTOP_MAX_HEIGHT,
          }}
        >
          <Table size={isMobile ? TableSize.SMALL : TableSize.MEDIUM} stickyHeader>
            <TableHead className="document-list-table-head">
              <TableRow>
                <TableCell className="document-list-header-cell">{t('documentList.columns.id')}</TableCell>
                <TableCell className="document-list-header-cell">{t('documentList.columns.module')}</TableCell>
                <TableCell className="document-list-header-cell">{t('documentList.columns.preview')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((doc: Document) => (
                <TableRow 
                  key={doc.id} 
                  className="document-list-row"
                  onClick={() => setSelectedDocument(doc)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell className="document-list-cell">{doc.id}</TableCell>
                  <TableCell>
                    <Chip
                      label={doc.module}
                      size="small"
                      className="document-list-chip"
                      style={{
                        backgroundColor: COLORS.PRIMARY,
                        color: COLORS.WHITE,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      className="document-list-text"
                      style={{
                        WebkitLineClamp: isMobile ? TEXT_CLAMP.MOBILE : TEXT_CLAMP.DESKTOP,
                      }}
                    >
                      {doc.text}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </If>

      <Dialog
        open={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
        maxWidth="sm"
        
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: COLORS.PRIMARY,
            color: COLORS.WHITE,
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: COLORS.WHITE }}>
              {selectedDocument?.id}
            </Typography>
            <Chip
              label={selectedDocument?.module}
              size="small"
              sx={{
                marginTop: '8px',
                backgroundColor: COLORS.WHITE,
                color: COLORS.PRIMARY,
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
          </Box>
          <IconButton
            onClick={() => setSelectedDocument(null)}
            sx={{
              color: COLORS.WHITE,
              '&:hover': {
                backgroundColor: COLORS.PRIMARY_DARK,
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent
          sx={{
            padding: '24px',
            backgroundColor: COLORS.BACKGROUND_LIGHT,
          }}
        >
          <Box
            sx={{
              backgroundColor: COLORS.WHITE,
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: COLORS.TEXT_PRIMARY,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                whiteSpace: 'pre-wrap',
              }}
            >
              {selectedDocument?.text}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
