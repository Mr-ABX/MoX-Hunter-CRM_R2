import React, { createContext, useContext, useState } from 'react';

export type ModelId = 
  | 'gemini-3.1-pro-preview'
  | 'gemini-3.1-flash-preview'
  | 'gemini-3-pro-preview'
  | 'gemini-3-flash-preview'
  | 'gemini-2.5-pro'
  | 'gemini-2.5-flash';

export type ModelConfig = {
  chat: ModelId;
  fast: ModelId;
};

export const DEFAULT_MODELS: ModelConfig = {
  chat: 'gemini-3.1-pro-preview',
  fast: 'gemini-3-flash-preview',
};

export const AVAILABLE_MODELS: { id: ModelId; name: string; type: 'pro' | 'flash' }[] = [
  { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro', type: 'pro' },
  { id: 'gemini-3.1-flash-preview', name: 'Gemini 3.1 Flash', type: 'flash' },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3.0 Pro', type: 'pro' },
  { id: 'gemini-3-flash-preview', name: 'Gemini 3.0 Flash', type: 'flash' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', type: 'pro' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', type: 'flash' },
];

type ModelContextType = {
  models: ModelConfig;
  setModel: (type: keyof ModelConfig, model: ModelId) => void;
  resetToRecommended: () => void;
};

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export const ModelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [models, setModels] = useState<ModelConfig>(DEFAULT_MODELS);

  const setModel = (type: keyof ModelConfig, model: ModelId) => {
    setModels(prev => ({ ...prev, [type]: model }));
  };

  const resetToRecommended = () => {
    setModels(DEFAULT_MODELS);
  };

  return (
    <ModelContext.Provider value={{ models, setModel, resetToRecommended }}>
      {children}
    </ModelContext.Provider>
  );
};

export const useModels = () => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error('useModels must be used within a ModelProvider');
  }
  return context;
};
