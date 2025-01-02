import React, { useState, useCallback, useRef } from 'react';
import type { Block } from '../../types';
import { BLOCK_TYPES } from './blockTypes';
import RenderPage from "./renderComponent";
import { useDrop } from 'react-dnd';

interface EditorPlateProps {
    blocks: Block[];
    onBlocksChange: (blocks: Block[]) => void;
    isDragging: boolean;
    onDraggingChange: (isDragging: boolean) => void;
}

export const EditorPlate: React.FC<EditorPlateProps> = ({
                                                            blocks,
                                                            onBlocksChange,
                                                            isDragging,
                                                            onDraggingChange
                                                        }) => {
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
    const editorRef = useRef<HTMLDivElement>(null);

    // Drop target for drag and drop
    const [, drop] = useDrop(() => ({
        accept: 'BLOCK',
        drop: (item: { type: string }, monitor) => {
            const didDrop = monitor.didDrop();
            if (didDrop) return;

            const clientOffset = monitor.getClientOffset();
            if (clientOffset && editorRef.current) {
                const hoverBoundingRect = editorRef.current.getBoundingClientRect();
                const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
                const hoverClientY = clientOffset.y - hoverBoundingRect.top;

                let insertIndex = hoverClientY > hoverMiddleY ? blocks.length : 0;

                const newBlock: Block = {
                    id: `block-${Date.now()}`,
                    type: item.type as Block['type'],
                    content: [],
                    settings: {
                        width: 'normal',
                        alignment: 'left',
                        padding: 'normal'
                    },
                    className: ''
                };

                const newBlocks = [...blocks];
                newBlocks.splice(insertIndex, 0, newBlock);
                onBlocksChange(newBlocks);
            }
        }
    }), [blocks, onBlocksChange]);

    // Create a callback ref that combines both refs
    const setRefs = useCallback(
        (node: HTMLDivElement | null) => {
            // Handle the ref for react-dnd
            drop(node);
            // Handle the ref for our component
            if (node) {
                // @ts-ignore
                editorRef.current = node;
            }
        },
        [drop]
    );

    return (
        <div
            ref={setRefs}
            className="block-editor editor_box pt-[0.68rem] min-h-screen bg-[rgb(232,234,237)] w-[calc(100%-320px)] mr-auto"
            onDragOver={(e) => e.preventDefault()}
        >
            <div className="editor_block border border-[#DADCE0] min-w-full pb-7 py-3 px-[3.7rem] bg-[#F1F3F4]">
                <div className="main_block min-h-[100vh] shadow-lg bg-white">
                    <RenderPage
                        blocks={blocks}
                        selectedBlockId={selectedBlockId}
                        onBlockSelect={setSelectedBlockId}
                        onBlockUpdate={(id, updates) => {
                            const newBlocks = blocks.map(block =>
                                block.id === id ? { ...block, ...updates } : block
                            );
                            onBlocksChange(newBlocks);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default EditorPlate;