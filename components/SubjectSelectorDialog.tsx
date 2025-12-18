'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { FolderOpen, Article } from '@mui/icons-material';
import { useSubjects } from '@/hooks/useSubjects';
import { useSubtopics } from '@/hooks/useSubtopics';

interface SubjectSelectorDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (subjectId: string, subtopicId?: string, name?: string) => void;
  selectedSubjectId?: string;
  selectedSubtopicId?: string;
}

export default function SubjectSelectorDialog({
  open,
  onClose,
  onSelect,
  selectedSubjectId,
  selectedSubtopicId
}: SubjectSelectorDialogProps) {
  const [selectedItem, setSelectedItem] = useState<{ 
    subjectId: string; 
    subtopicId?: string; 
    name: string; 
  } | null>(null);

  const {
    subjects,
    loading: subjectLoading,
    error: subjectError,
    loadSubjects,
    clearSubjectError,
  } = useSubjects();

  const {
    loading: subtopicLoading,
    error: subtopicError,
    clearSubtopicError,
  } = useSubtopics();

  useEffect(() => {
    if (open && subjects.length === 0) {
      loadSubjects();
    }
  }, [open, subjects.length, loadSubjects]);

  const renderTreeItems = (items: any[], parentSubjectId?: string) => {
    return items.map((item) => {
      const isSubject = !parentSubjectId;
      const subjectId = isSubject ? item.id : parentSubjectId!;
      
      return (
        <TreeItem
          key={item.id}
          itemId={item.id}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
              {isSubject ? <FolderOpen fontSize="small" /> : <Article fontSize="small" />}
              <Typography variant="body2">{item.name}</Typography>
            </Box>
          }
          onClick={() => {
            if (isSubject) {
              setSelectedItem({
                subjectId: item.id,
                name: item.name
              });
            }
          }}
        >
          {item.subtopics && item.subtopics.length > 0 && 
            renderTreeItems(item.subtopics, subjectId)}
        </TreeItem>
      );
    });
  };

  const handleSelect = () => {
    if (selectedItem) {
      onSelect(selectedItem.subjectId, selectedItem.subtopicId, selectedItem.name);
      onClose();
    }
  };

  const handleClose = () => {
    clearSubjectError();
    clearSubtopicError();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Selecionar Assunto</DialogTitle>
      <DialogContent>
        {(subjectLoading || subtopicLoading) && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {(subjectError || subtopicError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {subjectError || subtopicError}
          </Alert>
        )}

        {!subjectLoading && !subtopicLoading && subjects.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', p: 2 }}>
            Nenhum assunto encontrado. Crie um assunto primeiro.
          </Typography>
        )}

        {!subjectLoading && subjects.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <SimpleTreeView
              sx={{ 
                maxHeight: 400, 
                overflow: 'auto',
                '& .MuiTreeItem-content': {
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              {renderTreeItems(subjects)}
            </SimpleTreeView>

            {selectedItem && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="primary">
                  Selecionado:
                </Typography>
                <Typography variant="body2">
                  {selectedItem.name}
                </Typography>
                {selectedItem.subtopicId && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    Subtópico selecionado
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSelect} 
          variant="contained" 
          disabled={!selectedItem}
        >
          Selecionar
        </Button>
      </DialogActions>
    </Dialog>
  );
}