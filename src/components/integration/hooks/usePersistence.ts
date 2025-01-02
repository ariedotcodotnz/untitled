import type { Block } from '../../../types';

export const usePersistence = () => {
    const save = async (blocks: Block[]) => {
        try {
            localStorage.setItem('editor-blocks', JSON.stringify(blocks));
        } catch (error) {
            console.error('Failed to save blocks:', error);
        }
    };

    const load = async () => {
        try {
            const saved = localStorage.getItem('editor-blocks');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Failed to load blocks:', error);
            return [];
        }
    };

    return { save, load };
};