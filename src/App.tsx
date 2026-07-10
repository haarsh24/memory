import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Brain, Search, Chrome, Shield, ArrowRight, Check, Sparkles, 
  History, Bookmark, MessageSquare, ArrowUpRight, Pin, Trash2, 
  Plus, X, Edit2, Star, Clock, Folder, Settings, User as UserIcon, 
  LogOut, Globe, MousePointerClick, AlertCircle, RefreshCw, Layers,
  ChevronRight, ChevronDown, Filter, ExternalLink, Moon, Sun, Info, Copy, Download
} from "lucide-react";

import { Memory, Project, User, SearchResult } from "./types";
import { initialMemories, initialProjects } from "./initialData";
import Homepage from "./components/Homepage";
import JSZip from "jszip";

export default function App() {
  // Navigation & General App State
  const [currentView, setCurrentView] = useState<"homepage" | "browser" | "dashboard">("homepage");
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("mem_user");
    return saved ? JSON.parse(saved) : {
      id: "user_demo",
      email: "kumar.harsh.codes@gmail.com",
      name: "Kumar Harsh",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
    };
  });

  // Memories & Projects state persisted to localStorage
  const [memories, setMemories] = useState<Memory[]>(() => {
    const saved = localStorage.getItem("mem_memories");
    return saved ? JSON.parse(saved) : initialMemories;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem("mem_projects");
    return saved ? JSON.parse(saved) : initialProjects;
  });

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem("mem_memories", JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem("mem_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("mem_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("mem_user");
    }
  }, [user]);

  // VIRTUAL BROWSER STATE
  const [browserUrl, setBrowserUrl] = useState("https://linkedin.com/in/john");
  const [browserTitle, setBrowserTitle] = useState("John Doe | Tech Recruiter at Microsoft | LinkedIn");
  const [browserSiteName, setBrowserSiteName] = useState("LinkedIn");
  const [browserIcon, setBrowserIcon] = useState("💼");
  const [customUrlInput, setCustomUrlInput] = useState("");
  
  // Highlight state
  const [highlightedText, setHighlightedText] = useState("");
  
  // Extension popup state
  const [isExtensionOpen, setIsExtensionOpen] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");

  // Match notification overlay
  const [matchedMemory, setMatchedMemory] = useState<Memory | null>(null);
  const [matchReason, setMatchReason] = useState("");
  const [isMatchingPage, setIsMatchingPage] = useState(false);
  const [dismissedMatches, setDismissedMatches] = useState<Record<string, boolean>>({});

  // Smart Capture Prompt
  const [showSmartCapture, setShowSmartCapture] = useState(false);
  const [smartCaptureDismissed, setSmartCaptureDismissed] = useState<Record<string, boolean>>({});

  // DASHBOARD STATE
  const [dashboardTab, setDashboardTab] = useState<"all" | "pinned" | "projects" | "search" | "settings" | "extension">("all");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [dashSearchQuery, setDashSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [dashSearchResults, setDashSearchResults] = useState<SearchResult[]>([]);
  const [isDashSearching, setIsDashSearching] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);

  // Chrome Extension custom URL and file viewer state
  const [activeExtFile, setActiveExtFile] = useState<"manifest" | "background" | "content_js" | "content_css" | "popup_html" | "popup_js">("manifest");
  const [showTechnicalFiles, setShowTechnicalFiles] = useState(false);
  const [customBackendUrl, setCustomBackendUrl] = useState(() => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return "https://your-deployed-app.run.app";
  });

  const getFilename = (type: string) => {
    switch (type) {
      case "manifest": return "manifest.json";
      case "background": return "background.js";
      case "content_js": return "content.js";
      case "content_css": return "content.css";
      case "popup_html": return "popup.html";
      case "popup_js": return "popup.js";
      default: return "";
    }
  };

  const getExtensionFile = (type: "manifest" | "background" | "content_js" | "content_css" | "popup_html" | "popup_js") => {
    const backend = customBackendUrl.replace(/\/$/, "");
    switch (type) {
      case "manifest":
        return `{
  "manifest_version": 3,
  "name": "Memory Desk - Web Context Layer",
  "version": "1.0.0",
  "description": "Attach thoughts and context layers to any website. Trigger automatic overlays when you return.",
  "permissions": [
    "activeTab",
    "tabs",
    "storage",
    "contextMenus"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "css": ["content.css"]
    }
  ],
  "action": {
    "default_popup": "popup.html"
  }
}`;
      case "background":
        return `const BACKEND_URL = "${backend}";

// Listen for tab updates to fetch contextual match
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.startsWith("http")) {
    chrome.storage.local.get({ memories: [] }, (result) => {
      fetch(\`\${BACKEND_URL}/api/gemini/match-url\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: tab.url,
          title: tab.title || "",
          memories: result.memories
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.matchedMemory) {
          chrome.tabs.sendMessage(tabId, {
            action: "SHOW_MEMORY",
            memory: data.matchedMemory,
            reason: data.reason || "Smart context match"
          }).catch(err => console.log("Content script not injected yet:", err));
        }
      })
      .catch(err => console.error("Error matching URL:", err));
    });
  }
});

// Create context menu for quick capture
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "remember-selection",
    title: "Remember selected text",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "remember-selection" && tab && tab.id) {
    chrome.tabs.sendMessage(tab.id, {
      action: "QUICK_CAPTURE",
      selectionText: info.selectionText
    });
  }
});`;
      case "content_js":
        return `const BACKEND_URL = "${backend}";

// Listen to background messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "SHOW_MEMORY") {
    showOverlay(request.memory, request.reason);
  } else if (request.action === "QUICK_CAPTURE") {
    showCaptureForm(request.selectionText);
  }
});

function showOverlay(memory, reason) {
  if (document.getElementById("memory-overlay-root")) return;

  const root = document.createElement("div");
  root.id = "memory-overlay-root";
  root.innerHTML = \`
    <div class="mem-card">
      <div class="mem-header">
        <div class="mem-brand">
          <span style="font-size: 16px;">🧠</span>
          <span class="mem-title">Memory Desk</span>
        </div>
        <button class="mem-close-btn" id="mem-close-btn">&times;</button>
      </div>
      <div class="mem-content">
        <div class="mem-reason">\${reason || "Prior memory match"}</div>
        <div class="mem-note">"\${memory.originalNote}"</div>
        
        <div class="mem-ai-section">
          <div class="mem-ai-title">✨ Gemini Summary</div>
          <div class="mem-ai-summary">\${memory.aiSummary}</div>
        </div>
        
        <div class="mem-footer">
          <span class="mem-priority mem-priority-\${memory.priority}">\${memory.priority} priority</span>
          <span class="mem-date">\${new Date(memory.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  \`;

  document.body.appendChild(root);

  document.getElementById("mem-close-btn").addEventListener("click", () => {
    root.remove();
  });
}

function showCaptureForm(selectedText) {
  if (document.getElementById("memory-capture-root")) return;

  const root = document.createElement("div");
  root.id = "memory-capture-root";
  root.innerHTML = \`
    <div class="mem-card animate-slide">
      <div class="mem-header">
        <div class="mem-brand">
          <span>✨</span>
          <span class="mem-title">Save Note with Gemini AI</span>
        </div>
        <button class="mem-close-btn" id="mem-cap-close">&times;</button>
      </div>
      <div class="mem-content">
        \${selectedText ? \`<div class="mem-highlight">"...\${selectedText.slice(0, 100)}..."</div>\` : ''}
        <textarea id="mem-cap-text" placeholder="Write down what you want to remember about this page..." rows="3"></textarea>
        <button id="mem-cap-save" class="mem-primary-btn">Save context with Gemini</button>
        <div id="mem-cap-status" class="mem-status"></div>
      </div>
    </div>
  \`;

  document.body.appendChild(root);

  document.getElementById("mem-cap-close").addEventListener("click", () => root.remove());
  
  document.getElementById("mem-cap-save").addEventListener("click", () => {
    const noteText = document.getElementById("mem-cap-text").value.trim();
    if (!noteText) return;

    const btn = document.getElementById("mem-cap-save");
    const status = document.getElementById("mem-cap-status");
    btn.disabled = true;
    btn.innerText = "Gemini thinking...";

    const fullNote = selectedText ? \`[Selected Highlight: "\${selectedText}"]\\\\n\\\\n\${noteText}\` : noteText;

    fetch(\`\${BACKEND_URL}/api/gemini/process\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: window.location.href,
        title: document.title,
        originalNote: fullNote,
        existingProjects: []
      })
    })
    .then(res => res.json())
    .then(aiResult => {
      chrome.storage.local.get({ memories: [] }, (res) => {
        const newMemory = {
          id: "mem_" + Date.now(),
          url: window.location.href,
          domain: window.location.hostname.replace("www.", ""),
          pageTitle: document.title,
          websiteName: document.title.split("-")[0].trim() || window.location.hostname,
          websiteIcon: "📝",
          originalNote: fullNote,
          aiSummary: aiResult.aiSummary,
          tags: aiResult.tags,
          projectId: "default",
          priority: aiResult.priority,
          pinned: false,
          createdAt: new Date().toISOString()
        };

        const updated = [newMemory, ...res.memories];
        chrome.storage.local.set({ memories: updated }, () => {
          status.innerText = "Memory saved successfully! 🎉";
          status.style.color = "#10B981";
          setTimeout(() => root.remove(), 1500);
        });
      });
    })
    .catch(err => {
      console.error(err);
      btn.disabled = false;
      btn.innerText = "Save context with Gemini";
      status.innerText = "Error: Couldn't talk to Deployed backend.";
      status.style.color = "#EF4444";
    });
  });
}`;
      case "content_css":
        return `#memory-overlay-root, #memory-capture-root {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 2147483647;
  font-family: system-ui, -apple-system, sans-serif;
  color: #1e293b;
}

.mem-card {
  width: 320px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.mem-header {
  background: #f8fafc;
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mem-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mem-title {
  font-weight: 700;
  font-size: 13px;
  color: #0f172a;
}

.mem-close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #94a3b8;
  padding: 0 4px;
}

.mem-close-btn:hover {
  color: #475569;
}

.mem-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mem-reason {
  font-size: 10px;
  color: #4f46e5;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mem-note {
  font-size: 13px;
  color: #334155;
  font-weight: 500;
  line-height: 1.5;
  background: #f8fafc;
  padding: 10px;
  border-radius: 8px;
  border-left: 3px solid #6366f1;
  font-style: italic;
}

.mem-highlight {
  font-size: 11px;
  color: #64748b;
  background: #f1f5f9;
  padding: 8px;
  border-radius: 6px;
  font-style: italic;
}

.mem-ai-section {
  background: #f5f3ff;
  border: 1px solid #ddd6fe;
  padding: 10px;
  border-radius: 8px;
}

.mem-ai-title {
  font-size: 9px;
  font-weight: 700;
  color: #6d28d9;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.mem-ai-summary {
  font-size: 11px;
  line-height: 1.4;
  color: #4c1d95;
  font-weight: 500;
}

.mem-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  color: #94a3b8;
}

.mem-priority {
  padding: 2px 6px;
  border-radius: 9999px;
  font-weight: 700;
  text-transform: uppercase;
}

.mem-priority-high { background: #fee2e2; color: #ef4444; }
.mem-priority-medium { background: #fef3c7; color: #d97706; }
.mem-priority-low { background: #f1f5f9; color: #64748b; }

#mem-cap-text {
  width: 100%;
  padding: 8px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 12px;
  resize: none;
  box-sizing: border-box;
}

#mem-cap-text:focus {
  outline: 2px solid #6366f1;
}

.mem-primary-btn {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
  display: block;
  width: 100%;
}

.mem-primary-btn:hover {
  background: #4338ca;
}

.mem-primary-btn:disabled {
  background: #a5b4fc;
  cursor: not-allowed;
}

.mem-status {
  font-size: 11px;
  text-align: center;
}

@keyframes slideIn {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}`;
      case "popup_html":
        return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      width: 320px;
      margin: 0;
      font-family: system-ui, -apple-system, sans-serif;
      background: #ffffff;
      color: #0f172a;
    }
    .header {
      background: #4f46e5;
      color: white;
      padding: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .header h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: -0.01em;
    }
    .content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #94a3b8;
      letter-spacing: 0.05em;
    }
    textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 8px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 12px;
      resize: none;
      font-weight: 500;
    }
    textarea:focus {
      outline: 2px solid #4f46e5;
    }
    button {
      background: #4f46e5;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 8px;
      font-weight: 750;
      font-size: 12px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 6px;
      transition: background 0.2s;
      width: 100%;
    }
    button:hover {
      background: #4338ca;
    }
    button:disabled {
      background: #cbd5e1;
      cursor: not-allowed;
    }
    .status {
      font-size: 11px;
      text-align: center;
      font-weight: 600;
    }
    .memories-list {
      border-top: 1px solid #f1f5f9;
      padding: 12px 16px;
      background: #f8fafc;
    }
    .mem-item {
      font-size: 11px;
      padding: 8px;
      border-radius: 6px;
      background: white;
      border: 1px solid #e2e8f0;
      margin-top: 6px;
    }
  </style>
