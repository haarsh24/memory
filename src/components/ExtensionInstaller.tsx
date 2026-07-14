import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Download, Chrome, CheckCircle2, HelpCircle, AlertCircle, Copy, 
  Sparkles, Globe, ArrowRight, Check, ExternalLink, Settings, 
  ChevronDown, Terminal, FileCode, ShieldAlert
} from "lucide-react";
import { Memory } from "../types";

interface ExtensionInstallerProps {
  customBackendUrl: string;
  setCustomBackendUrl: (url: string) => void;
  onDownloadZIP: () => Promise<void>;
  getExtensionFile: (type: "manifest" | "background" | "content_js" | "content_css" | "popup_html" | "popup_js") => string;
  getFilename: (type: string) => string;
  onCopyFile: (type: "manifest" | "background" | "content_js" | "content_css" | "popup_html" | "popup_js") => void;
  onDownloadFile: (type: "manifest" | "background" | "content_js" | "content_css" | "popup_html" | "popup_js") => void;
  memories: Memory[];
  showNotification: (msg: string, type?: "success" | "info") => void;
}

export default function ExtensionInstaller({
  customBackendUrl,
  setCustomBackendUrl,
  onDownloadZIP,
  getExtensionFile,
  getFilename,
  onCopyFile,
  onDownloadFile,
  memories,
  showNotification
}: ExtensionInstallerProps) {
  // Local state
  const [activeTab, setActiveTab] = useState<"manifest" | "background" | "content_js" | "content_css" | "popup_html" | "popup_js">("manifest");
  const [showTechnicalFiles, setShowTechnicalFiles] = useState(false);
  
  // Interactive checklist progress state
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);

  // OS tab selection
  const [activeOS, setActiveOS] = useState<"windows" | "mac" | "linux">("windows");

  // FAQ Expand state
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({
    0: true,
    1: false,
    2: false
  });

  const toggleFaq = (index: number) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const isCompletedAll = step1Done && step2Done && step3Done;

  const handleDownloadAndCheck = async () => {
    await onDownloadZIP();
    setStep1Done(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fadeIn text-zinc-100">
      {/* Visual Header Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-indigo-950/40 to-zinc-900 border border-zinc-800/80 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute left-1/3 bottom-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border border-indigo-500/30">
            <Chrome className="w-3.5 h-3.5 animate-spin-slow" />
            Seamless Local Integration
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight font-sans">
            Install the Memory Desk Chrome Extension
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed font-medium">
            Turn your web browser into an active personal second brain. Capture code specifications, product reviews, or interview candidates instantly with smart overlay reminders when you return.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT SECTION: STEP-BY-STEP INSTALLATION INTERACTIVE BOARD (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-4">
              <h3 className="font-extrabold text-zinc-100 text-base tracking-tight flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                Step-by-Step Installation Console
              </h3>
              <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${isCompletedAll ? "bg-emerald-950/30 text-emerald-400 border-emerald-500/20" : "bg-indigo-950/30 text-indigo-300 border-indigo-500/20"}`}>
                {isCompletedAll ? "🎉 Setup Complete!" : `${[step1Done, step2Done, step3Done].filter(Boolean).length}/3 Steps Done`}
              </span>
            </div>

            {/* Step 1 */}
            <div className={`p-5 rounded-2xl border transition-all duration-300 ${step1Done ? "bg-zinc-900/20 border-zinc-800/80" : "bg-indigo-950/10 border-indigo-900/50"}`}>
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-extrabold font-mono transition-all duration-300 ${step1Done ? "bg-zinc-800 text-zinc-400" : "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"}`}>
                  {step1Done ? <Check className="w-4 h-4" /> : "1"}
                </div>
                <div className="flex-1 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-zinc-100 text-sm">Download preloaded ZIP file</h4>
                    <input 
                      type="checkbox" 
                      checked={step1Done}
                      onChange={(e) => setStep1Done(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-zinc-700 bg-zinc-800 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                    We package all required scripts (<code className="font-mono text-indigo-400 bg-indigo-950/30 px-1 py-0.5 rounded text-[10px]">manifest.json</code>, background workers, overlays, and popup managers) pre-configured with your specific server credentials into a single ZIP folder.
                  </p>
                  
                  {/* Backend Target Selector */}
                  <div className="bg-zinc-900/90 border border-zinc-800/80 p-3.5 rounded-xl space-y-2.5 shadow-inner">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] uppercase font-bold text-zinc-500 font-mono tracking-wider flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-zinc-500" />
                        Target Server Endpoint
                      </label>
                      <span className="text-[9px] bg-zinc-800 text-zinc-400 font-mono font-bold px-1.5 py-0.5 rounded">AUTO-DETECTED</span>
                    </div>
                    <div className="flex gap-2 flex-col sm:flex-row">
                      <input 
                        type="text"
                        value={customBackendUrl}
                        onChange={(e) => setCustomBackendUrl(e.target.value)}
                        className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 focus:outline-none rounded-lg text-xs font-bold text-zinc-100 font-mono focus:border-indigo-500"
                        placeholder="https://your-server.run.app"
                      />
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-normal font-medium">
                      Ensure this URL matches your active web app origin so the extension background listener can match your saved memories.
                    </p>
                  </div>

                  <button
                    onClick={handleDownloadAndCheck}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4.5 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/10 group cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-white group-hover:translate-y-0.5 transition-transform" />
                    Download Extension ZIP Bundle
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`p-5 rounded-2xl border transition-all duration-300 ${step2Done ? "bg-zinc-900/20 border-zinc-800/80" : !step1Done ? "opacity-60 bg-zinc-900/10 border-zinc-900" : "bg-indigo-950/10 border-indigo-900/50"}`}>
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-extrabold font-mono transition-all duration-300 ${step2Done ? "bg-zinc-800 text-zinc-400" : "bg-indigo-600 text-white shadow-sm"}`}>
                  {step2Done ? <Check className="w-4 h-4" /> : "2"}
                </div>
                <div className="flex-1 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-zinc-100 text-sm">Unpack the ZIP File</h4>
                    <input 
                      type="checkbox" 
                      checked={step2Done}
                      onChange={(e) => setStep2Done(e.target.checked)}
                      disabled={!step1Done}
                      className="w-4 h-4 text-indigo-600 border-zinc-700 bg-zinc-800 rounded focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                    />
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                    Extract the downloaded archive file (<code className="font-mono text-emerald-400 bg-emerald-950/30 px-1 py-0.5 rounded text-[10px]">MemoryDeskExtension.zip</code>) to a standard folder anywhere on your computer.
                  </p>

                  {/* OS Switcher to make instructions easier */}
                  <div className="space-y-2">
                    <div className="flex border-b border-zinc-800">
                      {(["windows", "mac", "linux"] as const).map((os) => (
                        <button
                          key={os}
                          onClick={() => setActiveOS(os)}
                          className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-mono font-extrabold border-b-2 transition-all -mb-px cursor-pointer ${activeOS === os ? "border-indigo-500 text-indigo-400" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
                        >
                          {os}
                        </button>
                      ))}
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-850 p-3 rounded-xl text-zinc-400 font-medium text-[11px] leading-relaxed">
                      {activeOS === "windows" && (
                        <span>
                          Right-click the <code className="font-mono text-zinc-200 bg-zinc-950 px-1 py-0.5 border border-zinc-800 rounded">MemoryDeskExtension.zip</code> file, select <strong>Extract All...</strong>, and choose a path (e.g., your Desktop or Documents folder).
                        </span>
                      )}
                      {activeOS === "mac" && (
                        <span>
                          Double-click the <code className="font-mono text-zinc-200 bg-zinc-950 px-1 py-0.5 border border-zinc-800 rounded">MemoryDeskExtension.zip</code> file inside Finder to automatically generate an extracted <strong>MemoryDeskExtension</strong> folder.
                        </span>
                      )}
                      {activeOS === "linux" && (
                        <div className="space-y-1.5">
                          <p>Extract using terminal command:</p>
                          <div className="bg-zinc-950 text-indigo-300 px-3 py-1.5 rounded font-mono text-[10px] flex justify-between items-center border border-zinc-850">
                            <code>unzip MemoryDeskExtension.zip -d ./MemoryDeskExtension</code>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText("unzip MemoryDeskExtension.zip -d ./MemoryDeskExtension");
                                showNotification("Copied extraction command!", "success");
                              }}
                              className="text-zinc-500 hover:text-white cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {step1Done && !step2Done && (
                    <button
                      onClick={() => setStep2Done(true)}
                      className="bg-indigo-950/40 hover:bg-indigo-900/40 text-indigo-300 border border-indigo-900/40 font-bold text-[10px] px-3.5 py-2 rounded-lg transition-colors inline-flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      I have extracted the files
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`p-5 rounded-2xl border transition-all duration-300 ${step3Done ? "bg-zinc-900/20 border-zinc-800/80" : !step2Done ? "opacity-60 bg-zinc-900/10 border-zinc-900" : "bg-indigo-950/10 border-indigo-900/50"}`}>
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-extrabold font-mono transition-all duration-300 ${step3Done ? "bg-zinc-800 text-zinc-400" : "bg-indigo-600 text-white shadow-sm"}`}>
                  {step3Done ? <Check className="w-4 h-4" /> : "3"}
                </div>
                <div className="flex-1 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-zinc-100 text-sm">Load Unpacked into Chrome</h4>
                    <input 
                      type="checkbox" 
                      checked={step3Done}
                      onChange={(e) => setStep3Done(e.target.checked)}
                      disabled={!step2Done}
                      className="w-4 h-4 text-indigo-600 border-zinc-700 bg-zinc-800 rounded focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                    />
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                    Open your web browser and load the extension in developer mode:
                  </p>

                  <div className="space-y-3 font-medium text-[11px] text-zinc-400 leading-relaxed bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl">
                    <div className="flex gap-2">
                      <span className="bg-zinc-800 text-zinc-300 w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0 font-bold mt-0.5">A</span>
                      <span>
                        Navigate to <span className="font-mono bg-zinc-950 px-1.5 py-0.5 border border-zinc-800 text-indigo-400 font-bold text-[10px]">chrome://extensions/</span> in your Chrome address bar (works on Edge, Brave, and Opera too!).
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="bg-zinc-800 text-zinc-300 w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0 font-bold mt-0.5">B</span>
                      <span>
                        Look for the <strong>Developer mode</strong> toggle switch in the top-right corner and switch it <strong>ON</strong>.
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="bg-zinc-800 text-zinc-300 w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0 font-bold mt-0.5">C</span>
                      <span>
                        Click the <strong>Load unpacked</strong> button that slides into view in the top-left corner.
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="bg-zinc-800 text-zinc-300 w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0 font-bold mt-0.5">D</span>
                      <span>
                        Select the unzipped folder containing <code className="font-mono text-xs text-indigo-400 font-semibold">manifest.json</code>.
                      </span>
                    </div>
                  </div>

                  {step2Done && !step3Done && (
                    <button
                      onClick={() => setStep3Done(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-indigo-150 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Loaded into browser successfully!
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Step 4 Checkpoint for Activation */}
            <AnimatePresence>
              {isCompletedAll && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-emerald-950/20 border border-emerald-500/20 p-5 rounded-2xl flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-900/30 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/15">
                    <Check className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h5 className="font-extrabold text-emerald-400 text-sm">Chrome Extension Activated!</h5>
                    <p className="text-xs text-emerald-300/80 leading-relaxed font-medium">
                      Your extension is officially primed. Go to any live website, highlight an important block of text, click right click, select <strong>"Remember selected text"</strong>, or click the Extension Icon to trigger contextual overlays!
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          const text = JSON.stringify({ memories }, null, 2);
                          navigator.clipboard.writeText(text);
                          showNotification("Copy-pasted current database seeds!", "success");
                        }}
                        className="bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3 text-emerald-400" />
                        Copy App Seeds Block
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT SECTION: USE CASES, TROUBLESHOOTER & TECHNICAL CODES (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section: Live Action Use Cases */}
          <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="font-extrabold text-zinc-100 text-sm tracking-tight flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
              How to Use & Practice (Use Cases)
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
              The Chrome Extension works silently in the background on your system. Try these daily active routines:
            </p>

            <div className="space-y-3">
              {[
                {
                  title: "💡 Select & Capture Selection",
                  desc: "Highlight any key text on StackOverflow, LinkedIn or Docs, right-click, and select 'Remember selected text'. The system extracts it instantly."
                },
                {
                  title: "📌 Instant Extension Sidebar Note",
                  desc: "Click the brain icon in your browser toolbar to pre-fill the tab's metadata, add your note, select target workspaces, and hit save."
                },
                {
                  title: "🧠 Hands-Free Context Alerts",
                  desc: "Revisit any previously memorized website. The background scanner fetches matches and slides in a beautiful overlay on top of the page."
                }
              ].map((item, index) => (
                <div key={index} className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-850/80 hover:bg-indigo-950/10 hover:border-indigo-900/30 transition-all flex items-start gap-3">
                  <div className="bg-indigo-950/60 text-indigo-300 font-mono text-[9px] font-bold w-4 h-4 rounded border border-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="font-bold text-zinc-200 text-xs">{item.title}</h5>
                    <p className="text-[10px] text-zinc-400 leading-normal font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Interactive Troubleshooter FAQ */}
          <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="font-extrabold text-zinc-100 text-sm tracking-tight flex items-center gap-2">
              <HelpCircle className="w-4.5 h-4.5 text-indigo-400" />
              Extension Troubleshooter
            </h4>

            <div className="space-y-3">
              {[
                {
                  q: "Why isn't my slide-in overlay showing up on pages?",
                  a: "Make sure you downloaded the extension AFTER setting your correct Target Server Origin URL. If the server is on a different domain than the extension's background script queries, standard CORS blocks or mismatch prevents matches from linking."
                },
                {
                  q: "Does this extension work in Brave, Edge, or Firefox?",
                  a: "Yes! Any Chromium-based browser (Edge, Brave, Opera, Vivaldi) fully supports unpacking. Go to edge://extensions or brave://extensions, enable developer mode, and load the unzipped package exact same way."
                },
                {
                  q: "Can I use the extension offline?",
                  a: "Yes, our background workers fallback gracefully. If your server is momentarily offline or unreachable, notes are processed instantly as offline records and local layers keep rendering."
                }
              ].map((faq, idx) => {
                const isOpen = faqOpen[idx];
                return (
                  <div key={idx} className="border-b border-zinc-900 pb-3 last:border-0 last:pb-0">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex justify-between items-start text-left gap-3 group focus:outline-none cursor-pointer"
                    >
                      <span className="font-bold text-xs text-zinc-200 group-hover:text-indigo-400 transition-colors">
                        {faq.q}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-indigo-400" : ""}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-[10px] text-zinc-400 leading-relaxed pt-2 font-medium">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Code Viewer Sandboxed Sandbox (Interactive Tab to view files) */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 shadow-lg space-y-4 text-white">
            <div className="flex items-center justify-between">
              <h5 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono text-indigo-300">
                <Terminal className="w-4 h-4 text-indigo-400" />
                Raw Source Viewer
              </h5>
              <button
                onClick={() => setShowTechnicalFiles(!showTechnicalFiles)}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1 text-[10px] font-bold text-indigo-300 rounded-lg transition-all cursor-pointer"
              >
                {showTechnicalFiles ? "Hide Code" : "Expand Code"}
              </button>
            </div>
            <p className="text-[10px] text-zinc-400 leading-normal font-medium">
              Optionally view, copy, or download individual files instead of loading the entire prepackaged ZIP bundle.
            </p>

            <AnimatePresence>
              {showTechnicalFiles && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 flex flex-col overflow-hidden pt-2"
                >
                  <div className="flex flex-wrap gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                    {[
                      { id: "manifest", name: "manifest.json" },
                      { id: "background", name: "background.js" },
                      { id: "content_js", name: "content.js" },
                      { id: "content_css", name: "content.css" },
                      { id: "popup_html", name: "popup.html" },
                      { id: "popup_js", name: "popup.js" }
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setActiveTab(f.id as any)}
                        className={`text-[9px] px-2 py-1 font-bold rounded-md font-mono transition-all cursor-pointer ${
                          activeTab === f.id
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                        }`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>

                  {/* Monospace Code Code block panel */}
                  <div className="relative border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 shadow-inner flex flex-col h-48">
                    <pre className="p-4 font-mono text-[9px] text-zinc-300 overflow-x-auto overflow-y-auto max-h-[160px] leading-relaxed whitespace-pre font-medium">
                      {getExtensionFile(activeTab)}
                    </pre>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onCopyFile(activeTab)}
                      className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-[10px] font-bold px-2.5 py-1.5 rounded flex items-center gap-1 transition-colors border border-zinc-800 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      Copy Code
                    </button>
                    <button
                      onClick={() => onDownloadFile(activeTab)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-2.5 py-1.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      Download file
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
