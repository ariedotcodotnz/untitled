import React, { useMemo } from 'react';
import { Search, Layout, Type, Image, Video, Code, Grid, Box, FileText, Columns, Globe } from 'lucide-react';
import { blockTemplates } from './BlockEditor/blockTemplates';
import { blockCombinations } from './BlockEditor/blockCombination';
import type { BlockCombination } from './BlockEditor/blockCombination';

interface BlockLibraryProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onBlockSelect: (templateId: string) => void;
    onCombinationSelect: (combinationId: string) => void;
}

// Icon mapping for block types
const blockIcons: Record<string, React.ReactNode> = {
    'text': <Type className="w-5 h-5" />,
    'image': <Image className="w-5 h-5" />,
    'video': <Video className="w-5 h-5" />,
    'columns': <Columns className="w-5 h-5" />,
    'grid': <Grid className="w-5 h-5" />,
    'embed': <Globe className="w-5 h-5" />,
    'html': <Code className="w-5 h-5" />,
    'layout': <Layout className="w-5 h-5" />,
    'basic': <Box className="w-5 h-5" />,
    'advanced': <FileText className="w-5 h-5" />
};

export const BlockLibrary: React.FC<BlockLibraryProps> = ({
                                                              searchTerm,
                                                              onSearchChange,
                                                              onBlockSelect,
                                                              onCombinationSelect
                                                          }) => {
    const filteredContent = useMemo(() => {
        const term = searchTerm.toLowerCase();

        if (term.includes('template')) {
            return blockTemplates.filter(template =>
                template.name.toLowerCase().includes(term) ||
                template.description.toLowerCase().includes(term)
            ).reduce((acc, template) => {
                const category = acc[template.category] || [];
                return {
                    ...acc,
                    [template.category]: [...category, template]
                };
            }, {} as Record<string, typeof blockTemplates>);
        } else {
            return blockCombinations.filter((combination: BlockCombination) =>
                combination.name.toLowerCase().includes(term) ||
                combination.description.toLowerCase().includes(term)
            ).reduce((acc: Record<string, BlockCombination[]>, combination: BlockCombination) => {
                const category = acc[combination.category] || [];
                return {
                    ...acc,
                    [combination.category]: [...category, combination]
                };
            }, {});
        }
    }, [searchTerm]);

    return (
        <div className="flex flex-col h-full">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search blocks..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Blocks List */}
            <div className="flex-1 overflow-auto p-4">
                <div className="space-y-6">
                    {Object.entries(filteredContent).map(([category, items]) => (
                        <div key={category} className="space-y-3">
                            <h3 className="text-sm font-medium text-gray-900 capitalize flex items-center">
                                {blockIcons[category.toLowerCase()] && (
                                    <span className="mr-2 text-gray-500">
                                        {blockIcons[category.toLowerCase()]}
                                    </span>
                                )}
                                {category}
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {'url' in items[0] ?
                                    (items as BlockCombination[]).map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => onCombinationSelect(item.id)}
                                            className="group relative flex flex-col p-4 text-left border rounded-lg hover:bg-gray-50 transition-all duration-200"
                                        >
                                            <span className="font-medium text-sm mb-1">{item.name}</span>
                                            <span className="text-xs text-gray-500 line-clamp-2">{item.description}</span>
                                            <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-200" />
                                        </button>
                                    ))
                                    :
                                    (items as typeof blockTemplates).map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => onBlockSelect(item.id)}
                                            className="group relative flex flex-col p-4 text-left border rounded-lg hover:bg-gray-50 transition-all duration-200"
                                        >
                                            <div className="flex items-center mb-2">
                                                {blockIcons[item.icon] && (
                                                    <span className="text-gray-400 group-hover:text-blue-500 transition-colors duration-200">
                                                        {blockIcons[item.icon]}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="font-medium text-sm mb-1">{item.name}</span>
                                            <span className="text-xs text-gray-500 line-clamp-2">{item.description}</span>
                                            <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-200" />
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};