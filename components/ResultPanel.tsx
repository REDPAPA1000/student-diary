import React, { useState, useEffect } from 'react';
import { ResultPanelProps } from '../types';

const ResultPanel: React.FC<ResultPanelProps> = ({ promptText, setPromptText, defaultText, colorClass, isLoading = false, title = "생성된_프롬프트.txt", onReset }) => {
    const [copied, setCopied] = useState(false);
    const [byteCount, setByteCount] = useState(0);

    // Accurate UTF-8 byte calculation
    useEffect(() => {
        if (!promptText) {
            setByteCount(0);
            return;
        }
        // Calculate bytes: Korean chars are typically 3 bytes in UTF-8
        let bytes = 0;
        for (let i = 0; i < promptText.length; i++) {
            const code = promptText.charCodeAt(i);
            if (code <= 0x007f) {
                bytes += 1; // ASCII
                if (code === 10) bytes += 1; // Treat newline as 2 bytes (CRLF) for conservative counting if needed, or just 1. NEIS often counts enters as 2.
            } else if (code <= 0x07ff) {
                bytes += 2;
            } else {
                bytes += 3; // Korean/Multi-byte
            }
        }
        setByteCount(bytes);
    }, [promptText]);

    const handleCopy = () => {
        if (!promptText || isLoading) return;
        navigator.clipboard.writeText(promptText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="lg:col-span-5 sticky top-24">
            <div className="bg-slate-900 text-white rounded-3xl p-1 shadow-2xl ring-1 ring-slate-900/5 overflow-hidden flex flex-col h-[calc(100vh-120px)] max-h-[800px]">
                {/* Header */}
                <div className="bg-slate-800/80 backdrop-blur-md rounded-t-[20px] p-4 border-b border-slate-700 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="flex gap-1.5">
                            <div className="size-3 rounded-full bg-red-500/80"></div>
                            <div className="size-3 rounded-full bg-yellow-500/80"></div>
                            <div className="size-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <div className="h-4 w-px bg-slate-600 mx-2"></div>
                        <span className={`material-symbols-outlined ${colorClass} text-sm`}>smart_toy</span>
                        <span className="font-mono font-bold text-xs tracking-wide text-slate-300">{title}</span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="relative bg-slate-900 p-6 flex-1 overflow-y-auto font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {isLoading ? (
                         <div className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-4">
                            <div className={`size-10 border-4 border-t-transparent ${colorClass.replace('text-', 'border-')} rounded-full animate-spin`}></div>
                            <p className="text-slate-400 text-sm animate-pulse">AI가 생활기록부를 작성하고 있습니다...</p>
                        </div>
                    ) : promptText ? (
                        <div className="whitespace-pre-wrap text-slate-300 animate-fade-in">
                            {promptText}
                        </div>
                    ) : (
                        <div className="absolute inset-0 p-6 flex flex-col pointer-events-none select-none">
                            <div className="text-slate-500 mb-6 flex gap-2">
                                <span>//</span>
                                <span>입력폼을 작성하고 '생성' 버튼을 눌러주세요.</span>
                            </div>
                            <div className="opacity-30 blur-[1px] flex flex-col gap-4 text-slate-400">
                                {defaultText}
                                <div className="h-px bg-slate-800 my-2"></div>
                                <p className="text-slate-600">... 입력 대기 중 ...</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer (Actions) */}
                <div className="bg-slate-800/50 p-4 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-4 shrink-0">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
                        <span className="material-symbols-outlined text-[14px]">data_object</span>
                        <span className="text-slate-200 font-bold">{byteCount}</span> bytes
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleCopy}
                            disabled={isLoading || !promptText}
                            className={`text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all border font-medium ${
                                copied 
                                ? "bg-green-600 border-green-500 text-white" 
                                : "bg-slate-700 hover:bg-slate-600 hover:text-white text-slate-300 border-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
                            }`}
                        >
                            <span className="material-symbols-outlined text-[16px]">{copied ? 'check' : 'content_copy'}</span>
                            {copied ? '복사됨' : '복사'}
                        </button>

                        {onReset && (
                            <button 
                                onClick={onReset}
                                disabled={isLoading}
                                className="text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all border font-medium bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined text-[16px]">refresh</span>
                                초기화
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultPanel;