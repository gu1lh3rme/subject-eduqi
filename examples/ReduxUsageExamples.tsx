// Exemplo de uso do Redux para Subjects e Subtopics

import { useEffect } from 'react';
import { useSubjects } from '@/hooks/useSubjects';
import { useSubtopics } from '@/hooks/useSubtopics';

// 1. EXEMPLO: Carregar e exibir todos os subjects
function SubjectsList() {
  const { subjects, loading, error, loadSubjects } = useSubjects();

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <ul>
      {subjects.map(subject => (
        <li key={subject.id}>{subject.name}</li>
      ))}
    </ul>
  );
}

function CreateSubjectForm() {
  const { createNewSubject, loading } = useSubjects();

  const handleSubmit = async (formData: any) => {
    try {
      await createNewSubject({
        name: formData.name
      });
      console.log('Subject criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar subject:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Seus campos de formulário aqui */}
    </form>
  );
}

function SubtopicsBySubject({ subjectId }: { subjectId: string }) {
  const { 
    loadSubtopicsBySubjectId, 
    getSubtopicsForSubject, 
    loading 
  } = useSubtopics();

  const subtopics = getSubtopicsForSubject(subjectId);

  useEffect(() => {
    loadSubtopicsBySubjectId(subjectId);
  }, [loadSubtopicsBySubjectId, subjectId]);

  if (loading) return <div>Carregando subtópicos...</div>;

  return (
    <div>
      <h3>Subtópicos:</h3>
      <ul>
        {subtopics.map(subtopic => (
          <li key={subtopic.id}>
            {subtopic.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

// 4. EXEMPLO: CRUD completo usando Redux store diretamente
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  fetchSubjects, 
  createSubject, 
  updateSubject, 
  deleteSubject 
} from '@/store/slices/subjectSlice';

function AdvancedSubjectManager() {
  const dispatch = useAppDispatch();
  const { subjects, loading, error, selectedSubject } = useAppSelector(
    state => state.subjects
  );

  // Carregar todos os subjects
  const handleLoadSubjects = () => {
    dispatch(fetchSubjects());
  };

  // Criar novo subject
  const handleCreateSubject = async () => {
    const result = await dispatch(createSubject({
      name: "Novo Subject"
    }));
    
    if (createSubject.fulfilled.match(result)) {
      console.log('Subject criado:', result.payload);
    }
  };

  const handleUpdateSubject = async (id: string) => {
    const result = await dispatch(updateSubject({
      id,
      name: "Subject Atualizado"
    }));
    
    if (updateSubject.fulfilled.match(result)) {
      console.log('Subject atualizado:', result.payload);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    const result = await dispatch(deleteSubject(id));
    
    if (deleteSubject.fulfilled.match(result)) {
      console.log('Subject deletado com ID:', result.payload);
    }
  };

  return (
    <div>
      <button onClick={handleLoadSubjects}>Carregar Subjects</button>
      <button onClick={handleCreateSubject}>Criar Subject</button>
      
      {subjects.map(subject => (
        <div key={subject.id}>
          <h3>{subject.name}</h3>
          <button onClick={() => handleUpdateSubject(subject.id)}>
            Editar
          </button>
          <button onClick={() => handleDeleteSubject(subject.id)}>
            Deletar
          </button>
        </div>
      ))}
    </div>
  );
}

function SubjectsWithErrorHandling() {
  const { 
    subjects, 
    loading, 
    error, 
    loadSubjects, 
    clearSubjectError 
  } = useSubjects();

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  // Limpar erro após 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearSubjectError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearSubjectError]);

  return (
    <div>
      {loading && <div>Carregando subjects...</div>}
      {error && (
        <div style={{ color: 'red' }}>
          Erro: {error}
          <button onClick={clearSubjectError}>Fechar</button>
        </div>
      )}
      
      <div>
        {subjects.map(subject => (
          <div key={subject.id}>
            <h3>{subject.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export {
  SubjectsList,
  CreateSubjectForm,
  SubtopicsBySubject,
  AdvancedSubjectManager,
  SubjectsWithErrorHandling
};