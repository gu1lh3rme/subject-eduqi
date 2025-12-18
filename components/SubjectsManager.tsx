'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add, Edit, Delete, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useSubjects } from '@/hooks/useSubjects';
import { useSubtopics } from '@/hooks/useSubtopics';
import { CreateSubjectRequest, UpdateSubjectRequest, CreateSubtopicRequest, UpdateSubtopicRequest, Subject } from '@/types';

interface ExpandedRowState {
  [key: string]: boolean;
}

export default function SubjectsManager() {
  const {
    subjects,
    selectedSubject,
    loading: subjectLoading,
    error: subjectError,
    loadSubjects,
    createNewSubject,
    updateExistingSubject,
    deleteExistingSubject,
    selectSubject,
    clearSelection,
    clearSubjectError,
  } = useSubjects();

  const {
    selectedSubtopic,
    loading: subtopicLoading,
    error: subtopicError,
    loadSubtopicsBySubjectId,
    createNewSubtopic,
    updateExistingSubtopic,
    deleteExistingSubtopic,
    selectSubtopic,
    clearSelection: clearSubtopicSelection,
    clearSubtopicError,
    getSubtopicsForSubject,
  } = useSubtopics();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [subtopicDialogOpen, setSubtopicDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [subtopicEditMode, setSubtopicEditMode] = useState(false);
  const [expandedRows, setExpandedRows] = useState<ExpandedRowState>({});
  const [selectedSubjectForSubtopic, setSelectedSubjectForSubtopic] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
  });

  const [subtopicFormData, setSubtopicFormData] = useState({
    name: '',
    subjectId: '',
  });

  const loading = subjectLoading || subtopicLoading;
  const error = subjectError || subtopicError;

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  useEffect(() => {
    if (selectedSubject && editMode) {
      setFormData({
        name: selectedSubject.name,
      });
    }
  }, [selectedSubject, editMode]);

  useEffect(() => {
    if (selectedSubtopic && subtopicEditMode && selectedSubtopic.subjectId !== undefined) {
      setSubtopicFormData({
        name: selectedSubtopic.name,
        subjectId: selectedSubtopic.subjectId!,
      });
    }
  }, [selectedSubtopic, subtopicEditMode]);

  const handleExpandClick = (subjectId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [subjectId]: !prev[subjectId]
    }));

    if (!expandedRows[subjectId]) {
      loadSubtopicsBySubjectId(subjectId);
    }
  };

  const handleOpenDialog = (isEdit = false) => {
    setEditMode(isEdit);
    if (!isEdit) {
      setFormData({ name: '' });
      clearSelection();
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditMode(false);
    setFormData({ name: '' });
    clearSelection();
  };

  const handleOpenSubtopicDialog = (subjectId: string, isEdit = false) => {
    setSelectedSubjectForSubtopic(subjectId);
    setSubtopicEditMode(isEdit);
    if (!isEdit) {
      setSubtopicFormData({ 
        name: '', 
        subjectId 
      });
      clearSubtopicSelection();
    }
    setSubtopicDialogOpen(true);
  };

  const handleCloseSubtopicDialog = () => {
    setSubtopicDialogOpen(false);
    setSubtopicEditMode(false);
    setSubtopicFormData({ name: '', subjectId: '' });
    setSelectedSubjectForSubtopic(null);
    clearSubtopicSelection();
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    try {
      if (editMode && selectedSubject) {
        const updateData: UpdateSubjectRequest = {
          name: formData.name,
        };
        await updateExistingSubject({ id: selectedSubject.id, ...updateData });
      } else {
        const createData: CreateSubjectRequest = {
          name: formData.name,
        };
        await createNewSubject(createData);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving subject:', error);
    }
  };

  const handleSubtopicSubmit = async () => {
    if (!subtopicFormData.name.trim() || !subtopicFormData.subjectId) return;

    try {
      if (subtopicEditMode && selectedSubtopic) {
        const updateData: UpdateSubtopicRequest = {
          name: subtopicFormData.name,
          subjectId: subtopicFormData.subjectId,
        };
        await updateExistingSubtopic({ id: selectedSubtopic.id, ...updateData });
      } else {
        const createData: CreateSubtopicRequest = {
          name: subtopicFormData.name,
          subjectId: subtopicFormData.subjectId,
        };
        await createNewSubtopic(createData);
      }
      handleCloseSubtopicDialog();
      // Recarregar subtópicos do subject
      if (selectedSubjectForSubtopic) {
        loadSubtopicsBySubjectId(selectedSubjectForSubtopic);
      }
    } catch (error) {
      console.error('Error saving subtopic:', error);
    }
  };

  const handleEdit = (subject: typeof subjects[0]) => {
    selectSubject(subject);
    handleOpenDialog(true);
  };

  const handleEditSubtopic = (subtopic: any) => {
    selectSubtopic(subtopic);
    setSelectedSubjectForSubtopic(subtopic.subjectId);
    handleOpenSubtopicDialog(subtopic.subjectId, true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este assunto?')) {
      try {
        await deleteExistingSubject(id);
      } catch (error) {
        console.error('Error deleting subject:', error);
      }
    }
  };

  const handleDeleteSubtopic = async (id: string, subjectId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este subtópico?')) {
      try {
        await deleteExistingSubtopic(id);
        loadSubtopicsBySubjectId(subjectId);
      } catch (error) {
        console.error('Error deleting subtopic:', error);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubtopicInputChange = (field: string, value: string | number) => {
    setSubtopicFormData(prev => ({ ...prev, [field]: value }));
  };

  const clearErrors = () => {
    if (subjectError) clearSubjectError();
    if (subtopicError) clearSubtopicError();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" component="h6">
          Gerenciar Assuntos e Subtópicos
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog(false)}
        >
          Novo Assunto
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearErrors}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell><strong>Nome do Assunto</strong></TableCell>
                <TableCell><strong>Subtópicos</strong></TableCell>
                <TableCell align="center"><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subjects?.map((subject: Subject) => {
                const subtopics = getSubtopicsForSubject(subject.id);
                return (
                  <>
                    <TableRow key={subject.id}>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleExpandClick(subject.id)}
                        >
                          {expandedRows[subject.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">{subject.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label={`${subtopics.length} subtópicos`} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                          <Button
                            size="small"
                            startIcon={<Add />}
                            onClick={() => handleOpenSubtopicDialog(subject.id, false)}
                          >
                            Adicionar
                          </Button>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(subject)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(subject.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                        <Collapse in={expandedRows[subject.id]} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 2 }}>
                            <Typography variant="h6" gutterBottom component="div">
                              Subtópicos de {subject.name}
                            </Typography>
                            {subtopics.length === 0 ? (
                              <Typography color="text.secondary">
                                Nenhum subtópico encontrado
                              </Typography>
                            ) : (
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell><strong>Nome</strong></TableCell>
                                    <TableCell align="center"><strong>Ações</strong></TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {subtopics.map((subtopic) => (
                                    <TableRow key={subtopic.id}>
                                      <TableCell>{subtopic.name}</TableCell>
                                      <TableCell align="center">
                                        <IconButton
                                          size="small"
                                          onClick={() => handleEditSubtopic(subtopic)}
                                          color="primary"
                                        >
                                          <Edit />
                                        </IconButton>
                                        <IconButton
                                          size="small"
                                          onClick={() => handleDeleteSubtopic(subtopic.id, subject.id)}
                                          color="error"
                                        >
                                          <Delete />
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog para Subject */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? 'Editar Assunto' : 'Novo Assunto'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Nome do Assunto"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.name.trim() || loading}
          >
            {editMode ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para Subtopic */}
      <Dialog open={subtopicDialogOpen} onClose={handleCloseSubtopicDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {subtopicEditMode ? 'Editar Subtópico' : 'Novo Subtópico'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              autoFocus
              label="Nome do Subtópico"
              fullWidth
              variant="outlined"
              value={subtopicFormData.name}
              onChange={(e) => handleSubtopicInputChange('name', e.target.value)}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubtopicDialog}>Cancelar</Button>
          <Button
            onClick={handleSubtopicSubmit}
            variant="contained"
            disabled={!subtopicFormData.name.trim() || loading}
          >
            {subtopicEditMode ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}