</head>
<body>
  <div class="header">
    <span style="font-size: 16px;">🧠</span>
    <h3>Memory Desk</h3>
  </div>
  <div class="content">
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <label>Save a new thought</label>
      <textarea id="note-text" placeholder="What should we remind you of when you return to this URL?" rows="3"></textarea>
    </div>
    <button id="save-btn">✨ Save to Memory</button>
    <div id="status-msg" class="status"></div>
  </div>
  <div class="memories-list">
    <label>Recently Remembered</label>
    <div id="recent-memories"></div>
  </div>
  <script src="popup.js"></script>
</body>
</html>`;
      case "popup_js":
        return `const BACKEND_URL = "${backend}";

document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("save-btn");
  const noteText = document.getElementById("note-text");
  const statusMsg = document.getElementById("status-msg");
  const recentDiv = document.getElementById("recent-memories");

  function loadRecent() {
    chrome.storage.local.get({ memories: [] }, (res) => {
      recentDiv.innerHTML = "";
      if (res.memories.length === 0) {
        recentDiv.innerHTML = '<div style="font-size: 11px; color: #94a3b8; padding-top: 4px;">No notes captured yet.</div>';
        return;
      }
      res.memories.slice(0, 3).forEach(m => {
        const item = document.createElement("div");
        item.className = "mem-item";
        item.innerHTML = \`
          <div style="font-weight: 700; color: #334155; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">\${m.websiteName}</div>
          <div style="color: #64748b; font-style: italic; margin-top: 2px;">"\${m.originalNote.slice(0, 60)}"</div>
        \`;
        recentDiv.appendChild(item);
      });
    });
  }

  loadRecent();

  saveBtn.addEventListener("click", () => {
    const text = noteText.value.trim();
    if (!text) return;

    saveBtn.disabled = true;
    saveBtn.innerText = "Gemini thinking...";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab || !activeTab.url) {
        statusMsg.innerText = "Cannot capture this tab.";
        statusMsg.style.color = "#EF4444";
        saveBtn.disabled = false;
        saveBtn.innerText = "Save to Memory";
        return;
      }

      fetch(\`\${BACKEND_URL}/api/gemini/process\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: activeTab.url,
          title: activeTab.title || "",
          originalNote: text,
          existingProjects: []
        })
      })
      .then(res => {
        if (!res.ok) throw new Error("Backend response error");
        return res.json();
      })
      .then(aiResult => {
        chrome.storage.local.get({ memories: [] }, (res) => {
          const newMemory = {
            id: "mem_" + Date.now(),
            url: activeTab.url,
            domain: new URL(activeTab.url).hostname.replace("www.", ""),
            pageTitle: activeTab.title || activeTab.url,
            websiteName: (activeTab.title || "").split("-")[0].trim() || new URL(activeTab.url).hostname,
            websiteIcon: "📝",
            originalNote: text,
            aiSummary: aiResult.aiSummary,
            tags: aiResult.tags,
            projectId: "default",
            priority: aiResult.priority,
            pinned: false,
            createdAt: new Date().toISOString()
          };

          const updated = [newMemory, ...res.memories];
          chrome.storage.local.set({ memories: updated }, () => {
            statusMsg.innerText = "Saved successfully! 🎉";
            statusMsg.style.color = "#10B981";
            noteText.value = "";
            saveBtn.disabled = false;
            saveBtn.innerText = "Save to Memory";
            loadRecent();
          });
        });
      })
      .catch(err => {
        console.error(err);
        statusMsg.innerText = "Error: Couldn't talk to backend.";
        statusMsg.style.color = "#EF4444";
        saveBtn.disabled = false;
        saveBtn.innerText = "Save to Memory";
      });
    });
  });
});`;
      default:
        return "";
    }
  };

  const handleCopyFile = (type: typeof activeExtFile) => {
    const text = getExtensionFile(type);
    navigator.clipboard.writeText(text);
    showNotification(`Copied ${getFilename(type)} to clipboard!`, "success");
  };

  const handleDownloadFile = (type: typeof activeExtFile) => {
    const text = getExtensionFile(type);
    const filename = getFilename(type);
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showNotification(`Downloaded ${filename}!`, "success");
  };

  const handleDownloadAllExtensionFiles = async () => {
    try {
      const zip = new JSZip();
      const files = ["manifest", "background", "content_js", "content_css", "popup_html", "popup_js"] as const;
      
      files.forEach(f => {
        const text = getExtensionFile(f);
        const filename = getFilename(f);
        zip.file(filename, text);
      });
      
      const content = await zip.generateAsync({ type: "blob" });
      const element = document.createElement("a");
      element.href = URL.createObjectURL(content);
      element.download = "MemoryDeskExtension.zip";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      showNotification("Downloaded MemoryDeskExtension.zip successfully! 🎉", "success");
    } catch (err) {
      console.error(err);
      showNotification("Failed to package extension files into ZIP.", "info");
    }
  };

  // Status Alerts
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const showNotification = (message: string, type: "success" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Google Sign In Mock
  const handleLogin = () => {
    const demoUser: User = {
      id: "user_demo",
      email: "kumar.harsh.codes@gmail.com",
      name: "Kumar Harsh",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
    };
    setUser(demoUser);
    showNotification("Logged in with Google as Kumar Harsh", "success");
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    showNotification("Logged out successfully", "info");
    setCurrentView("homepage");
  };

  // Predefined browser tabs
  const presetTabs = [
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "💼",
      url: "https://linkedin.com/in/john",
      title: "John Doe | Tech Recruiter at Microsoft | LinkedIn",
      textBlocks: [
        "John Doe is a Senior Recruiter on the Azure Core Engineering team at Microsoft India.",
        "Previously, John recruited for cloud infrastructure roles at Google and Amazon.",
        "At the React India 2026 conference, John presented a talk on the future of remote engineering talent."
      ]
    },
    {
      id: "amazon",
      name: "Amazon",
      icon: "📦",
      url: "https://amazon.in/macbook-pro",
      title: "Apple MacBook Pro (M3, 14-inch) - Amazon",
      textBlocks: [
        "Price: ₹1,15,000 (inclusive of all taxes). Bank offers available up to ₹10,000.",
        "Expected upcoming festival sale will drop overall hardware prices by up to 15%.",
        "Specs: Apple M3 chip, 16GB Unified Memory, 512GB SSD storage, Space Grey finish."
      ]
    },
    {
      id: "github",
      name: "GitHub",
      icon: "🐙",
      url: "https://github.com/facebook/react",
      title: "GitHub - facebook/react: The library for web and native user interfaces",
      textBlocks: [
        "React is a library for building composable user interfaces using components.",
        "The React Compiler (React Forget) automatically memoizes hooks and components to eliminate manual useMemo.",
        "Excellent candidates for frontend analytics engines include light-weight charting dashboards."
      ]
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: "📺",
      url: "https://youtube.com/watch?v=react-compiler",
      title: "React Compiler: Deep Dive & Architecture Explained",
      textBlocks: [
        "00:00 - Introduction to the Compiler.",
        "09:15 - How Babel plugins parse code structures.",
        "18:42 - Deep dive into auto-memoization logic and side effects optimization."
      ]
    },
    {
      id: "wikipedia",
      name: "Wikipedia",
      icon: "🌐",
      url: "https://en.wikipedia.org/wiki/System_design",
      title: "System design - Wikipedia",
      textBlocks: [
        "System design is the process of defining the architecture, modules, interfaces, and data for a system.",
        "Modern system design interviews emphasize scalability, horizontal partition, database replication, and load balancing.",
        "Microservices architecture splits applications into small, independently deployable software entities."
      ]
    },
    {
      id: "stackoverflow",
      name: "Stack Overflow",
      icon: "🥞",
      url: "https://stackoverflow.com/questions/shadow-dom",
      title: "How to fix querySelector with Shadow DOM elements? - Stack Overflow",
      textBlocks: [
        "To query elements inside a shadow root, standard querySelector does not cross the shadow boundary.",
        "The correct fix is to recursively traverse shadowRoots: const el = container.shadowRoot.querySelector(selector).",
        "Make sure the shadow root mode is configured as 'open' in order to gain access programmatically."
      ]
    }
  ];

  // Navigate Virtual Browser
  const handleNavigate = (url: string, title: string, siteName: string, icon: string) => {
    setBrowserUrl(url);
    setBrowserTitle(title);
    setBrowserSiteName(siteName);
    setBrowserIcon(icon);
    setHighlightedText("");
    setIsExtensionOpen(false);
    setShowSmartCapture(false);
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;

    let cleanUrl = customUrlInput.trim();
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
    }

    let parsedDomain = "webpage.com";
    try {
      const u = new URL(cleanUrl);
      parsedDomain = u.hostname;
    } catch (_) {}

    // Title from domain name
    const guessedTitle = cleanUrl.replace(/^https?:\/\//, "").split("/")[0] + " - Custom Webpage";
    
    handleNavigate(cleanUrl, guessedTitle, parsedDomain, "🌐");
  };

  // Whenever browser url changes, query AI for Matching Memory
  useEffect(() => {
    const fetchUrlMatch = async () => {
      if (memories.length === 0) {
        setMatchedMemory(null);
        return;
      }

      // Fast client-side matching (Instant, robust, and handles offlines/timeouts seamlessly)
      const cleanUrl = (u: string) => u.split('?')[0].split('#')[0].replace(/\/$/, '').toLowerCase();
      const targetClean = cleanUrl(browserUrl);
      
      // 1. Try Exact URL Match first
      const exactMatch = memories.find(m => cleanUrl(m.url) === targetClean);
      if (exactMatch) {
        if (!dismissedMatches[exactMatch.id]) {
          setMatchedMemory(exactMatch);
          setMatchReason("Welcome back. Here is your memory for this page.");
        } else {
          setMatchedMemory(null);
        }
        return; // Skip server request
      }

      // 2. Try Domain Match
      let targetDomain = "";
      try {
        targetDomain = new URL(browserUrl).hostname.replace("www.", "").toLowerCase();
      } catch (_) {}

      if (targetDomain) {
        const domainMatch = memories.find(m => {
          try {
            const mDomain = new URL(m.url).hostname.replace("www.", "").toLowerCase();
            return mDomain === targetDomain && !dismissedMatches[m.id];
          } catch (_) {
            return false;
          }
        });

        if (domainMatch) {
          setMatchedMemory(domainMatch);
          setMatchReason(`Saved thought on this website (${domainMatch.websiteName})`);
          return; // Skip server request
        }
      }

      // No client-side direct match, run server-side matching for smart context association
      setIsMatchingPage(true);
      try {
        const response = await fetch("/api/gemini/match-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: browserUrl,
            title: browserTitle,
            memories: memories
          })
        });

        if (!response.ok) {
          throw new Error(`Server status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON");
        }

        const data = await response.json();
        if (data.matchedMemory && !dismissedMatches[data.matchedMemory.id]) {
          setMatchedMemory(data.matchedMemory);
          setMatchReason(data.reason || "Matched by intelligent domain matching");
        } else {
          setMatchedMemory(null);
        }
      } catch (error) {
        // Log quietly as info to prevent noisy telemetry alerts during transient network timeouts/rate limits
        console.log("[INFO] Intelligent URL matching fallback applied safely");
        setMatchedMemory(null);
      } finally {
        setIsMatchingPage(false);
      }
    };

    fetchUrlMatch();

    // Setup a slight random timer to trigger the "Smart Capture" prompt if they have no memory saved
    const alreadySaved = memories.some(m => m.url.includes(browserUrl));
    if (!alreadySaved && !smartCaptureDismissed[browserUrl]) {
      const timer = setTimeout(() => {
        setShowSmartCapture(true);
      }, 7000); // Trigger prompt after 7 seconds of simulated reading
      return () => clearTimeout(timer);
    } else {
      setShowSmartCapture(false);
    }
  }, [browserUrl, memories, dismissedMatches, smartCaptureDismissed]);

  // Handle Capture Memory via the Extension Popup
  const handleSaveMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;

    setIsProcessingAI(true);
    setProcessingStatus("Initializing Gemini context analysis...");

    const fullOriginalNote = highlightedText 
      ? `[Selected Highlight: "${highlightedText}"]\n\n${noteInput}`
      : noteInput;

    const existingProjectNames = projects.map(p => p.name);

    try {
      setProcessingStatus("Synthesizing memory, auto-extracting tags and priority...");
      const response = await fetch("/api/gemini/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: browserUrl,
          title: browserTitle,
          originalNote: fullOriginalNote,
          existingProjects: existingProjectNames
        })
      });

      const aiData = await response.json();
      
      if (aiData.error) {
        throw new Error(aiData.error);
      }

      // Check if project exists, or create a new one
      let projId: string | undefined;
      if (aiData.projectSuggestion) {
        const matchingProj = projects.find(p => p.name.toLowerCase() === aiData.projectSuggestion.toLowerCase());
        if (matchingProj) {
          projId = matchingProj.id;
        } else {
          const newProjId = `proj_${Date.now()}`;
          const newProj: Project = {
            id: newProjId,
            name: aiData.projectSuggestion,
            description: `Auto-created workspace for research on ${aiData.projectSuggestion}`,
            createdAt: new Date().toISOString()
          };
          setProjects(prev => [newProj, ...prev]);
          projId = newProjId;
        }
      }

      const parsedDomain = new URL(browserUrl).hostname.replace("www.", "");

      const newMemory: Memory = {
        id: `mem_${Date.now()}`,
        userId: user?.id || "user_demo",
        url: browserUrl,
        canonicalUrl: browserUrl,
        domain: parsedDomain,
        pageTitle: browserTitle,
        websiteName: browserSiteName,
        websiteIcon: browserIcon,
        originalNote: fullOriginalNote,
        aiSummary: aiData.aiSummary || "Saved reference",
        tags: aiData.tags || ["General"],
        priority: (aiData.priority || "medium") as "low" | "medium" | "high",
        projectId: projId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setMemories(prev => [newMemory, ...prev]);
      showNotification("Memory saved instantly & processed by AI!");
      setNoteInput("");
      setHighlightedText("");
      setIsExtensionOpen(false);
      setShowSmartCapture(false);
    } catch (err) {
      console.warn("Save memory error (using local fallback):", err);
      // Fallback
      const parsedDomain = new URL(browserUrl).hostname.replace("www.", "");
      const fallbackMemory: Memory = {
        id: `mem_${Date.now()}`,
        userId: user?.id || "user_demo",
        url: browserUrl,
        canonicalUrl: browserUrl,
        domain: parsedDomain,
        pageTitle: browserTitle,
        websiteName: browserSiteName,
        websiteIcon: browserIcon,
        originalNote: fullOriginalNote,
        aiSummary: noteInput.slice(0, 50) + "...",
        tags: ["Saved"],
        priority: "medium",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setMemories(prev => [fallbackMemory, ...prev]);
      showNotification("Memory saved (offline fallback)", "info");
      setNoteInput("");
      setHighlightedText("");
      setIsExtensionOpen(false);
    } finally {
      setIsProcessingAI(false);
      setProcessingStatus("");
    }
  };

  // Quick Action triggers
  const handleDeleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
    showNotification("Memory permanently deleted", "info");
    if (editingMemory?.id === id) setEditingMemory(null);
  };

  const handleTogglePin = (id: string) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, pinned: !m.pinned } : m));
    const memory = memories.find(m => m.id === id);
    showNotification(memory?.pinned ? "Removed from pinned memories" : "Pinned memory for top priority access");
  };

  const handleUpdateMemory = (updated: Memory) => {
    setMemories(prev => prev.map(m => m.id === updated.id ? updated : m));
    setEditingMemory(null);
    showNotification("Memory updated successfully");
  };

  // Run Semantic search on dashboard
  const handleDashboardSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dashSearchQuery.trim()) {
      setDashSearchResults([]);
      return;
    }

    setIsDashSearching(true);
    try {
      const response = await fetch("/api/gemini/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: dashSearchQuery, memories: memories }),
      });
      const data = await response.json();
      setDashSearchResults(data.results || []);
    } catch (error) {
      console.warn("Dashboard search error (using keyword fallback):", error);
      // Fallback keyword search
      const queryLower = dashSearchQuery.toLowerCase();
      const fallbackResults = memories.map(m => {
        const matches = m.originalNote.toLowerCase().includes(queryLower) ||
                        m.aiSummary.toLowerCase().includes(queryLower) ||
                        m.pageTitle.toLowerCase().includes(queryLower) ||
                        m.tags.some(t => t.toLowerCase().includes(queryLower));
        return {
          ...m,
          relevanceScore: matches ? 0.8 : 0,
          matchExplanation: matches ? "Fuzzy match found" : ""
        };
      }).filter(m => (m.relevanceScore || 0) > 0);
      setDashSearchResults(fallbackResults);
    } finally {
      setIsDashSearching(false);
    }
  };

  return (
    <div className="bg-[#fcfbfc] text-slate-900 min-h-screen relative font-sans">
      
      {/* Dynamic Status Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4.5 py-3 bg-zinc-900 text-white rounded-xl shadow-2xl border border-zinc-800 text-sm font-medium"
          >
            {notification.type === "success" ? (
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Info className="w-3.5 h-3.5" />
              </div>
            )}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Navigation tabs across App mode */}
      <div className="bg-zinc-950 text-zinc-400 px-6 py-3 flex items-center justify-between text-xs font-mono font-bold border-b border-zinc-900 sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-2.5">
          <Brain className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span className="text-white font-bold tracking-tight uppercase text-[10px]">Memory Desk Control Plane</span>
        </div>
        <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800/80 relative">
          <button 
            id="nav_landing_btn"
            onClick={() => setCurrentView("homepage")}
            className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 relative z-10 text-[11px] ${currentView === 'homepage' ? 'text-white' : 'hover:text-zinc-200'}`}
          >
            {currentView === 'homepage' && (
              <motion.div 
                layoutId="primaryNavCapsule"
                className="absolute inset-0 bg-zinc-800 rounded-lg -z-10"
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
              />
            )}
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            Landing Page
          </button>
          <button 
            id="nav_browser_btn"
            onClick={() => setCurrentView("browser")}
            className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 relative z-10 text-[11px] ${currentView === 'browser' ? 'text-white' : 'hover:text-zinc-200'}`}
          >
            {currentView === 'browser' && (
              <motion.div 
                layoutId="primaryNavCapsule"
                className="absolute inset-0 bg-zinc-800 rounded-lg -z-10"
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
              />
            )}
            <Chrome className="w-3.5 h-3.5 text-indigo-400" />
            Virtual Browser Simulator
          </button>
          <button 
            id="nav_dashboard_btn"
            onClick={() => setCurrentView("dashboard")}
            className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 relative z-10 text-[11px] ${currentView === 'dashboard' ? 'text-white' : 'hover:text-zinc-200'}`}
          >
            {currentView === 'dashboard' && (
              <motion.div 
                layoutId="primaryNavCapsule"
                className="absolute inset-0 bg-zinc-800 rounded-lg -z-10"
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
              />
            )}
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Personal Dashboard
          </button>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              <span className="text-zinc-400 text-[10px] bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg">{user.email}</span>
              <button 
                id="header_logout_btn"
                onClick={handleLogout}
                className="text-rose-400 hover:text-rose-300 text-[10px] uppercase font-bold tracking-widest cursor-pointer bg-zinc-900 hover:bg-rose-950/20 px-2.5 py-1 rounded-lg border border-zinc-800 hover:border-rose-900/30 transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              id="header_login_btn"
              onClick={handleLogin}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-colors shadow-lg shadow-indigo-500/20"
            >
              Google Sign-In
            </button>
          )}
        </div>
      </div>

      {/* Main Mode switcher */}
      <AnimatePresence mode="wait">
        {currentView === "homepage" && (
          <motion.div
            key="homepage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Homepage 
              onStartApp={(tab) => {
                if (tab === "browser") setCurrentView("browser");
                else if (tab === "dashboard") setCurrentView("dashboard");
                else setCurrentView("homepage");
              }}
              onLogin={handleLogin}
              initialMemories={memories}
            />
          </motion.div>
        )}

        {/* MODE: VIRTUAL BROWSER ENVIRONMENT */}
        {currentView === "browser" && (
          <motion.div
            key="browser"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-4 py-8 space-y-6"
          >
            <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
              <div className="space-y-1.5">
                <h2 className="font-display font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <Chrome className="w-5 h-5 text-indigo-600 animate-pulse" />
                  Interactive Extension Playground
                </h2>
                <p className="text-xs text-slate-500 max-w-3xl leading-relaxed font-medium">
                  Memory Desk integrates beautifully within Chrome. Revisit any preloaded popular sandbox domain below or navigate to a custom URL to see how your context layers slide in.
                </p>
              </div>
              <button
                onClick={() => {
                  setMemories(initialMemories);
                  localStorage.removeItem("mem_memories");
                  showNotification("Reset demo memories to clean state", "info");
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-4.5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all duration-200 shadow-md self-start md:self-auto shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Sandbox
              </button>
            </div>

            {/* Quick-switch website simulator tabs */}
            <div className="flex flex-wrap items-center gap-2.5 pb-2">
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider mr-2">Visited:</span>
              <div className="flex flex-wrap gap-2">
                {presetTabs.map((pt) => {
                  const isCurrent = browserUrl === pt.url;
                  const hasMemorySaved = memories.some(m => m.url === pt.url);
                  return (
                    <button
                      key={pt.id}
                      onClick={() => handleNavigate(pt.url, pt.title, pt.name, pt.icon)}
                      className={`relative px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 ${
                        isCurrent 
                          ? "text-white" 
                          : "bg-white hover:bg-slate-100 border border-slate-200/60 text-slate-600"
                      }`}
                    >
                      {isCurrent && (
                        <motion.div
                          layoutId="simulatorTabCapsule"
                          className="absolute inset-0 bg-indigo-600 rounded-xl -z-10 shadow-lg shadow-indigo-600/20"
                          transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        />
                      )}
                      <span className="relative z-10">{pt.icon}</span>
                      <span className="relative z-10">{pt.name}</span>
                      {hasMemorySaved && (
                        <span className={`relative z-10 w-2 h-2 rounded-full ${isCurrent ? 'bg-white' : 'bg-indigo-600 animate-pulse'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulated Chrome Browser */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden min-h-[580px] flex flex-col relative">
              
              {/* Browser bar */}
              <div className="bg-slate-100/80 px-4 py-3 flex items-center justify-between gap-4 border-b border-slate-200">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-400 inline-block"></span>
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-400 inline-block"></span>
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 inline-block"></span>
                </div>

                {/* URL Navigation input */}
                <form onSubmit={handleCustomUrlSubmit} className="flex-1 max-w-2xl flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1 text-xs">
                  <span className="text-slate-400 select-none mr-1.5">https://</span>
                  <input 
                    type="text" 
                    placeholder="Type custom webpage address (e.g. google.com/about)..." 
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="flex-1 focus:outline-none text-slate-800 font-mono py-0.5"
                  />
                  <button type="submit" className="text-indigo-600 hover:text-indigo-700 font-bold px-1">Go</button>
                </form>

                {/* Simulated Chrome Extensions Panel */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      id="extension_btn_trigger"
                      onClick={() => setIsExtensionOpen(!isExtensionOpen)}
                      className={`p-2 rounded-xl transition-all relative ${
                        isExtensionOpen 
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-150" 
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                      title="Open Memory Extension"
                    >
                      <Brain className="w-4 h-4" />
                      {/* Red bubble indicating saved state */}
                      {memories.some(m => m.url === browserUrl) && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white" />
                      )}
                    </button>

                    {/* Simulated Extension Popup Box */}
                    <AnimatePresence>
                      {isExtensionOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-slate-150 p-4.5 z-40 space-y-4 text-left"
                        >
                          <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
                            <span className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
                              <Brain className="w-4 h-4 animate-pulse" />
                              Remember This Page
                            </span>
                            <button onClick={() => setIsExtensionOpen(false)} className="text-slate-400 hover:text-slate-600">
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-1">
                            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Target Webpage</div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm">{browserIcon}</span>
                              <div className="truncate text-xs font-semibold text-slate-800 leading-tight">
                                {browserTitle}
                              </div>
                            </div>
                          </div>

                          {highlightedText && (
                            <div className="space-y-1 bg-slate-50 border-l-2 border-indigo-600 p-2.5 rounded text-xs">
                              <div className="text-[9px] uppercase font-bold tracking-wider text-indigo-600">Captured Highlight</div>
                              <p className="text-slate-600 italic line-clamp-3">"{highlightedText}"</p>
                              <button 
                                onClick={() => setHighlightedText("")}
                                className="text-[9px] text-rose-500 hover:underline block font-semibold mt-1"
                              >
                                Remove Highlight
                              </button>
                            </div>
                          )}

                          <form onSubmit={handleSaveMemory} className="space-y-3.5">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">What do you want to remember?</label>
                              <textarea
                                required
                                value={noteInput}
                                onChange={(e) => setNoteInput(e.target.value)}
                                placeholder="E.g., Renew passport in October, target price is ₹95k, Azure recruiter followup..."
                                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all h-20 resize-none font-medium text-slate-800"
                              />
                            </div>

                            {/* Show AI features that happen instantly */}
                            <div className="bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100/60 text-[10px] text-indigo-700 font-medium space-y-1">
                              <div className="flex items-center gap-1 font-bold">
                                <Sparkles className="w-3 h-3 text-indigo-600" />
                                Gemini AI Auto-processing
                              </div>
                              <p className="text-slate-500 leading-relaxed">
                                AI automatically creates a concise summary, assigns priorities, extracts tags, and links related projects instantly on save.
                              </p>
                            </div>

                            <div className="flex items-center gap-2 justify-end pt-1">
                              <button
                                type="button"
                                onClick={() => setIsExtensionOpen(false)}
                                className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 transition-colors font-semibold"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={isProcessingAI}
                                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-indigo-100 transition-colors"
                              >
                                {isProcessingAI ? (
                                  <>
                                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    Save Memory
                                  </>
                                )}
                              </button>
                            </div>
                          </form>

                          {isProcessingAI && (
                            <div className="absolute inset-0 bg-white/90 rounded-xl flex flex-col items-center justify-center p-4 text-center z-50">
                              <div className="relative w-12 h-12 flex items-center justify-center mb-3">
                                <Brain className="w-8 h-8 text-indigo-600 animate-pulse absolute" />
                                <div className="w-12 h-12 rounded-full border-2 border-indigo-600/20 border-t-indigo-600 animate-spin"></div>
                              </div>
                              <h4 className="font-bold text-slate-900 text-sm">Processing with Gemini</h4>
                              <p className="text-[11px] text-slate-500 mt-1.5 max-w-[220px] font-medium leading-relaxed">
                                {processingStatus}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Simulation Content Body */}
              <div className="flex-1 p-8 bg-slate-50 flex flex-col md:flex-row gap-8 relative overflow-hidden">
                
                {/* Main simulated page content */}
                <div className="flex-1 space-y-6">
                  
                  {/* Webpage Header mockup */}
                  <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-150 shadow-sm">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-2xl shadow-inner select-none">
                      {browserIcon}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-wider">{browserSiteName}</span>
                      <h1 className="font-bold text-lg text-slate-900 leading-tight tracking-tight">{browserTitle}</h1>
                      <p className="text-[11px] text-slate-400 font-mono truncate">{browserUrl}</p>
                    </div>
                  </div>

                  {/* Webpage Body Blocks */}
                  <div className="space-y-4">
                    <div className="bg-indigo-50/40 border border-indigo-100/50 p-3 rounded-xl flex items-center gap-2.5 text-xs text-indigo-800">
                      <MousePointerClick className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>
                        <strong>Highlight to Remember:</strong> Click any text block below to simulate highlighting text before opening the memory extension.
                      </span>
                    </div>

                    <div className="space-y-4">
                      {presetTabs.find(p => p.url === browserUrl)?.textBlocks.map((block, idx) => {
                        const isHighlighted = highlightedText === block;
                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              if (isHighlighted) {
                                setHighlightedText("");
                                showNotification("Highlight removed", "info");
                              } else {
                                setHighlightedText(block);
                                showNotification("Text highlighted! Click the extension brain icon to save notes.");
                              }
                            }}
                            className={`p-4 rounded-xl cursor-pointer border transition-all text-sm leading-relaxed ${
                              isHighlighted 
                                ? "bg-indigo-50 border-indigo-300 shadow-md shadow-indigo-50 text-indigo-950 scale-[1.01]" 
                                : "bg-white hover:bg-slate-50/80 border-slate-150 text-slate-700 hover:scale-[1.005]"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5 select-none">
                              <span className="text-[10px] text-slate-400 font-mono font-bold">Paragraph {idx + 1}</span>
                              {isHighlighted && (
                                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5" /> Selected Highlight
                                </span>
                              )}
                            </div>
                            <p className="font-medium font-sans">{block}</p>
                            {isHighlighted && (
                              <div className="mt-3 pt-2.5 border-t border-indigo-100 flex flex-wrap items-center gap-2 animate-fadeIn text-xs">
                                <span className="text-[10px] text-indigo-700 font-extrabold flex items-center gap-1 shrink-0">
                                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                                  Quick Note Preset:
                                </span>
                                {[
                                  { label: "📌 Follow-up Task", note: "Add action to follow up on this info next week." },
                                  { label: "💰 Specs & Pricing", note: "Save pricing specification / tech options details." },
                                  { label: "⭐ Reference Point", note: "Reference key point of interest for our active workspace." }
                                ].map((opt, oIdx) => (
                                  <button
                                    key={oIdx}
                                    onClick={(e) => {
                                      e.stopPropagation(); // Avoid untoggling the highlight
                                      setNoteInput(opt.note);
                                      setIsExtensionOpen(true);
                                      showNotification("Note content pre-filled! Check the Extension Popup.", "success");
                                    }}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors border border-indigo-700 shadow-sm"
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      }) || (
                        // If custom URL is entered
                        <div className="bg-white border border-slate-150 p-6 rounded-xl space-y-4">
                          <p className="text-sm text-slate-700 font-medium">
                            This is a simulated custom viewport representation of <strong>{browserUrl}</strong>.
                          </p>
                          <div className="space-y-2.5">
                            <div className="w-full h-2 bg-slate-100 rounded"></div>
                            <div className="w-11/12 h-2 bg-slate-100 rounded"></div>
                            <div className="w-4/5 h-2 bg-slate-100 rounded"></div>
                          </div>
                          <button
                            onClick={() => {
                              const block = `Context notes from page: ${browserTitle}. Saved on custom url exploration module.`;
                              setHighlightedText(block);
                              showNotification("Custom text block highlighted!");
                            }}
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs px-3.5 py-2 rounded-xl transition-all"
                          >
                            Simulate Text Selection here
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Simulated Floating Memory Card Overlays / Real-time Notification */}
                <div className="w-full md:w-80 shrink-0 space-y-4">
                  
                  {/* Floating Recall Card (Magically slides in on revisit!) */}
                  <AnimatePresence mode="wait">
                    {matchedMemory ? (
                      <motion.div
                        initial={{ opacity: 0, x: 50, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 30 }}
                        className="bg-white rounded-xl shadow-2xl border border-indigo-100 p-5 space-y-4 relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-2xl"></div>
                        
                        <div className="flex items-center justify-between border-b border-slate-50 pb-2 relative z-10">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 font-sans uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            Welcome Back
                          </span>
                          <button
                            onClick={() => {
                              setDismissedMatches(prev => ({ ...prev, [matchedMemory.id]: true }));
                              setMatchedMemory(null);
                            }}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-2 relative z-10">
                          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Your previous thought:</div>
                          <p className="text-xs text-slate-700 font-semibold leading-relaxed bg-indigo-50/40 p-3 rounded-lg border-l-2 border-indigo-500 italic">
                            &ldquo;{matchedMemory.originalNote.replace(/\[Selected Highlight: ".*"\]\n\n/, "")}&rdquo;
                          </p>
                          
                          {matchedMemory.originalNote.includes('[Selected Highlight: "') && (
                            <div className="text-[10px] text-slate-500 pl-3 border-l border-slate-200 line-clamp-2">
                              Highlighted: {matchedMemory.originalNote.match(/\[Selected Highlight: "(.*)"\]/) ? matchedMemory.originalNote.match(/\[Selected Highlight: "(.*)"\]/)![1] : ""}
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-50 flex items-center justify-between relative z-10">
                          <span className="text-[9px] font-mono text-slate-400">
                            Saved {new Date(matchedMemory.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer flex items-center gap-0.5" onClick={() => setCurrentView("dashboard")}>
                            Edit in Dashboard <ArrowUpRight className="w-3 h-3" />
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      // Shimmer skeleton when loading matching results
                      isMatchingPage && (
                        <div className="bg-white rounded-xl border border-slate-150 p-5 space-y-3.5 animate-pulse">
                          <div className="h-3.5 bg-slate-100 rounded w-1/3"></div>
                          <div className="h-14 bg-slate-100 rounded"></div>
                          <div className="h-3.5 bg-slate-100 rounded w-1/2"></div>
                        </div>
                      )
                    )}
                  </AnimatePresence>

                  {/* Smart capture suggestions overlay */}
                  <AnimatePresence>
                    {showSmartCapture && !memories.some(m => m.url === browserUrl) && (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="bg-zinc-900 text-white rounded-xl p-5 border border-zinc-800 space-y-3 shadow-xl"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                            Smart Habit Assist
                          </span>
                          <button 
                            onClick={() => {
                              setSmartCaptureDismissed(prev => ({ ...prev, [browserUrl]: true }));
                              setShowSmartCapture(false);
                            }}
                            className="text-zinc-500 hover:text-zinc-300"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                          You spent a few minutes reading this page. Anything worth saving to your Memory layer?
                        </p>
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => {
                              setIsExtensionOpen(true);
                              setShowSmartCapture(false);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-lg transition-all"
                          >
                            Remember This Page
                          </button>
                          <button
                            onClick={() => {
                              setSmartCaptureDismissed(prev => ({ ...prev, [browserUrl]: true }));
                              setShowSmartCapture(false);
                            }}
                            className="text-zinc-400 hover:text-zinc-200 text-[11px] px-2.5 py-1.5 transition-all"
                          >
                            Not now
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Instructions Block */}
                  <div className="bg-white rounded-xl border border-slate-150 p-5 space-y-3 shadow-sm text-xs text-slate-600 leading-relaxed">
                    <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-indigo-600" />
                      How to test the Extension
                    </h3>
                    <ol className="list-decimal pl-4 space-y-1.5 font-medium">
                      <li>Click on one of the simulated pages (e.g., <strong>LinkedIn</strong> or <strong>Amazon</strong>).</li>
                      <li>Highlight text inside a paragraph if desired.</li>
                      <li>Click the purple brain extension icon <Brain className="w-3 h-3 text-indigo-600 inline mx-0.5" /> in the address bar.</li>
                      <li>Write down a thought and click <strong>Save Memory</strong>. Watch the AI auto-synthesize tags and categories.</li>
                      <li>Switch tabs, then revisit the same tab and see your memory slide in instantly!</li>
                    </ol>
                  </div>

                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* MODE: PERSONAL DASHBOARD */}
        {currentView === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto px-4 py-8"
          >
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden min-h-[620px] flex flex-col md:flex-row">
              
              {/* Sidebar Navigation */}
              <aside className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-6 flex flex-col justify-between shrink-0 space-y-8">
                <div className="space-y-7">
                  {/* Brand logo */}
                  <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentView("homepage")}>
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-display font-bold text-base tracking-tight text-slate-900">Memory Desk</span>
                  </div>

                  {/* Core Filters */}
                  <nav className="space-y-1.5 text-xs font-bold text-slate-500 relative">
                    <button
                      onClick={() => {
                        setDashboardTab("all");
                        setSelectedProjectId(null);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-300 relative ${
                        dashboardTab === "all" && !selectedProjectId 
                          ? "text-indigo-700 font-extrabold" 
                          : "hover:text-slate-900"
                      }`}
                    >
                      {dashboardTab === "all" && !selectedProjectId && (
                        <motion.div 
                          layoutId="activeSidebarTab"
                          className="absolute inset-0 bg-indigo-50 border border-indigo-100/30 rounded-xl -z-10 shadow-sm"
                          transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        />
                      )}
                      <span className="flex items-center gap-2.5 relative z-10">
                        <Layers className="w-4 h-4 text-indigo-500" />
                        All Memories
                      </span>
                      <span className="bg-slate-200/60 text-slate-600 px-2 py-0.5 rounded-lg text-[9px] relative z-10">{memories.length}</span>
                    </button>

                    <button
                      onClick={() => {
                        setDashboardTab("pinned");
                        setSelectedProjectId(null);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-300 relative ${
                        dashboardTab === "pinned" 
                          ? "text-indigo-700 font-extrabold" 
                          : "hover:text-slate-900"
                      }`}
                    >
                      {dashboardTab === "pinned" && (
                        <motion.div 
                          layoutId="activeSidebarTab"
                          className="absolute inset-0 bg-indigo-50 border border-indigo-100/30 rounded-xl -z-10 shadow-sm"
                          transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        />
                      )}
                      <span className="flex items-center gap-2.5 relative z-10">
                        <Pin className="w-4 h-4 text-indigo-500" />
                        Pinned memories
                      </span>
                      <span className="bg-slate-200/60 text-slate-600 px-2 py-0.5 rounded-lg text-[9px] relative z-10">
                        {memories.filter(m => m.pinned).length}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setDashboardTab("search");
                        setSelectedProjectId(null);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-300 relative ${
                        dashboardTab === "search" 
                          ? "text-indigo-700 font-extrabold" 
                          : "hover:text-slate-900"
                      }`}
                    >
                      {dashboardTab === "search" && (
                        <motion.div 
                          layoutId="activeSidebarTab"
                          className="absolute inset-0 bg-indigo-50 border border-indigo-100/30 rounded-xl -z-10 shadow-sm"
                          transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        />
                      )}
                      <span className="flex items-center gap-2.5 relative z-10">
                        <Search className="w-4 h-4 text-indigo-500" />
                        Semantic AI Search
                      </span>
                      <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-[8px] uppercase font-mono tracking-wider font-extrabold relative z-10">Gemini</span>
                    </button>

                    <button
                      onClick={() => {
                        setDashboardTab("extension");
                        setSelectedProjectId(null);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-300 relative ${
                        dashboardTab === "extension" 
                          ? "text-indigo-700 font-extrabold" 
                          : "hover:text-slate-900"
                      }`}
                    >
                      {dashboardTab === "extension" && (
                        <motion.div 
                          layoutId="activeSidebarTab"
                          className="absolute inset-0 bg-indigo-50 border border-indigo-100/30 rounded-xl -z-10 shadow-sm"
                          transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        />
                      )}
                      <span className="flex items-center gap-2">
                        <Chrome className="w-4 h-4" />
                        Chrome Extension
                      </span>
                      <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider font-extrabold">INSTALL</span>
                    </button>
                  </nav>

                  {/* Projects List */}
                  <div className="space-y-2">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 font-mono px-3">
                      Projects & Spaces
                    </div>
                    <div className="space-y-1">
                      {projects.map((proj) => {
                        const count = memories.filter(m => m.projectId === proj.id).length;
                        const isSelected = selectedProjectId === proj.id;
                        return (
                          <button
                            key={proj.id}
                            onClick={() => {
                              setSelectedProjectId(proj.id);
                              setDashboardTab("projects");
                            }}
                            className={`w-full text-xs font-bold flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-300 relative ${
                              isSelected 
                                ? "text-indigo-700 font-extrabold" 
                                : "hover:text-slate-950 text-slate-500"
                            }`}
                          >
                            {isSelected && (
                              <motion.div 
                                layoutId="activeSidebarTab"
                                className="absolute inset-0 bg-indigo-50 border border-indigo-100/30 rounded-xl -z-10 shadow-sm"
                                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                              />
                            )}
                            <span className="flex items-center gap-2.5 truncate relative z-10">
                              <Folder className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                              <span className="truncate">{proj.name}</span>
                            </span>
                            <span className="bg-slate-200/60 text-slate-600 px-2 py-0.5 rounded-lg text-[9px] shrink-0 relative z-10">{count}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Minimalist Profile Details */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <img 
                      src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} 
                      alt="avatar" 
                      className="w-8 h-8 rounded-full border border-slate-200 shadow-sm"
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-800 truncate">{user?.name || "Demo User"}</div>
                      <div className="text-[10px] text-slate-400 truncate">{user?.email || "demo@example.com"}</div>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </aside>

              {/* Main Content Pane */}
              <main className="flex-1 p-8 bg-white flex flex-col justify-between overflow-y-auto max-h-[700px]">
                
                <div className="space-y-6">
                  {/* Dashboard Header Title */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        {selectedProjectId 
                          ? projects.find(p => p.id === selectedProjectId)?.name 
                          : dashboardTab === "all" 
                          ? "All Saved Memories" 
                          : dashboardTab === "pinned"
                          ? "Pinned Memories"
                          : dashboardTab === "search"
                          ? "Semantic AI Search"
                          : dashboardTab === "extension"
                          ? "Chrome Extension Integration"
                          : "Settings"}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        {selectedProjectId 
                          ? projects.find(p => p.id === selectedProjectId)?.description 
                          : dashboardTab === "extension"
                          ? "Integrate Memory Desk directly with your live Google Chrome browser."
                          : "Remember why pages mattered with non-disruptive context indicators."}
                      </p>
                    </div>

                    <button
                      onClick={() => setCurrentView("browser")}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-100 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Memory (Go to Browser)
                    </button>
                  </div>

                  {/* MAIN VIEW: SEMANTIC SEARCH */}
                  {dashboardTab === "search" && (
                    <div className="space-y-6">
                      <form onSubmit={handleDashboardSearch} className="flex gap-3 bg-slate-50 border border-slate-250 p-2 rounded-xl">
                        <div className="relative flex-1">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                          <input
                            type="text"
                            required
                            placeholder="Type a query conceptually (e.g. microsoft contact, pricing details, Shadow DOM query fixes)..."
                            value={dashSearchQuery}
                            onChange={(e) => setDashSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-transparent focus:outline-none text-sm font-medium text-slate-800"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isDashSearching}
                          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          {isDashSearching ? (
                            <>
                              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                              Searching...
                            </>
                          ) : (
                            <>
                              <Brain className="w-3.5 h-3.5" />
                              AI Search
                            </>
                          )}
                        </button>
                      </form>

                      {/* Display Search Results */}
                      <div className="space-y-4">
                        {isDashSearching ? (
                          <div className="space-y-3">
                            <div className="h-12 bg-slate-50 border border-slate-100 rounded-xl animate-pulse"></div>
                            <div className="h-12 bg-slate-50 border border-slate-100 rounded-xl animate-pulse"></div>
                          </div>
                        ) : dashSearchResults.length > 0 ? (
                          <div className="space-y-3.5">
                            <div className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">AI Sorted relevance matches:</div>
                            {dashSearchResults.map((res) => (
                              <div key={res.id} className="bg-slate-50 border border-slate-200/70 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">{res.websiteIcon}</span>
                                    <span className="text-xs font-bold text-slate-800">{res.websiteName}</span>
                                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                                      {res.relevanceScore ? Math.round(res.relevanceScore * 100) : 0}% Match
                                    </span>
                                  </div>
                                  <p className="text-xs font-bold text-slate-400 truncate max-w-lg">{res.pageTitle}</p>
                                  <p className="text-xs text-slate-700 font-medium italic pl-3 border-l-2 border-indigo-400">
                                    &ldquo;{res.originalNote}&rdquo;
                                  </p>
                                </div>
                                {res.matchExplanation && (
                                  <div className="bg-white border border-slate-150 rounded-lg px-3 py-1.5 text-[10px] font-mono text-indigo-700 font-semibold max-w-[180px] text-center">
                                    {res.matchExplanation}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : dashSearchQuery ? (
                          <div className="text-center py-12 space-y-2">
                            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                            <h4 className="font-bold text-slate-700 text-sm">No match explanation found</h4>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">Try typing conceptually, such as "laptop specs", "recruiters", "YouTube notes", or similar keywords.</p>
                          </div>
                        ) : (
                          <div className="bg-indigo-50/40 border border-indigo-100 p-6 rounded-xl space-y-2 text-center">
                            <Brain className="w-8 h-8 text-indigo-600 mx-auto animate-pulse" />
                            <h4 className="font-bold text-indigo-900 text-xs">Vector Match Playground</h4>
                            <p className="text-xs text-slate-600 max-w-md mx-auto">
                              Our search query utilizes server-side embeddings projection logic. This means it queries concepts like "laptop" and successfully links to "MacBook Pro" without exact keyword constraints.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {dashboardTab === "extension" && (
                    <div className="space-y-6">
                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                        <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider">How Local vs Deployed Domain works</h4>
                          <p className="text-xs text-amber-800 leading-relaxed font-medium">
                            Your Chrome Extension needs to communicate with your deployed backend server. By default, we pre-configure the files with the URL we detected: <strong className="font-bold underline">{customBackendUrl}</strong>. If you deploy this applet to Google Cloud Run, Vercel, or your custom server, simply update the URL input below and click <strong>Download All Files</strong> to instantly generate configured extension workers!
                          </p>
                        </div>
                      </div>

                      {/* Backend URL configuration input */}
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                        <label className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block">
                          Configure Extension Backend Target Server
                        </label>
                        <div className="flex gap-3">
                          <div className="relative flex-1">
                            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              required
                              placeholder="https://your-deployed-server-url.run.app"
                              value={customBackendUrl}
                              onChange={(e) => setCustomBackendUrl(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 focus:outline-none rounded-lg text-xs font-bold text-slate-800 focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                          <button
                            onClick={handleDownloadAllExtensionFiles}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-100"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download Extension Package (ZIP)
                          </button>
                        </div>
                      </div>

                      {/* Step-by-Step guide and File Previews in split columns */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* LEFT COLUMN: 3 Step Guide (5 cols) */}
                        <div className="lg:col-span-5 space-y-4">
                          <h4 className="font-extrabold text-slate-850 text-sm tracking-tight border-b border-slate-100 pb-2">
                            🚀 Chrome Installation Guide
                          </h4>

                          <div className="space-y-4 font-sans text-xs">
                            <div className="flex gap-3">
                              <span className="bg-indigo-600 text-white font-mono font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center shrink-0 text-[11px]">1</span>
                              <div className="space-y-0.5">
                                <h5 className="font-bold text-slate-800">Download ZIP Package</h5>
                                <p className="text-slate-500 leading-relaxed font-medium">
                                  Click the <strong className="font-bold text-indigo-600">Download Extension Package (ZIP)</strong> button above to download all pre-configured assets bundled as a single package.
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <span className="bg-indigo-600 text-white font-mono font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center shrink-0 text-[11px]">2</span>
                              <div className="space-y-0.5">
                                <h5 className="font-bold text-slate-800">Extract the ZIP Folder</h5>
                                <p className="text-slate-500 leading-relaxed font-medium">
                                  Extract/unzip the downloaded <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-indigo-700 text-[10px] font-semibold">MemoryDeskExtension.zip</code> file into a standard folder anywhere on your computer.
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <span className="bg-indigo-600 text-white font-mono font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center shrink-0 text-[11px]">3</span>
                              <div className="space-y-0.5">
                                <h5 className="font-bold text-slate-800">Load Unpacked in Chrome</h5>
                                <p className="text-slate-500 leading-relaxed font-medium">
                                  Open Chrome and go to <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-bold text-[10px]">chrome://extensions/</span>. Enable the **Developer mode** toggle in the top-right, click **Load unpacked** in the top-left, and select your extracted folder! Done! 🚀
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Dynamic Seed synchronization panel */}
                          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3.5 mt-4">
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-indigo-600" />
                              <h5 className="font-bold text-slate-800 text-xs">Instantly Sync App Data</h5>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                              Seed your fresh browser extension immediately with your current app memories so you do not start empty!
                            </p>
                            <div className="space-y-2">
                              <button
                                onClick={() => {
                                  const text = JSON.stringify({ memories }, null, 2);
                                  navigator.clipboard.writeText(text);
                                  showNotification("Extension seeds copied! Paste them in Chrome Extension LocalStorage Console or Import menu.", "success");
                                }}
                                className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
                              >
                                <Copy className="w-3 h-3 text-slate-500" />
                                Copy Memories JSON Seed Block
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT COLUMN: File Previewer Tab structure (7 cols) */}
                        <div className="lg:col-span-7 flex flex-col space-y-4">
                          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col space-y-3.5 shadow-sm">
                            <div className="flex items-center justify-between">
                              <h5 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                <Settings className="w-4 h-4 text-indigo-500 animate-spin-slow" />
                                Extension Source Sandbox
                              </h5>
                              <button
                                onClick={() => setShowTechnicalFiles(!showTechnicalFiles)}
                                className="bg-white hover:bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-xl text-[10px] font-bold text-indigo-600 transition-all flex items-center gap-1 shadow-sm"
                              >
                                {showTechnicalFiles ? "Hide Code View" : "Expand Code View"}
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showTechnicalFiles ? "rotate-180" : ""}`} />
                              </button>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                              Inspect, review, or copy the pre-configured browser extension scripts that establish communication hooks back to your server.
                            </p>
                          </div>

                          <AnimatePresence>
                            {showTechnicalFiles && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-3 flex flex-col overflow-hidden"
                              >
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                  <h4 className="font-extrabold text-slate-850 text-sm tracking-tight">
                                    📁 File Generator Sandbox
                                  </h4>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleCopyFile(activeExtFile)}
                                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] px-2.5 py-1 rounded flex items-center gap-1 transition-colors"
                                    >
                                      <Copy className="w-3 h-3" />
                                      Copy Code
                                    </button>
                                    <button
                                      onClick={() => handleDownloadFile(activeExtFile)}
                                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] px-2.5 py-1 rounded flex items-center gap-1 transition-colors"
                                    >
                                      <Download className="w-3 h-3" />
                                      Download File
                                    </button>
                                  </div>
                                </div>

                                {/* File Selection Tabs */}
                                <div className="flex flex-wrap gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
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
                                      onClick={() => setActiveExtFile(f.id as any)}
                                      className={`text-[11px] px-2.5 py-1 font-bold rounded-md transition-all ${
                                        activeExtFile === f.id
                                          ? "bg-indigo-600 text-white shadow-sm shadow-indigo-100"
                                          : "text-slate-500 hover:bg-white hover:text-slate-800"
                                      }`}
                                    >
                                      {f.name}
                                    </button>
                                  ))}
                                </div>

                                {/* Monospace Code Code block panel */}
                                <div className="relative border border-slate-200/80 rounded-xl overflow-hidden bg-slate-900 shadow-inner flex-1 min-h-[300px] flex flex-col">
                                  <div className="absolute right-3.5 top-3.5 z-10 text-[9px] uppercase tracking-wider font-extrabold text-indigo-400 font-mono bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                                    {getFilename(activeExtFile)}
                                  </div>
                                  <pre className="p-5 font-mono text-[10px] text-slate-100 overflow-x-auto overflow-y-auto max-h-[360px] leading-relaxed whitespace-pre font-medium">
                                    {getExtensionFile(activeExtFile)}
                                  </pre>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MEMORY CARDS LIST DISPLAY (Filter depending on selected Tab) */}
                  {dashboardTab !== "search" && dashboardTab !== "settings" && dashboardTab !== "extension" && (
                    <div className="space-y-5">
                      {/* Integrated Instant Search & Tag Pills */}
                      <div className="bg-slate-50 border border-slate-200/85 p-4.5 rounded-2xl space-y-4 shadow-sm">
                        <div className="flex flex-col sm:flex-row gap-3">
                          {/* Live search input */}
                          <div className="relative flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 flex items-center shadow-inner">
                            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                            <input
                              type="text"
                              placeholder="Fuzzy-filter page title, note content, domain, or tag..."
                              value={dashSearchQuery}
                              onChange={(e) => setDashSearchQuery(e.target.value)}
                              className="w-full bg-transparent text-xs focus:outline-none font-medium text-slate-800"
                            />
                            {dashSearchQuery && (
                              <button
                                onClick={() => setDashSearchQuery("")}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          
                          {/* AI Search Mode Trigger Button */}
                          <button
                            onClick={() => {
                              if (dashSearchQuery.trim()) {
                                setDashboardTab("search");
                                handleDashboardSearch(new Event('submit') as any);
                              } else {
                                showNotification("Type something in the search box to trigger Semantic AI matching!", "info");
                              }
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4.5 py-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-sm shadow-indigo-150"
                            title="Perform smart vector search on your note contexts"
                          >
                            <Brain className="w-4 h-4" />
                            AI Concept Search
                          </button>
                        </div>

                        {/* Interactive Horizontal Tag Filter Pills */}
                        {(() => {
                          const allTags = Array.from(new Set(memories.flatMap(m => m.tags))).filter(Boolean);
                          if (allTags.length === 0) return null;
                          return (
                            <div className="flex flex-col gap-2 pt-1 border-t border-slate-100/60">
                              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                                Filter by tag:
                              </div>
                              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                                <button
                                  onClick={() => setSelectedTag(null)}
                                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                                    selectedTag === null
                                      ? "bg-slate-900 text-white border-slate-900"
                                      : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                                  }`}
                                >
                                  All tags
                                </button>
                                {allTags.map((tag) => {
                                  const isSelected = selectedTag === tag;
                                  return (
                                    <button
                                      key={tag}
                                      onClick={() => setSelectedTag(isSelected ? null : tag)}
                                      className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all border flex items-center gap-1 ${
                                        isSelected
                                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                          : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                                      }`}
                                    >
                                      #{tag}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Filter the list */}
                      {(() => {
                        let filtered = memories;
                        if (dashboardTab === "pinned") {
                          filtered = memories.filter(m => m.pinned);
                        } else if (dashboardTab === "projects" && selectedProjectId) {
                          filtered = memories.filter(m => m.projectId === selectedProjectId);
                        }

                        // Filter by selected tag
                        if (selectedTag) {
                          filtered = filtered.filter(m => m.tags.includes(selectedTag));
                        }

                        // Filter by live fuzzy query
                        if (dashSearchQuery.trim()) {
                          const query = dashSearchQuery.toLowerCase();
                          filtered = filtered.filter(m => {
                            return m.originalNote.toLowerCase().includes(query) ||
                                   m.aiSummary.toLowerCase().includes(query) ||
                                   m.pageTitle.toLowerCase().includes(query) ||
                                   m.websiteName.toLowerCase().includes(query) ||
                                   m.tags.some(t => t.toLowerCase().includes(query));
                          });
                        }

                        if (filtered.length === 0) {
                          return (
                            <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-4">
                              <Brain className="w-10 h-10 text-slate-300 mx-auto" />
                              <div className="space-y-1">
                                <h4 className="font-bold text-slate-700 text-sm">You haven't forgotten anything yet.</h4>
                                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                                  Your internet memory starts here. Go capture your first memory on any webpage via the Virtual Browser.
                                </p>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div className="grid gap-6">
                            {filtered.map((mem) => (
                              <motion.div 
                                layout
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                key={mem.id}
                                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-150 transition-all duration-300 flex flex-col justify-between gap-5 relative group"
                              >
                                <div className="space-y-4">
                                  {/* Favicon & domain info row */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <span className="text-2xl select-none w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">{mem.websiteIcon}</span>
                                      <div>
                                        <div className="flex items-center gap-1.5">
                                          <span className="font-display font-extrabold text-sm text-slate-800">{mem.websiteName}</span>
                                          <span className="text-[10px] text-slate-400 font-mono">({mem.domain})</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Action items */}
                                    <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <button
                                        onClick={() => handleTogglePin(mem.id)}
                                        className={`p-2 rounded-xl border transition-all duration-200 ${
                                          mem.pinned 
                                            ? "bg-indigo-50 border-indigo-150 text-indigo-600 shadow-sm" 
                                            : "bg-white border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100"
                                        }`}
                                        title={mem.pinned ? "Unpin" : "Pin memory"}
                                      >
                                        <Pin className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => setEditingMemory(mem)}
                                        className="p-2 rounded-xl border bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-all duration-200"
                                        title="Edit note"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteMemory(mem.id)}
                                        className="p-2 rounded-xl border bg-white border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all duration-200"
                                        title="Delete memory"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Content Title */}
                                  <div className="space-y-2">
                                    <a 
                                      href={mem.url} 
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors inline-flex items-center gap-1 hover:underline"
                                    >
                                      {mem.pageTitle}
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                    
                                    {/* Original note with nice quoting */}
                                    <p className="text-sm text-slate-700 font-medium leading-relaxed italic border-l-2 border-indigo-500 pl-4 bg-slate-50/50 py-3 pr-3 rounded-r-xl">
                                      &ldquo;{mem.originalNote.replace(/\[Selected Highlight: ".*"\]\n\n/, "")}&rdquo;
                                    </p>
                                    
                                    {/* Extracted Highlight if present */}
                                    {mem.originalNote.includes('[Selected Highlight: "') && (
                                      <p className="text-[11px] text-slate-500 pl-4 leading-relaxed bg-amber-50/40 py-2.5 rounded-r-xl border-l-2 border-amber-400">
                                        <span className="font-extrabold text-amber-600 uppercase tracking-wider text-[9px] block mb-1">Highlighted Selection:</span>
                                        {mem.originalNote.match(/\[Selected Highlight: "(.*)"\]/) ? mem.originalNote.match(/\[Selected Highlight: "(.*)"\]/)![1] : ""}
                                      </p>
                                    )}
                                  </div>

                                  {/* AI Summary Badge */}
                                  <div className="bg-indigo-50/30 rounded-2xl p-3.5 border border-indigo-100/50 flex gap-3">
                                    <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                                    <div>
                                      <span className="text-[9px] font-mono font-extrabold text-indigo-600 uppercase tracking-wider block mb-0.5">Gemini Synthesis Summary</span>
                                      <p className="text-[11px] text-indigo-950 font-medium leading-relaxed">
                                        {mem.aiSummary}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Badges bottom row */}
                                <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-100 text-[10px] text-slate-400 font-bold gap-2">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className={`px-2.5 py-1 rounded-lg uppercase tracking-wider font-extrabold ${
                                      mem.priority === 'high' 
                                        ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                                        : mem.priority === 'medium'
                                        ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                        : 'bg-slate-50 text-slate-500 border border-slate-150'
                                    }`}>
                                      {mem.priority} priority
                                    </span>
                                    {mem.tags.map(t => (
                                      <span key={t} className="bg-slate-50 border border-slate-150 px-2.5 py-1 rounded-lg text-slate-500 font-semibold">#{t}</span>
                                    ))}
                                  </div>
                                  <span className="font-mono text-slate-400">Added {new Date(mem.createdAt).toLocaleDateString()}</span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                </div>

                {/* Micro footer inside dashboard */}
                <div className="pt-8 border-t border-slate-100 text-center text-[10px] text-slate-400 font-mono">
                  Memory uses server-side Gemini 3.5 models to synthesize tags, generate smart workspaces, and perform vector conceptual matches.
                </div>
              </main>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT MEMORY MODAL POPUP */}
      <AnimatePresence>
        {editingMemory && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 text-left border border-slate-150"
            >
              <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                  <Edit2 className="w-4 h-4 text-indigo-600" />
                  Edit Saved Memory
                </h4>
                <button onClick={() => setEditingMemory(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Website</label>
                  <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <span>{editingMemory.websiteIcon}</span>
                    <span>{editingMemory.pageTitle}</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Your Note Context</label>
                  <textarea
                    required
                    value={editingMemory.originalNote.replace(/\[Selected Highlight: ".*"\]\n\n/, "")}
                    onChange={(e) => {
                      const textValue = e.target.value;
                      const matches = editingMemory.originalNote.match(/\[Selected Highlight: ".*"\]\n\n/);
                      const prefix = matches ? matches[0] : "";
                      setEditingMemory({
                        ...editingMemory,
                        originalNote: prefix + textValue
                      });
                    }}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all h-24 resize-none font-medium text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Priority Level</label>
                    <select
                      value={editingMemory.priority}
                      onChange={(e) => setEditingMemory({ ...editingMemory, priority: e.target.value as any })}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Pin to Top</label>
                    <select
                      value={editingMemory.pinned ? "yes" : "no"}
                      onChange={(e) => setEditingMemory({ ...editingMemory, pinned: e.target.value === "yes" })}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Gemini Summary</label>
                  <input
                    type="text"
                    value={editingMemory.aiSummary}
                    onChange={(e) => setEditingMemory({ ...editingMemory, aiSummary: e.target.value })}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium"
                  />
                </div>

                <div className="flex items-center gap-2 justify-end pt-2 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={() => setEditingMemory(null)}
                    className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateMemory(editingMemory)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-md transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
