import React, { useState } from 'react';
import Header from '../components/Header.tsx';
import ResultPanel from '../components/ResultPanel.tsx';
import { GoogleGenAI } from "@google/genai";
import { useApiKey } from '../contexts/ApiKeyContext.tsx';

const BehaviorScreen: React.FC = () => {
    const { apiKey } = useApiKey();
    const [prompt, setPrompt] = useState("");
    const [observation, setObservation] = useState("");
    const [tone, setTone] = useState("학생의 잠재력과 발전 가능성을 중심으로 서술");
    const [isLoading, setIsLoading] = useState(false);

    // Updated Keywords List
    const keywords = ["성실성", "책임감", "갈등관리", "리더십", "협력", "진로", "자기주도", "배려", "나눔"];

    // Internal variations to ensure diversity
    const variances = [
        "구체적인 에피소드 위주로 생동감 있게 묘사",
        "학생의 내면적 성숙과 인성적 깊이를 강조",
        "학급 내에서의 긍정적인 영향력과 관계성에 초점",
        "차분하고 진정성 있는 관찰자 시점으로 서술",
        "학생의 에너지와 적극적인 실행력을 부각",
        "문제 상황을 지혜롭게 해결해가는 과정을 상세히 서술"
    ];

    const handleGenerate = async () => {
        if (!apiKey) {
            alert("메인 페이지에서 Google API Key를 먼저 설정해주세요.");
            return;
        }

        if (!observation.trim()) {
            setPrompt("관찰 내용을 입력해주세요.");
            return;
        }

        setIsLoading(true);
        setPrompt("");

        // Pick a random variance to differentiate outputs
        const randomVariance = variances[Math.floor(Math.random() * variances.length)];

        try {
            const ai = new GoogleGenAI({ apiKey: apiKey });
            
            const systemInstruction = `당신은 대한민국 고등학교 교사로서 나이스(NEIS)에 입력할 '행동특성 및 종합의견'을 작성하는 전문가입니다.

### [핵심 목표: 개별화 및 차별화]
- **중요**: 동일한 키워드(예: 성실)가 입력되더라도, 매번 다른 어휘와 문장 구조를 사용하여 학생마다 차별화된 생기부가 작성되도록 하십시오.
- 이번 작성의 강조점: **"${randomVariance}"**

### [절대 규칙: 분량 및 완결성] (최우선 적용)
1. **분량 최적화 (1500바이트 준수)**:
   - 선택된 작성 방향(${tone})이 무엇이든 상관없이, **반드시 공백 포함 1500바이트(한글 기준 약 500자 ~ 550자)** 내외로 작성하십시오.
   - **주의**: 2000바이트에 육박할 정도로 너무 길게 작성하지 마십시오. 나이스 입력 한도인 1500바이트(약 500자)에 근접하게 맞추십시오.
   - 입력 내용이 빈약하면 살을 붙이되, 상투적인 표현을 피하고 학생만의 고유한 특성이 드러나도록 구체화하십시오.

2. **문장 완결성**:
   - 문장이 중간에 잘리지 않도록 하십시오.
   - 마지막 문장은 반드시 **"~함."** 또는 **"~임."** 등의 명사형 어미와 **마침표(.)**로 끝나야 합니다.
   - 마지막 내용은 반드시 학생의 **발전 가능성**이나 **추후 성장 기대감**으로 마무리하십시오.

### [작성 구조: START 기법]
반드시 다음 흐름을 따라 하나의 긴 문단으로 작성하십시오.
1. **S (Situation)**: 구체적인 상황 묘사
2. **T (Task)**: 학생에게 주어진 과제나 역할
3. **A (Action)**: 학생의 구체적 행동, 대화 내용, 태도 (가장 상세하게 서술)
4. **R (Result)**: 행동의 결과, 주변의 반응
5. **T (Transformation)**: 이를 통해 성장한 점, 교사의 총평 (마무리)

### [작성 방향]
- **선택된 스타일**: ${tone}
- 주어(학생은, 위 학생은)는 생략하십시오.
- 사교육, 수상 실적, 신체적 특징 언급 금지.

예시 분량 감각 (약 500자 목표):
(입력: 성실함) -> (출력: 학기 초 학급 환경미화 활동에서 아무도 맡으려 하지 않는 분리수거 당번을 자원하여 매일 아침 일찍 등교해 교실을 정리하는 등 남다른 성실함을 보임. 친구들이 등교하기 전 쾌적한 환경을 조성하기 위해 창문을 열고 환기를 시키며, 쓰레기 분리배출 규정을 꼼꼼히 익혀 학급 내 분리수거함이 섞이지 않도록 수시로 점검함. 이러한 노력 덕분에 학급 환경 점수에서 우수한 성적을 거두었으며, 급우들 또한 솔선수범하는 태도에 감화되어 학급 정리에 동참하는 분위기가 형성됨. 묵묵히 자신의 맡은 바 책임을 다하고 공동체를 위해 헌신하는 태도에서 뛰어난 봉사 정신과 리더십을 엿볼 수 있으며, 앞으로도 타의 모범이 되는 훌륭한 인재로 성장할 것으로 기대됨.)`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `[관찰 내용]\n${observation}`,
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.9, // Increased for variety
                    maxOutputTokens: 2000,
                }
            });

            setPrompt(response.text || "생성된 내용이 없습니다.");
        } catch (error) {
            console.error("AI Generation Error:", error);
            setPrompt("오류가 발생했습니다. 잠시 후 다시 시도해주세요. (API 키가 유효한지 확인해주세요)");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setObservation("");
        setPrompt("");
        setTone("학생의 잠재력과 발전 가능성을 중심으로 서술");
    };

    const addKeyword = (keyword: string) => {
        setObservation(prev => prev + (prev ? " " : "") + keyword);
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden transition-colors duration-200">
            <Header 
                title="행특 도우미" 
                icon="psychology" 
                colorClass="text-s1-primary" 
                bgClass="bg-s1-primary/10" 
                backLink={true}
            />
            
            <div className="flex flex-1 justify-center w-full">
                <div className="flex flex-col max-w-[1280px] w-full px-4 md:px-10 pb-20 pt-8">
                    <div className="mb-10 text-center space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-s1-primary/10 border border-s1-primary/20 w-fit mx-auto mb-2">
                            <span className="material-symbols-outlined text-s1-primary text-sm">engineering</span>
                            <span className="text-xs font-bold text-s1-primary tracking-wide uppercase">AI 자동 생성</span>
                        </div>
                        <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
                            행동특성 및 종합의견 <span className="text-transparent bg-clip-text bg-gradient-to-r from-s1-primary to-indigo-600">AI 생성기</span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto font-normal">
                            선생님의 관찰 기록을 바탕으로 AI가 학교생활기록부를 작성합니다.<br className="hidden md:block"/> 
                            <span className="font-bold text-s1-primary">명사형 어미</span>와 <span className="font-bold text-s1-primary">START 기법</span>이 적용된 완성본을 받아보세요.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-7 flex flex-col gap-6">
                            {/* Input Section */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-slate-900 dark:text-white font-bold text-lg">학생 관찰 내용</h3>
                                    </div>
                                    <span className="text-xs text-s1-primary font-medium px-2 py-1 bg-s1-primary/5 dark:bg-s1-primary/10 rounded">필수 입력</span>
                                </div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                                    학생의 특징, 에피소드, 변화 과정을 자유롭게 입력해주세요. '성실', '책임감' 같은 단어만 입력해도 AI가 구체적인 사례를 덧붙여 완성해드립니다.
                                </label>
                                <textarea 
                                    value={observation}
                                    onChange={(e) => setObservation(e.target.value)}
                                    className="w-full h-40 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-s1-primary focus:border-transparent p-4 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none transition-all text-sm leading-relaxed" 
                                    placeholder="예: 학기 초에는 발표를 꺼려했으나(S), 모둠 활동에서 자료 조사 역할을 맡으며(T) 책임감을 갖고 성실히 준비함(A). 이후 자신감이 붙어 자발적으로 발표자로 나섰으며(R), 이를 통해 소극적인 성격을 극복하고 의사소통 능력이 향상됨(T)."
                                ></textarea>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {keywords.map((kw) => (
                                        <button 
                                            key={kw}
                                            onClick={() => addKeyword(kw)}
                                            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 hover:bg-s1-primary/5 hover:border-s1-primary/30 hover:text-s1-primary dark:hover:bg-s1-primary/20 dark:hover:text-s1-primary-light transition-colors"
                                        >
                                            {kw}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Options Section */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-8 divide-y divide-slate-100 dark:divide-slate-800/50">
                                <div className="pt-2">
                                    <div className="flex items-center gap-3 mb-4">
                                        <h3 className="text-slate-900 dark:text-white font-bold text-lg">작성 방향 (AI 가이드)</h3>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 pointer-events-none">trending_up</span>
                                        <select 
                                            value={tone}
                                            onChange={(e) => setTone(e.target.value)}
                                            style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
                                            className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-s1-primary focus:border-transparent py-3 pl-11 pr-4 text-slate-900 dark:text-white text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            <option>학생의 잠재력과 발전 가능성을 중심으로 서술</option>
                                            <option>구체적인 변화 과정을 포착하여 성장 스토리 강조</option>
                                            <option>단점보다는 장점으로 승화하여 긍정적 언어로 표현</option>
                                            <option>객관적 사실 위주로 담백하게 서술</option>
                                        </select>
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 pointer-events-none text-sm">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="w-full py-5 bg-s1-primary hover:bg-s1-primary-hover disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg shadow-s1-primary/30 transition-all transform hover:scale-[1.01] active:scale-[0.99] text-lg flex items-center justify-center gap-3 group mt-4"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>AI 생성 중...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined group-hover:rotate-180 transition-transform text-2xl">auto_awesome</span>
                                        <span>AI 행발 생성</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <ResultPanel 
                            promptText={prompt} 
                            setPromptText={setPrompt}
                            isLoading={isLoading}
                            title="생성된_행동특성.txt"
                            colorClass="text-s1-primary"
                            onReset={handleReset}
                            defaultText={
                                <>
                                    <p><span className="text-purple-400">AI Role:</span> 학교생활기록부 작성 전문가</p>
                                    <p><span className="text-blue-400">Process:</span> START 기법 서사 구조화</p>
                                    <p><span className="text-green-400">Check:</span><br/>
                                    - 명사형 어미 (~함.) 및 마침표 적용<br/>
                                    - 학생별 개별화/차별화 적용<br/>
                                    - 발전 가능성으로 마무리</p>
                                    <p className="text-slate-500 mt-2 text-xs">※ 생성된 내용은 참고용으로 활용하시고, 반드시 선생님의 검토를 거쳐 나이스에 입력해주세요.</p>
                                </>
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BehaviorScreen;