// themeSystem.ts
import { createContext, useContext, useState, useEffect } from 'react';

export interface Theme {
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: {
            primary: string;
            secondary: string;
            accent: string;
        };
        text: {
            primary: string;
            secondary: string;
            accent: string;
            inverse: string;
        };
        border: string;
        error: string;
        success: string;
        warning: string;
    };
    typography: {
        fontFamily: {
            heading: string;
            body: string;
            mono: string;
        };
        fontSize: {
            xs: string;
            sm: string;
            base: string;
            lg: string;
            xl: string;
            '2xl': string;
            '3xl': string;
            '4xl': string;
        };
        fontWeight: {
            normal: string;
            medium: string;
            semibold: string;
            bold: string;
        };
        lineHeight: {
            none: string;
            tight: string;
            normal: string;
            relaxed: string;
        };
        letterSpacing: {
            tight: string;
            normal: string;
            wide: string;
        };
    };
    spacing: {
        unit: number;
        scale: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
        };
        container: {
            padding: string;
            maxWidth: string;
        };
    };
    breakpoints: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
    };
    borderRadius: {
        none: string;
        sm: string;
        md: string;
        lg: string;
        full: string;
    };
    shadows: {
        none: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    transitions: {
        fast: string;
        normal: string;
        slow: string;
    };
    zIndex: {
        dropdown: number;
        sticky: number;
        fixed: number;
        modal: number;
        popover: number;
    };
}

export const defaultTheme: Theme = {
    colors: {
        primary: '#3B82F6',
        secondary: '#6B7280',
        accent: '#10B981',
        background: {
            primary: '#FFFFFF',
            secondary: '#F3F4F6',
            accent: '#F0FDF4'
        },
        text: {
            primary: '#1F2937',
            secondary: '#4B5563',
            accent: '#059669',
            inverse: '#FFFFFF'
        },
        border: '#E5E7EB',
        error: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B'
    },
    typography: {
        fontFamily: {
            heading: 'Inter, system-ui, sans-serif',
            body: 'Inter, system-ui, sans-serif',
            mono: 'ui-monospace, SFMono-Regular, Menlo, monospace'
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem'
        },
        fontWeight: {
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700'
        },
        lineHeight: {
            none: '1',
            tight: '1.25',
            normal: '1.5',
            relaxed: '1.75'
        },
        letterSpacing: {
            tight: '-0.025em',
            normal: '0',
            wide: '0.025em'
        }
    },
    spacing: {
        unit: 4,
        scale: {
            xs: '0.5rem',
            sm: '1rem',
            md: '1.5rem',
            lg: '2rem',
            xl: '3rem'
        },
        container: {
            padding: '1rem',
            maxWidth: '1280px'
        }
    },
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
    },
    borderRadius: {
        none: '0',
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        full: '9999px'
    },
    shadows: {
        none: 'none',
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
    },
    transitions: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms'
    },
    zIndex: {
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modal: 1040,
        popover: 1050
    }
};

const ThemeContext = createContext<{
    theme: Theme;
    setTheme: (theme: Theme) => void;
}>({
    theme: defaultTheme,
    setTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{
    children: React.ReactNode;
    initialTheme?: Theme;
}> = ({ children, initialTheme = defaultTheme }) => {
    const [theme, setTheme] = useState<Theme>(initialTheme);

    // Generate CSS variables from theme
    useEffect(() => {
        const root = document.documentElement;
        const variables = generateCssVariables(theme);
        Object.entries(variables).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
    {children}
    </ThemeContext.Provider>
);
};

const generateCssVariables = (theme: Theme): Record<string, string> => {
    const variables: Record<string, string> = {};

    const flatten = (obj: Record<string, unknown>, prefix = ''): Record<string, string> => {
        const variables: Record<string, string> = {};

        Object.entries(obj).forEach(([key, value]) => {
            const stringKey = String(key);
            const newKey = prefix + kebabCase(stringKey);
            if (value !== null && typeof value === 'object') {
                Object.assign(variables, flatten(value as Record<string, unknown>, newKey + '-'));
            } else {
                variables[newKey] = String(value);
            }
        });

        return variables;
    };

    Object.assign(variables, flatten(theme));
    return variables;
};