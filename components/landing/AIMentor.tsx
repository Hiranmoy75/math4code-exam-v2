"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState, useEffect } from "react";
import {
    Bot, X, Loader2, Send, MessageSquare, ShoppingCart,
    ChevronsRight, ChevronsLeft, Plus, ChevronDown,
    Paperclip, Mic, ArrowUp
} from "lucide-react";
import { useChatHistory, useChatMessages, useCreateSession, useSaveMessage } from "@/hooks/student/useChat";
import { usePublicCourses } from "@/hooks/usePublicCourses";
import { usePublicTestSeries } from "@/hooks/usePublicTestSeries";
import { createClient } from "@/lib/supabase/client";
import { useTenantId } from "@/hooks/useTenantId";
import { useRouter } from "next/navigation";

// --- TYPES ---
export type Message = {
    id?: string;
    role: 'user' | 'ai';
    content: string;
    created_at?: string;
};

export type ChatSession = {
    id: string;
    title: string;
    created_at: string;
};

// --- REACT QUERY KEYS ---
export const chatKeys = {
    all: ['chat'] as const,
    sessions: () => [...chatKeys.all, 'sessions'] as const,
    messages: (sessionId: string | null) => [...chatKeys.all, 'messages', sessionId] as const,
};



// --- CENTRALIZED API CALL ---
export const callGemini = async (prompt: string, systemInstruction: string = ""): Promise<string> => {
    try {
        const response = await fetch("/api/ai/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, systemInstruction })
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || "Failed to generate response");
        }

        return data.text;
    } catch (error: any) {
        console.error("AI Mentor API Error:", error);
        throw error;
    }
};

// --- KaTeX Components ---
const useKaTeX = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if ((window as any).katex) { setIsLoaded(true); return; }
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css'; document.head.appendChild(link);
        const script = document.createElement('script'); script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js'; script.onload = () => setIsLoaded(true); document.head.appendChild(script);
    }, []);
    return isLoaded;
};
const LatexSpan = ({ content }: { content: string }) => {
    const spanRef = useRef<HTMLSpanElement>(null);
    const katexLoaded = useKaTeX();
    useEffect(() => {
        if (katexLoaded && spanRef.current && (window as any).katex) {
            try {
                (window as any).katex.render(content, spanRef.current, {
                    throwOnError: false,
                    output: 'html',
                    displayMode: false
                });
            } catch (e) {
                spanRef.current.innerText = content;
            }
        }
    }, [content, katexLoaded]);
    if (!katexLoaded) return <span className="font-mono text-pink-600">{content}</span>;
    return <span ref={spanRef} className="mx-1" />;
};

// --- MAIN CHAT COMPONENT ---
// --- CONSTANTS ---
const SUGGESTED_QUESTIONS = [
    "Tell me about IIT-JAM courses.",
    "Which test series is best for GATE Maths?",
    "How can I improve my Linear Algebra?",
    "Show me some courses under 500."
];

