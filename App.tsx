import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './pages/Home.tsx';
import BehaviorScreen from './pages/Behavior.tsx';
import SubjectScreen from './pages/Subject.tsx';
import CreativeScreen from './pages/Creative.tsx';
import { ApiKeyProvider } from './contexts/ApiKeyContext.tsx';

const App: React.FC = () => {
    return (
        <ApiKeyProvider>
            <HashRouter>
                <div className="font-display">
                    <Routes>
                        <Route path="/" element={<HomeScreen />} />
                        <Route path="/behavior" element={<BehaviorScreen />} />
                        <Route path="/subject" element={<SubjectScreen />} />
                        <Route path="/creative" element={<CreativeScreen />} />
                    </Routes>
                    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark">
                        <div className="w-full px-4 md:px-10 py-8">
                            <p className="text-center text-xs text-slate-400">© 생활기록부 프롬프트 생성기 | Teachers' AI Assistant</p>
                        </div>
                    </footer>
                </div>
            </HashRouter>
        </ApiKeyProvider>
    );
};

export default App;