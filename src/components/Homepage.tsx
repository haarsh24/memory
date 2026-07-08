import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Brain, Chrome, Shield, ArrowRight, Play, Check, Sparkles, HelpCircle, History, Bookmark, MessageSquare, ArrowUpRight } from "lucide-react";
import { Memory } from "../types";

interface HomepageProps {
  onStartApp: (tab?: string) => void;
  onLogin: () => void;
  initialMemories: Memory[];
}

export default function Homepage({ onStartApp, onLogin, initialMemories }: HomepageProps) {
  const [activeMockIndex, setActiveMockIndex] = useState(0);
  const [demoSearchQuery, setDemoSearchQuery] = useState("");
  const [demoSearchResults, setDemoSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Simulated browser mockup items for the hero section
  const mockScreens = [
    {
      url: "linkedin.com/in/john-doe",
      site: "LinkedIn",
      icon: "💼",
      color: "bg-blue-600",
      content: "John Doe • Tech Recruiter at Microsoft",
      memory: {
        note: "Met him at React India. Works at Microsoft. Follow up in August.",
        date: "July 1, 2026",
        priority: "high"
      }
    },
    {
      url: "amazon.in/macbook-pro",
      site: "Amazon",
      icon: "📦",
      color: "bg-amber-500",
      content: "Apple MacBook Pro (M3, 14-inch) - Amazon Price Tracker",
      memory: {
        note: "Buy after salary. Target price ₹95,000 for sale trigger.",
        date: "July 2, 2026",
        priority: "medium"
      }
    },
    {
      url: "github.com/facebook/react",
      site: "GitHub",
      icon: "🐙",
      color: "bg-zinc-800",
      content: "facebook/react: A JavaScript library for building user interfaces",
      memory: {
        note: "Use this library in the analytics dashboard module.",
        date: "July 3, 2026",
        priority: "low"
      }
    },
    {
      url: "youtube.com/watch?v=react-compiler",
      site: "YouTube",
      icon: "📺",
      color: "bg-red-600",
      content: "React Compiler: Deep Dive & Architecture Explained",
      memory: {
        note: "Resume from 18:42 — this section explains auto-memoization.",
        date: "July 4, 2026",
        priority: "low"
      }
    }
  ];

  // Auto-rotating mock browser in Hero
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMockIndex((prev) => (prev + 1) % mockScreens.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [mockScreens.length]);

  // Demo semantic search feature on homepage
  const handleDemoSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoSearchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch("/api/gemini/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: demoSearchQuery, memories: initialMemories }),
      });
      const data = await response.json();
      setDemoSearchResults(data.results || []);
    } catch (err) {
      console.error(err);
      // Local fallback in case server fails
      const results = initialMemories.filter(m => 
        m.originalNote.toLowerCase().includes(demoSearchQuery.toLowerCase()) ||
        m.websiteName.toLowerCase().includes(demoSearchQuery.toLowerCase())
      );
      setDemoSearchResults(results);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen font-sans selection:bg-indigo-100 overflow-x-hidden">
      
      {/* Top Header Navigation */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-100 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onStartApp("home")}>
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-sans font-semibold tracking-tight text-xl text-slate-900">Memory</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#why" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">Why Memory</a>
          <a href="#works-everywhere" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">Works Everywhere</a>
          <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">How It Works</a>
          <a href="#search-demo" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">Semantic Search</a>
        </nav>

        <div className="flex items-center gap-3">
          <button 
            id="login_header_btn"
            onClick={onLogin}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Sign In
          </button>
          <button 
            id="start_demo_header_btn"
            onClick={() => onStartApp("browser")}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-150 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            Launch Virtual Browser
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Hero Content */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.py-1 py-1 px-3 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            Chrome Extension Built for the Curious
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
            Remember what <span className="text-indigo-600">mattered</span>.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Attach your thoughts, decisions, context and memories to any webpage. The next time you visit, Memory quietly brings them back.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <button 
              id="hero_install_btn"
              onClick={() => onStartApp("browser")}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3.5 rounded-xl shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2 text-base hover:scale-[1.02] active:scale-[0.98]"
            >
              <Chrome className="w-5 h-5" />
              Try Extension Demo
            </button>
            <button 
              id="hero_dashboard_btn"
              onClick={() => onStartApp("dashboard")}
              className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 hover:text-slate-900 font-medium px-8 py-3.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 text-base"
            >
              <Brain className="w-5 h-5 text-indigo-600" />
              Open Dashboard
            </button>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> No complex database needed</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Fully Semantic Matching</span>
          </div>
        </div>

        {/* Right Hero Content: Live Browser Mockup Loop */}
        <div className="flex-1 w-full max-w-xl">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative aspect-video flex flex-col">
            
            {/* Mock browser header */}
            <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
              </div>
              <div className="flex-1 bg-white border border-slate-100 px-3 py-1 rounded-lg text-xs text-slate-400 font-mono truncate flex items-center gap-2">
                <span className="text-emerald-500">https://</span>
                {mockScreens[activeMockIndex].url}
              </div>
            </div>

            {/* Mock website content area */}
            <div className="flex-1 p-6 bg-slate-50/50 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${mockScreens[activeMockIndex].color} flex items-center justify-center text-white font-bold text-sm`}>
                    {mockScreens[activeMockIndex].icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-800">{mockScreens[activeMockIndex].site}</h3>
                    <p className="text-xs text-slate-400">Current tab content loaded</p>
                  </div>
                </div>
                
                {/* Simulated webpage content placeholder */}
                <div className="space-y-2 pt-2">
                  <div className="text-sm font-medium text-slate-700">{mockScreens[activeMockIndex].content}</div>
                  <div className="w-full h-1.5 bg-slate-200/60 rounded"></div>
                  <div className="w-5/6 h-1.5 bg-slate-200/60 rounded"></div>
                  <div className="w-3/4 h-1.5 bg-slate-200/60 rounded"></div>
                </div>
              </div>

              {/* Floating Memory Extension Card sliding in overlay */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMockIndex}
                  initial={{ opacity: 0, x: 80, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -80, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute right-4 top-4 w-72 bg-white rounded-xl shadow-2xl border border-indigo-50 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
                      <Brain className="w-3.5 h-3.5" />
                      Memory Extension
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {mockScreens[activeMockIndex].memory.date}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-mono font-semibold">Your Notes</div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed italic bg-slate-50 p-2.5 rounded-lg border-l-2 border-indigo-500">
                      &ldquo;{mockScreens[activeMockIndex].memory.note}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className={`px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                      mockScreens[activeMockIndex].memory.priority === 'high' 
                        ? 'bg-rose-50 text-rose-600' 
                        : 'bg-amber-50 text-amber-600'
                    }`}>
                      {mockScreens[activeMockIndex].memory.priority} priority
                    </span>
                    <span className="text-slate-400 hover:text-indigo-600 cursor-pointer font-medium transition-colors flex items-center gap-1">
                      Recall active <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Why Memory Section */}
      <section id="why" className="bg-white border-y border-slate-100 py-24 scroll-mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">The difference defines the product.</h2>
            <p className="text-slate-500">Why Memory succeeds where bookmarks, search history, and browsers fail.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100/50 space-y-4 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <History className="w-6 h-6 text-slate-500" />
              </div>
              <h3 className="font-bold text-xl text-slate-800">Chrome History</h3>
              <div className="font-mono text-xs uppercase tracking-wider text-slate-400">Remembers</div>
              <p className="text-5xl font-extrabold text-slate-400 tracking-tight">Where</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                A chronological checklist of exact web addresses. Chrome knows you loaded a page, but has no comprehension of why or what you were thinking.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100/50 space-y-4 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <Bookmark className="w-6 h-6 text-slate-500" />
              </div>
              <h3 className="font-bold text-xl text-slate-800">Bookmarks</h3>
              <div className="font-mono text-xs uppercase tracking-wider text-slate-400">Remember</div>
              <p className="text-5xl font-extrabold text-slate-400 tracking-tight">Pages</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                A static list of links buried deep in browser folders. Bookmarks save the destination, but the core context gets lost over time.
              </p>
            </div>

            <div className="bg-indigo-50/50 rounded-2xl p-8 border border-indigo-100 space-y-4 shadow-xl shadow-indigo-100/30 hover:scale-[1.01] transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl"></div>
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-xl text-indigo-900">Memory</h3>
              <div className="font-mono text-xs uppercase tracking-wider text-indigo-500 font-semibold">Remembers</div>
              <p className="text-5xl font-extrabold text-indigo-600 tracking-tight">Why</p>
              <p className="text-sm text-indigo-700/80 leading-relaxed">
                Your personal, invisible context layer. Automatically surfaces the exact thoughts, action items, or decisions you annotated whenever you return.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Works Everywhere Section */}
      <section id="works-everywhere" className="py-24 bg-slate-50 scroll-mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Works on Every Webpage</h2>
            <p className="text-slate-500 leading-relaxed">No complicated integrations or configurations. Write a thought anywhere, and Memory connects the dots.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialMemories.map((mem) => (
              <div 
                key={mem.id}
                className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{mem.websiteIcon}</span>
                      <span className="font-semibold text-sm text-slate-800">{mem.websiteName}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      mem.priority === 'high' 
                        ? 'bg-rose-50 text-rose-600' 
                        : mem.priority === 'medium'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-slate-50 text-slate-500'
                    }`}>
                      {mem.priority}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-slate-500 truncate">{mem.pageTitle}</p>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed italic border-l-2 border-indigo-400 pl-3">
                      &ldquo;{mem.originalNote}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-4 text-[11px] text-slate-400">
                  <div className="flex gap-1.5">
                    {mem.tags.map(t => (
                      <span key={t} className="bg-slate-50 px-2 py-0.5 rounded text-slate-500">#{t}</span>
                    ))}
                  </div>
                  <span>{new Date(mem.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Semantic Search Live Demo */}
      <section id="search-demo" className="bg-white border-t border-slate-100 py-24 scroll-mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Search Your Memory Semantically</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Find notes by conceptual meaning. Search for &ldquo;laptop research&rdquo; and Memory will find your &ldquo;MacBook Pro&rdquo; pages, even if the keyword doesn't match exactly.
            </p>
          </div>

          <form onSubmit={handleDemoSearch} className="flex gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search conceptual meaning (e.g. laptop, Azure hire, compiling)..." 
                value={demoSearchQuery}
                onChange={(e) => setDemoSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
              />
            </div>
            <button 
              type="submit"
              disabled={isSearching}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium px-6 py-3.5 rounded-xl transition-colors flex items-center gap-2 text-sm shadow-md shadow-indigo-100"
            >
              {isSearching ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Brain className="w-4 h-4" />}
              Search AI
            </button>
          </form>

          {/* Preset queries */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto text-xs text-slate-500 font-medium">
            <span>Try searching:</span>
            {["Laptop reviews", "Microsoft contact", "API caching", "Video player timestamp"].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  setDemoSearchQuery(q);
                  // Trigger search immediately
                  setTimeout(() => {
                    const fakeEvent = { preventDefault: () => {} } as any;
                    setDemoSearchQuery(q);
                  }, 10);
                }}
                className="bg-slate-50 border border-slate-200/60 hover:bg-slate-100 px-2.5 py-1 rounded-md transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Real-time search output rendering */}
          <AnimatePresence mode="wait">
            {demoSearchResults.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="text-left space-y-4 max-w-2xl mx-auto bg-slate-50/50 rounded-2xl p-6 border border-slate-100"
              >
                <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider font-mono">Semantic Results ({demoSearchResults.length})</div>
                
                <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                  {demoSearchResults.map((res) => (
                    <div key={res.id} className="bg-white rounded-xl p-4 border border-slate-150 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{res.websiteIcon}</span>
                          <span className="font-bold text-xs text-slate-800">{res.websiteName}</span>
                          {res.relevanceScore && (
                            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">
                              {Math.round(res.relevanceScore * 100)}% Match
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-400">{res.pageTitle}</p>
                        <p className="text-xs text-slate-700 italic pl-3 border-l border-slate-200">
                          &ldquo;{res.originalNote}&rdquo;
                        </p>
                      </div>
                      
                      {res.matchExplanation && (
                        <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-[10px] font-mono text-indigo-700 sm:self-start whitespace-nowrap">
                          {res.matchExplanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-50 scroll-mt-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Only Three Steps</h2>
            <p className="text-slate-500 leading-relaxed">Memory stays invisible until you actually need it. No workflows to modify.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="space-y-4 text-center md:text-left relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg mx-auto md:mx-0 shadow-lg shadow-indigo-50">1</div>
              <h3 className="font-bold text-lg text-slate-800">Visit Webpage</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Open any standard webpage in your browser. Read articles, watch tutorial guides, shop, or browse profiles.
              </p>
            </div>

            <div className="space-y-4 text-center md:text-left relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg mx-auto md:mx-0 shadow-lg shadow-indigo-50">2</div>
              <h3 className="font-bold text-lg text-slate-800">Write Remember Note</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Use the shortcut <kbd className="bg-slate-100 px-1.5 py-0.5 border border-slate-200 rounded text-xs text-slate-600 font-mono">Ctrl+Shift+M</kbd> to write down a quick thought, decision, or reminder.
              </p>
            </div>

            <div className="space-y-4 text-center md:text-left relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg mx-auto md:mx-0 shadow-lg shadow-indigo-100">3</div>
              <h3 className="font-bold text-lg text-indigo-950">Automatic Recall</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Whenever you revisit that webpage or any semantically similar webpage, your thoughts slide in quietly in the corner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="bg-white py-24 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-150 flex items-center justify-center mx-auto text-slate-700 shadow-md">
            <Shield className="w-8 h-8 text-indigo-600" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Your Data, Private by Default</h2>
            <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
              Every memory is encrypted and fully private to you. AI is used solely to assist with automated categorizations, smart project groupings, tags, and semantic search. We never sell your memory profile.
            </p>
          </div>
        </div>
      </section>

      {/* Footer / Call To Action */}
      <footer className="bg-slate-50 py-16 text-center border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">Memory</span>
          </div>

          <p className="text-sm text-slate-400">© 2026 Memory. All rights reserved. Built for competition demonstration.</p>
        </div>
      </footer>

    </div>
  );
}
