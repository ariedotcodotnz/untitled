// src/components/integration/EditorProvider.tsx
import React, { useState, useCallback } from 'react';
import { EditorContext } from './EditorContext';
import { useHistory } from './hooks/useHistory';
import { usePersistence } from './hooks/usePersistence';
import type { Block, Page, Site, Theme } from '../../types';
import type { EditorContextType } from './types';

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentPage, setCurrentPage] = useState<Page | null>(null);
    const [site, setSite] = useState<Site | null>(null);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const history = useHistory();
    const persistence = usePersistence();

    const updateBlocks = useCallback((newBlocks: Block[]) => {
        history.push(newBlocks);
        setBlocks(newBlocks);
        persistence.save(newBlocks);
        setHasUnsavedChanges(true);
    }, [history, persistence]);

    const value: EditorContextType = {
        currentPage,
        site,
        blocks,
        selectedBlockId,
        isDragging,
        isPreviewMode,
        hasUnsavedChanges,

        setCurrentPage,
        updatePage: () => {},  // Implement these methods
        createPage: () => {},  // as needed
        deletePage: () => {},
        updateBlocks,
        updateBlock: () => {},
        addBlock: () => {},
        removeBlock: () => {},
        moveBlock: () => {},
        selectBlock: setSelectedBlockId,
        updateSite: () => {},
        updateTheme: () => {},
        publishSite: async () => {},
        undo: history.undo,
        redo: history.redo,
        canUndo: history.canUndo,
        canRedo: history.canRedo,
        setDragging,
        togglePreviewMode: () => setIsPreviewMode(prev => !prev)
    };

    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
};