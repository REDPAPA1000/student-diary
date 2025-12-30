import React, { useState } from 'react';
import Header from '../components/Header.tsx';
import ResultPanel from '../components/ResultPanel.tsx';
import { ActivityType } from '../types';
import { GoogleGenAI } from "@google/genai";
import { useApiKey } from '../contexts/ApiKeyContext.tsx';

interface ActivityItem {
    id: number;
    date: string;
    name: string;
    content: string;
}

const CreativeScreen: React.FC = () => {
    const { apiKey } = useApiKey();
    const [prompt, setPrompt] = useState("");
    // Default to '자율활동'. '봉사활동' is removed.
    const [activityType, setActivityType] = useState<ActivityType>("자율활동");
    
    // List State
    const [activities, setActivities] = useState<ActivityItem[]>([]);

    // Input States
    const [currentDate, setCurrentDate] = useState("");
    const [currentName, setCurrentName] = useState("");
    const [currentContent, setCurrentContent] = useState("");
    
    const [isLoading, setIsLoading] = useState(false);

    // Helper to check if current mode is Club Activity
    const isClub = activityType === "동아리활동";

    // Internal variations for Creative Activities
    const variances = [
        "활동의 계기와 참여 동기를 중심으로 개인의 의미 부여 강조",
        "활동 과정에서의 구체적인 에피소드와 학생의 역할 수행을 상세 묘사",
        "활동을 통해 얻은 내면적 성숙과 가치관의 변화를 중점적으로 서술",
        "공동체 역량(소통, 협력, 배려) 함양 과정을 부각",
        "자신의 진로 흥미와 연계하여 활동의 의미를 확장하여 서술",
        "활동 전후의 변화된 모습을 대조하여 성장 지향적으로 서술"
    ];

    const handleAddActivity = () => {
        // Validation Logic
        if (!isClub) {
            // Autonomous & Career: Date and Name required
            if (!currentDate) {
                alert("날짜(기간)를 입력해주세요.");
                return;
            }
            if (!currentName) {
                alert("활동명을 입력해주세요.");
                return;
            }
        }
        
        // Content is always required now (since Club has no Name to generate from)
        if (!currentContent) {
            alert("활동 내용을 입력해주세요.");
            return;
        }

        const newItem: ActivityItem = {
            id: Date.now(),
            date: isClub ? "" : currentDate,
            name: isClub ? "" : currentName,
            content: currentContent
        };

        setActivities([...activities, newItem]);
        
        // Reset inputs
        setCurrentDate("");
        setCurrentName("");
        setCurrentContent("");
    };

    const handleDeleteActivity = (id: number) => {
        setActivities(activities.filter(item => item.id !== id));
    };

    const handleGenerate = async () => {
        if (!apiKey) {
            alert("메인 페이지에서 Google API Key를 먼저 설정해주세요.");
            return;
        }

        if (activities.length === 0) {
            setPrompt("최소 1개 이상의 활동을 추가해주세요.");
            return;
        }

        setIsLoading(true);
        setPrompt("");

        // Pick a random variance
        const randomVariance = variances[Math.floor(Math.random() * variances.length)];

        try {
            const ai = new GoogleGenAI({ apiKey: apiKey });
            
            // Construct input data from the list
            const activitiesData = activities.map((item, index) => {
                if (isClub) {
                    // Club: Content only
                    return `
[활동 ${index + 1}]
- 활동내용: ${item.content}
                    `.trim();
                } else {
                    // Auto/Career: Date, Name, Content
                    return `
[활동 ${index + 1}]
- 날짜: ${item.date}
- 활동명: ${item.name}
- 활동내용: ${item.content}
                    `.trim();
                }
            }).join("\n");

            const inputData = `
[선택된 영역] ${activityType}

[입력된 활동 리스트]
${activitiesData}
            `.trim();

            const systemInstruction = `당신은 대한민국 고등학교 교사로서 나이스(NEIS)에 입력할 '창의적 체험활동 특기사항'을 작성하는 전문가입니다.
입력된 활동 리스트를 바탕으로 생활기록부를 작성하십시오.

### [핵심 목표: 개별화 및 차별화]
- **중요**: 동일한 활동 리스트라도, 학생마다 느낌과 표현 방식이 달라야 합니다.
- 이번 작성의 강조점: **"${randomVariance}"**

### [작성 절대 규칙]
1. **나열식 작성 (접속사 금지)**:
   - 활동과 활동 사이에 '이어서', '또한', '그 후' 같은 **접속사를 절대 사용하지 마십시오.**
   - 앞의 내용이 끝나면 바로 띄어쓰기 한 번 후 다음 활동으로 시작하십시오.

2. **활동별 작성 형식**:
   - **동아리활동일 경우**: 
     - 형식: **구체적 활동 내용 서술 + (AI가 창작한) 배우고 느낀점.**
     - 별도의 활동명이나 날짜 표기 없이, 자연스러운 문장으로 서술하십시오.
   - **자율활동 / 진로활동일 경우**: 
     - 형식: **활동명(날짜) 구체적 활동 내용 + (AI가 창작한) 배우고 느낀점.**
     - 날짜는 입력된 그대로 소괄호 안에 넣으십시오.

3. **내용 확장 (Sal-butigi)**:
   - 입력된 '활동내용'은 팩트(Fact) 위주이므로, 이를 교육적인 용어로 다듬고 학생의 **역량**과 **성장**이 드러나도록 문장을 풍성하게 만드십시오.
   - 각 활동마다 반드시 **느낀점/배운점/변화된 점**을 덧붙여야 합니다.

4. **문체 및 마무리**:
   - 모든 문장은 명사형 어미('~함.', '~임.')로 종결하십시오.
   - 거창한 미래 포부로 전체를 마무리하지 말고, 마지막 활동의 내용과 감상으로 담백하게 끝내십시오.
   - 전체 분량은 **공백 포함 1500바이트(약 500자) 내외**로 작성하십시오.

### [출력 예시]
(동아리활동 예시 - 활동내용만 입력됨)
산성비가 식물 성장에 미치는 영향 실험에서 산성도에 따른 콩나물의 생장 속도를 비교 분석함. 실험 데이터를 도표화하여 보고서를 작성하는 과정에서 정보 처리 역량을 기르고, 환경 오염의 심각성을 체감하며 환경 보존을 위한 실천 의지를 다짐함. 굴절 망원경 조작법을 익혀...

(자율/진로활동 예시 - 날짜, 활동명 포함)
수학여행(2025.06.04.-2025.06.06.)에서 베트남 다낭과 호이안의 문화유산을 탐방하며... (중략) ...공동체 의식을 함양함. AI 진로 캠프(2025.05.20.)에 참여하여...`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: inputData,
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.9, // Increased for variety
                    maxOutputTokens: 2500,
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
        setActivities([]);
        setCurrentDate("");
        setCurrentName("");
        setCurrentContent("");
        setPrompt("");
    };

    const handleTypeChange = (type: ActivityType) => {
        setActivityType(type);
        setActivities([]);
        setCurrentDate("");
        setCurrentName("");
        setCurrentContent("");
        setPrompt("");
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden transition-colors duration-200">
            <Header 
                title="창체 도우미" 
                icon="diversity_3" 
                colorClass="text-s4-primary" 
                bgClass="bg-s4-primary/20" 
                backLink={true}
            />
            
            <div className="flex flex-1 justify-center w-full">
                <div className="flex flex-col max-w-[1280px] w-full px-4 md:px-10 pb-20 pt-8">
                    <div className="mb-10 text-center space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-s4-primary/10 border border-s4-primary/20 w-fit mx-auto mb-2">
                            <span className="material-symbols-outlined text-s4-primary dark:text-orange-400 text-sm">stars</span>
                            <span className="text-xs font-bold text-orange-800 dark:text-orange-300 tracking-wide uppercase">AI 창의적 체험활동 생성</span>
                        </div>
                        <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
                            창의적 체험활동 <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-s4-secondary">AI 생성기</span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto font-normal">
                            {isClub ? (
                                <>
                                    <span className="font-bold text-s4-primary">활동 내용</span>을 구체적으로 입력하세요.<br className="hidden md:block"/>
                                    AI가 내용을 다듬고 느낀점을 추가하여 완성합니다.
                                </>
                            ) : (
                                <>
                                    날짜, 활동명, 내용을 입력하여 리스트를 만드세요.<br className="hidden md:block"/>
                                    AI가 <span className="font-bold text-s4-primary">'활동명(날짜) 내용 + 성장'</span> 형식으로 완성합니다.
                                </>
                            )}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-7 flex flex-col gap-6">
                            {/* Activity Type Selector */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 shadow-sm">
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        {id: "자율활동", icon: "accessibility_new"},
                                        {id: "동아리활동", icon: "groups"},
                                        // 봉사활동 Removed
                                        {id: "진로활동", icon: "rocket_launch"}
                                    ].map(act => (
                                        <label key={act.id} className="cursor-pointer" onClick={() => handleTypeChange(act.id as ActivityType)}>
                                            <input className="peer sr-only" type="radio" name="activityType" checked={activityType === act.id} onChange={() => handleTypeChange(act.id as ActivityType)} />
                                            <div className="flex flex-col items-center justify-center py-3 rounded-xl border border-transparent peer-checked:bg-s4-primary/10 peer-checked:border-s4-primary/20 peer-checked:text-s4-primary dark:peer-checked:text-orange-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                                <span className="material-symbols-outlined mb-1">{act.icon}</span>
                                                <span className="text-sm font-bold">{act.id}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Add Activity Form */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-s4-primary"></div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-slate-900 dark:text-white font-bold text-lg">
                                        {isClub ? "동아리 활동 내용 추가" : "활동 추가하기"}
                                    </h3>
                                    <span className="text-xs text-s4-primary font-bold bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-md">Step 1</span>
                                </div>
                                
                                {/* Non-Club Inputs: Date & Name */}
                                {!isClub && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">날짜 (기간)</label>
                                            <div className="relative">
                                                <input 
                                                    value={currentDate}
                                                    onChange={(e) => setCurrentDate(e.target.value)}
                                                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-s4-primary focus:border-transparent py-2.5 pl-4 pr-10 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm" 
                                                    placeholder="2025.03.02." 
                                                    type="text"
                                                />
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-slate-400 pointer-events-none text-[20px]">calendar_month</span>
                                                    <input 
                                                        type="date"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        onChange={(e) => {
                                                            if (e.target.value) {
                                                                // Convert 2024-03-02 to 2024.03.02.
                                                                const formatted = e.target.value.replace(/-/g, '.') + '.';
                                                                setCurrentDate(formatted);
                                                                e.target.value = ''; // Reset
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-slate-400 mt-1 ml-1">형식: YYYY.MM.DD. (직접 입력 또는 달력)</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">활동명</label>
                                            <input 
                                                value={currentName}
                                                onChange={(e) => setCurrentName(e.target.value)}
                                                className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-s4-primary focus:border-transparent py-2.5 px-4 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm" 
                                                placeholder="예: 수학여행, 진로체험의 날" 
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        활동 내용 
                                        <span className="text-xs font-normal text-slate-400 ml-1">(Fact 위주)</span>
                                    </label>
                                    <textarea 
                                        value={currentContent}
                                        onChange={(e) => setCurrentContent(e.target.value)}
                                        className="w-full h-24 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-s4-primary focus:border-transparent p-4 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none transition-all text-sm leading-relaxed" 
                                        placeholder={isClub ? "예: 산성비가 식물 성장에 미치는 영향 실험을 진행함. (활동명 없이 내용만 입력)" : "어떤 활동을 했는지 구체적인 사실 위주로 입력하세요."}
                                    ></textarea>
                                </div>

                                <button 
                                    onClick={handleAddActivity}
                                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">add_circle</span>
                                    <span>리스트에 추가</span>
                                </button>
                            </div>

                            {/* Activity List Display */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <h3 className="text-slate-900 dark:text-white font-bold text-lg">입력된 활동 리스트 <span className="text-s4-primary">({activities.length})</span></h3>
                                    {activities.length > 0 && (
                                        <button onClick={() => setActivities([])} className="text-xs text-red-500 hover:text-red-600 underline">전체 삭제</button>
                                    )}
                                </div>
                                
                                {activities.length === 0 ? (
                                    <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                        <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">playlist_add</span>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">위 양식을 작성하고 '추가' 버튼을 눌러주세요.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                                        {activities.map((item) => (
                                            <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex gap-4 group relative">
                                                <div className="flex-1 min-w-0">
                                                    {!isClub && (
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs font-bold text-s4-primary bg-orange-50 dark:bg-orange-900/30 px-2 py-0.5 rounded">{item.date}</span>
                                                            <h4 className="font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                                                        </div>
                                                    )}
                                                    <p className={`text-sm text-slate-600 dark:text-slate-400 line-clamp-2 ${isClub ? 'font-medium' : ''}`}>
                                                        {item.content}
                                                    </p>
                                                </div>
                                                <button 
                                                    onClick={() => handleDeleteActivity(item.id)}
                                                    className="self-center p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="삭제"
                                                >
                                                    <span className="material-symbols-outlined">delete</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={handleGenerate}
                                disabled={isLoading || activities.length === 0}
                                className="w-full py-5 bg-s4-primary hover:bg-orange-500 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 transition-all transform hover:scale-[1.01] active:scale-[0.99] text-lg flex items-center justify-center gap-3 group mt-4"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>AI 통합 작성 중...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined group-hover:rotate-180 transition-transform text-2xl">auto_awesome</span>
                                        <span>AI 창체 통합 생성</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <ResultPanel 
                            promptText={prompt} 
                            setPromptText={setPrompt}
                            isLoading={isLoading}
                            onReset={handleReset}
                            title="생성된_창체.txt"
                            colorClass="text-s4-primary"
                            defaultText={
                                <>
                                    <p><span className="text-orange-400">Activity:</span> {activityType}</p>
                                    <p><span className="text-orange-300">Format:</span> {isClub ? "내용 + 성장" : "활동명(날짜) 내용 + 성장"}</p>
                                    <p><span className="text-yellow-400">Check:</span><br/>
                                    - 접속사 없이 활동 나열<br/>
                                    - 학생별 개별화/차별화 적용<br/>
                                    - 1500바이트 내외 완성</p>
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

export default CreativeScreen;