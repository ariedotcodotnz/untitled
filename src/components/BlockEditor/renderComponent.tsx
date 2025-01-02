import React, { useCallback } from 'react';
import type { Block } from '../../types';

interface RenderPageProps {
    blocks: Block[];
    selectedBlockId: string | null;
    onBlockSelect: (id: string) => void;
    onBlockUpdate: (id: string, updates: Partial<Block>) => void;
}

interface ComponentFactoryProps {
    type: string;
    props: any;
    text?: string;
    content: any[];
    style?: React.CSSProperties;
    editable?: boolean;
    blockId?: string;
}

interface CommonProps {
    style?: React.CSSProperties;
    contentEditable?: boolean;
    onClick: (e: React.MouseEvent) => void;
    className: string;
    onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
    suppressContentEditableWarning?: boolean;
}

const RenderPage: React.FC<RenderPageProps> = ({
                                                   blocks,
                                                   selectedBlockId,
                                                   onBlockSelect,
                                                   onBlockUpdate
                                               }) => {
    const componentFactory = useCallback((
        { type, props, text, content, style, editable, blockId }: ComponentFactoryProps
    ): React.ReactElement => {
        const commonProps: CommonProps = {
            style,
            contentEditable: editable,
            onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                if (blockId) onBlockSelect(blockId);
            },
            className: `${props.className || ''} ${
                blockId && selectedBlockId === blockId ? 'ring-2 ring-blue-500' : ''
            }`,
        };

        if (editable) {
            commonProps.onBlur = (e: React.FocusEvent<HTMLElement>) => {
                if (blockId) {
                    onBlockUpdate(blockId, { text: e.target.textContent || '' });
                }
            };
            commonProps.suppressContentEditableWarning = true;
        }

        return React.createElement(
            type,
            { ...props, ...commonProps },
            text,
            ...(Array.isArray(content) ? content : []).map((child: any) =>
                componentFactory({
                    type: child.type,
                    props: { ...child.props, className: child.className },
                    text: child.text,
                    content: child.content || [],
                    style: child.style,
                    editable: child.editable,
                    blockId: child.id
                })
            )
        );
    }, [selectedBlockId, onBlockSelect, onBlockUpdate]);

    return (
        <div className="w-full bg-white p-4">
            {blocks.map((block) =>
                componentFactory({
                    type: block.type === 'text' ? 'div' : block.type,
                    props: {
                        key: block.id,
                        id: block.id,
                        className: block.className || ''
                    },
                    text: block.text,
                    content: Array.isArray(block.content) ? block.content : [],
                    style: block.settings?.style,
                    editable: block.editable,
                    blockId: block.id
                })
            )}
        </div>
    );
};

export default RenderPage;