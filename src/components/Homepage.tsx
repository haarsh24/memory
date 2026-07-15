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
}

export default function Homepage({ onStartApp, onLogin, onLogout, user }: HomepageProps) {
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
    <div className="bg-[#07070a] text-zinc-100 min-h-screen font-sans selection:bg-indigo-500/30 overflow-x-hidden relative pb-16">
      {/* Premium ambient decorative grids & gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none"></div>

      {/* Modern Slim Sticky Navigation */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between sticky top-0 z-50 bg-[#07070a]/80 backdrop-blur-md border-b border-zinc-900/60 gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer shrink-0" onClick={() => onStartApp("home")}>
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-md">
            <Brain className="w-4.5 h-4.5 text-indigo-400" />
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-xs sm:text-sm text-zinc-100 block">Memory</span>
            <span className="text-[7px] sm:text-[8px] font-mono font-bold tracking-widest text-indigo-400 uppercase">SECOND BRAIN</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button 
            id="header_vault_landing_btn"
            onClick={() => onStartApp("dashboard")}
            className="px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-zinc-300 hover:text-zinc-100 transition-colors cursor-pointer bg-zinc-900/40 hover:bg-zinc-850/80 border border-zinc-800/60"
          >
            Vault Dashboard
          </button>

          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="hidden md:inline text-zinc-500 text-[10px] bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-900/60 font-mono max-w-[120px] truncate">{user.email}</span>
              <button 
                id="header_logout_landing_btn"
                onClick={onLogout}
                className="text-zinc-400 hover:text-rose-450 text-[10px] font-bold transition-all px-2.5 py-1.5 bg-zinc-950/25 hover:bg-rose-950/10 rounded-lg border border-zinc-900 hover:border-rose-900/10 cursor-pointer flex items-center gap-1"
                title="Sign Out"
              >
                <span className="hidden xs:inline">Sign Out</span>
                <LogOut className="w-3.5 h-3.5 xs:w-3 xs:h-3" />
              </button>
            </div>
          ) : (
            <button 
              id="header_login_landing_btn"
              onClick={onLogin}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}

          <button 
            id="launch_simulator_landing_btn"
            onClick={() => onStartApp("browser")}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/10 shrink-0"
          >
            <span>Launch Demo</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 space-y-16 sm:space-y-20 relative z-10">
        
        {/* Minimal Hero Header */}
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-505 bg-indigo-950/40 border border-indigo-500/20 rounded-full text-indigo-300 text-[10px] font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-indigo-400 fill-indigo-400/20" />
            Automatic URL Context Recall
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-zinc-100">
            Remember everything<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              as you browse.
            </span>
          </h1>

          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            Attach comments, tasks, or clippings to any URL. Your saved thoughts automatically slide back into view whenever you return to that page.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button 
              onClick={() => onStartApp("browser")}
              className="bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Chrome className="w-4 h-4" />
              Launch Sandbox
            </button>
            <button 
              onClick={() => onStartApp("install-extension")}
              className="bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 font-bold text-xs px-5 py-3 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-zinc-400" />
              Get Extension
            </button>
            <button 
              onClick={() => onStartApp("dashboard")}
              className="bg-zinc-950/80 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-900 font-bold text-xs px-4 py-3 rounded-xl transition-all cursor-pointer"
            >
              Vault Dashboard
            </button>
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
            <div key={item.step} className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-4.5 space-y-2">
              <div className="w-6 h-6 rounded bg-indigo-500/10 text-indigo-400 font-mono font-bold text-xs flex items-center justify-center border border-indigo-500/20">
                {item.step}
              </div>
              <h3 className="font-bold text-xs text-zinc-200">{item.title}</h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Centered Minimal Interactive Live Demo */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                Live Demo: Simulate Surf Flow
              </h3>
              <p className="text-[10px] text-zinc-500 font-semibold">Click a website below to see pre-saved memory layers auto-trigger.</p>
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
          <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-4.5 min-h-[220px] flex flex-col justify-between relative overflow-hidden shadow-2xl">
            <div className="absolute top-[-5%] right-[-5%] w-[200px] h-[200px] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none"></div>

            {/* Mock Top bar */}
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-900/60">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              </div>
              <div className="bg-zinc-900 px-4.5 py-1 rounded-lg text-[9px] font-mono text-zinc-400 border border-zinc-850/60 flex items-center gap-1">
                <span className="text-emerald-500">https://</span>
                <span className="text-zinc-100 font-bold">{activeDemo.url}</span>
              </div>
              <div className="w-6"></div>
            </div>

            {/* Mock Website Body Content */}
            <div className="flex-1 py-4 flex flex-col justify-center space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl bg-zinc-900/80 w-10 h-10 rounded-xl flex items-center justify-center border border-zinc-850 shadow-inner">{activeDemo.icon}</span>
                <div>
                  <div className="text-[8px] font-mono font-bold text-indigo-400 uppercase tracking-widest">{activeDemo.badge}</div>
                  <h4 className="text-sm font-bold text-zinc-200 tracking-tight leading-tight">{activeDemo.title}</h4>
                </div>
              </div>
              
              <div className="space-y-1.5 pl-1 shrink-0">
                <div className="h-2 bg-zinc-900 rounded w-11/12"></div>
                <div className="h-2 bg-zinc-900 rounded w-2/3"></div>
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
                className="absolute right-4 bottom-4 left-4 sm:left-auto sm:w-[280px] bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-xl text-left"
              >
                <div className="flex items-center justify-between border-b border-zinc-850 pb-2 mb-2">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 uppercase font-mono tracking-wider">
                    <Brain className="w-3 h-3 text-indigo-400" />
                    Memory Recalled
                  </span>
                  <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${
                    activeDemo.priority === 'high' 
                      ? 'bg-rose-950/50 text-rose-400 border border-rose-500/10' 
                      : activeDemo.priority === 'medium'
                      ? 'bg-amber-950/50 text-amber-400 border border-amber-500/10'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {activeDemo.priority}
                  </span>
                </div>
                
                <p className="text-[11px] text-zinc-200 leading-relaxed font-medium italic pl-2.5 border-l border-indigo-500">
                  &ldquo;{activeDemo.note}&rdquo;
                </p>
                
                <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 font-semibold pt-2 mt-2 border-t border-zinc-850/60">
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
