import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Brain, 
  Chrome, 
  ArrowRight, 
  Sparkles, 
  Globe, 
  Download,
  CheckCircle2,
  LogOut
} from "lucide-react";
import { Memory } from "../types";

interface HomepageProps {
  onStartApp: (tab?: string) => void;
  onLogin: () => void;
  onLogout?: () => void;
  initialMemories: Memory[];
  user?: any;
  theme: "dark" | "light";
}

export default function Homepage({ onStartApp, onLogin, onLogout, user, theme }: HomepageProps) {
  // Preset memories for the minimal live demo
  const presetDemoData = [
    {
      id: "linkedin",
      site: "LinkedIn Jobs",
      url: "linkedin.com/jobs",
      icon: "💼",
      badge: "CAREER INTEL",
      title: "Staff Frontend Architect — Seattle",
      highlight: "Principal Recruiter: John Doe (met at Seattle dev meet)",
      note: "Met recruiter John. Reach out next Tuesday to follow up on my portfolio feedback.",
      priority: "high"
    },
    {
      id: "github",
      site: "GitHub Repo",
      url: "github.com/react",
      icon: "🐙",
      badge: "DEV NOTES",
      title: "facebook/react: UI Library",
      highlight: "compiler auto-memoization",
      note: "Review experimental React Compiler automatic tuning benchmarks for the production deployment.",
      priority: "medium"
    },
    {
      id: "amazon",
      site: "Amazon Shopping",
      url: "amazon.com/item",
      icon: "📦",
      badge: "PRICE WATCH",
      title: "Apple MacBook Pro M3 Max",
      highlight: "Limit: $2,499",
      note: "Price drop watch active. Check standard retail discounts before buying.",
      priority: "low"
    }
  ];

  const [activeDemo, setActiveDemo] = useState(presetDemoData[0]);

  return (
    <div className={`min-h-screen font-sans selection:bg-indigo-500/30 overflow-x-hidden relative pb-16 transition-colors duration-300 ${
      theme === "light" ? "bg-[#fcfcfc] text-zinc-900" : "bg-[#07070a] text-zinc-100"
    }`}>
      {/* Premium ambient decorative grids & gradients */}
      <div className={`absolute inset-0 bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none ${
        theme === "light" 
          ? "bg-[linear-gradient(to_right,#00000004_1px,transparent_1px),linear-gradient(to_bottom,#00000004_1px,transparent_1px)]"
          : "bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)]"
      }`}></div>

      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none"></div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 space-y-16 sm:space-y-20 relative z-10">
        
        {/* Minimal Hero Header */}
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border transition-colors ${
            theme === 'light'
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
              : 'bg-indigo-950/40 border-indigo-500/20 text-indigo-300'
          }`}>
            <Sparkles className={`w-3 h-3 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400 fill-indigo-400/20'}`} />
            Automatic URL Context Recall
          </div>
          
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] ${theme === 'light' ? 'text-zinc-900' : 'text-zinc-100'}`}>
            Remember everything<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              as you browse.
            </span>
          </h1>

          <p className={`text-sm leading-relaxed font-medium ${theme === 'light' ? 'text-zinc-600' : 'text-zinc-400'}`}>
            Attach comments, tasks, or clippings to any URL. Your saved thoughts automatically slide back into view whenever you return to that page.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button 
              onClick={() => onStartApp("browser")}
              className={`font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer ${
                theme === 'light'
                  ? 'bg-zinc-900 hover:bg-zinc-850 text-white'
                  : 'bg-zinc-100 hover:bg-white text-zinc-950'
              }`}
            >
              <Chrome className="w-4 h-4" />
              Launch Sandbox
            </button>
            <button 
              onClick={() => onStartApp("install-extension")}
              className={`font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border ${
                theme === 'light'
                  ? 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-250'
                  : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border-zinc-800'
              }`}
            >
              <Download className="w-4 h-4 text-indigo-500" />
              Get Extension
            </button>
            {/* <button 
              onClick={() => onStartApp("dashboard")}
              className={`font-bold text-xs px-4 py-3 rounded-xl transition-all cursor-pointer border ${
                theme === 'light'
                  ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-200/80'
                  : 'bg-zinc-950/80 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-zinc-900'
              }`}
            >
              Vault Dashboard
            </button> */}
          </div>
        </div>

        {/* 5-Second Comprehension Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              step: "1",
              title: "Save Thoughts",
              desc: "Highlight text or pin notes instantly on any website domain."
            },
            {
              step: "2",
              title: "Close the Tab",
              desc: "Close the page freely. Your reminders are indexed to the exact URL."
            },
            {
              step: "3",
              title: "Instant Recall",
              desc: "Revisit that website weeks later—your context slides back into view."
            }
          ].map((item) => (
            <div 
              key={item.step} 
              className={`border rounded-2xl p-4.5 space-y-2 transition-all duration-300 ${
                theme === 'light' 
                  ? 'bg-white border-zinc-200/80 text-zinc-900 shadow-sm' 
                  : 'bg-zinc-950/60 border-zinc-900 text-zinc-100'
              }`}
            >
              <div className="w-6 h-6 rounded bg-indigo-500/10 text-indigo-500 font-mono font-bold text-xs flex items-center justify-center border border-indigo-500/20">
                {item.step}
              </div>
              <h3 className={`font-bold text-xs ${theme === 'light' ? 'text-zinc-800' : 'text-zinc-200'}`}>{item.title}</h3>
              <p className={`text-[11px] leading-relaxed font-medium ${theme === 'light' ? 'text-zinc-500' : 'text-zinc-400'}`}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Centered Minimal Interactive Live Demo */}
        <div className="space-y-4">
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 ${theme === 'light' ? 'border-zinc-200/80' : 'border-zinc-900'}`}>
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${theme === 'light' ? 'text-zinc-600' : 'text-zinc-400'}`}>
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                Live Demo: Simulate Surf Flow
              </h3>
              <p className={`text-[10px] font-semibold ${theme === 'light' ? 'text-zinc-400' : 'text-zinc-500'}`}>Click a website below to see pre-saved memory layers auto-trigger.</p>
            </div>
            
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1 w-full sm:w-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              {presetDemoData.map((d) => {
                const isSelected = activeDemo.id === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setActiveDemo(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      isSelected 
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                        : theme === 'light'
                        ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-800 border border-zinc-200"
                        : "bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/50"
                    }`}
                  >
                    {d.icon} {d.site}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clean Mock Browser Sandbox Visual Frame */}
          <div className={`border rounded-2xl p-4.5 min-h-[220px] flex flex-col justify-between relative overflow-hidden transition-colors duration-300 ${
            theme === 'light'
              ? 'bg-zinc-50 border-zinc-200/80 shadow-md'
              : 'bg-zinc-950 border-zinc-850 shadow-2xl shadow-black/50'
          }`}>
            <div className="absolute top-[-5%] right-[-5%] w-[200px] h-[200px] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none"></div>

            {/* Mock Top bar */}
            <div className={`flex items-center justify-between pb-3.5 border-b ${theme === 'light' ? 'border-zinc-200/60' : 'border-zinc-900/60'}`}>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              </div>
              <div className={`px-4.5 py-1 rounded-lg text-[9px] font-mono border flex items-center gap-1 ${
                theme === 'light'
                  ? 'bg-white border-zinc-200/80 text-zinc-500 shadow-inner'
                  : 'bg-zinc-900 border-zinc-850/60 text-zinc-400'
              }`}>
                <span className="text-emerald-500">https://</span>
                <span className={`font-bold ${theme === 'light' ? 'text-zinc-800' : 'text-zinc-100'}`}>{activeDemo.url}</span>
              </div>
              <div className="w-6"></div>
            </div>

            {/* Mock Website Body Content */}
            <div className="flex-1 py-4 flex flex-col justify-center space-y-3">
              <div className="flex items-center gap-2.5">
                <span className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner ${
                  theme === 'light' ? 'bg-white border-zinc-200/80' : 'bg-zinc-900/80 border-zinc-850'
                }`}>{activeDemo.icon}</span>
                <div>
                  <div className="text-[8px] font-mono font-bold text-indigo-500 uppercase tracking-widest">{activeDemo.badge}</div>
                  <h4 className={`text-sm font-bold tracking-tight leading-tight ${theme === 'light' ? 'text-zinc-800' : 'text-zinc-200'}`}>{activeDemo.title}</h4>
                </div>
              </div>
              
              <div className="space-y-1.5 pl-1 shrink-0">
                <div className={`h-2 rounded w-11/12 ${theme === 'light' ? 'bg-zinc-200/80' : 'bg-zinc-900'}`}></div>
                <div className={`h-2 rounded w-2/3 ${theme === 'light' ? 'bg-zinc-200/80' : 'bg-zinc-900'}`}></div>
              </div>
            </div>

            {/* Slide-In Auto-Recall Overlay Notification inside browser frame */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDemo.id}
                initial={{ opacity: 0, x: 20, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`absolute right-4 bottom-4 left-4 sm:left-auto sm:w-[280px] border rounded-xl p-4 shadow-xl text-left transition-colors duration-300 ${
                  theme === 'light'
                    ? 'bg-white border-zinc-200/90 text-zinc-900 shadow-indigo-600/5'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-100 shadow-black/50'
                }`}
              >
                <div className={`flex items-center justify-between border-b pb-2 mb-2 ${theme === 'light' ? 'border-zinc-150' : 'border-zinc-850'}`}>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 uppercase font-mono tracking-wider">
                    <Brain className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                    Memory Recalled
                  </span>
                  <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${
                    activeDemo.priority === 'high' 
                      ? 'bg-rose-100 text-rose-700 border border-rose-200/60' 
                      : activeDemo.priority === 'medium'
                      ? 'bg-amber-100 text-amber-700 border border-amber-200/60'
                      : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                  }`}>
                    {activeDemo.priority}
                  </span>
                </div>
                
                <p className={`text-[11px] leading-relaxed font-medium italic pl-2.5 border-l-2 border-indigo-500 ${theme === 'light' ? 'text-zinc-700' : 'text-zinc-200'}`}>
                  &ldquo;{activeDemo.note}&rdquo;
                </p>
                
                <div className={`flex justify-between items-center text-[8px] font-mono font-semibold pt-2 mt-2 border-t ${
                  theme === 'light' ? 'border-zinc-150 text-zinc-400' : 'border-zinc-850/60 text-zinc-500'
                }`}>
                  <span className="flex items-center gap-0.5"><CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" /> Context Synced</span>
                  <span>Auto match</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </main>
    </div>
  );
}
