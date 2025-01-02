import type { Block, Page, Theme, Site } from '../../types';

// Editor Context Types
export interface EditorContextType {
    currentPage: Page | null;
    site: Site | null;
    blocks: Block[];
    selectedBlockId: string | null;
    isDragging: boolean;
    isPreviewMode: boolean;
    hasUnsavedChanges: boolean;

    // Page Actions
    setCurrentPage: (page: Page | null) => void;
    updatePage: (pageId: string, updates: Partial<Page>) => void;
    createPage: (page: Partial<Page>) => void;
    deletePage: (pageId: string) => void;

    // Block Actions
    updateBlocks: (blocks: Block[]) => void;
    updateBlock: (blockId: string, updates: Partial<Block>) => void;
    addBlock: (block: Block) => void;
    removeBlock: (blockId: string) => void;
    moveBlock: (blockId: string, toIndex: number) => void;
    selectBlock: (blockId: string | null) => void;

    // Site Actions
    updateSite: (updates: Partial<Site>) => void;
    updateTheme: (theme: Theme) => void;
    publishSite: () => Promise<void>;

    // History
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;

    // UI State
    setDragging: (isDragging: boolean) => void;
    togglePreviewMode: () => void;
}

// History Types
export interface HistoryState {
    past: EditorState[];
    present: EditorState;
    future: EditorState[];
}

export interface EditorState {
    blocks: Block[];
    site: Site | null;
    currentPage: Page | null;
    selectedBlockId: string | null;
}

// Storage Types
export interface StorageProvider {
    save: (key: string, data: any) => Promise<void>;
    load: (key: string) => Promise<any>;
    remove: (key: string) => Promise<void>;
    clear: () => Promise<void>;
}

// Editor Options
export interface EditorOptions {
    autosave?: boolean;
    autosaveInterval?: number;
    maxHistorySize?: number;
    storageKey?: string;
    storageProvider?: StorageProvider;
}

// Block Management Types
export interface BlockOperation {
    type: 'add' | 'update' | 'remove' | 'move';
    blockId?: string;
    data?: any;
    index?: number;
}

export interface BlockUpdateEvent {
    blockId: string;
    updates: Partial<Block>;
    source?: 'user' | 'system' | 'undo' | 'redo';
}

// Editor Events
export type EditorEvent =
    | { type: 'PAGE_CHANGE'; page: Page | null }
    | { type: 'BLOCK_UPDATE'; data: BlockUpdateEvent }
    | { type: 'THEME_CHANGE'; theme: Theme }
    | { type: 'PUBLISH'; success: boolean }
    | { type: 'ERROR'; error: Error };

export interface EditorEventHandler {
    (event: EditorEvent): void;
}

// Selection Types
export interface Selection {
    blockId: string;
    range?: {
        start: number;
        end: number;
    };
}

// Editor Status
export interface EditorStatus {
    initialized: boolean;
    loading: boolean;
    saving: boolean;
    publishing: boolean;
    error: Error | null;
    lastSaved?: Date;
    lastPublished?: Date;
}

// Validation Types
export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}

// Editor State Snapshot
export interface EditorSnapshot {
    timestamp: Date;
    state: EditorState;
    description?: string;
}

// Editor Configuration
export interface EditorConfig {
    features?: {
        history?: boolean;
        preview?: boolean;
        publish?: boolean;
        collaboration?: boolean;
    };
    validation?: {
        enabled: boolean;
        validateOnSave: boolean;
        validateOnPublish: boolean;
    };
    ui?: {
        showToolbar: boolean;
        showSidebar: boolean;
        defaultTab: 'blocks' | 'pages' | 'theme';
    };
    autosave?: {
        enabled: boolean;
        interval: number;
    };
}