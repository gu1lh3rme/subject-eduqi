'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  Subject as SubjectIcon,
} from '@mui/icons-material';
import { useQuestions } from '@/hooks/useQuestions';
import { useSubjects } from '@/hooks/useSubjects';
import { Question } from '@/types';
import QuestionForm from './QuestionForm';

interface QuestionListProps {
  refresh?: boolean;
  onRefreshComplete?: () => void;
}

export default function QuestionList({ refresh, onRefreshComplete }: QuestionListProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);

  const {
    questions,
    loading,
    error,
    fetchQuestions,
    deleteQuestion,
    clearError
  } = useQuestions();

  const {
    subjects,
    loadSubjects
  } = useSubjects();

  useEffect(() => {
    fetchQuestions();
    if (subjects.length === 0) {
      loadSubjects();
    }
  }, [fetchQuestions, loadSubjects, subjects.length]);

  useEffect(() => {
    if (refresh) {
      fetchQuestions();
      if (onRefreshComplete) {
        onRefreshComplete();
      }
    }
  }, [refresh, fetchQuestions, onRefreshComplete]);

  const getSubjectName = (subjectId: string): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Assunto não encontrado';
  };

  const getStatusColor = (status: string): 'default' | 'success' | 'error' | 'warning' => {
    switch (status) {
      case 'aprovado':
        return 'success';
      case 'reprovado':
        return 'error';
      case 'rascunho':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'aprovado':
        return 'Aprovado';
      case 'reprovado':
        return 'Reprovado';
      case 'rascunho':
        return 'Rascunho';
      default:
        return status;
    }
  };

  const handleViewQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setViewDialogOpen(true);
  };

  const handleDeleteClick = (question: Question) => {
    setQuestionToDelete(question);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (question: Question) => {
    setQuestionToEdit(question);
    setEditDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (questionToDelete) {
      try {
        await deleteQuestion(questionToDelete.id);
        setDeleteDialogOpen(false);
        setQuestionToDelete(null);
        fetchQuestions(); // Refresh the list
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    }
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
        <Button onClick={() => { clearError(); fetchQuestions(); }} sx={{ ml: 2 }}>
          Tentar Novamente
        </Button>
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Questões Cadastradas
      </Typography>

      {questions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Nenhuma questão cadastrada ainda.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr',
          gap: 2,
          maxWidth: '100%'
        }}>
          {questions.map((question) => (
            <Card key={question.id} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={getStatusLabel(question.status)}
                      color={getStatusColor(question.status)}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Chip
                      label={question.difficulty}
                      variant="outlined"
                      size="small"
                      sx={{ mb: 1, ml: 1 }}
                    />
                  </Box>

                  <Typography variant="body1" gutterBottom>
                    {truncateText(question.statement, 80)}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SubjectIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {getSubjectName(question.subjectId)}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ flexDirection: 'row', alignItems: 'flex-end', gap: 0.2 }}>
                  <Button
                    size="small"
                    onClick={() => handleViewQuestion(question)}
                  >
                    <Visibility />
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleEditClick(question)}
                  >
                    <Edit />
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClick(question)}
                  >
                    <Delete />
                  </Button>
                </CardActions>
              </Card>
          ))}
        </Box>
      )}

      {/* Dialog para visualizar questão */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Visualizar Questão
        </DialogTitle>
        <DialogContent>
          {selectedQuestion && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={getStatusLabel(selectedQuestion.status)}
                  color={getStatusColor(selectedQuestion.status)}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={selectedQuestion.difficulty}
                  variant="outlined"
                  size="small"
                />
              </Box>

              <Typography variant="h6" gutterBottom>
                Enunciado:
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {selectedQuestion.statement}
              </Typography>

              <Typography variant="h6" gutterBottom>
                Alternativas:
              </Typography>
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <RadioGroup value={selectedQuestion.correctAlternative}>
                  {['A', 'B', 'C', 'D', 'E'].map((letter) => (
                    <FormControlLabel
                      key={letter}
                      value={letter}
                      control={<Radio />}
                      label={`${letter}) ${selectedQuestion[`alternative${letter}` as keyof Question]}`}
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          color: selectedQuestion.correctAlternative === letter ? 'success.main' : 'text.primary',
                          fontWeight: selectedQuestion.correctAlternative === letter ? 'bold' : 'normal',
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary">
                <strong>Assunto:</strong> {getSubjectName(selectedQuestion.subjectId)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Dificuldade:</strong> {selectedQuestion.difficulty}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Status:</strong> {getStatusLabel(selectedQuestion.status)}
              </Typography>
              {selectedQuestion.createdAt && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Criada em:</strong> {new Date(selectedQuestion.createdAt).toLocaleString('pt-BR')}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para confirmar exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir esta questão? Esta ação não pode ser desfeita.
          </Typography>
          {questionToDelete && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              <strong>Questão:</strong> {truncateText(questionToDelete.statement, 100)}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para editar questão */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Editar Questão
        </DialogTitle>
        <DialogContent>
          {questionToEdit && (
            <QuestionForm
              questionToEdit={questionToEdit}
              onSuccess={() => {
                setEditDialogOpen(false);
                setQuestionToEdit(null);
                fetchQuestions(); // Refresh the list
              }}
              onCancel={() => {
                setEditDialogOpen(false);
                setQuestionToEdit(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}