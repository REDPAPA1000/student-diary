import React, { useState } from 'react';
import Header from '../components/Header.tsx';
import ResultPanel from '../components/ResultPanel.tsx';
import { GoogleGenAI } from "@google/genai";
import { useApiKey } from '../contexts/ApiKeyContext.tsx';

const SubjectScreen: React.FC = () => {
    const { apiKey } = useApiKey();
    // New Focus Options for different student levels
    const focusOptions = [
        "[심화/탐구] 자기주도적 탐구와 학술적 깊이 강조 (상위권)",
        "[창의/융합] 문제해결력과 타 교과 연계 능력 부각 (상위권)",
        "[성실/이해] 교과 개념 이해와 성실한 과제 수행 강조 (중위권)",
        "[참여/소통] 적극적인 수업 참여와 모둠 활동 기여 (중위권)",
        "[흥미/태도] 수업에 대한 관심과 긍정적 학습 태도 묘사 (하위권)",
        "[노력/변화] 기초 학습 노력과 구체적인 행동 변화 격려 (하위권)"
    ];

    const [prompt, setPrompt] = useState("");
    const [subject, setSubject] = useState("");
    const [attitude, setAttitude] = useState("");
    const [details, setDetails] = useState("");
    const [focus, setFocus] = useState(focusOptions[0]);
    const [isLoading, setIsLoading] = useState(false);

    // Common attitude keywords
    const attitudeKeywords = ["적극적 질문", "토론 참여", "수업 집중도", "과제 성실성", "자기주도성", "경청하는 태도"];

    // Subject-specific excellence keywords
    const subjectKeywords: Record<string, string[]> = {
        "국어": ["문해력", "비판적읽기", "논리적글쓰기", "토론능력", "문학감수성", "어휘력", "주제파악"],
        "수학": ["논리적추론", "문제해결", "수리감각", "수학적모델링", "그래프해석", "원리이해", "추상화"],
        "영어": ["독해력", "의사소통", "영작문", "문화이해", "문맥파악", "어휘활용", "청해능력"],
        "한국사": ["역사인식", "사료분석", "인과관계", "시대흐름", "비판적시각", "역사적상상력", "자료해석"],
        "통합사회": ["사회현상분석", "다각적관점", "자료해석", "문제해결", "비판적사고", "공동체역량", "갈등조정"],
        "통합과학": ["과학적원리", "실험설계", "탐구능력", "데이터분석", "가설검증", "결론도출", "오차분석"],
        "과학탐구실험": ["실험설계", "기구조작", "정량적분석", "보고서작성", "협력탐구", "변인통제", "결과해석"],
        "체육": ["운동수행", "스포츠맨십", "협동심", "전략이해", "규칙준수", "건강관리", "신체표현"],
        "음악": ["음악적표현", "악기연주", "예술감수성", "비평능력", "창의적해석", "협연능력", "곡해석"],
        "미술": ["창의적표현", "미적감각", "작품해석", "도구활용", "비평능력", "시각적소통", "표현기법"],
        "정보": ["알고리즘", "프로그래밍", "구조화", "컴퓨팅사고", "정보윤리", "문제분해", "디지털활용"],
        "기술가정": ["창의적설계", "문제해결", "실생활적용", "기술활용", "생활자립", "가족이해", "적응력"],
        "제2외국어": ["문화이해", "의사소통", "어휘습득", "상황대처", "타문화존중", "적극적표현", "발음정확성"]
    };

    const defaultKeywords = ["논리적분석", "문제해결", "탐구능력", "데이터해석", "비판적사고", "융합사고", "정보활용"];
    const currentExcellenceKeywords = subject && subjectKeywords[subject] ? subjectKeywords[subject] : defaultKeywords;

    // Internal variations for Subject
    const variances = [
        "지적 호기심과 주제 탐구 동기를 특히 강조하여 서술",
        "문제 해결 과정에서의 논리적 사고 흐름과 시행착오 극복을 구체화",
        "결과물의 완성도와 학업적 성취 수준을 전문적인 용어로 부각",
        "수업 중 동료와의 협력 및 의사소통 능력을 중점적으로 서술",
        "해당 교과 개념의 심층적 이해와 타 분야 적용 능력을 강조",
        "자료를 수집하고 분석하는 과정에서의 정보 처리 역량을 부각"
    ];

    const handleGenerate = async () => {
        if (!apiKey) {
            alert("메인 페이지에서 Google API Key를 먼저 설정해주세요.");
            return;
        }

        if (!subject) {
            setPrompt("과목을 먼저 선택해주세요.");
            return;
        }
        
        setIsLoading(true);
        setPrompt("");

        // Pick a random variance
        const randomVariance = variances[Math.floor(Math.random() * variances.length)];

        try {
            const ai = new GoogleGenAI({ apiKey: apiKey });
            
            const inputData = `
[과목 정보]
- 과목명: ${subject}

[수업 태도 및 관찰]
${attitude || "수업 태도가 바르고 성실함"}

[평가 및 탐구 활동 내용 (우수성 포함)]
${details || "해당 과목의 교육과정에 맞는 탐구 활동 및 우수성 내용을 창의적으로 생성"}
            `.trim();

            const systemInstruction = `당신은 대한민국 고등학교 교사로서 나이스(NEIS)에 입력할 '교과 세부능력 및 특기사항(세특)'을 작성하는 전문가입니다.

### [핵심 목표: 개별화 및 차별화]
- **중요**: 동일한 정보가 입력되더라도, 학생마다 다른 관점과 어휘를 사용하여 고유한 세특이 작성되도록 하십시오.
- 이번 작성의 강조점: **"${randomVariance}"**

### [절대 규칙: 분량 및 완결성] (최우선 적용)
1. **분량 최적화 (1500바이트 준수)**:
   - 선택된 작성 방향(${focus})에 상관없이, **반드시 공백 포함 1500바이트(한글 기준 약 500자 ~ 550자)** 내외로 작성하십시오.
   - **주의**: 2000바이트가 넘어가지 않도록 주의하십시오. 나이스 입력 한도인 1500바이트에 가깝게 맞추되, 이를 크게 초과하여 입력이 불가능해지는 상황을 피하십시오.
   - 내용이 부족하면 과목(${subject})의 심화 개념이나 탐구 과정을 구체적으로 덧붙여 1500바이트 분량을 채우십시오.

2. **문장 완결성 (Cut-off 방지)**:
   - 문장이 중간에 끊기지 않고 반드시 끝맺음해야 합니다.
   - 마지막 문장은 명사형 어미('~함.', '~임.')와 **마침표(.)**로 정확히 종료하십시오.
   - 마무리는 반드시 **심화 탐구 의지**나 **학업적 발전 가능성**으로 맺으십시오.

### [작성 구조]
다음 흐름을 사용하여 하나의 긴 문단으로 작성하십시오.
1. **동기(Motivation)**: 학습 주제 선정 이유, 수업 중 생긴 호기심
2. **탐구(Inquiry)**: 이론적 탐구 과정, 문제 해결 방법, 데이터 분석 등 (가장 길게 서술)
3. **결과(Result)**: 도출된 결론, 산출물의 완성도
4. **심화(Extension)**: 이를 통해 확장된 사고, 후속 탐구 계획, 타 교과 연계 (마무리)

### [작성 방향]
- **선택된 스타일**: ${focus}
- 주어 생략.

예시 분량 감각 (약 500자 목표):
(입력: 미적분 문제 풀이 잘함) -> (출력: '도함수의 활용' 단원을 학습하며... (중략) ... 이를 통해 수학적 모델링 역량을 증명하였으며 향후 공학 분야에서의 응용 가능성이 매우 높음.)`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: inputData,
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
        setSubject("");
        setAttitude("");
        setDetails("");
        setPrompt("");
        setFocus(focusOptions[0]);
    };

    const addAttitude = (text: string) => {
        setAttitude(prev => prev + (prev ? " " : "") + text);
    };

    const addDetailKeyword = (text: string) => {
        setDetails(prev => prev + (prev ? " " : "") + text);
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden transition-colors duration-200">
            <Header 
                title="세특 도우미" 
                icon="menu_book" 
                colorClass="text-s2-primary dark:text-emerald-400" 
                bgClass="bg-emerald-100 dark:bg-emerald-900/30"
                backLink={true}
            />
            
            <div className="flex flex-1 justify-center w-full">
                <div className="flex flex-col max-w-[1280px] w-full px-4 md:px-10 pb-20 pt-8">
                    <div className="mb-10 text-center space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800 w-fit mx-auto mb-2">
                            <span className="material-symbols-outlined text-s2-primary dark:text-emerald-400 text-sm">school</span>
                            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 tracking-wide uppercase">AI 교과 세특 생성</span>
                        </div>
                        <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
                            교과 세부능력 및 특기사항 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-s2-primary">AI 생성기</span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto font-normal">
                            과목별 수업 활동과 학생의 성장을 구체적으로 기록하세요.<br className="hidden md:block"/> 
                            AI가 명사형 어미와 학업 역량 중심의 완성된 세특을 작성해 드립니다.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-7 flex flex-col gap-6">
                            {/* Subject Selection */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-full">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        과목 선택 <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select 
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
                                            className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-s2-primary focus:border-transparent py-3 pl-4 pr-10 text-slate-900 dark:text-white text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            <option disabled value="">선택해주세요</option>
                                            <option value="국어">국어</option>
                                            <option value="수학">수학</option>
                                            <option value="영어">영어</option>
                                            <option value="한국사">한국사</option>
                                            <option value="통합사회">통합사회</option>
                                            <option value="통합과학">통합과학</option>
                                            <option value="과학탐구실험">과학탐구실험</option>
                                            <option value="체육">체육</option>
                                            <option value="음악">음악</option>
                                            <option value="미술">미술</option>
                                            <option value="정보">정보</option>
                                            <option value="기술가정">기술가정</option>
                                            <option value="제2외국어">제2외국어</option>
                                        </select>
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 pointer-events-none text-sm">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            {/* Attitude */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-slate-900 dark:text-white font-bold text-lg">수업 참여 태도</h3>
                                    <span className="text-xs text-slate-400 font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">핵심 역량</span>
                                </div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                                    학생이 수업 시간에 보여준 태도나 습관을 기록해주세요. 키워드를 클릭하여 추가할 수 있습니다.
                                </label>
                                <textarea 
                                    value={attitude}
                                    onChange={(e) => setAttitude(e.target.value)}
                                    className="w-full h-24 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-s2-primary focus:border-transparent p-4 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none transition-all text-sm leading-relaxed mb-4" 
                                    placeholder="예: 수업 시작 전 교과서를 미리 준비하고, 교사의 설명에 집중하여 경청함."
                                ></textarea>
                                <div className="flex flex-wrap gap-2">
                                    {attitudeKeywords.map(item => (
                                        <button 
                                            key={item}
                                            onClick={() => addAttitude(item)}
                                            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-300 transition-colors"
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Evaluation & Details (Merged with Excellence) */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-6">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-slate-900 dark:text-white font-bold text-lg">
                                            평가 및 활동 내용 
                                            <span className="text-sm font-normal text-slate-500 ml-2">
                                                ({subject ? `${subject} 핵심 역량` : "우수성"})
                                            </span>
                                        </h3>
                                        <span className="text-xs text-slate-400 font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">심화 탐구</span>
                                    </div>
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                                        수행평가 주제, 탐구 내용, 그리고 학생의 우수성(특기사항)을 입력해주세요.
                                    </label>
                                    <textarea 
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                        className="w-full h-32 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-s2-primary focus:border-transparent p-4 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none transition-all text-sm leading-relaxed mb-4" 
                                        placeholder="예: 수행평가 주제로 '기후 변화의 심각성'을 선정하여 PPT를 제작하고 발표함. 데이터 분석 능력이 뛰어남."
                                    ></textarea>
                                    <div className="flex flex-wrap gap-2">
                                        {currentExcellenceKeywords.map(item => (
                                            <button 
                                                key={item}
                                                onClick={() => addDetailKeyword(item)}
                                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-300 transition-colors animate-fade-in"
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Settings */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-8 divide-y divide-slate-100 dark:divide-slate-800/50">
                                <div className="pt-2">
                                    <div className="flex items-center gap-3 mb-4">
                                        <h3 className="text-slate-900 dark:text-white font-bold text-lg">작성 방향 (AI 가이드)</h3>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 pointer-events-none">trending_up</span>
                                        <select 
                                            value={focus}
                                            onChange={(e) => setFocus(e.target.value)}
                                            style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
                                            className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-s2-primary focus:border-transparent py-3 pl-11 pr-10 text-slate-900 dark:text-white text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            {focusOptions.map((option, index) => (
                                                <option key={index} value={option}>{option}</option>
                                            ))}
                                        </select>
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 pointer-events-none text-sm">expand_more</span>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="w-full py-5 bg-s2-primary hover:bg-s2-primary-dark disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] text-lg flex items-center justify-center gap-3 group mt-4"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>AI 작성 중...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined group-hover:rotate-180 transition-transform text-2xl">auto_awesome</span>
                                        <span>AI 세특 생성</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <ResultPanel 
                            promptText={prompt} 
                            setPromptText={setPrompt}
                            isLoading={isLoading}
                            onReset={handleReset}
                            title="생성된_세특.txt"
                            colorClass="text-s2-primary"
                            defaultText={
                                <>
                                    <p><span className="text-purple-400">AI Role:</span> 교과 세특 작성 전문가</p>
                                    <p><span className="text-blue-400">Structure:</span> 동기 → 탐구 → 결과 → 심화</p>
                                    <p><span className="text-emerald-400">Check:</span><br/>
                                    - 명사형 어미(~함.) 및 마침표<br/>
                                    - 학생별 개별화/차별화 적용<br/>
                                    - 학업 역량 구체화</p>
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

export default SubjectScreen;