'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Save, ArrowLeft, Edit, X } from 'lucide-react';
import Link from 'next/link';

interface Topic {
  question: string;
  answer: string;
  keywords: string[];
}

interface Category {
  name: string;
  topics: Topic[];
}

interface KnowledgeBase {
  categories: Category[];
}

export default function KnowledgeBasePage() {
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase>({ categories: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [editingTopic, setEditingTopic] = useState<{ categoryIndex: number; topicIndex: number } | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newTopic, setNewTopic] = useState<Partial<Topic>>({ question: '', answer: '', keywords: [] });
  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    fetchKnowledgeBase();
  }, []);

  const fetchKnowledgeBase = async () => {
    try {
      const response = await fetch('/api/admin/chatbot/knowledge');
      const data = await response.json();

      if (data.success) {
        setKnowledgeBase(data.knowledgeBase || { categories: [] });
      }
    } catch (error) {
      console.error('Error fetching knowledge base:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/chatbot/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          knowledgeBase,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Base de conocimiento actualizada correctamente');
      } else {
        alert(`Error al actualizar base de conocimiento: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving knowledge base:', error);
      alert('Error al actualizar base de conocimiento');
    } finally {
      setIsSaving(false);
    }
  };

  const addCategory = () => {
    if (newCategoryName.trim()) {
      setKnowledgeBase(prev => ({
        ...prev,
        categories: [...prev.categories, { name: newCategoryName.trim(), topics: [] }]
      }));
      setNewCategoryName('');
    }
  };

  const deleteCategory = (index: number) => {
    setKnowledgeBase(prev => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== index)
    }));
  };

  const addTopic = (categoryIndex: number) => {
    if (newTopic.question?.trim() && newTopic.answer?.trim()) {
      setKnowledgeBase(prev => ({
        ...prev,
        categories: prev.categories.map((cat, i) => 
          i === categoryIndex 
            ? { ...cat, topics: [...cat.topics, { ...newTopic, keywords: newTopic.keywords || [] } as Topic] }
            : cat
        )
      }));
      setNewTopic({ question: '', answer: '', keywords: [] });
    }
  };

  const deleteTopic = (categoryIndex: number, topicIndex: number) => {
    setKnowledgeBase(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) => 
        i === categoryIndex 
          ? { ...cat, topics: cat.topics.filter((_, j) => j !== topicIndex) }
          : cat
      )
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setNewTopic(prev => ({
        ...prev,
        keywords: [...(prev.keywords || []), newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setNewTopic(prev => ({
      ...prev,
      keywords: prev.keywords?.filter((_, i) => i !== index) || []
    }));
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/chatbot/tickets">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Base de Conocimiento
            </h1>
            <p className="text-gray-500 mt-1">
              Gestiona la información que el chatbot usa para responder
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      {/* Add New Category */}
      <Card>
        <CardHeader>
          <CardTitle>Agregar Nueva Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Nombre de la categoría"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Button onClick={addCategory} disabled={!newCategoryName.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      {knowledgeBase.categories.map((category, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {category.name}
                <Badge variant="secondary">{category.topics.length} temas</Badge>
              </CardTitle>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteCategory(categoryIndex)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add New Topic */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium">Agregar Nuevo Tema</h4>
              <Input
                placeholder="Pregunta"
                value={newTopic.question || ''}
                onChange={(e) => setNewTopic(prev => ({ ...prev, question: e.target.value }))}
              />
              <Textarea
                placeholder="Respuesta"
                value={newTopic.answer || ''}
                onChange={(e) => setNewTopic(prev => ({ ...prev, answer: e.target.value }))}
                rows={3}
              />
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Palabra clave"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                  />
                  <Button onClick={addKeyword} disabled={!newKeyword.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {newTopic.keywords && newTopic.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {newTopic.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {keyword}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeKeyword(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <Button 
                onClick={() => addTopic(categoryIndex)} 
                disabled={!newTopic.question?.trim() || !newTopic.answer?.trim()}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar Tema
              </Button>
            </div>

            {/* Existing Topics */}
            {category.topics.map((topic, topicIndex) => (
              <div key={topicIndex} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-700">{topic.question}</h4>
                    <p className="text-sm text-gray-600 mt-1">{topic.answer}</p>
                    {topic.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {topic.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTopic(categoryIndex, topicIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {knowledgeBase.categories.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No hay categorías. Agrega una nueva categoría para comenzar.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}