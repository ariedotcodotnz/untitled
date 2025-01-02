// src/components/integration/hooks/useEditor.ts
import { useCallback } from 'react';
import { useEditorContext } from '../EditorContext';

export const useEditor = () => {
    const context = useEditorContext();

    const handleBlockUpdate = useCallback((blockId: string, updates: any) => {
        context.updateBlock(blockId, updates);
    }, [context]);

    const handleBlockSelect = useCallback((blockId: string) => {
        context.selectBlock(blockId);
    }, [context]);

    return {
        ...context,
        handleBlockUpdate,
        handleBlockSelect
    };
};