
declare global {
    interface Window {
        aistudio: {
            hasSelectedApiKey: () => Promise<boolean>;
            openSelectKey: () => Promise<void>;
        };
    }

    namespace NodeJS {
        interface ProcessEnv {
            API_KEY: string;
            GEMINI_API_KEY: string;
        }
    }
}

export { };
