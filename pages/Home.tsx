import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.tsx';
import { useApiKey } from '../contexts/ApiKeyContext.tsx';

const HomeScreen: React.FC = () => {
    const { apiKey, setApiKey, hasKey } = useApiKey();
    const [isKeyExpanded, setIsKeyExpanded] = useState(false);
    const [tempKey, setTempKey] = useState("");

    const handleSaveKey = () => {
        setApiKey(tempKey);
        alert("API 키가 저장되었습니다.");
        setIsKeyExpanded(false);
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden transition-colors duration-200">
            <Header 
                title="생활기록부 프롬프트 생성기" 
                icon="auto_awesome" 
                colorClass="text-s1-primary" 
                bgClass="bg-s1-primary/10"
            />

            <div className="flex flex-1 justify-center w-full">
                <div className="flex flex-col max-w-[1280px] w-full px-4 md:px-10 pb-20 pt-10 md:pt-16">
                    <div className="mb-16 text-center space-y-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-fit mx-auto shadow-sm animate-fade-in-up">
                            <span className="material-symbols-outlined text-s1-primary text-sm">psychology</span>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 tracking-wide uppercase">선생님을 위한 AI 어시스턴트</span>
                        </div>
                        <h1 className="text-slate-900 dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-tight">
                            생활기록부 작성을 <br className="md:hidden"/>더 쉽고 전문적으로
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed break-keep">
                            행동특성 및 종합의견부터 교과 세부능력 및 특기사항, 창의적 체험활동까지,<br className="hidden md:block"/> 
                            AI가 선생님의 관찰 기록을 최적화된 문구로 완성해 드립니다.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto w-full mb-16">
                        {/* Card 1: Behavior */}
                        <Link to="/behavior" className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer">
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 size-48 rounded-full bg-gradient-to-br from-s1-primary/20 to-transparent opacity-50 blur-2xl group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="size-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-s1-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-indigo-100 dark:border-indigo-800">
                                        <span className="material-symbols-outlined text-3xl">psychology</span>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-300 group-hover:text-s1-primary transition-colors">arrow_outward</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">행동특성 및 종합의견</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-8 flex-1 break-keep">
                                    학생의 인성, 잠재력, 발달 과정을 종합적으로 기록합니다. 키워드 선택과 구체적 사례를 통해 풍성한 종합의견을 생성해보세요.
                                </p>
                                <div className="w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-300 font-bold rounded-xl border border-slate-200 dark:border-slate-700 group-hover:bg-s1-primary group-hover:text-white group-hover:border-s1-primary transition-all flex items-center justify-center gap-2">
                                    <span>프롬프트 생성하기</span>
                                </div>
                            </div>
                        </Link>

                        {/* Card 2: Subject */}
                        <Link to="/subject" className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer">
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 size-48 rounded-full bg-gradient-to-br from-emerald-400/20 to-transparent opacity-50 blur-2xl group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="size-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-s2-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-emerald-100 dark:border-emerald-800">
                                        <span className="material-symbols-outlined text-3xl">menu_book</span>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-300 group-hover:text-s2-primary transition-colors">arrow_outward</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">교과 세부능력 및 특기사항</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-8 flex-1 break-keep">
                                    교과별 성취 기준에 따른 학업 역량과 탐구 활동을 기록합니다. 수업 참여도와 수행평가 내용을 바탕으로 세특을 생성해보세요.
                                </p>
                                <div className="w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-300 font-bold rounded-xl border border-slate-200 dark:border-slate-700 group-hover:bg-s2-primary group-hover:text-white group-hover:border-s2-primary transition-all flex items-center justify-center gap-2">
                                    <span>프롬프트 생성하기</span>
                                </div>
                            </div>
                        </Link>

                        {/* Card 3: Creative */}
                        <Link to="/creative" className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer">
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 size-48 rounded-full bg-gradient-to-br from-orange-400/20 to-transparent opacity-50 blur-2xl group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="size-14 rounded-2xl bg-orange-50 dark:bg-orange-900/30 text-s4-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-orange-100 dark:border-orange-800">
                                        <span className="material-symbols-outlined text-3xl">diversity_3</span>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-300 group-hover:text-s4-primary transition-colors">arrow_outward</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">창의적 체험활동</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-8 flex-1 break-keep">
                                    자율활동, 동아리활동, 봉사활동, 진로활동 등 학생의 다양한 창의 체험 활동을 구체적이고 생생한 언어로 기록해 드립니다.
                                </p>
                                <div className="w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-300 font-bold rounded-xl border border-slate-200 dark:border-slate-700 group-hover:bg-s4-primary group-hover:text-white group-hover:border-s4-primary transition-all flex items-center justify-center gap-2">
                                    <span>프롬프트 생성하기</span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* API Key Section */}
                    <div className="w-full max-w-4xl mx-auto mb-16 animate-fade-in-up transition-all" style={{animationDelay: '0.2s'}}>
                        {!isKeyExpanded ? (
                            <div 
                                onClick={() => {
                                    setTempKey(apiKey);
                                    setIsKeyExpanded(true);
                                }}
                                className="cursor-pointer group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-800 dark:to-black p-1 shadow-xl shadow-slate-200 dark:shadow-none transition-transform hover:scale-[1.01]"
                            >
                                <div className="relative flex flex-col md:flex-row items-center justify-between p-6 gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/50">
                                            <span className="material-symbols-outlined text-2xl">key</span>
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                                Google Gemini API 설정
                                                {hasKey ? (
                                                    <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">등록됨</span>
                                                ) : (
                                                    <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">미등록</span>
                                                )}
                                            </h3>
                                            <p className="text-sm text-slate-300">개인 API Key를 등록해야 서비스를 이용할 수 있습니다. 이곳을 눌러 설정하세요.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/10 group-hover:bg-white/20 transition-colors">
                                        <span className="text-sm font-bold text-white">설정하기</span>
                                        <span className="material-symbols-outlined text-white text-sm">expand_more</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-800 dark:border-slate-700 p-6 shadow-xl animate-fade-in">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-yellow-500">vpn_key</span>
                                            API Key 입력
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                                            Google AI Studio에서 무료 API Key를 발급받아 입력해주세요.<br/>
                                            입력된 키는 브라우저에만 저장되며 서버로 전송되지 않습니다.
                                        </p>
                                        <div className="flex flex-col gap-3">
                                            <div className="relative">
                                                <input 
                                                    type="password" 
                                                    value={tempKey}
                                                    onChange={(e) => setTempKey(e.target.value)}
                                                    placeholder="sk-..."
                                                    className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent py-3 pl-4 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={handleSaveKey}
                                                    className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                                                >
                                                    저장하기
                                                </button>
                                                <button 
                                                    onClick={() => setIsKeyExpanded(false)}
                                                    className="px-6 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                                >
                                                    취소
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:w-px md:h-auto md:bg-slate-200 dark:md:bg-slate-700 w-full h-px bg-slate-200 my-2 md:my-0"></div>
                                    <div className="md:w-1/3 flex flex-col justify-center">
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">아직 키가 없으신가요?</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                                                Google AI Studio에서 쉽고 빠르게 무료 키를 발급받을 수 있습니다.
                                            </p>
                                            <a 
                                                href="https://aistudio.google.com/app/apikey" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 w-full py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors"
                                            >
                                                <span>API Key 발급받기</span>
                                                <span className="material-symbols-outlined text-base">open_in_new</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-800 pt-16">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400">
                                    <span className="material-symbols-outlined text-2xl">verified_user</span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">프라이버시 보호</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                                    입력하신 학생 정보는 서버에 저장되지 않으며,<br/>브라우저 내에서만 안전하게 처리됩니다.
                                </p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-2xl text-purple-600 dark:text-purple-400">
                                    <span className="material-symbols-outlined text-2xl">smart_toy</span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">프롬프트 엔지니어링</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                                    생성형 AI 모델에 최적화된 구조화된 질문을<br/>자동으로 구성하여 최상의 결과를 도출합니다.
                                </p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-2xl text-orange-600 dark:text-orange-400">
                                    <span className="material-symbols-outlined text-2xl">bolt</span>
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">업무 효율 향상</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                                    반복적인 문장 작성 시간을 획기적으로 단축하고<br/>학생 관찰과 지도에 더 집중할 수 있습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;