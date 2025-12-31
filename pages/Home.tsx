
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.tsx';

// Removed local Window augmentation to avoid conflict with pre-configured ambient types.
// The environment provides window.aistudio with the correct AIStudio type.

const HomeScreen: React.FC = () => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const checkKey = async () => {
            // @ts-ignore - aistudio is pre-configured in the environment
            if (window.aistudio) {
                // @ts-ignore
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setIsConnected(hasKey);
            }
        };
        checkKey();
    }, []);

    const handleOpenSystemKeyPopup = async () => {
        // @ts-ignore
        if (window.aistudio) {
            try {
                // @ts-ignore
                await window.aistudio.openSelectKey();
                // After triggering, we assume success as per race condition mitigation guidelines
                setIsConnected(true);
            } catch (err) {
                console.error("Failed to open system key selector", err);
            }
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden transition-colors duration-200 font-body">
            <Header 
                title="생활기록부 프롬프트 생성기" 
                icon="auto_awesome" 
                colorClass="text-primary" 
                bgClass="bg-primary/10"
            />

            <div className="flex flex-1 justify-center w-full">
                <div className="flex flex-col max-w-[1280px] w-full px-4 md:px-10 pb-20 pt-10 md:pt-20">
                    {/* Hero Section */}
                    <div className="mb-16 text-center space-y-6 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-fit mx-auto shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isConnected ? 'bg-primary' : 'bg-red-500'} opacity-75`}></span>
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-primary' : 'bg-red-500'}`}></span>
                            </span>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 tracking-wider uppercase">
                                {isConnected ? "System Connection Active" : "External Key Required"}
                            </span>
                        </div>
                        <h1 className="text-slate-900 dark:text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
                            생동감 넘치는 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">생활기록부</span><br/>
                            AI와 함께 완성하세요
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-3xl mx-auto font-normal leading-relaxed break-keep">
                            선생님의 소중한 관찰 기록이 전문적인 문장으로 재탄생합니다.<br className="hidden md:block"/> 
                            시스템 외장 API 연동을 통해 더욱 안전하고 강력한 성능을 경험하세요.
                        </p>
                        
                        {/* External Key Management Button */}
                        <div className="pt-4 animate-fade-in" style={{animationDelay: '0.4s'}}>
                            <button 
                                onClick={handleOpenSystemKeyPopup}
                                className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-xl ${
                                    isConnected 
                                    ? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900" 
                                    : "bg-primary text-slate-900 hover:bg-primary-hover shadow-primary/20"
                                }`}
                            >
                                <span className="material-symbols-outlined">{isConnected ? 'admin_panel_settings' : 'vpn_key'}</span>
                                <span>{isConnected ? '시스템 API 설정 관리' : '외부 API 키 연결하기'}</span>
                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                            </button>
                            <div className="mt-4">
                                <a 
                                    href="https://ai.google.dev/gemini-api/docs/billing" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-slate-400 hover:text-primary underline transition-colors"
                                >
                                    결제 및 유료 API 정책 확인하기
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Main Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
                        {/* Section 1: Behavior */}
                        <Link to="/behavior" className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-12 -mt-12 size-40 rounded-full bg-s1-primary/10 blur-3xl group-hover:bg-s1-primary/20 transition-all duration-500"></div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="size-16 rounded-2xl bg-s1-primary-light dark:bg-s1-primary/20 text-s1-primary flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm">
                                        <span className="material-symbols-outlined text-4xl">psychology</span>
                                    </div>
                                    <div className="size-10 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center group-hover:bg-s1-primary group-hover:text-white transition-all duration-300">
                                        <span className="material-symbols-outlined text-xl">arrow_forward</span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">행동특성 및 종합의견</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-10 flex-1 break-keep">
                                    학생의 인성, 리더십, 협동심을 관찰 기반으로 생생하게 기록합니다. <strong>START 기법</strong>이 적용된 서사적 문장을 생성합니다.
                                </p>
                                <div className="w-full py-4 bg-s1-primary-light dark:bg-slate-800 text-s1-primary dark:text-s1-primary-light font-black rounded-2xl group-hover:bg-s1-primary group-hover:text-white transition-all duration-300 text-center flex items-center justify-center gap-2">
                                    <span>행발 프롬프트 생성</span>
                                    <span className="material-symbols-outlined text-lg">bolt</span>
                                </div>
                            </div>
                        </Link>

                        {/* Section 2: Subject */}
                        <Link to="/subject" className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-12 -mt-12 size-40 rounded-full bg-s2-primary/10 blur-3xl group-hover:bg-s2-primary/20 transition-all duration-500"></div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="size-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-s2-primary flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-sm">
                                        <span className="material-symbols-outlined text-4xl">menu_book</span>
                                    </div>
                                    <div className="size-10 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center group-hover:bg-s2-primary group-hover:text-white transition-all duration-300">
                                        <span className="material-symbols-outlined text-xl">arrow_forward</span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">교과 세부능력 특기사항</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-10 flex-1 break-keep">
                                    교과별 학업 역량과 탐구 의지를 전문 용어로 기술합니다. <strong>성취 기준</strong>에 부합하는 수준별 맞춤 문항을 제공합니다.
                                </p>
                                <div className="w-full py-4 bg-emerald-50 dark:bg-slate-800 text-s2-primary dark:text-emerald-400 font-black rounded-2xl group-hover:bg-s2-primary group-hover:text-white transition-all duration-300 text-center flex items-center justify-center gap-2">
                                    <span>세특 프롬프트 생성</span>
                                    <span className="material-symbols-outlined text-lg">auto_stories</span>
                                </div>
                            </div>
                        </Link>

                        {/* Section 3: Creative */}
                        <Link to="/creative" className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-12 -mt-12 size-40 rounded-full bg-s4-primary/10 blur-3xl group-hover:bg-s4-primary/20 transition-all duration-500"></div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="size-16 rounded-2xl bg-orange-50 dark:bg-orange-900/30 text-s4-primary flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-sm">
                                        <span className="material-symbols-outlined text-4xl">diversity_3</span>
                                    </div>
                                    <div className="size-10 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center group-hover:bg-s4-primary group-hover:text-white transition-all duration-300">
                                        <span className="material-symbols-outlined text-xl">arrow_forward</span>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">창의적 체험활동</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-10 flex-1 break-keep">
                                    자율, 동아리, 진로활동의 방대한 데이터를 하나로 통합합니다. 활동의 <strong>개연성</strong>과 <strong>성장 스토리</strong>를 극대화합니다.
                                </p>
                                <div className="w-full py-4 bg-orange-50 dark:bg-slate-800 text-s4-primary dark:text-s4-secondary font-black rounded-2xl group-hover:bg-s4-primary group-hover:text-white transition-all duration-300 text-center flex items-center justify-center gap-2">
                                    <span>창체 프롬프트 생성</span>
                                    <span className="material-symbols-outlined text-lg">rocket_launch</span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Features Footer */}
                    <div className="mt-24 pt-16 border-t border-slate-200 dark:border-slate-800">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                            <div className="space-y-4">
                                <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                                    <span className="material-symbols-outlined">security</span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">강력한 외장 보안</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">로컬에 키를 저장하지 않고 시스템 환경을 통해 직접 주입받아 보안을 극대화합니다.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                                    <span className="material-symbols-outlined">auto_awesome</span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Gemini 3 Pro</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">최신 언어 모델과 고도화된 프롬프트 엔지니어링으로 압도적인 품질을 보장합니다.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="size-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto">
                                    <span className="material-symbols-outlined">speed</span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">업무 경감</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">반복적인 문구 고민 시간을 줄이고 학생과의 만남에 더 집중할 수 있습니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;
