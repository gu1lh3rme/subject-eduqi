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
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import { 
  Add, 
  Edit, 
  Delete, 
  FolderOpen, 
  Article,
  CreateNewFolder 
} from '@mui/icons-material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { useSubjects } from '@/hooks/useSubjects';
import { useSubtopics } from '@/hooks/useSubtopics';
import { CreateSubjectRequest, UpdateSubjectRequest, CreateSubtopicRequest, UpdateSubtopicRequest, TreeNode } from '@/types';

export default function SubjectsManagerTree() {
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
    createNewSubtopic,
    updateExistingSubtopic,
    deleteExistingSubtopic,
    selectSubtopic,
    clearSelection: clearSubtopicSelection,
    clearSubtopicError,
    getSubtopicsForSubject,
  } = useSubtopics();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentNodeType, setCurrentNodeType] = useState<'subject' | 'subtopic'>('subject');
  const [parentNode, setParentNode] = useState<{ id: string; type: 'subject' | 'subtopic' } | null>(null);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
  });

  const loading = subjectLoading || subtopicLoading;
  const error = subjectError || subtopicError;

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  useEffect(() => {
    buildTreeData();
  }, [subjects]);

  const buildTreeData = () => {
    const tree: TreeNode[] = subjects.map(subject => ({
      id: subject.id,
      name: subject.name,
      type: 'subject' as const,
      children: buildSubtopicTreeFromNested(subject.subtopics || []),
    }));
    setTreeData(tree);
  };

  const buildSubtopicTreeFromNested = (subtopics: any[]): TreeNode[] => {
    return subtopics.map(subtopic => ({
      id: subtopic.id,
      name: subtopic.name,
      type: 'subtopic' as const,
      subjectId: subtopic.subjectId,
      parentId: subtopic.parentId,
      children: buildSubtopicTreeFromNested(subtopic.subtopics || []),
    }));
  };

  const reloadAllData = async () => {
    await loadSubjects();
  };

  const buildSubtopicTree = (subjectId: string, parentId: string | null): TreeNode[] => {
    const subtopics = getSubtopicsForSubject(subjectId).filter(
      subtopic => (subtopic.parentId || null) === parentId
    );

    return subtopics.map(subtopic => ({
      id: subtopic.id,
      name: subtopic.name,
      type: 'subtopic' as const,
      subjectId: subjectId,
      parentId: subtopic.parentId,
      children: buildSubtopicTree(subjectId, subtopic.id),
    }));
  };

  const findSubtopicInTree = (subtopics: any[], targetId: string): any => {
    for (const subtopic of subtopics) {
      if (subtopic.id === targetId) {
        return subtopic;
      }
      if (subtopic.subtopics && subtopic.subtopics.length > 0) {
        const found = findSubtopicInTree(subtopic.subtopics, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const getSubjectIdForSubtopic = (parentNode: { id: string; type: 'subject' | 'subtopic' }): string => {
    if (parentNode.type === 'subject') {
      return parentNode.id;
    } else {
      // Se o parent é um subtópico, precisamos encontrar o subject pai
      for (const subject of subjects) {
        const foundSubtopic = findSubtopicInTree(subject.subtopics || [], parentNode.id);
        if (foundSubtopic) {
          return subject.id;
        }
      }
      return '';
    }
  };

  const handleAddChild = (nodeId: string, nodeType: 'subject' | 'subtopic') => {
    setCurrentNodeType('subtopic');
    if (nodeType === 'subject') {
      setParentNode({ id: nodeId.replace('subject-', ''), type: 'subject' });
    } else {
      setParentNode({ id: nodeId.replace('subtopic-', ''), type: 'subtopic' });
    }
    setEditMode(false);
    setFormData({ name: '' });
    setDialogOpen(true);
  };

  const handleEditNode = (nodeId: string, nodeType: 'subject' | 'subtopic') => {
    setCurrentNodeType(nodeType);
    setEditMode(true);
    
    const id = nodeId.replace(`${nodeType}-`, '');
    
    if (nodeType === 'subject') {
      const subject = subjects.find(s => s.id === id);
      if (subject) {
        selectSubject(subject);
        setFormData({ name: subject.name });
      }
    } else {
      // Buscar o subtópico na estrutura aninhada para edição
      let foundSubtopic = null;
      for (const subject of subjects) {
        foundSubtopic = findSubtopicInTree(subject.subtopics || [], id);
        if (foundSubtopic) {
          selectSubtopic(foundSubtopic);
          setFormData({ name: foundSubtopic.name });
          break;
        }
      }
    }
    
    setDialogOpen(true);
  };

  const handleDeleteNode = async (nodeId: string, nodeType: 'subject' | 'subtopic') => {
    if (window.confirm(`Tem certeza que deseja excluir este ${nodeType === 'subject' ? 'assunto' : 'subtópico'}?`)) {
      try {
        const id = nodeId.replace(`${nodeType}-`, '');
        if (nodeType === 'subject') {
          await deleteExistingSubject(id);
        } else {
          await deleteExistingSubtopic(id);
        }
        
        // Recarregar dados para atualizar a árvore
        await reloadAllData();
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const handleDragStart = (event: React.DragEvent, nodeId: string) => {
    if (!nodeId.startsWith('subtopic-')) return; // Só permite arrastar subtópicos
    setDraggedNodeId(nodeId);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (event: React.DragEvent, targetNodeId: string) => {
    event.preventDefault();
    
    if (!draggedNodeId || draggedNodeId === targetNodeId) {
      setDraggedNodeId(null);
      return;
    }

    console.log('Move:', draggedNodeId, '→', targetNodeId);
    
    // Aqui você implementaria a lógica de mover no backend
    // Por exemplo: await subtopicApi.move(draggedId, targetId);
    
    setDraggedNodeId(null);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      console.warn('⚠️ Form data name is empty');
      return;
    }

    try {
      if (currentNodeType === 'subject') {
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
      } else if (currentNodeType === 'subtopic') {
        if (editMode && selectedSubtopic) {
          const updateData: UpdateSubtopicRequest = {
            name: formData.name,
            subjectId: selectedSubtopic.subjectId, // Sempre manter o subjectId original
            parentId: selectedSubtopic.parentId,
          };
          await updateExistingSubtopic({ id: selectedSubtopic.id, ...updateData });
        } else if (parentNode) {
          const subjectId = getSubjectIdForSubtopic(parentNode);
          
          const createData: CreateSubtopicRequest = {
            name: formData.name,
            subjectId: subjectId,
            parentId: parentNode.type === 'subtopic' ? parentNode.id : undefined,
          };
          await createNewSubtopic(createData);
        }
      }
      
      await reloadAllData();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleOpenDialog = (type: 'subject' | 'subtopic') => {
    setCurrentNodeType(type);
    setEditMode(false);
    setParentNode(null);
    setFormData({ name: '' });
    clearSelection();
    clearSubtopicSelection();
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditMode(false);
    setCurrentNodeType('subject');
    setParentNode(null);
    setFormData({ name: '' });
    clearSelection();
    clearSubtopicSelection();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const clearErrors = () => {
    if (subjectError) clearSubjectError();
    if (subtopicError) clearSubtopicError();
  };

  const renderTreeNode = (node: TreeNode): React.ReactNode => (
    <TreeItem
      key={`${node.type}-${node.id}`}
      itemId={`${node.type}-${node.id}`}
      label={
        <Box
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 0.5, 
            pr: 0,
            cursor: 'pointer',
            '&:hover': { 
              backgroundColor: 'action.hover',
              '& .action-buttons': { visibility: 'visible' }
            }
          }}
          draggable={node.type === 'subtopic'}
          onDragStart={(e) => handleDragStart(e, `${node.type}-${node.id}`)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, `${node.type}-${node.id}`)}
        >
          <Box sx={{ mr: 1 }}>
            {node.type === 'subject' ? <FolderOpen color="primary" /> : <Article color="action" />}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: node.type === 'subject' ? 'bold' : 'normal' }}>
              {node.name}
            </Typography>
          </Box>
          <Box 
            className="action-buttons"
            sx={{ 
              display: 'flex', 
              gap: 0.5, 
              visibility: 'hidden',
              '& .MuiIconButton': {
                padding: '4px',
                fontSize: '0.875rem'
              }
            }}
          >
            <Box
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 24, 
                height: 24, 
                borderRadius: 0.5,
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'action.selected' }
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleAddChild(`${node.type}-${node.id}`, node.type);
              }}
              title="Adicionar Subtópico"
            >
              <CreateNewFolder fontSize="small" color="action" />
            </Box>
            <Box
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 24, 
                height: 24, 
                borderRadius: 0.5,
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'action.selected' }
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleEditNode(`${node.type}-${node.id}`, node.type);
              }}
              title="Editar"
            >
              <Edit fontSize="small" color="action" />
            </Box>
            <Box
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 24, 
                height: 24, 
                borderRadius: 0.5,
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'error.light', color: 'error.main' }
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteNode(`${node.type}-${node.id}`, node.type);
              }}
              title="Excluir"
            >
              <Delete fontSize="small" color="action" />
            </Box>
          </Box>
        </Box>
      }
    >
      {node.children?.map(child => renderTreeNode(child))}
    </TreeItem>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" component="h6">
          Gerenciar Assuntos e Subtópicos
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog('subject')}
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
        <Paper sx={{ p: 2, height: '600px', overflow: 'auto' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Estrutura Hierárquica
            <Typography variant="caption" display="block" color="text.secondary">
              Passe o mouse sobre os itens para ver as ações • Arraste subtópicos para reorganizar
            </Typography>
          </Typography>
          
          {treeData.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                Nenhum assunto criado. Clique em "Novo Assunto" para começar.
              </Typography>
            </Box>
          ) : (
            <SimpleTreeView
              expandedItems={expandedNodes}
              selectedItems={selectedNodeId}
              onExpandedItemsChange={(event: any, nodeIds: any) => setExpandedNodes(nodeIds)}
              onSelectedItemsChange={(event: any, nodeId: any) => setSelectedNodeId(nodeId as string)}
              sx={{ flexGrow: 1, overflowY: 'auto' }}
            >
              {treeData.map(node => renderTreeNode(node))}
            </SimpleTreeView>
          )}
        </Paper>
      )}

      {/* Dialog para criar/editar */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode 
            ? `Editar ${currentNodeType === 'subject' ? 'Assunto' : 'Subtópico'}` 
            : `Novo ${currentNodeType === 'subject' ? 'Assunto' : 'Subtópico'}`
          }
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              label={`Nome do ${currentNodeType === 'subject' ? 'Assunto' : 'Subtópico'}`}
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
    </Box>
  );
}