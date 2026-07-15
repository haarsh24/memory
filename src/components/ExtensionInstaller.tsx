import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Download, Chrome, CheckCircle2, HelpCircle, Copy, 
  Sparkles, Globe, ArrowRight, Check, Settings, 
  ChevronDown, Terminal
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-12 animate-fadeIn text-zinc-100">
      
      {/* Refined Elegant Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-950/40 border border-indigo-500/20 rounded-full text-indigo-300 text-[10px] font-mono font-bold uppercase tracking-wider">
          <Chrome className="w-3.5 h-3.5" />
          Native Browser Companion
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight font-sans text-zinc-100">
          Install the Chrome Extension
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed font-medium">
          Integrate Memory directly into your browser workflow. Save notes, highlights, and bookmarks on any website, and view contextual prompts whenever you return.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Clean Interactive Console (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 space-y-6">
            
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <h3 className="font-bold text-zinc-200 text-sm tracking-tight flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                Setup Timeline
              </h3>
              <span className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider border ${
                isCompletedAll 
                  ? "bg-emerald-950/20 text-emerald-400 border-emerald-500/10" 
                  : "bg-indigo-950/20 text-indigo-300 border-indigo-500/10"
              }`}>
                {isCompletedAll ? "Setup Complete" : `${[step1Done, step2Done, step3Done].filter(Boolean).length} of 3 complete`}
              </span>
            </div>

            {/* Step 1 */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold font-mono transition-all duration-300 border ${
                  step1Done 
                    ? "bg-zinc-900 border-zinc-800 text-zinc-400" 
                    : "bg-indigo-950 border-indigo-500/30 text-indigo-300"
                }`}>
                  {step1Done ? <Check className="w-3.5 h-3.5" /> : "1"}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-zinc-200 text-sm">Download your pre-configured package</h4>
                    <input 
                      type="checkbox" 
                      checked={step1Done}
                      onChange={(e) => setStep1Done(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-zinc-800 bg-zinc-900 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                    Your package contains all the extension files (<code className="font-mono text-indigo-400">manifest.json</code>, backgrounds, overlays) configured to connect back to this specific sandbox server.
                  </p>
                  
                  {/* Slim Host Origin Selector */}
                  <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] uppercase font-bold text-zinc-500 font-mono tracking-wider flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        Target origin
                      </label>
                      <span className="text-[8px] bg-zinc-900 text-zinc-500 font-mono font-semibold px-1.5 py-0.5 rounded">CONNECTED</span>
                    </div>
                    <input 
                      type="text"
                      value={customBackendUrl}
                      onChange={(e) => setCustomBackendUrl(e.target.value)}
                      className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-850/80 focus:outline-none rounded-lg text-xs font-medium text-zinc-200 font-mono focus:border-indigo-500 transition-colors"
                      placeholder="https://your-server.run.app"
                    />
                  </div>

                  <button
                    onClick={handleDownloadAndCheck}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/10 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-white" />
                    Download ZIP Bundle
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`pt-6 border-t border-zinc-900 ${!step1Done ? "opacity-50" : ""}`}>
              <div className="flex items-start gap-4">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold font-mono transition-all border ${
                  step2Done 
                    ? "bg-zinc-900 border-zinc-800 text-zinc-400" 
                    : "bg-indigo-950 border-indigo-500/30 text-indigo-300"
                }`}>
                  {step2Done ? <Check className="w-3.5 h-3.5" /> : "2"}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-zinc-200 text-sm">Extract the archive</h4>
                    <input 
                      type="checkbox" 
                      checked={step2Done}
                      onChange={(e) => setStep2Done(e.target.checked)}
                      disabled={!step1Done}
                      className="w-4 h-4 text-indigo-600 border-zinc-800 bg-zinc-900 rounded focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                    />
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                    Unzip the downloaded <code className="font-mono text-indigo-400">MemoryDeskExtension.zip</code> onto your local filesystem.
                  </p>

                  {/* Clean OS Switcher */}
                  <div className="space-y-2 pt-1">
                    <div className="flex gap-2 border-b border-zinc-900 pb-1.5">
                      {(["windows", "mac", "linux"] as const).map((os) => (
                        <button
                          key={os}
                          onClick={() => setActiveOS(os)}
                          className={`px-2 py-1 text-[10px] uppercase tracking-wider font-mono font-bold border-b transition-all -mb-1.5 cursor-pointer ${
                            activeOS === os 
                              ? "border-indigo-500 text-indigo-400" 
                              : "border-transparent text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          {os}
                        </button>
                      ))}
                    </div>
                    <div className="text-zinc-400 text-[11px] leading-relaxed py-1">
                      {activeOS === "windows" && (
                        <span>
                          Right-click the ZIP file and select <strong>Extract All...</strong>, then choose a destination folder.
                        </span>
                      )}
                      {activeOS === "mac" && (
                        <span>
                          Double-click the ZIP archive inside Finder to generate an extracted folder.
                        </span>
                      )}
                      {activeOS === "linux" && (
                        <div className="space-y-1.5">
                          <p>Extract using terminal command:</p>
                          <div className="bg-zinc-950 text-indigo-400 px-3 py-1.5 rounded-lg font-mono text-[10px] flex justify-between items-center border border-zinc-900">
                            <code>unzip MemoryDeskExtension.zip -d ./MemoryDeskExtension</code>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText("unzip MemoryDeskExtension.zip -d ./MemoryDeskExtension");
                                showNotification("Copied extraction command!", "success");
                              }}
                              className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
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
                      className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      I have extracted the folder
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`pt-6 border-t border-zinc-900 ${!step2Done ? "opacity-50" : ""}`}>
              <div className="flex items-start gap-4">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold font-mono transition-all border ${
                  step3Done 
                    ? "bg-zinc-900 border-zinc-800 text-zinc-400" 
                    : "bg-indigo-950 border-indigo-500/30 text-indigo-300"
                }`}>
                  {step3Done ? <Check className="w-3.5 h-3.5" /> : "3"}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-zinc-200 text-sm">Load unpacked into Chrome</h4>
                    <input 
                      type="checkbox" 
                      checked={step3Done}
                      onChange={(e) => setStep3Done(e.target.checked)}
                      disabled={!step2Done}
                      className="w-4 h-4 text-indigo-600 border-zinc-800 bg-zinc-900 rounded focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                    />
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                    Load the extracted directory into Chrome to activate the browser companion background scripts.
                  </p>

                  <div className="space-y-2 font-medium text-[11px] text-zinc-400 leading-relaxed bg-zinc-950 border border-zinc-900 p-4 rounded-xl">
                    <div className="flex gap-2">
                      <span className="text-zinc-500 font-mono select-none">1.</span>
                      <span>
                        Navigate to <span className="font-mono text-indigo-400 font-semibold">chrome://extensions/</span> in your address bar.
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-zinc-500 font-mono select-none">2.</span>
                      <span>
                        Enable the <strong>Developer mode</strong> toggle switch in the top-right.
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-zinc-500 font-mono select-none">3.</span>
                      <span>
                        Click the <strong>Load unpacked</strong> button that appears and select your extracted folder.
                      </span>
                    </div>
                  </div>

                  {step2Done && !step3Done && (
                    <button
                      onClick={() => setStep3Done(true)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4.5 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-md cursor-pointer"
                    >
                      Loaded successfully
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Active Confirmation Banner */}
            <AnimatePresence>
              {isCompletedAll && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-emerald-950/20 border border-emerald-500/10 p-5 rounded-xl flex items-start gap-4"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-900/30 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/10">
                    <Check className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h5 className="font-bold text-emerald-400 text-sm">Companion Activated</h5>
                    <p className="text-xs text-emerald-300/80 leading-relaxed font-medium">
                      Your Chrome companion is officially armed. Right-click text selections on any page, save thoughts via the toolbar, and watch recall cues link up seamlessly.
                    </p>
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          const text = JSON.stringify({ memories }, null, 2);
                          navigator.clipboard.writeText(text);
                          showNotification("Copied database seeds!", "success");
                        }}
                        className="bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/10 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3 text-emerald-400" />
                        Copy Memories JSON Seed
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* RIGHT COLUMN: Troubleshooting & Code Viewer (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* FAQ Troubleshooter */}
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 space-y-4">
            <h4 className="font-bold text-zinc-200 text-sm tracking-tight flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              Frequently Asked
            </h4>

            <div className="space-y-3">
              {[
                {
                  q: "Why isn't my slide-in overlay triggering?",
                  a: "Confirm your target origin URL exactly matches this app origin. Standard CORS configurations or URL mismatch will prevent matches from synchronizing successfully."
                },
                {
                  q: "Does this work in Arc, Edge, or Brave?",
                  a: "Yes! Any Chromium-based browser supports Load Unpacked. Simply navigate to their respective extensions dashboards and load the directory."
                }
              ].map((faq, idx) => {
                const isOpen = faqOpen[idx];
                return (
                  <div key={idx} className="border-b border-zinc-900 pb-3 last:border-0 last:pb-0">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex justify-between items-start text-left gap-3 group focus:outline-none cursor-pointer"
                    >
                      <span className="font-bold text-[11px] text-zinc-300 group-hover:text-indigo-400 transition-colors">
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

          {/* Minimalist Code Viewer Sandbox */}
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 space-y-4 text-zinc-200">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3.5">
              <h5 className="font-bold text-xs tracking-wider flex items-center gap-1.5 font-sans text-indigo-400">
                <Terminal className="w-4 h-4 text-indigo-400" />
                Raw Source Code
              </h5>
              <button
                onClick={() => setShowTechnicalFiles(!showTechnicalFiles)}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-2.5 py-1 text-[9px] font-bold text-zinc-300 rounded-lg transition-all cursor-pointer"
              >
                {showTechnicalFiles ? "Hide Source" : "View Source"}
              </button>
            </div>

            <AnimatePresence>
              {showTechnicalFiles && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 flex flex-col overflow-hidden"
                >
                  <div className="flex flex-wrap gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-900">
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
                        className={`text-[9px] px-2 py-1 font-bold rounded font-mono transition-all cursor-pointer ${
                          activeTab === f.id
                            ? "bg-indigo-600 text-white"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>

                  <div className="relative border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950/90 shadow-inner flex flex-col h-40">
                    <pre className="p-3.5 font-mono text-[9px] text-zinc-400 overflow-x-auto overflow-y-auto max-h-[140px] leading-relaxed whitespace-pre font-medium">
                      {getExtensionFile(activeTab)}
                    </pre>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onCopyFile(activeTab)}
                      className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[9px] font-bold px-2.5 py-1.5 rounded flex items-center gap-1 transition-colors border border-zinc-800 cursor-pointer"
                    >
                      Copy File
                    </button>
                    <button
                      onClick={() => onDownloadFile(activeTab)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-bold px-2.5 py-1.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      Download
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
