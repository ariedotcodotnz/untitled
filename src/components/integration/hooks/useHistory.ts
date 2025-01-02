import { useState, useCallback } from 'react';
import type { Block } from '../../../types';

export const useHistory = () => {
    const [past, setPast] = useState<Block[][]>([]);
    const [future, setFuture] = useState<Block[][]>([]);

    const push = useCallback((blocks: Block[]) => {
        setPast(prev => [...prev, blocks]);
        setFuture([]);
    }, []);

    const undo = useCallback(() => {
        if (past.length === 0) return null;

        const previous = past[past.length - 1];
        setPast(prev => prev.slice(0, -1));
        return previous;
    }, [past]);

    const redo = useCallback(() => {
        if (future.length === 0) return null;

        const next = future[0];
        setFuture(prev => prev.slice(1));
        return next;
    }, [future]);

    return {
        push,
        undo,
        redo,
        canUndo: past.length > 0,
        canRedo: future.length > 0
    };
};
