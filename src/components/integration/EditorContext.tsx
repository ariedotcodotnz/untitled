// src/components/integration/EditorContext.tsx
import { createContext, useContext } from 'react';
import type { EditorContextType } from './types';

export const EditorContext = createContext<EditorContextType | null>(null);

export const useEditorContext = () => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditorContext must be used within an EditorProvider');
    }
    return context;
};