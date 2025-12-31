import React, { createContext, useState, useEffect, useContext } from 'react';

interface ApiKeyContextType {
    apiKey: string;
    setApiKey: (key: string) => void;
    hasKey: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType>({ apiKey: '', setApiKey: () => {}, hasKey: false });

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [apiKey, setApiKeyState] = useState('');
    const [hasKey, setHasKey] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('gemini_api_key');
        if (stored) {
            setApiKeyState(stored);
            setHasKey(true);
        }
    }, []);

    const setApiKey = (key: string) => {
        setApiKeyState(key);
        if (key) {
            localStorage.setItem('gemini_api_key', key);
            setHasKey(true);
        } else {
            localStorage.removeItem('gemini_api_key');
            setHasKey(false);
        }
    };

    return (
        <ApiKeyContext.Provider value={{ apiKey, setApiKey, hasKey }}>
            {children}
        </ApiKeyContext.Provider>
    );
};

export const useApiKey = () => useContext(ApiKeyContext);