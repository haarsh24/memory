import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Brain, 
  Chrome, 
  ArrowRight, 
  Sparkles, 
  Plus,
  Globe,
  NotebookPen,
  ArrowUpRight,
  Database,
  Fingerprint,
  Cpu,
  Sparkle,
  Zap,
  MousePointer,
  HelpCircle,
  RefreshCw,
  Download
} from "lucide-react";
import { Memory } from "../types";

interface HomepageProps {
  onStartApp: (tab?: string) => void;
  onLogin: () => void;
  initialMemories: Memory[];
}

export default function Homepage({ onStartApp, onLogin, initialMemories }: HomepageProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [interactiveUrl, setInteractiveUrl] = useState("linkedin.com/jobs");
  const [showNotification, setShowNotification] = useState(false);
  const [sandboxUrl, setSandboxUrl] = useState("");
  const [sandboxNote, setSandboxNote] = useState("");
  const [sandboxMemories, setSandboxMemories] = useState<Array<{url: string, note: string, site: string, icon: string}>>([
    { url: "github.com/react", note: "Look into compiler auto-memoization options tomorrow", site: "GitHub", icon: "🐙" },
    { url: "amazon.com/item", note: "Price target limit ₹1,80,000. Wait for Prime Day sale", site: "Amazon Shopping", icon: "📦" }
  ]);

  const explainSteps = [
    {
      title: "1. Land on any URL",
      desc: "Simulate surfing an article, job listing, or shopping page",
      icon: <Globe className="w-4 h-4 text-bento-orange" />,
      url: "linkedin.com/jobs",
      siteName: "LinkedIn Jobs",
      siteIcon: "💼",
      siteContent: "Frontend Architect • Microsoft Office Group • Redmond",
      badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20"
    },
    {
      title: "2. Pin Your Thoughts",
      desc: "Select text or click the floating extension to write a quick note",
      icon: <NotebookPen className="w-4 h-4 text-bento-teal" />,
      url: "linkedin.com/jobs",
      siteName: "LinkedIn Jobs",
      siteIcon: "💼",
      siteContent: "Frontend Architect • Microsoft Office Group • Redmond",
      note: "Met the principal recruiter John at the Seattle developer meetup. Follow up next Tuesday regarding the resume shortlisting.",
      highlight: "Frontend Architect",
      badgeColor: "bg-bento-teal/10 text-bento-teal border-bento-teal/20"
    },
    {
      title: "3. Infinite Auto-Recall",
      desc: "When you revisit later, your context layer slides back in instantly",
      icon: <Brain className="w-4 h-4 text-purple-400" />,
      url: "linkedin.com/jobs",
      siteName: "LinkedIn Jobs",
      siteIcon: "💼",
      siteContent: "Frontend Architect • Microsoft Office Group • Redmond",
      note: "Met the principal recruiter John at the Seattle developer meetup. Follow up next Tuesday regarding the resume shortlisting.",
      highlight: "Frontend Architect",
      recalled: true,
      badgeColor: "bg-purple-400/10 text-purple-400 border-purple-400/20"
    }
  ];

  // Auto-play steps loop to ensure immediate 5-second comprehension
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % explainSteps.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleInteractiveClick = (url: string) => {
    setInteractiveUrl(url);
    setShowNotification(true);
    const timer = setTimeout(() => setShowNotification(false), 2000);
    return () => clearTimeout(timer);
  };

  const handleAddSandbox = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sandboxUrl || !sandboxNote) return;
    
    const domain = sandboxUrl.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];
    const newMemo = {
      url: sandboxUrl.toLowerCase(),
      note: sandboxNote,
      site: domain.charAt(0).toUpperCase() + domain.slice(1).split(".")[0],
      icon: "📝"
    };

    setSandboxMemories([newMemo, ...sandboxMemories]);
    setSandboxUrl("");
    setSandboxNote("");
    
    // Quick auto-navigate demo to show instant recall
    setInteractiveUrl(newMemo.url);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2500);
  };

  // Get active simulated content based on user's manual interactive selection
  const getSimulatedPage = () => {
    if (interactiveUrl.includes("linkedin")) {
      return {
        icon: "💼",
        name: "LinkedIn Jobs",
        url: "linkedin.com/jobs",
        title: "Frontend Architect • Microsoft Office Group • Redmond",
        note: "Met the principal recruiter John at the Seattle developer meetup. Follow up next Tuesday regarding the resume shortlisting.",
        highlight: "Frontend Architect",
        priority: "high"
      };
    } else if (interactiveUrl.includes("amazon")) {
      return {
        icon: "📦",
        name: "Amazon Shopping",
        url: "amazon.com/item",
        title: "Apple MacBook Pro M3 Max (16-inch, 48GB RAM)",
        note: "Price target limit ₹1,80,000. Wait for Prime Day sale. Read verified battery life benchmarks first.",
        highlight: "48GB RAM",
        priority: "medium"
      };
    } else if (interactiveUrl.includes("github")) {
      return {
        icon: "🐙",
        name: "GitHub Repository",
        url: "github.com/react",
        title: "facebook/react: A JavaScript library for building user interfaces",
        note: "Look into compiler auto-memoization options tomorrow inside our production branch.",
        highlight: "compiler auto-memoization",
        priority: "low"
      };
    } else {
      // Custom sandbox memory
      const match = sandboxMemories.find(m => interactiveUrl.toLowerCase().includes(m.url.toLowerCase()) || m.url.toLowerCase().includes(interactiveUrl.toLowerCase()));
      if (match) {
        return {
          icon: match.icon,
          name: match.site,
          url: match.url,
          title: `Custom Simulated URL Webpage (${match.site})`,
          note: match.note,
          highlight: null,
          priority: "high"
        };
      }
      return {
        icon: "🌐",
        name: "Web Preview",
        url: interactiveUrl,
        title: "Simulated Custom Destination Page",
        note: "No memory note pinned to this URL yet. Type one in the sandbox tool below to save it!",
        highlight: null,
        priority: "low"
      };
    }
  };

  const simPage = getSimulatedPage();

  return (
    <div className="bg-[#07070a] text-white min-h-screen font-sans selection:bg-bento-orange/30 overflow-x-hidden relative pb-28">
      {/* Background grids & ambient neon meshes inspired by premium developer portfolios */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_85%,transparent_100%)]"></div>
      
      {/* High-end ambient color-burst spots */}
      <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-bento-orange/5 blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[15%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-bento-teal/5 blur-[160px] pointer-events-none"></div>

      {/* Modern Blurry Header Navigation */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between sticky top-0 z-50 bg-[#07070a]/75 backdrop-blur-md border-b border-white/[0.04]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onStartApp("home")}>
          <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95 duration-300">
            <Brain className="w-5.5 h-5.5 text-bento-orange animate-pulse" />
          </div>
          <div>
            <span className="font-display font-black tracking-tight text-lg text-white block">Memory Desk</span>
            <span className="text-[9px] font-mono font-extrabold tracking-widest text-bento-orange uppercase">KumarHarsh Signature Mode</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
          <a href="#explain-section" className="hover:text-white transition-colors">How it works</a>
          <a href="#interactive-playground" className="hover:text-white transition-colors">Recall Sandbox</a>
          <a href="#active-vault" className="hover:text-white transition-colors">Your Vault</a>
        </nav>

        <div className="flex items-center gap-3">
          <button 
            id="header_login_landing_btn"
            onClick={onLogin}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all"
          >
            Sign In
          </button>
          <button 
            id="launch_simulator_landing_btn"
            onClick={() => onStartApp("browser")}
            className="bg-white hover:bg-slate-100 text-[#07070a] px-5 py-3 rounded-2xl text-xs font-black tracking-tight shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 group"
          >
            Launch Browser
            <ArrowRight className="w-4 h-4 text-[#07070a] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* MAIN HERO */}
      <main className="max-w-6xl mx-auto px-6 pt-12 space-y-16 relative z-10">
        
        {/* Under-5-seconds immediate headline value */}
        <div className="text-center max-w-3xl mx-auto space-y-6 pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.04] border border-white/[0.08] rounded-full text-slate-300 text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm">
            <Sparkle className="w-3.5 h-3.5 text-bento-orange fill-bento-orange animate-spin-slow" />
            Zero-friction contextual bookmarking
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight leading-[1.03] text-white">
            Remember everything<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-bento-orange via-rose-500 to-indigo-400">
              as you browse.
            </span>
          </h1>

          <p className="text-sm sm:text-base font-semibold text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Attach notes and key highlight targets directly onto any URL. Whenever you visit that webpage again, Memory Desk automatically brings back your context in real-time.
          </p>

          {/* 3-Step Instant Explanation Grid for 5s comprehension */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto pt-4 text-left">
            <div className="bg-zinc-950/80 border border-white/[0.06] rounded-2xl p-5 space-y-2 relative overflow-hidden group hover:border-bento-orange/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-16 h-16 bg-bento-orange/5 rounded-full blur-xl"></div>
              <div className="w-8 h-8 rounded-lg bg-bento-orange/10 flex items-center justify-center font-mono font-black text-xs text-bento-orange border border-bento-orange/20">1</div>
              <h3 className="font-extrabold text-sm text-slate-200">1. Save on Any URL</h3>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                Click the brain icon or highlight text on any website to pin an important comment directly to that webpage.
              </p>
            </div>
            
            <div className="bg-zinc-950/80 border border-white/[0.06] rounded-2xl p-5 space-y-2 relative overflow-hidden group hover:border-rose-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-full blur-xl"></div>
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center font-mono font-black text-xs text-rose-500 border border-rose-500/20">2</div>
              <h3 className="font-extrabold text-sm text-slate-200">2. Close the Tab</h3>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                Go about your work. Your notes are securely index-matched and stored locally or synchronized in the cloud.
              </p>
            </div>

            <div className="bg-zinc-950/80 border border-white/[0.06] rounded-2xl p-5 space-y-2 relative overflow-hidden group hover:border-indigo-400/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl"></div>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center font-mono font-black text-xs text-indigo-400 border border-indigo-400/20">3</div>
              <h3 className="font-extrabold text-sm text-slate-200">3. Automatic Recall</h3>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                Whenever you revisit that URL next week or next month, your saved notes instantly slide back into view!
              </p>
            </div>
          </div>

          {/* Quick Launch Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button 
              onClick={() => onStartApp("browser")}
              className="bg-bento-orange hover:bg-bento-orange/90 text-white font-extrabold text-xs px-7 py-4.5 rounded-2xl transition-all duration-300 shadow-xl shadow-bento-orange/15 hover:scale-105 active:scale-95 flex items-center gap-2 border border-orange-400/10 cursor-pointer"
            >
              <Chrome className="w-4 h-4" />
              Try Sandbox Simulator
            </button>
            <button 
              onClick={() => onStartApp("install-extension")}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-7 py-4.5 rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-500/15 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer border border-indigo-500/10"
            >
              <Download className="w-4 h-4" />
              Install Chrome Extension
            </button>
            <button 
              onClick={() => onStartApp("dashboard")}
              className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white font-bold text-xs px-6 py-4.5 rounded-2xl transition-all duration-300 cursor-pointer"
            >
              Open Dashboard Vault
            </button>
          </div>
        </div>

        {/* 5-SECOND CONCEPT FLOW EXPLAINER STAGE */}
        <section id="explain-section" className="space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-display font-black tracking-tight text-slate-200">The 5-Second Concept Walkthrough</h2>
            <p className="text-xs text-slate-400 font-semibold">Watch how simple URL context recall works natively inside your flow</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white/[0.01] border border-white/[0.05] rounded-[36px] p-6 md:p-8 relative">
            
            {/* Steps panel left side (Interactive Tabs) */}
            <div className="lg:col-span-5 flex flex-col justify-center gap-3.5">
              {explainSteps.map((step, idx) => {
                const isSelected = activeStep === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`w-full text-left p-4.5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                      isSelected 
                        ? "bg-[#101015] border-white/[0.12] shadow-xl scale-[1.01]" 
                        : "bg-transparent border-transparent hover:bg-white/[0.01] hover:border-white/[0.03]"
                    }`}
                  >
                    {/* Active side indicator */}
                    {isSelected && (
                      <motion.div 
                        layoutId="active-indicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-bento-orange"
                      />
                    )}

                    <div className="flex items-start gap-4">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
                        isSelected ? "bg-white/[0.06] border-white/[0.12]" : "bg-white/[0.02] border-white/[0.05]"
                      }`}>
                        {step.icon}
                      </div>
                      <div className="space-y-1">
                        <h3 className={`text-sm font-display font-black transition-colors ${
                          isSelected ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                        }`}>
                          {step.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-semibold">{step.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Simulated Live Browser Mockup Viewport */}
            <div className="lg:col-span-7 bg-[#0b0b0e] rounded-2xl border border-white/[0.08] p-5 flex flex-col justify-between min-h-[390px] relative overflow-hidden shadow-inner">
              
              {/* Simulated browser navigation address bar */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.05] mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/85"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/85"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/85"></span>
                </div>

                {/* Simulated Domain Bar */}
                <div className="bg-white/[0.04] px-4 py-1.5 rounded-xl text-[10px] font-mono text-slate-400 flex items-center gap-1.5 w-full max-w-[280px] justify-center border border-white/[0.04]">
                  <span className="text-emerald-500">https://</span>
                  <motion.span 
                    key={activeStep}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white font-bold"
                  >
                    {explainSteps[activeStep].url}
                  </motion.span>
                </div>

                <div className="w-6"></div>
              </div>

              {/* Simulated Page Body */}
              <div className="flex-1 flex flex-col justify-center py-4 px-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl bg-white/[0.04] w-12 h-12 rounded-xl flex items-center justify-center border border-white/[0.08] shadow-inner">
                        {explainSteps[activeStep].siteIcon}
                      </span>
                      <div>
                        <h4 className="text-sm font-display font-black text-white">{explainSteps[activeStep].siteName}</h4>
                        <p className="text-[11px] text-slate-400 font-semibold">{explainSteps[activeStep].siteContent}</p>
                      </div>
                    </div>

                    {/* highlight layout overlay */}
                    {explainSteps[activeStep].highlight ? (
                      <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                        Selected text highlight target:{" "}
                        <span className="bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/30 font-bold">
                          &ldquo;{explainSteps[activeStep].highlight}&rdquo;
                        </span>{" "}
                        saved into our matching database.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <div className="h-2 bg-white/[0.03] rounded-lg w-3/4"></div>
                        <div className="h-2 bg-white/[0.03] rounded-lg w-1/2"></div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Float pop-in context memo layer representing step 2 & 3 */}
              <div className="min-h-[145px] flex items-end">
                <AnimatePresence>
                  {explainSteps[activeStep].note && (
                    <motion.div
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 30, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 420, damping: 28 }}
                      className="w-full bg-white text-[#07070a] rounded-2xl p-4.5 shadow-2xl relative border border-slate-200"
                    >
                      <div className="absolute -top-3 left-4 bg-bento-orange text-white text-[8px] font-mono font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5 animate-bounce">
                        <Sparkles className="w-3 h-3 text-white fill-white" />
                        {explainSteps[activeStep].recalled ? "Context Layer Restored" : "Sticky Memory Pinned"}
                      </div>

                      <div className="space-y-2 pt-1">
                        <p className="text-xs font-bold leading-relaxed text-slate-800 italic border-l-2 border-bento-orange pl-3.5 bg-slate-50 py-2 rounded-r-lg">
                          &ldquo;{explainSteps[activeStep].note}&rdquo;
                        </p>
                        
                        <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 font-bold pt-1">
                          <span className="text-indigo-600 font-black">HIGH PRIORITY ACTION</span>
                          <span>Auto-Triggered</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>
        </section>

        {/* 1-CLICK INTERACTIVE RECALL PLAYGROUND */}
        <section id="interactive-playground" className="space-y-6 pt-4">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-display font-black tracking-tight text-white">Live Recall Playground</h2>
            <p className="text-xs text-slate-400 font-semibold">
              Click a mock tab below to immediately see how Memory Desk restores the note matched with that URL.
            </p>
          </div>

          <div className="bg-[#0b0b0e] border border-white/[0.06] rounded-[36px] p-6 md:p-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left controller: tab buttons & customizable input */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.04] rounded-full text-bento-orange text-[9px] font-mono font-bold uppercase tracking-widest border border-white/[0.05]">
                    Interactive Controller
                  </div>
                  <h3 className="text-xl font-display font-black text-white">Simulate browsing preset tabs</h3>
                  <p className="text-xs text-slate-400 font-semibold">
                    We've pre-saved comments for these websites. Click them to trigger real-time, matching overlay previews.
                  </p>
                </div>

                {/* Preset Tab Buttons */}
                <div className="flex flex-col gap-2">
                  {[
                    { site: "LinkedIn Jobs", url: "linkedin.com/jobs", icon: "💼" },
                    { site: "Amazon Shopping", url: "amazon.com/item", icon: "📦" },
                    { site: "GitHub Repo", url: "github.com/react", icon: "🐙" }
                  ].map((s) => {
                    const isSelected = interactiveUrl === s.url;
                    return (
                      <button
                        key={s.url}
                        onClick={() => handleInteractiveClick(s.url)}
                        className={`w-full px-4.5 py-3.5 rounded-xl text-left flex items-center justify-between transition-all duration-300 relative ${
                          isSelected 
                            ? "bg-white text-black font-extrabold shadow-lg scale-[1.015]" 
                            : "bg-white/[0.02] text-slate-300 hover:bg-white/[0.04] border border-white/[0.04]"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-xl">{s.icon}</span>
                          <span className="text-xs font-bold uppercase tracking-tight">{s.site}</span>
                        </span>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                          isSelected ? "bg-bento-orange text-white" : "text-slate-500 bg-white/[0.05]"
                        }`}>
                          {s.url}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Sandbox simulation */}
                <div className="bg-[#121217] border border-white/[0.05] p-5 rounded-2xl space-y-4">
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-bento-orange fill-bento-orange" />
                    Quick Sandbox Creator
                  </h4>
                  <p className="text-[11px] text-slate-400 font-semibold">
                    Pin a custom memory layer below to instantly test your custom routing!
                  </p>
                  
                  <form onSubmit={handleAddSandbox} className="space-y-2.5">
                    <input 
                      type="text" 
                      placeholder="Enter mock URL (e.g. medium.com)"
                      value={sandboxUrl}
                      onChange={(e) => setSandboxUrl(e.target.value)}
                      className="w-full bg-[#07070a] border border-white/[0.08] focus:border-bento-orange focus:outline-none rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white transition-colors"
                      required
                    />
                    <input 
                      type="text" 
                      placeholder="Write your sticky memory..."
                      value={sandboxNote}
                      onChange={(e) => setSandboxNote(e.target.value)}
                      className="w-full bg-[#07070a] border border-white/[0.08] focus:border-bento-orange focus:outline-none rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white transition-colors"
                      required
                    />
                    <button 
                      type="submit"
                      className="w-full bg-bento-orange hover:bg-bento-orange/90 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Pin Custom Target
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Viewport: The Interactive Browser */}
              <div className="lg:col-span-7 bg-[#07070a] rounded-3xl p-4 md:p-6 shadow-2xl border border-white/[0.08] flex flex-col justify-between min-h-[420px] relative">
                
                {/* Simulated Chrome top bar */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.05] mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                  </div>
                  
                  {/* Address bar */}
                  <div className="bg-white/[0.03] px-4 py-1.5 rounded-xl text-[10px] font-mono text-slate-400 flex items-center gap-1.5 w-full max-w-[340px] justify-center shadow-inner border border-white/[0.04]">
                    <span className="text-emerald-500">https://</span>
                    <span className="text-white font-bold">{simPage.url}</span>
                  </div>

                  <div className="w-6"></div>
                </div>

                {/* Simulated webpage content layout */}
                <div className="flex-1 flex flex-col justify-center py-6 px-4 relative">
                  
                  {/* Overlay pop-up flash notifier */}
                  <AnimatePresence>
                    {showNotification && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        className="absolute top-2 left-1/2 -translate-x-1/2 bg-bento-orange text-white text-[10px] font-mono font-bold px-4.5 py-2 rounded-full shadow-2xl z-30 flex items-center gap-2"
                      >
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Navigating and injecting context...
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3.5">
                      <span className="text-4xl bg-white/[0.04] w-14 h-14 rounded-2xl flex items-center justify-center border border-white/[0.08] shadow-inner">{simPage.icon}</span>
                      <div>
                        <h4 className="text-lg font-display font-black text-white">{simPage.name}</h4>
                        <p className="text-xs text-slate-400 font-semibold">{simPage.title}</p>
                      </div>
                    </div>

                    {/* text highlight mock */}
                    {simPage.highlight && (
                      <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                        We loaded back and automatically highlighted the text:{" "}
                        <span className="bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/30 font-black">
                          &ldquo;{simPage.highlight}&rdquo;
                        </span>
                      </p>
                    )}

                    {/* mockup blocks */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="h-2.5 bg-white/[0.02] rounded-lg w-3/4"></div>
                      <div className="h-2.5 bg-white/[0.02] rounded-lg w-1/2"></div>
                      <div className="h-2.5 bg-white/[0.02] rounded-lg w-full col-span-2"></div>
                    </div>
                  </div>
                </div>

                {/* Simulated Recall overlay card popping in at bottom right */}
                <div className="absolute right-4 bottom-4 left-4 md:left-auto md:right-6 md:bottom-6 md:w-[320px] z-20">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={simPage.url}
                      initial={{ opacity: 0, x: 50, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 50, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 420, damping: 28 }}
                      className="bg-white text-black rounded-2xl p-5 shadow-2xl border-2 border-bento-orange relative"
                    >
                      {/* Badge header */}
                      <div className="absolute -top-3 left-4 bg-bento-orange text-white text-[9px] font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Brain className="w-3 h-3 text-white fill-white" />
                        Memory Desk Active
                      </div>

                      <div className="pt-2 space-y-3.5">
                        <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 font-bold">
                          <span>COGNITIVE ASSOCIATION</span>
                          <span>Just Now</span>
                        </div>
                        
                        <p className="text-xs font-bold leading-relaxed text-slate-800 italic border-l-2 border-bento-orange pl-3.5 bg-slate-50 py-2.5 rounded-r-lg">
                          &ldquo;{simPage.note}&rdquo;
                        </p>

                        <div className="flex justify-between items-center pt-0.5">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-mono font-extrabold uppercase ${
                            simPage.priority === 'high' 
                              ? 'bg-rose-100 text-rose-700' 
                              : simPage.priority === 'medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {simPage.priority} Priority
                          </span>
                          <span className="text-[9px] font-mono font-bold text-bento-orange">Auto-Saved</span>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* VAULT GALLERY */}
        <section id="active-vault" className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-4">
            <div>
              <h3 className="text-2xl font-display font-black text-slate-200 tracking-tight">Your Active Reminders Vault</h3>
              <p className="text-xs text-slate-500 font-semibold">Ready to be automatically retrieved as you browse the web</p>
            </div>
            
            <button 
              onClick={() => onStartApp("dashboard")}
              className="text-xs font-mono font-bold uppercase tracking-wider text-bento-orange hover:text-white transition-colors flex items-center gap-1 group"
            >
              <span>Manage in Dashboard</span>
              <ArrowUpRight className="w-4 h-4 text-bento-orange group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {initialMemories.slice(0, 3).map((mem) => (
              <motion.div 
                whileHover={{ y: -5, scale: 1.01 }}
                key={mem.id}
                className="bg-white/[0.01] rounded-3xl border border-white/[0.05] p-6 shadow-sm hover:shadow-xl hover:border-white/[0.12] transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Minimal ambient visual background blur accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] rounded-full blur-3xl pointer-events-none"></div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5">
                      <span className="text-lg bg-white/[0.04] w-9 h-9 rounded-xl flex items-center justify-center border border-white/[0.08] shadow-inner">{mem.websiteIcon}</span>
                      <span className="font-display font-black text-xs text-slate-200">{mem.websiteName}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border ${
                      mem.priority === 'high' 
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                        : mem.priority === 'medium'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>
                      {mem.priority}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-500 truncate">{mem.pageTitle}</p>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed italic border-l-2 border-bento-orange pl-3 bg-white/[0.01] py-2.5 rounded-r-lg">
                      &ldquo;{mem.originalNote.replace(/\[Selected Highlight: ".*"\]\n\n/, "")}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.04] mt-4 text-[10px] font-medium text-slate-500">
                  <div className="flex flex-wrap gap-1">
                    {mem.tags.map(t => (
                      <span key={t} className="bg-white/[0.03] border border-white/[0.05] px-2 py-0.5 rounded text-slate-400 text-[9px] font-semibold">#{t}</span>
                    ))}
                  </div>
                  <span className="font-mono text-[9px]">{new Date(mem.createdAt).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* METRICS & PROMISES */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="bg-gradient-to-br from-bento-orange/10 to-transparent border border-bento-orange/20 rounded-3xl p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-bento-orange/10 flex items-center justify-center">
                <Fingerprint className="w-5 h-5 text-bento-orange" />
              </div>
              <h3 className="font-display font-black text-lg text-white">100% Secure Client Isolation</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Your notes and annotations are captured in sandbox memory. We respect your search patterns and provide immediate local database backup.
              </p>
            </div>
            <div className="pt-6">
              <button 
                onClick={() => onStartApp("browser")}
                className="text-xs font-mono font-bold uppercase tracking-wider text-bento-orange hover:text-white transition-colors flex items-center gap-1.5"
              >
                Launch Browser simulator <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                <Database className="w-5 h-5 text-slate-400" />
              </div>
              <h3 className="font-display font-black text-lg text-white">Full Cloud Synchronization</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Store structured records safely to never lose contextual research. Access highlights across standard virtual extension planes anytime.
              </p>
            </div>
            <div className="pt-6">
              <button 
                onClick={() => onStartApp("dashboard")}
                className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
              >
                Go to Workspace <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 mt-24 pt-10 border-t border-white/[0.04] text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
            <Brain className="w-5.5 h-5.5 text-bento-orange" />
          </div>
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
            Memory Desk © 2026. Designed with extreme spring mechanics & sleek developer styling.
          </p>
        </div>
      </footer>

    </div>
  );
}
