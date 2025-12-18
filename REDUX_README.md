# Redux Integration for Subject-EduQi

## Visão Geral

Este projeto agora possui integração completa com Redux para gerenciar **Subjects** (Assuntos) e **Subtopics** (Subtópicos) conectados à API backend em `http://localhost:8080`.

## Estrutura Implementada

### 📁 Arquivos Criados

- **Types**: `/types/index.ts` - Tipos TypeScript para Subject e Subtopic
- **API**: `/lib/api.ts` - Configuração do Axios com interceptors
- **Services**: 
  - `/services/subjectService.ts` - Operações CRUD para subjects
  - `/services/subtopicService.ts` - Operações CRUD para subtopics
- **Redux Store**:
  - `/store/index.ts` - Configuração da store
  - `/store/slices/subjectSlice.ts` - Slice para subjects
  - `/store/slices/subtopicSlice.ts` - Slice para subtopics
- **Hooks**:
  - `/hooks/useSubjects.ts` - Hook personalizado para subjects
  - `/hooks/useSubtopics.ts` - Hook personalizado para subtopics
- **Components**:
  - `/components/ReduxProvider.tsx` - Provider do Redux
  - `/components/SubjectsManager.tsx` - Interface para gerenciar subjects
  - `/components/SubtopicsManager.tsx` - Interface para gerenciar subtopics

### 🔧 Dependências Instaladas

```bash
npm install @reduxjs/toolkit react-redux axios
```

## Funcionalidades CRUD

### Subjects (Assuntos)

- ✅ **Create**: Criar novos assuntos
- ✅ **Read**: Listar todos os assuntos / Buscar por ID
- ✅ **Update**: Editar assuntos existentes
- ✅ **Delete**: Remover assuntos

### Subtopics (Subtópicos)

- ✅ **Create**: Criar novos subtópicos
- ✅ **Read**: Listar todos os subtópicos / Buscar por subject / Buscar por ID
- ✅ **Update**: Editar subtópicos existentes
- ✅ **Delete**: Remover subtópicos

## Como Usar

### 1. Usar o Hook de Subjects

```tsx
import { useSubjects } from '@/hooks/useSubjects';

function MyComponent() {
  const {
    subjects,
    selectedSubject,
    loading,
    error,
    loadSubjects,
    createNewSubject,
    updateExistingSubject,
    deleteExistingSubject,
  } = useSubjects();

  // Carregar subjects
  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  // Criar subject
  const handleCreate = async () => {
    await createNewSubject({
      name: "Novo Assunto",
      description: "Descrição do assunto"
    });
  };
}
```

### 2. Usar o Hook de Subtopics

```tsx
import { useSubtopics } from '@/hooks/useSubtopics';

function MyComponent() {
  const {
    subtopics,
    loading,
    error,
    loadSubtopicsBySubjectId,
    createNewSubtopic,
    getSubtopicsForSubject,
  } = useSubtopics();

  // Carregar subtopics de um subject específico
  useEffect(() => {
    loadSubtopicsBySubjectId(1);
  }, [loadSubtopicsBySubjectId]);

  // Criar subtopic
  const handleCreate = async () => {
    await createNewSubtopic({
      name: "Novo Subtópico",
      description: "Descrição do subtópico",
      subjectId: 1
    });
  };
}
```

### 3. Usar Diretamente o Redux Store

```tsx
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchSubjects } from '@/store/slices/subjectSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const { subjects, loading } = useAppSelector(state => state.subjects);

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);
}
```

## API Endpoints Esperados

O Redux está configurado para trabalhar com os seguintes endpoints:

### Subjects
- `GET /subjects` - Listar todos
- `GET /subjects/:id` - Buscar por ID
- `POST /subjects` - Criar novo
- `PUT /subjects/:id` - Atualizar
- `DELETE /subjects/:id` - Deletar

### Subtopics
- `GET /subtopics` - Listar todos
- `GET /subjects/:subjectId/subtopics` - Listar por subject
- `GET /subtopics/:id` - Buscar por ID
- `POST /subtopics` - Criar novo
- `PUT /subtopics/:id` - Atualizar
- `DELETE /subtopics/:id` - Deletar

## Estrutura de Resposta da API

```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
```

## Páginas Atualizadas

- **`/assunto`**: Agora usa o `SubjectsManager` para gerenciar assuntos
- **`/questoes`**: Agora usa o `SubtopicsManager` para gerenciar subtópicos

## Estado Global

O Redux mantém:
- Lista de subjects
- Subject selecionado
- Lista de subtopics (geral e por subject)
- Subtopic selecionado
- Estados de loading e erro
- Cache de subtopics por subject

## Tratamento de Erros

- Interceptors do Axios para tratamento global
- Estados de erro específicos por slice
- Funções para limpar erros
- Feedback visual nos componentes

## Próximos Passos

1. Configurar autenticação JWT (se necessário)
2. Implementar cache persistente (Redux Persist)
3. Adicionar testes unitários
4. Implementar paginação nas listagens
5. Adicionar validações de formulário mais robustas