function AIMentorContent() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isGuest, setIsGuest] = useState(true);
    const tenantId = useTenantId();
    const supabaseClient = createClient();

    // Local Storage Helpers for Guest Mode
    const getLocalSessions = (): ChatSession[] => {
        if (typeof window === 'undefined') return [];
        return JSON.parse(localStorage.getItem('guest_chat_sessions') || '[]');
    };
    const saveLocalSession = (session: ChatSession) => {
        const sessions = getLocalSessions();
        localStorage.setItem('guest_chat_sessions', JSON.stringify([session, ...sessions]));
    };
    const getLocalMessages = (sessionId: string): Message[] => {
        if (typeof window === 'undefined') return [];
        return JSON.parse(localStorage.getItem(`guest_chat_messages_${sessionId}`) || '[]');
    };
    const saveLocalMessage = (sessionId: string, message: Message) => {
        const messages = getLocalMessages(sessionId);
        localStorage.setItem(`guest_chat_messages_${sessionId}`, JSON.stringify([...messages, message]));
    };

    // Initialize Unique User ID for Browser-wise History
    useEffect(() => {
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setUserId(session.user.id);
                setIsGuest(false);
            } else {
                let id = localStorage.getItem('chat_browser_id');
                if (!id) {
                    id = crypto.randomUUID?.() || 'chat-' + Math.random().toString(36).substring(2, 9);
                    localStorage.setItem('chat_browser_id', id);
                }
                setUserId(id);
                setIsGuest(true);
            }
        });

        const initUser = async () => {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (user) {
                setUserId(user.id);
                setIsGuest(false);
            } else {
                let id = localStorage.getItem('chat_browser_id');
                if (!id) {
                    id = crypto.randomUUID?.() || 'chat-' + Math.random().toString(36).substring(2, 9);
                    localStorage.setItem('chat_browser_id', id);
                }
                setUserId(id);
                setIsGuest(true);
            }
        };
        initUser();

        return () => subscription.unsubscribe();
    }, []);

    // React Query Hooks
    const { data: serverHistory, isLoading: isHistoryLoading } = useChatHistory(isGuest ? null : userId);
    const chatHistory = useMemo(() => {
        if (isGuest) return getLocalSessions();
        return serverHistory;
    }, [isGuest, serverHistory]);

    const { data: serverMessages, isLoading: isMessagesLoading } = useChatMessages(!isGuest ? currentSessionId : null);

    // FETCH REAL CATALOG DATA
    const { data: courses, isLoading: coursesLoading } = usePublicCourses();
    const { data: testSeries, isLoading: testsLoading } = usePublicTestSeries();

    // Mutations
    const createSessionMutation = useCreateSession();
    const saveMessageMutation = useSaveMessage();

    // Local UI state
    const [messages, setMessages] = useState<Message[] | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const knowledgeBase = useMemo(() => {
        if (coursesLoading || testsLoading || !courses || !testSeries) return "Catalog data is being updated. Ask the user to wait a moment if they need specific course details.";

        const coursesData = courses.slice(0, 50).map(c => ({
            id: c.id,
            title: c.title,
            price: c.price,
            category: c.category
        }));

        const testsData = testSeries.slice(0, 50).map(t => ({
            id: t.id,
            title: t.title,
            price: t.price
        }));

        return `
            COURSES: ${JSON.stringify(coursesData)}
            TEST SERIES: ${JSON.stringify(testsData)}
            INSTRUCTION: Use the above IDs in {{id}} format when recommending.
        `;
    }, [courses, testSeries, coursesLoading, testsLoading]);

    // Sync Messages (Local or Server)
    useEffect(() => {
        if (isGuest && currentSessionId) {
            setMessages(getLocalMessages(currentSessionId));
        } else if (serverMessages) {
            setMessages(serverMessages);
        } else if (currentSessionId === null) {
            setMessages(null);
        }
    }, [serverMessages, currentSessionId, isGuest]);

    const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
    useEffect(() => { if (isOpen && messages) scrollToBottom(); }, [messages, isOpen]);

    const loadSession = (sessionId: string) => {
        setCurrentSessionId(sessionId);
        setIsSidebarOpen(false);
    };

    const startNewChat = () => {
        setCurrentSessionId(null);
        setMessages(null);
        setIsSidebarOpen(false);
    };

    const handleSend = async () => {
        if (!query.trim()) return;
        const userText = query;

        // Optimistic Update
        const optimisticUserMsg: Message = { role: 'user', content: userText, created_at: new Date().toISOString() };
        setMessages(prev => prev ? [...prev, optimisticUserMsg] : [optimisticUserMsg]);
        setQuery("");
        setIsGenerating(true);

        try {
            let activeSessionId = currentSessionId;
            if (!activeSessionId) {
                if (!userId || !tenantId) throw new Error("Initializing session... please try again.");

                if (isGuest) {
                    const newSession: ChatSession = {
                        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
                        title: userText.length > 40 ? userText.substring(0, 40) + "..." : userText,
                        created_at: new Date().toISOString()
                    };
                    saveLocalSession(newSession);
                    activeSessionId = newSession.id;
                } else {
                    const newSession = await createSessionMutation.mutateAsync({ firstMessage: userText, userId, tenantId: tenantId! });
                    activeSessionId = newSession.id;
                }
                setCurrentSessionId(activeSessionId);
            }

            if (isGuest) {
                saveLocalMessage(activeSessionId!, optimisticUserMsg);
            } else {
                saveMessageMutation.mutate({ sessionId: activeSessionId!, role: 'user', content: userText, tenantId: tenantId! });
            }

            const systemPrompt = `
                You are Math4Code Ai expert, an expert AI tutor for Math4Code platform.
                
                KNOWLEDGE BASE: ${knowledgeBase}
                
                CRITICAL RULES:
                1. Answer user questions based on the knowledge base above.
                2. If you recommend a specific Course or Test Series, you MUST append its exact ID wrapped in double curly braces {{id}} immediately after the name (e.g., Course Name {{course-id-123}}).
                3. Use **bold** markdown for course titles and prices.
                4. ALWAYS use the Indian Rupee symbol (₹) for prices, never use the dollar sign ($).
                5. Use LaTeX format enclosed in single $ symbols for math expressions.
                6. Keep answers helpful, concise, and academic.
            `;

            const aiResponseText = await callGemini(userText, systemPrompt);

            const aiMsg: Message = { role: 'ai', content: aiResponseText, created_at: new Date().toISOString() };
            setMessages(prev => prev ? [...prev, aiMsg] : [aiMsg]);

            if (isGuest) {
                saveLocalMessage(activeSessionId!, aiMsg);
            } else {
                saveMessageMutation.mutate({ sessionId: activeSessionId!, role: 'ai', content: aiResponseText, tenantId: tenantId! });
            }

        } catch (e: any) {
            console.error("Chat Error:", e);
            const displayError = e.message || "Sorry, I'm having trouble. Please check your internet or try again later.";
            const errorMsg: Message = { role: 'ai', content: displayError, created_at: new Date().toISOString() };
            setMessages(prev => prev ? [...prev, errorMsg] : [errorMsg]);
        } finally {
            setIsGenerating(false);
            setTimeout(() => document.getElementById('chat-input')?.focus(), 100);
        }
    };

    const handleSuggestedQuestion = (question: string) => {
        setQuery(question);
        // We need to wait for state to update or just pass it directly
        setTimeout(() => {
            const btn = document.getElementById('chat-send-btn');
            btn?.click();
        }, 10);
    };

    const handleBuy = (productId: string) => {
        setIsOpen(false);
        router.push(`/courses/${productId}`); // Uncomment for real navigation
    };

    const parseFormattedText = (text: string) => {
        if (!text) return null;
        const boldChunks = text.split(/(\*\*.*?\*\*)/g);
        return boldChunks.map((chunk, i) => {
            if (chunk.startsWith('**') && chunk.endsWith('**')) {
                return <strong key={`bold-${i}`} className="font-bold text-[#1F2A6B]">{chunk.slice(2, -2)}</strong>;
            }
            const mathChunks = chunk.split(/(\$[^\$]+\$)/g);
            return mathChunks.map((subChunk, j) => {
                if (subChunk.startsWith('$') && subChunk.endsWith('$')) {
                    return <LatexSpan key={`math-${i}-${j}`} content={subChunk.slice(1, -1)} />;
                }
                return <span key={`text-${i}-${j}`}>{subChunk}</span>;
            });
        });
    };

    const renderMessageContent = (text: string) => {
        if (!text) return null;

        // 1. Extract IDs from the text to separate them from the message content
        const productIds: string[] = [];
        const cleanText = text.replace(/\{\{([a-zA-Z0-9-_]+)\}\}/g, (match, id) => {
            productIds.push(id);
            return ""; // Remove the ID tag from the display text
        });

        // 2. Resolve Products from the IDs
        const products = productIds.map(id => {
            return courses?.find(c => c.id === id) || testSeries?.find(t => t.id === id);
        }).filter(Boolean); // Filter out undefined if ID not found

        return (
            <div className="flex flex-col gap-3">
                {/* Render the clean text (without {{id}} tags) */}
                <div className="whitespace-pre-wrap leading-relaxed">
                    {parseFormattedText(cleanText)}
                </div>

                {/* Render Horizontal Scrolling Carousel if products exist */}
                {products.length > 0 && (
                    <div className="flex gap-4 overflow-x-auto pb-4 pt-2 -mx-2 px-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent items-stretch">
                        {products.map((product, idx) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={`${product!.id}-${idx}`}
                                className="min-w-[240px] w-[240px] bg-white rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden shrink-0"
                            >
                                {/* Thumbnail Image */}
                                <div className="h-32 w-full bg-gray-100 relative overflow-hidden">
                                    {product!.thumbnail_url ? (
                                        <img
                                            src={product!.thumbnail_url}
                                            alt={product!.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-indigo-50 to-purple-50 text-indigo-200">
                                            <Bot size={40} />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold text-indigo-600 shadow-sm">
                                        ₹{product!.price}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-3 flex flex-col flex-1">
                                    <div className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider mb-1">
                                        {(product as any).category || 'Course'}
                                    </div>
                                    <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1 line-clamp-2" title={product!.title}>
                                        {product!.title}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 flex-1">
                                        {product!.description || "No description available."}
                                    </p>

                                    <button
                                        onClick={() => handleBuy(product!.id)}
                                        className="w-full bg-[#1F2A6B] hover:bg-indigo-800 active:scale-95 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all mt-auto"
                                    >
                                        <ShoppingCart size={14} /> View Details
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[500px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-100 z-9999 overflow-hidden flex flex-col font-sans"
                    >
                        {/* --- HEADER --- */}
                        <div className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40 sticky top-0">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 hover:bg-gray-100/80 rounded-full transition-colors text-gray-600 active:scale-90"
                            >
                                <ChevronsRight size={20} className={`${isSidebarOpen ? 'rotate-180' : ''} transition-transform duration-300`} />
                            </button>

                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-linear-to-tr from-pink-500 to-orange-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                    <Bot size={14} />
                                </div>
                                <span className="font-semibold text-gray-800 text-sm">Math4Code Ai</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <button onClick={startNewChat} className="p-2 hover:bg-gray-100 rounded-full text-gray-600" title="New Chat">
                                    <Plus size={20} />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600" title="Close">
                                    <ChevronDown size={20} />
                                </button>
                            </div>
                        </div>

                        {/* --- CONTENT CONTAINER --- */}
                        <div className="flex-1 relative flex overflow-hidden">

                            {/* --- SIDEBAR (HISTORY) --- */}
                            <AnimatePresence>
                                {isSidebarOpen && (
                                    <motion.div
                                        initial={{ x: "-100%" }}
                                        animate={{ x: 0 }}
                                        exit={{ x: "-100%" }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        className="absolute top-0 left-0 bottom-0 w-64 bg-white z-30 shadow-[4px_0_24px_rgba(0,0,0,0.05)] border-r border-gray-100 flex flex-col"
                                    >
                                        <div className="p-4 flex justify-between items-center text-gray-500 text-xs font-medium tracking-wider">
                                            QUICK ACTIONS
                                            <button onClick={() => setIsSidebarOpen(false)} className="hover:text-gray-800"><ChevronsLeft size={18} /></button>
                                        </div>

                                        <div className="px-2">
                                            <button onClick={startNewChat} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl text-left text-gray-700 transition-colors">
                                                <MessageSquare size={18} className="text-gray-400" />
                                                <span className="text-sm font-medium">Start new chat</span>
                                            </button>
                                        </div>

                                        <div className="mt-6 px-4 text-gray-500 text-xs font-medium tracking-wider mb-2">
                                            RECENT CONVERSATIONS
                                        </div>
                                        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-200">
                                            {isHistoryLoading ? (
                                                <div className="flex justify-center p-4"><Loader2 size={16} className="animate-spin text-gray-400" /></div>
                                            ) : chatHistory?.length === 0 ? (
                                                <div className="px-4 text-xs text-gray-400 italic">No history yet</div>
                                            ) : (
                                                chatHistory?.map((hist: any) => (
                                                    <button
                                                        key={hist.id}
                                                        onClick={() => loadSession(hist.id)}
                                                        className={`w-full text-left p-3 rounded-xl text-sm truncate transition-all duration-200
                                                        ${currentSessionId === hist.id
                                                                ? 'bg-indigo-50 text-[#1F2A6B] font-medium shadow-sm'
                                                                : 'hover:bg-gray-50 text-gray-600'
                                                            }`}
                                                    >
                                                        {hist.title}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* --- CHAT AREA --- */}
                            <div className="flex-1 flex flex-col bg-white w-full">
                                <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">

                                    {!messages && !isMessagesLoading && (
                                        <div className="h-full flex flex-col items-center justify-center p-4">
                                            <div className="w-16 h-16 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center mb-6 shadow-xl shadow-indigo-100 animate-bounce">
                                                <Bot size={32} className="text-white" />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-800">Hi! I'm your Math Mentor</h2>
                                            <p className="text-sm text-gray-500 mt-2 mb-8 text-center max-w-[280px]">
                                                {coursesLoading ? "Updating my catalog..." : "Ask me anything about IIT-JAM, GATE, or our platform."}
                                            </p>

                                            <div className="w-full space-y-2">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-2">TRY ASKING</p>
                                                {SUGGESTED_QUESTIONS.map((q, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleSuggestedQuestion(q)}
                                                        className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 transition-all text-xs text-gray-600 border border-gray-100 flex items-center group"
                                                    >
                                                        <span className="flex-1">{q}</span>
                                                        <Send size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Loading State (Messages) */}
                                    {isMessagesLoading && (
                                        <div className="flex justify-center items-center h-full">
                                            <Loader2 className="animate-spin text-gray-300" size={24} />
                                        </div>
                                    )}

                                    {messages && messages.map((msg, idx) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            key={idx}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            {msg.role === 'ai' && (
                                                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center mr-2 shrink-0 mt-1 shadow-sm border border-white">
                                                    <Bot size={16} className="text-white" />
                                                </div>
                                            )}
                                            <div
                                                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm relative group/msg transition-all duration-300
                                                ${msg.role === 'user'
                                                        ? 'bg-[#1F2A6B] text-white rounded-tr-sm'
                                                        : msg.content.includes("Sorry, I'm having trouble")
                                                            ? 'bg-red-50 border border-red-100 text-red-700'
                                                            : 'bg-white border border-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                {renderMessageContent(msg.content)}
                                                {msg.role === 'ai' && msg.content.includes("Sorry, I'm having trouble") && (
                                                    <button
                                                        onClick={() => {
                                                            const lastUserMsg = [...messages!].reverse().find(m => m.role === 'user');
                                                            if (lastUserMsg) {
                                                                setQuery(lastUserMsg.content);
                                                                setTimeout(() => document.getElementById('chat-send-btn')?.click(), 50);
                                                            }
                                                        }}
                                                        className="mt-2 text-[10px] font-bold uppercase tracking-wider text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors"
                                                    >
                                                        <Plus size={10} className="rotate-45" /> Retry Now
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}

                                    {isGenerating && (
                                        <div className="flex items-center gap-2 pl-2 animate-pulse">
                                            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-pink-500 to-orange-400 flex items-center justify-center shadow-sm">
                                                <Bot size={16} className="text-white" />
                                            </div>
                                            <div className="bg-gray-100 rounded-full px-4 py-2 text-xs text-gray-500 flex items-center gap-2">
                                                <Loader2 size={12} className="animate-spin" /> Thinking...
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* --- FOOTER INPUT --- */}
                                <div className="p-4 bg-white z-10 border-t border-gray-50">
                                    <div className="relative group">
                                        <div className={`absolute -inset-px rounded-[24px] bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-30 transition-opacity duration-300 ${query ? 'opacity-100' : 'group-hover:opacity-60 opacity-0'}`} />

                                        <div className="relative flex items-center bg-white border border-gray-200 rounded-[22px] px-4 py-2 shadow-sm focus-within:border-transparent">
                                            <button className="text-gray-400 hover:text-gray-600 transition-colors p-1" title="Attach file (Demo)">
                                                <Paperclip size={20} />
                                            </button>

                                            <input
                                                id="chat-input"
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSend();
                                                    }
                                                }}
                                                placeholder="Ask me anything..."
                                                className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-gray-700 placeholder:text-gray-400 font-normal"
                                            />

                                            <div className="flex items-center gap-2">
                                                {!query && (
                                                    <button className="text-gray-400 hover:text-gray-600 p-1" title="Voice Input (Demo)">
                                                        <Mic size={20} />
                                                    </button>
                                                )}
                                                <button
                                                    id="chat-send-btn"
                                                    onClick={handleSend}
                                                    disabled={!query.trim() || isGenerating}
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 
                                                    ${query.trim() ? 'bg-black text-white hover:scale-105 shadow-md' : 'bg-gray-100 text-gray-300'}`}
                                                >
                                                    <ArrowUp size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center mt-2">
                                        <p className="text-[10px] text-gray-400">AI can make mistakes. Please double-check responses.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-9998 bg-[#1F2A6B] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
        </>
    );
}

// --- WRAPPER WITH QUERY PROVIDER ---
export default function AIMentor() {
    // This wrapper ensures React Query works even if the global provider is missing in the playground


    return (
        <AIMentorContent />
    );
}
