'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  InputLabel,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import { Add, Subject, Clear } from '@mui/icons-material';
import { useQuestions } from '@/hooks/useQuestions';
import { useSubjects } from '@/hooks/useSubjects';
import { CreateQuestionRequest, Question } from '@/types';
import SubjectSelectorDialog from './SubjectSelectorDialog';

interface QuestionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  questionToEdit?: Question;
}

export default function QuestionForm({ onSuccess, onCancel, questionToEdit }: QuestionFormProps) {
  const [formData, setFormData] = useState<Omit<CreateQuestionRequest, 'subjectId'> & { 
    subjectId?: string;
    subtopicId?: string;
    subjectName?: string;
  }>(() => {
    if (questionToEdit) {
      return {
        statement: questionToEdit.statement,
        alternativeA: questionToEdit.alternativeA,
        alternativeB: questionToEdit.alternativeB,
        alternativeC: questionToEdit.alternativeC,
        alternativeD: questionToEdit.alternativeD,
        alternativeE: questionToEdit.alternativeE,
        correctAlternative: questionToEdit.correctAlternative,
        difficulty: questionToEdit.difficulty,
        status: questionToEdit.status,
        subjectId: questionToEdit.subjectId,
        subtopicId: undefined,
        subjectName: undefined,
      };
    }
    return {
      statement: '',
      alternativeA: '',
      alternativeB: '',
      alternativeC: '',
      alternativeD: '',
      alternativeE: '',
      correctAlternative: 'A',
      difficulty: '',
      status: 'rascunho',
      subjectId: undefined,
      subtopicId: undefined,
      subjectName: undefined,
    };
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [subjectSelectorOpen, setSubjectSelectorOpen] = useState(false);

  const { createQuestion, updateQuestion, loading, error, clearError } = useQuestions();
  const { subjects } = useSubjects();

  // Get subject name for display
  const getSubjectName = (subjectId?: string): string => {
    if (!subjectId) return '';
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Assunto não encontrado';
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.statement || formData.statement.trim().length < 20) {
      newErrors.statement = 'O enunciado deve ter pelo menos 20 caracteres';
    }

    const alternatives = [
      { key: 'alternativeA', label: 'Alternativa A' },
      { key: 'alternativeB', label: 'Alternativa B' },
      { key: 'alternativeC', label: 'Alternativa C' },
      { key: 'alternativeD', label: 'Alternativa D' },
      { key: 'alternativeE', label: 'Alternativa E' },
    ];

    const filledAlternatives: string[] = [];
    
    alternatives.forEach(({ key, label }) => {
      const value = formData[key as keyof typeof formData] as string;
      if (!value || value.trim() === '') {
        newErrors[key] = `${label} é obrigatória`;
      } else {
        filledAlternatives.push(value.trim().toLowerCase());
      }
    });

    const duplicates = filledAlternatives.filter((item, index) => filledAlternatives.indexOf(item) !== index);
    if (duplicates.length > 0) {
      newErrors.alternatives = 'As alternativas não podem ser iguais entre si';
    }

    if (!formData.subjectId) {
      newErrors.subjectId = 'O assunto é obrigatório';
    }

    if (!formData.difficulty) {
      newErrors.difficulty = 'A dificuldade é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    if (field.startsWith('alternative') && errors.alternatives) {
      setErrors(prev => ({
        ...prev,
        alternatives: ''
      }));
    }

    clearError();
  };

  const handleSubjectSelect = (subjectId: string, subtopicId?: string, name?: string) => {
    setFormData(prev => ({
      ...prev,
      subjectId,
      subtopicId,
      subjectName: name
    }));

    if (errors.subjectId) {
      setErrors(prev => ({
        ...prev,
        subjectId: ''
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const questionData: CreateQuestionRequest = {
      statement: formData.statement.trim(),
      alternativeA: formData.alternativeA.trim(),
      alternativeB: formData.alternativeB.trim(),
      alternativeC: formData.alternativeC.trim(),
      alternativeD: formData.alternativeD.trim(),
      alternativeE: formData.alternativeE.trim(),
      correctAlternative: formData.correctAlternative,
      subjectId: formData.subjectId!,
      subtopicId: formData.subtopicId,
      difficulty: formData.difficulty,
      status: formData.status,
    };

    try {
      let result;
      
      if (questionToEdit) {
        result = await updateQuestion({
          id: questionToEdit.id,
          ...questionData,
        });
      } else {
        result = await createQuestion(questionData);
      }
      
      if (result.meta.requestStatus === 'fulfilled') {
        if (!questionToEdit) {
          setFormData({
            statement: '',
            alternativeA: '',
            alternativeB: '',
            alternativeC: '',
            alternativeD: '',
            alternativeE: '',
            correctAlternative: 'A',
            difficulty: 'Fácil',
            status: 'rascunho',
            subjectId: undefined,
            subtopicId: undefined,
            subjectName: undefined,
          });
        }
        setErrors({});
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      console.error('Error saving question:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      statement: '',
      alternativeA: '',
      alternativeB: '',
      alternativeC: '',
      alternativeD: '',
      alternativeE: '',
      correctAlternative: 'A',
      difficulty: 'Fácil',
      status: 'rascunho',
      subjectId: undefined,
      subtopicId: undefined,
      subjectName: undefined,
    });
    setErrors({});
    clearError();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Cadastrar Nova Questão
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {errors.alternatives && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.alternatives}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {/* Enunciado */}
          <TextField
            fullWidth
            label="Enunciado da Questão"
            multiline
            rows={4}
            value={formData.statement}
            onChange={(e) => handleInputChange('statement', e.target.value)}
            error={!!errors.statement}
            helperText={errors.statement || `${formData.statement.length}/20 caracteres mínimos`}
            sx={{ mb: 3 }}
            required
          />

          {/* Alternativas */}
          <Typography variant="h6" gutterBottom>
            Alternativas
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            {['A', 'B', 'C', 'D', 'E'].map((letter) => (
              <TextField
                key={letter}
                fullWidth
                label={`Alternativa ${letter}`}
                value={formData[`alternative${letter}` as keyof typeof formData]}
                onChange={(e) => handleInputChange(`alternative${letter}`, e.target.value)}
                error={!!errors[`alternative${letter}`]}
                helperText={errors[`alternative${letter}`]}
                required
              />
            ))}
          </Box>

          {/* Alternativa Correta */}
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">Alternativa Correta *</FormLabel>
            <RadioGroup
              row
              value={formData.correctAlternative}
              onChange={(e) => handleInputChange('correctAlternative', e.target.value)}
            >
              {['A', 'B', 'C', 'D', 'E'].map((letter) => (
                <FormControlLabel 
                  key={letter}
                  value={letter} 
                  control={<Radio />} 
                  label={letter} 
                />
              ))}
            </RadioGroup>
          </FormControl>

          {/* Assunto */}
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<Subject />}
              onClick={() => setSubjectSelectorOpen(true)}
              fullWidth
              sx={{ mb: 1, justifyContent: 'flex-start' }}
            >
              {formData.subjectName || getSubjectName(formData.subjectId) || 'Selecionar Assunto'}
            </Button>
            {errors.subjectId && (
              <Typography variant="caption" color="error">
                {errors.subjectId}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            {/* Dificuldade */}
            <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
              <FormControl fullWidth error={!!errors.difficulty}>
                <InputLabel>Dificuldade</InputLabel>
                <Select
                  value={formData.difficulty}
                  label="Dificuldade"
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  required
                >
                  <MenuItem value="Fácil">Fácil</MenuItem>
                  <MenuItem value="Média">Média</MenuItem>
                  <MenuItem value="Difícil">Difícil</MenuItem>
                </Select>
                {errors.difficulty && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.difficulty}
                  </Typography>
                )}
              </FormControl>
            </Box>

            {/* Status */}
            <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <MenuItem value="rascunho">Rascunho</MenuItem>
                  <MenuItem value="aprovado">Aprovado</MenuItem>
                  <MenuItem value="reprovado">Reprovado</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Botões */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            {questionToEdit ? (
              <>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <Add />}
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={resetForm}
                  disabled={loading}
                >
                  Limpar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <Add />}
                  disabled={loading}
                >
                  {loading ? 'Criando...' : 'Criar Questão'}
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Paper>

      <SubjectSelectorDialog
        open={subjectSelectorOpen}
        onClose={() => setSubjectSelectorOpen(false)}
        onSelect={handleSubjectSelect}
        selectedSubjectId={formData.subjectId}
        selectedSubtopicId={formData.subtopicId}
      />
    </Box>
  );
}