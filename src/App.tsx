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
import ExtensionInstaller from "./components/ExtensionInstaller";
import JSZip from "jszip";

export default function App() {
  // Navigation & General App State
  const [currentView, setCurrentView] = useState<"homepage" | "browser" | "dashboard" | "install-extension">("homepage");
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
    <div className="bg-[#07070a] text-zinc-100 min-h-screen relative font-sans flex flex-col justify-between">
      
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
      <div className="bg-[#07070a]/80 backdrop-blur-md text-zinc-400 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b border-zinc-900/60 sticky top-0 z-50 gap-2 sm:gap-4">
        <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setCurrentView("homepage")}>
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-md">
            <Brain className="w-4.5 h-4.5 text-indigo-400" />
          </div>
          <div className="hidden min-[400px]:block">
            <span className="font-extrabold tracking-tight text-xs sm:text-sm text-zinc-100 block">Memory</span>
            <span className="text-[7px] sm:text-[8px] font-mono font-bold tracking-widest text-indigo-400 uppercase block">SECOND BRAIN</span>
          </div>
        </div>

        <div className="flex items-center bg-zinc-900/60 p-0.5 sm:p-1 rounded-xl border border-zinc-900 relative overflow-x-auto scrollbar-none max-w-[55%] sm:max-w-none">
          <button 
            id="nav_landing_btn"
            onClick={() => setCurrentView("homepage")}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors relative z-10 text-[10px] sm:text-xs font-bold shrink-0 ${currentView === 'homepage' ? 'text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            {currentView === 'homepage' && (
              <motion.div 
                layoutId="primaryNavCapsule"
                className="absolute inset-0 bg-zinc-800/80 rounded-lg -z-10 border border-zinc-700/20"
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
              />
            )}
            Home
          </button>
          <button 
            id="nav_browser_btn"
            onClick={() => setCurrentView("browser")}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors relative z-10 text-[10px] sm:text-xs font-bold shrink-0 ${currentView === 'browser' ? 'text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            {currentView === 'browser' && (
              <motion.div 
                layoutId="primaryNavCapsule"
                className="absolute inset-0 bg-zinc-800/80 rounded-lg -z-10 border border-zinc-700/20"
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
              />
            )}
            Sandbox
          </button>
          <button 
            id="nav_install_btn"
            onClick={() => setCurrentView("install-extension")}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors relative z-10 text-[10px] sm:text-xs font-bold shrink-0 ${currentView === 'install-extension' ? 'text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            {currentView === 'install-extension' && (
              <motion.div 
                layoutId="primaryNavCapsule"
                className="absolute inset-0 bg-zinc-800/80 rounded-lg -z-10 border border-zinc-700/20"
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
              />
            )}
            Extension
          </button>
          <button 
            id="nav_dashboard_btn"
            onClick={() => setCurrentView("dashboard")}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors relative z-10 text-[10px] sm:text-xs font-bold shrink-0 ${currentView === 'dashboard' ? 'text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            {currentView === 'dashboard' && (
              <motion.div 
                layoutId="primaryNavCapsule"
                className="absolute inset-0 bg-zinc-800/80 rounded-lg -z-10 border border-zinc-700/20"
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
              />
            )}
            Vault
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="hidden md:inline text-zinc-500 text-[10px] bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-900 font-mono max-w-[120px] truncate">{user.email}</span>
              <button 
                id="header_logout_btn"
                onClick={handleLogout}
                className="text-zinc-400 hover:text-rose-450 text-[10px] font-bold transition-all px-2.5 py-1.5 bg-zinc-950/25 hover:bg-rose-950/10 rounded-lg border border-zinc-900 hover:border-rose-900/10 cursor-pointer flex items-center gap-1"
                title="Sign Out"
              >
                <span className="hidden min-[480px]:inline">Sign Out</span>
                <LogOut className="w-3.5 h-3.5 min-[480px]:w-3 min-[480px]:h-3" />
              </button>
            </div>
          ) : (
            <button 
              id="header_login_btn"
              onClick={handleLogin}
              className="bg-zinc-100 hover:bg-white text-zinc-950 px-2.5 sm:px-3.5 py-1.5 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs transition-colors shadow-sm cursor-pointer"
            >
              Sign In
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
                else if (tab === "install-extension") setCurrentView("install-extension");
                else setCurrentView("homepage");
              }}
              onLogin={handleLogin}
              onLogout={handleLogout}
              initialMemories={memories}
              user={user}
            />
          </motion.div>
        )}

        {/* MODE: EXTENSION INSTALLATION & SETUP GUIDE */}
        {currentView === "install-extension" && (
          <motion.div
            key="install-extension"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ExtensionInstaller 
              customBackendUrl={customBackendUrl}
              setCustomBackendUrl={setCustomBackendUrl}
              onDownloadZIP={handleDownloadAllExtensionFiles}
              getExtensionFile={getExtensionFile}
              getFilename={getFilename}
              onCopyFile={handleCopyFile}
              onDownloadFile={handleDownloadFile}
              memories={memories}
              showNotification={showNotification}
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
            className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-6 sm:space-y-8"
          >
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-950/40 border border-indigo-500/20 rounded-full text-indigo-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                <Chrome className="w-3.5 h-3.5" />
                Live Playground
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-3xl font-extrabold tracking-tight text-zinc-100">
                    Virtual Sandbox
                  </h2>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                    Test the Memory companion inside a mock browser. Highlight content, save notes, switch pages, and watch the contextual layer automatically retrieve on return.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setMemories(initialMemories);
                    localStorage.removeItem("mem_memories");
                    showNotification("Reset demo memories to clean state", "info");
                  }}
                  className="bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 text-xs px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-all shrink-0 cursor-pointer self-start sm:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Sandbox
                </button>
              </div>
            </div>

            {/* Quick-switch website simulator tabs */}
            <div className="flex flex-wrap items-center gap-2.5 pb-2">
              <span className="text-[10px] font-bold text-zinc-500 font-mono uppercase tracking-wider mr-2">Visited:</span>
              <div className="flex flex-wrap gap-2">
                {presetTabs.map((pt) => {
                  const isCurrent = browserUrl === pt.url;
                  const hasMemorySaved = memories.some(m => m.url === pt.url);
                  return (
                    <button
                      key={pt.id}
                      onClick={() => handleNavigate(pt.url, pt.title, pt.name, pt.icon)}
                      className={`relative px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 cursor-pointer ${
                        isCurrent 
                          ? "text-white" 
                          : "bg-zinc-900 hover:bg-zinc-850 border border-zinc-800/85 text-zinc-400"
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
                        <span className={`relative z-10 w-2 h-2 rounded-full ${isCurrent ? 'bg-white' : 'bg-indigo-400 animate-pulse'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulated Chrome Browser */}
            <div className="bg-zinc-950 rounded-2xl border border-zinc-800/80 shadow-2xl shadow-black/50 overflow-hidden min-h-[580px] flex flex-col relative">
              
              {/* Browser bar */}
              <div className="bg-zinc-900 px-4 py-3 flex items-center justify-between gap-4 border-b border-zinc-800">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-500 inline-block"></span>
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block"></span>
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block"></span>
                </div>

                {/* URL Navigation input */}
                <form onSubmit={handleCustomUrlSubmit} className="flex-1 max-w-2xl flex items-center bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-1 text-xs">
                  <span className="text-zinc-500 select-none mr-1.5">https://</span>
                  <input 
                    type="text" 
                    placeholder="Type custom webpage address (e.g. google.com/about)..." 
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="flex-1 focus:outline-none text-zinc-100 font-mono py-0.5 bg-transparent"
                  />
                  <button type="submit" className="text-indigo-400 hover:text-indigo-300 font-bold px-1 cursor-pointer">Go</button>
                </form>

                {/* Simulated Chrome Extensions Panel */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      id="extension_btn_trigger"
                      onClick={() => setIsExtensionOpen(!isExtensionOpen)}
                      className={`p-2 rounded-xl transition-all relative cursor-pointer ${
                        isExtensionOpen 
                          ? "bg-indigo-600 text-white shadow-lg" 
                          : "bg-zinc-900 border border-zinc-800 text-zinc-350 hover:bg-zinc-850"
                      }`}
                      title="Open Memory Extension"
                    >
                      <Brain className="w-4 h-4" />
                      {/* Red bubble indicating saved state */}
                      {memories.some(m => m.url === browserUrl) && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-zinc-900" />
                      )}
                    </button>

                    {/* Simulated Extension Popup Box */}
                    <AnimatePresence>
                      {isExtensionOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute -right-2 sm:right-0 top-12 w-[calc(100vw-48px)] sm:w-80 max-w-[340px] bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 p-4.5 z-40 space-y-4 text-left text-zinc-100 max-h-[480px] overflow-y-auto"
                        >
                          <div className="flex items-center justify-between border-b border-zinc-850 pb-2.5">
                            <span className="flex items-center gap-1.5 text-sm font-semibold text-indigo-400">
                              <Brain className="w-4 h-4 animate-pulse" />
                              Remember This Page
                            </span>
                            <button onClick={() => setIsExtensionOpen(false)} className="text-zinc-500 hover:text-zinc-300 cursor-pointer">
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-1">
                            <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Target Webpage</div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm">{browserIcon}</span>
                              <div className="truncate text-xs font-semibold text-zinc-200 leading-tight">
                                {browserTitle}
                              </div>
                            </div>
                          </div>

                          {highlightedText && (
                            <div className="space-y-1 bg-zinc-950 border-l-2 border-indigo-500 p-2.5 rounded text-xs">
                              <div className="text-[9px] uppercase font-bold tracking-wider text-indigo-400">Captured Highlight</div>
                              <p className="text-zinc-300 italic line-clamp-3">"{highlightedText}"</p>
                              <button 
                                onClick={() => setHighlightedText("")}
                                className="text-[9px] text-rose-400 hover:underline block font-semibold mt-1 cursor-pointer"
                              >
                                Remove Highlight
                              </button>
                            </div>
                          )}

                          <form onSubmit={handleSaveMemory} className="space-y-3.5">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">What do you want to remember?</label>
                              <textarea
                                required
                                value={noteInput}
                                onChange={(e) => setNoteInput(e.target.value)}
                                placeholder="E.g., Renew passport in October, target price is ₹95k, Azure recruiter followup..."
                                className="w-full text-xs p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-zinc-900 transition-all h-20 resize-none font-medium text-zinc-150"
                              />
                            </div>

                            {/* Show AI features that happen instantly */}
                            <div className="bg-indigo-950/20 p-2.5 rounded-lg border border-indigo-900/40 text-[10px] text-indigo-300 font-medium space-y-1">
                              <div className="flex items-center gap-1 font-bold">
                                <Sparkles className="w-3 h-3 text-indigo-400" />
                                Gemini AI Auto-processing
                              </div>
                              <p className="text-zinc-400 leading-relaxed">
                                AI automatically creates a concise summary, assigns priorities, extracts tags, and links related projects instantly on save.
                              </p>
                            </div>

                            <div className="flex items-center gap-2 justify-end pt-1">
                              <button
                                type="button"
                                onClick={() => setIsExtensionOpen(false)}
                                className="text-xs text-zinc-400 hover:text-zinc-200 px-3 py-1.5 transition-colors font-semibold cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={isProcessingAI}
                                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-850 text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-indigo-950/50 transition-colors cursor-pointer"
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
                            <div className="absolute inset-0 bg-zinc-950/95 rounded-xl flex flex-col items-center justify-center p-4 text-center z-50">
                              <div className="relative w-12 h-12 flex items-center justify-center mb-3">
                                <Brain className="w-8 h-8 text-indigo-400 animate-pulse absolute" />
                                <div className="w-12 h-12 rounded-full border-2 border-indigo-600/20 border-t-indigo-500 animate-spin"></div>
                              </div>
                              <h4 className="font-bold text-zinc-100 text-sm">Processing with Gemini</h4>
                              <p className="text-[11px] text-zinc-400 mt-1.5 max-w-[220px] font-medium leading-relaxed">
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
              <div className="flex-1 p-8 bg-zinc-900/10 flex flex-col md:flex-row gap-8 relative overflow-hidden">
                
                {/* Main simulated page content */}
                <div className="flex-1 space-y-6">
                  
                  {/* Webpage Header mockup */}
                  <div className="flex items-center gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-850 shadow-sm">
                    <div className="w-11 h-11 rounded-xl bg-zinc-950 flex items-center justify-center text-2xl shadow-inner select-none border border-zinc-850">
                      {browserIcon}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">{browserSiteName}</span>
                      <h1 className="font-bold text-lg text-zinc-100 leading-tight tracking-tight">{browserTitle}</h1>
                      <p className="text-[11px] text-zinc-500 font-mono truncate">{browserUrl}</p>
                    </div>
                  </div>

                  {/* Webpage Body Blocks */}
                  <div className="space-y-4">
                    <div className="bg-indigo-950/20 border border-indigo-900/40 p-3 rounded-xl flex items-center gap-2.5 text-xs text-indigo-300">
                      <MousePointerClick className="w-4 h-4 text-indigo-400 shrink-0" />
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
                                ? "bg-indigo-950/30 border-indigo-900 shadow-md shadow-indigo-950/20 text-zinc-100 scale-[1.01]" 
                                : "bg-zinc-900 hover:bg-zinc-850 border-zinc-850 text-zinc-350 hover:scale-[1.005]"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5 select-none">
                              <span className="text-[10px] text-zinc-500 font-mono font-bold">Paragraph {idx + 1}</span>
                              {isHighlighted && (
                                <span className="bg-indigo-900/50 text-indigo-300 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-indigo-500/20">
                                  <Sparkles className="w-2.5 h-2.5" /> Selected Highlight
                                </span>
                              )}
                            </div>
                            <p className="font-medium font-sans">{block}</p>
                            {isHighlighted && (
                              <div className="mt-3 pt-2.5 border-t border-indigo-900 flex flex-wrap items-center gap-2 animate-fadeIn text-xs">
                                <span className="text-[10px] text-indigo-300 font-extrabold flex items-center gap-1 shrink-0">
                                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
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
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors border border-indigo-700 shadow-sm cursor-pointer"
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
                        <div className="bg-zinc-900 border border-zinc-850 p-6 rounded-xl space-y-4">
                          <p className="text-sm text-zinc-300 font-medium">
                            This is a simulated custom viewport representation of <strong>{browserUrl}</strong>.
                          </p>
                          <div className="space-y-2.5">
                            <div className="w-full h-2 bg-zinc-950 rounded"></div>
                            <div className="w-11/12 h-2 bg-zinc-950 rounded"></div>
                            <div className="w-4/5 h-2 bg-zinc-950 rounded"></div>
                          </div>
                          <button
                            onClick={() => {
                              const block = `Context notes from page: ${browserTitle}. Saved on custom url exploration module.`;
                              setHighlightedText(block);
                              showNotification("Custom text block highlighted!");
                            }}
                            className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
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
                        className="bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 p-5 space-y-4 relative overflow-hidden text-zinc-100"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-950/10 rounded-full blur-2xl"></div>
                        
                        <div className="flex items-center justify-between border-b border-zinc-850 pb-2 relative z-10">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 font-sans uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            Welcome Back
                          </span>
                          <button
                            onClick={() => {
                              setDismissedMatches(prev => ({ ...prev, [matchedMemory.id]: true }));
                              setMatchedMemory(null);
                            }}
                            className="text-zinc-500 hover:text-zinc-350 transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-2 relative z-10">
                          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">Your previous thought:</div>
                          <p className="text-xs text-zinc-200 font-semibold leading-relaxed bg-indigo-950/20 p-3 rounded-lg border-l-2 border-indigo-500 italic">
                            &ldquo;{matchedMemory.originalNote.replace(/\[Selected Highlight: ".*"\]\n\n/, "")}&rdquo;
                          </p>
                          
                          {matchedMemory.originalNote.includes('[Selected Highlight: "') && (
                            <div className="text-[10px] text-zinc-400 pl-3 border-l border-zinc-800 line-clamp-2">
                              Highlighted: {matchedMemory.originalNote.match(/\[Selected Highlight: "(.*)"\]/) ? matchedMemory.originalNote.match(/\[Selected Highlight: "(.*)"\]/)![1] : ""}
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-zinc-850 flex items-center justify-between relative z-10">
                          <span className="text-[9px] font-mono text-zinc-500">
                            Saved {new Date(matchedMemory.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] text-indigo-400 font-bold hover:underline cursor-pointer flex items-center gap-0.5" onClick={() => setCurrentView("dashboard")}>
                            Edit in Dashboard <ArrowUpRight className="w-3 h-3" />
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      // Shimmer skeleton when loading matching results
                      isMatchingPage && (
                        <div className="bg-zinc-900 rounded-xl border border-zinc-850 p-5 space-y-3.5 animate-pulse">
                          <div className="h-3.5 bg-zinc-950 rounded w-1/3"></div>
                          <div className="h-14 bg-zinc-950 rounded"></div>
                          <div className="h-3.5 bg-zinc-950 rounded w-1/2"></div>
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
                  <div className="bg-zinc-950/40 rounded-xl border border-zinc-900 p-5 space-y-3 shadow-sm text-xs text-zinc-400 leading-relaxed">
                    <h3 className="font-bold text-zinc-200 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-indigo-400" />
                      Testing Checklist
                    </h3>
                    <ol className="list-decimal pl-4 space-y-1.5 font-medium">
                      <li>Click on one of the simulated pages (e.g., <strong>LinkedIn</strong> or <strong>Amazon</strong>).</li>
                      <li>Highlight text inside a paragraph if desired.</li>
                      <li>Click the purple brain extension icon <Brain className="w-3 h-3 text-indigo-400 inline mx-0.5" /> in the address bar.</li>
                      <li>Write down a thought and click <strong>Save Memory</strong>. Let the AI synthesize tags and priorities.</li>
                      <li>Switch tabs, then revisit the same page to see your memory slide back in.</li>
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
            className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12"
          >
            <div className="bg-zinc-950/40 border border-zinc-900 shadow-2xl rounded-2xl overflow-hidden min-h-[620px] flex flex-col md:flex-row">
              
              {/* Sidebar Navigation */}
              <aside className="hidden md:flex w-full md:w-64 bg-zinc-950/80 border-r border-zinc-900 p-6 flex-col justify-between shrink-0 space-y-8">
                <div className="space-y-7">
                  {/* Brand logo */}
                  <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentView("homepage")}>
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-md">
                      <Brain className="w-4.5 h-4.5 text-indigo-400" />
                    </div>
                    <div>
                      <span className="font-extrabold tracking-tight text-sm text-zinc-100 block">Memory</span>
                      <span className="text-[8px] font-mono font-bold tracking-widest text-indigo-400 uppercase block">SECOND BRAIN</span>
                    </div>
                  </div>

                  {/* Core Filters */}
                  <nav className="space-y-1.5 text-xs font-bold text-zinc-400 relative">
                    <button
                      onClick={() => {
                        setDashboardTab("all");
                        setSelectedProjectId(null);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-300 relative ${
                        dashboardTab === "all" && !selectedProjectId 
                          ? "text-zinc-100 font-extrabold" 
                          : "hover:text-zinc-200"
                      }`}
                    >
                      {dashboardTab === "all" && !selectedProjectId && (
                        <motion.div 
                          layoutId="activeSidebarTab"
                          className="absolute inset-0 bg-zinc-900 border border-zinc-850 rounded-xl -z-10 shadow-sm"
                          transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        />
                      )}
                      <span className="flex items-center gap-2.5 relative z-10">
                        <Layers className="w-4 h-4 text-indigo-400" />
                        All Memories
                      </span>
                      <span className="bg-zinc-900 text-zinc-400 border border-zinc-850 px-2 py-0.5 rounded-lg text-[9px] relative z-10">{memories.length}</span>
                    </button>

                    <button
                      onClick={() => {
                        setDashboardTab("pinned");
                        setSelectedProjectId(null);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-300 relative ${
                        dashboardTab === "pinned" 
                          ? "text-zinc-100 font-extrabold" 
                          : "hover:text-zinc-200"
                      }`}
                    >
                      {dashboardTab === "pinned" && (
                        <motion.div 
                          layoutId="activeSidebarTab"
                          className="absolute inset-0 bg-zinc-900 border border-zinc-850 rounded-xl -z-10 shadow-sm"
                          transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        />
                      )}
                      <span className="flex items-center gap-2.5 relative z-10">
                        <Pin className="w-4 h-4 text-indigo-400" />
                        Pinned memories
                      </span>
                      <span className="bg-zinc-900 text-zinc-400 border border-zinc-850 px-2 py-0.5 rounded-lg text-[9px] relative z-10">
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
                          ? "text-zinc-100 font-extrabold" 
                          : "hover:text-zinc-200"
                      }`}
                    >
                      {dashboardTab === "search" && (
                        <motion.div 
                          layoutId="activeSidebarTab"
                          className="absolute inset-0 bg-zinc-900 border border-zinc-850 rounded-xl -z-10 shadow-sm"
                          transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        />
                      )}
                      <span className="flex items-center gap-2.5 relative z-10">
                        <Search className="w-4 h-4 text-indigo-400" />
                        AI Concept Search
                      </span>
                      <span className="bg-indigo-950 text-indigo-300 border border-indigo-500/10 px-1.5 py-0.5 rounded text-[8px] uppercase font-mono tracking-wider font-extrabold relative z-10">Gemini</span>
                    </button>

                    <button
                      onClick={() => {
                        setDashboardTab("extension");
                        setSelectedProjectId(null);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-300 relative ${
                        dashboardTab === "extension" 
                          ? "text-zinc-100 font-extrabold" 
                          : "hover:text-zinc-200"
                      }`}
                    >
                      {dashboardTab === "extension" && (
                        <motion.div 
                          layoutId="activeSidebarTab"
                          className="absolute inset-0 bg-zinc-900 border border-zinc-850 rounded-xl -z-10 shadow-sm"
                          transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        />
                      )}
                      <span className="flex items-center gap-2">
                        <Chrome className="w-4 h-4 text-indigo-400" />
                        Companion Setup
                      </span>
                      <span className="bg-indigo-950 text-indigo-300 border border-indigo-500/25 px-1.5 py-0.5 rounded text-[9px] uppercase font-mono tracking-wider font-bold">SETUP</span>
                    </button>
                  </nav>

                  {/* Projects List */}
                  <div className="space-y-2">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 font-mono px-3">
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
                                ? "text-zinc-100 font-extrabold" 
                                : "hover:text-zinc-200 text-zinc-400"
                            }`}
                          >
                            {isSelected && (
                              <motion.div 
                                layoutId="activeSidebarTab"
                                className="absolute inset-0 bg-zinc-900 border border-zinc-850 rounded-xl -z-10 shadow-sm"
                                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                              />
                            )}
                            <span className="flex items-center gap-2.5 truncate relative z-10">
                              <Folder className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <span className="truncate">{proj.name}</span>
                            </span>
                            <span className="bg-zinc-900 text-zinc-400 border border-zinc-850 px-2 py-0.5 rounded-lg text-[9px] shrink-0 relative z-10">{count}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Minimalist Profile Details */}
                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <img 
                      src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} 
                      alt="avatar" 
                      className="w-8 h-8 rounded-full border border-zinc-800 shadow-sm shrink-0"
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold text-zinc-200 truncate">{user?.name || "Demo User"}</div>
                      <div className="text-[10px] text-zinc-500 truncate">{user?.email || "demo@example.com"}</div>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-1.5 hover:bg-zinc-900 text-zinc-500 hover:text-zinc-200 rounded-lg transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </aside>

              {/* Mobile Filter Row (only visible on mobile screens) */}
              <div className="md:hidden flex flex-col gap-3.5 bg-zinc-950/60 border-b border-zinc-900 p-4 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                      <Brain className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <span className="text-xs font-extrabold text-zinc-200">Vault Menu</span>
                  </div>
                  <span className="text-[10px] bg-zinc-900 border border-zinc-850 text-zinc-400 px-2.5 py-0.5 rounded-lg font-mono font-bold">
                    {memories.length} Memories
                  </span>
                </div>
                
                <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4">
                  <button
                    onClick={() => {
                      setDashboardTab("all");
                      setSelectedProjectId(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                      dashboardTab === "all" && !selectedProjectId
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                        : "bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    All ({memories.length})
                  </button>
                  <button
                    onClick={() => {
                      setDashboardTab("pinned");
                      setSelectedProjectId(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                      dashboardTab === "pinned"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                        : "bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Pinned ({memories.filter(m => m.pinned).length})
                  </button>
                  <button
                    onClick={() => {
                      setDashboardTab("search");
                      setSelectedProjectId(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                      dashboardTab === "search"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                        : "bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    AI Search
                  </button>
                  <button
                    onClick={() => {
                      setDashboardTab("extension");
                      setSelectedProjectId(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                      dashboardTab === "extension"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                        : "bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Setup
                  </button>
                  
                  <div className="w-[1px] bg-zinc-900 shrink-0 mx-1 self-stretch" />
                  
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
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                            : "bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        {proj.name} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Content Pane */}
              <main className="flex-1 p-4 sm:p-8 bg-transparent flex flex-col justify-between overflow-y-auto md:max-h-[700px]">
                
                <div className="space-y-6">
                  {/* Dashboard Header Title */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-zinc-100 tracking-tight">
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
                      <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                        {selectedProjectId 
                          ? projects.find(p => p.id === selectedProjectId)?.description 
                          : dashboardTab === "extension"
                          ? "Integrate Memory Desk directly with your live Google Chrome browser."
                          : "Remember why pages mattered with non-disruptive context indicators."}
                      </p>
                    </div>

                    <button
                      onClick={() => setCurrentView("browser")}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/10 transition-all cursor-pointer w-full sm:w-auto shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Memory
                    </button>
                  </div>

                  {/* MAIN VIEW: SEMANTIC SEARCH */}
                  {dashboardTab === "search" && (
                    <div className="space-y-6">
                      <form onSubmit={handleDashboardSearch} className="flex flex-col sm:flex-row gap-3 bg-zinc-950 border border-zinc-900 p-2 rounded-xl">
                        <div className="relative flex-1">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
                          <input
                            type="text"
                            required
                            placeholder="Type a query conceptually (e.g. microsoft contact, pricing details, Shadow DOM query fixes)..."
                            value={dashSearchQuery}
                            onChange={(e) => setDashSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-transparent focus:outline-none text-xs sm:text-sm font-medium text-zinc-100 placeholder-zinc-500"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isDashSearching}
                          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto shrink-0"
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
                            <div className="h-12 bg-zinc-900/40 border border-zinc-850 rounded-xl animate-pulse"></div>
                            <div className="h-12 bg-zinc-900/40 border border-zinc-850 rounded-xl animate-pulse"></div>
                          </div>
                        ) : dashSearchResults.length > 0 ? (
                          <div className="space-y-3.5">
                            <div className="text-xs font-semibold text-zinc-500 font-mono uppercase tracking-wider">AI Sorted relevance matches:</div>
                            {dashSearchResults.map((res) => (
                              <div key={res.id} className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">{res.websiteIcon}</span>
                                    <span className="text-xs font-bold text-zinc-200">{res.websiteName}</span>
                                    <span className="text-[10px] bg-indigo-950/30 text-indigo-300 border border-indigo-500/10 font-bold px-2 py-0.5 rounded-full">
                                      {res.relevanceScore ? Math.round(res.relevanceScore * 100) : 0}% Match
                                    </span>
                                  </div>
                                  <p className="text-xs font-bold text-zinc-500 truncate max-w-lg">{res.pageTitle}</p>
                                  <p className="text-xs text-zinc-350 font-medium italic pl-3 border-l-2 border-indigo-500/40">
                                    &ldquo;{res.originalNote}&rdquo;
                                  </p>
                                </div>
                                {res.matchExplanation && (
                                  <div className="bg-zinc-900 border border-zinc-850 rounded-lg px-3 py-1.5 text-[10px] font-mono text-indigo-400 font-semibold max-w-[180px] text-center">
                                    {res.matchExplanation}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : dashSearchQuery ? (
                          <div className="text-center py-12 space-y-2">
                            <AlertCircle className="w-8 h-8 text-zinc-700 mx-auto" />
                            <h4 className="font-bold text-zinc-400 text-sm">No match explanation found</h4>
                            <p className="text-xs text-zinc-500 max-w-sm mx-auto">Try typing conceptually, such as "laptop specs", "recruiters", "YouTube notes", or similar keywords.</p>
                          </div>
                        ) : (
                          <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-xl space-y-2 text-center">
                            <Brain className="w-8 h-8 text-indigo-400 mx-auto animate-pulse" />
                            <h4 className="font-bold text-indigo-300 text-xs">Vector Match Playground</h4>
                            <p className="text-xs text-zinc-400 max-w-md mx-auto">
                              Our search query utilizes server-side embeddings projection logic. This means it queries concepts like "laptop" and successfully links to "MacBook Pro" without exact keyword constraints.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {dashboardTab === "extension" && (
                    <div className="space-y-6">
                      <div className="bg-amber-950/10 border border-amber-500/10 p-4 rounded-xl flex items-start gap-3">
                        <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider">How Local vs Deployed Domain works</h4>
                          <p className="text-xs text-amber-300/80 leading-relaxed font-medium">
                            Your Chrome Extension needs to communicate with your deployed backend server. By default, we pre-configure the files with the URL we detected: <strong className="font-bold underline">{customBackendUrl}</strong>. If you deploy this applet to Google Cloud Run, Vercel, or your custom server, simply update the URL input below and click <strong>Download All Files</strong> to instantly generate configured extension workers!
                          </p>
                        </div>
                      </div>

                      {/* Backend URL configuration input */}
                      <div className="bg-zinc-950/40 border border-zinc-900 p-4 rounded-xl space-y-3">
                        <label className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-wider block">
                          Configure Extension Backend Target Server
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="relative flex-1">
                            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                              type="text"
                              required
                              placeholder="https://your-deployed-server-url.run.app"
                              value={customBackendUrl}
                              onChange={(e) => setCustomBackendUrl(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 bg-zinc-900/60 border border-zinc-850 focus:outline-none rounded-lg text-xs font-bold text-zinc-200 focus:border-indigo-500 transition-colors"
                            />
                          </div>
                          <button
                            onClick={handleDownloadAllExtensionFiles}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer w-full sm:w-auto shrink-0"
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
                          <h4 className="font-extrabold text-zinc-200 text-sm tracking-tight border-b border-zinc-900 pb-2">
                            🚀 Chrome Installation Guide
                          </h4>

                          <div className="space-y-4 font-sans text-xs">
                            <div className="flex gap-3">
                              <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center shrink-0 text-[11px]">1</span>
                              <div className="space-y-0.5">
                                <h5 className="font-bold text-zinc-200">Download ZIP Package</h5>
                                <p className="text-zinc-400 leading-relaxed font-medium">
                                  Click the <strong className="font-bold text-indigo-400">Download Extension Package (ZIP)</strong> button above to download all pre-configured assets bundled as a single package.
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center shrink-0 text-[11px]">2</span>
                              <div className="space-y-0.5">
                                <h5 className="font-bold text-zinc-200">Extract the ZIP Folder</h5>
                                <p className="text-zinc-400 leading-relaxed font-medium">
                                  Extract/unzip the downloaded <code className="font-mono bg-zinc-900 px-1 py-0.5 rounded text-indigo-400 text-[10px] font-semibold">MemoryDeskExtension.zip</code> file into a standard folder anywhere on your computer.
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center shrink-0 text-[11px]">3</span>
                              <div className="space-y-0.5">
                                <h5 className="font-bold text-zinc-200">Load Unpacked in Chrome</h5>
                                <p className="text-zinc-400 leading-relaxed font-medium">
                                  Open Chrome and go to <span className="font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-350 font-bold text-[10px]">chrome://extensions/</span>. Enable the **Developer mode** toggle in the top-right, click **Load unpacked** in the top-left, and select your extracted folder! Done! 🚀
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Dynamic Seed synchronization panel */}
                          <div className="bg-zinc-950/40 border border-zinc-900 p-4 rounded-xl space-y-3.5 mt-4">
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-indigo-400" />
                              <h5 className="font-bold text-zinc-200 text-xs">Instantly Sync App Data</h5>
                            </div>
                            <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                              Seed your fresh browser extension immediately with your current app memories so you do not start empty!
                            </p>
                            <div className="space-y-2">
                              <button
                                onClick={() => {
                                  const text = JSON.stringify({ memories }, null, 2);
                                  navigator.clipboard.writeText(text);
                                  showNotification("Extension seeds copied! Paste them in Chrome Extension LocalStorage Console or Import menu.", "success");
                                }}
                                className="w-full bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 text-[11px] font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                              >
                                <Copy className="w-3 h-3 text-zinc-400" />
                                Copy Memories JSON Seed Block
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT COLUMN: File Previewer Tab structure (7 cols) */}
                        <div className="lg:col-span-7 flex flex-col space-y-4">
                          <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-5 flex flex-col space-y-3.5 shadow-sm">
                            <div className="flex items-center justify-between">
                              <h5 className="font-extrabold text-zinc-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                <Settings className="w-4 h-4 text-indigo-400" />
                                Extension Source Sandbox
                              </h5>
                              <button
                                onClick={() => setShowTechnicalFiles(!showTechnicalFiles)}
                                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3.5 py-1.5 rounded-xl text-[10px] font-bold text-indigo-400 transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                              >
                                {showTechnicalFiles ? "Hide Code View" : "Expand Code View"}
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showTechnicalFiles ? "rotate-180" : ""}`} />
                              </button>
                            </div>
                            <p className="text-[11px] text-zinc-400 leading-relaxed font-semibold">
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
                                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                                  <h4 className="font-extrabold text-zinc-200 text-sm tracking-tight">
                                    📁 File Generator Sandbox
                                  </h4>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleCopyFile(activeExtFile)}
                                      className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 font-bold text-[10px] px-2.5 py-1.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                                    >
                                      <Copy className="w-3 h-3" />
                                      Copy Code
                                    </button>
                                    <button
                                      onClick={() => handleDownloadFile(activeExtFile)}
                                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] px-2.5 py-1.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                                    >
                                      <Download className="w-3 h-3" />
                                      Download File
                                    </button>
                                  </div>
                                </div>

                                {/* File Selection Tabs */}
                                <div className="flex flex-wrap gap-1.5 bg-zinc-950 p-1.5 rounded-lg border border-zinc-900">
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
                                      className={`text-[11px] px-2.5 py-1 font-bold rounded-md transition-all cursor-pointer ${
                                        activeExtFile === f.id
                                          ? "bg-indigo-600 text-white"
                                          : "text-zinc-500 hover:text-zinc-300"
                                      }`}
                                    >
                                      {f.name}
                                    </button>
                                  ))}
                                </div>

                                {/* Monospace Code Code block panel */}
                                <div className="relative border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950 shadow-inner flex-1 min-h-[300px] flex flex-col">
                                  <div className="absolute right-3.5 top-3.5 z-10 text-[9px] uppercase tracking-wider font-extrabold text-indigo-400 font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-850">
                                    {getFilename(activeExtFile)}
                                  </div>
                                  <pre className="p-5 font-mono text-[10px] text-zinc-400 overflow-x-auto overflow-y-auto max-h-[360px] leading-relaxed whitespace-pre font-medium">
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
                      <div className="bg-zinc-950/40 border border-zinc-900 p-4.5 rounded-2xl space-y-4 shadow-sm">
                        <div className="flex flex-col sm:flex-row gap-3">
                          {/* Live search input */}
                          <div className="relative flex-1 bg-zinc-900/60 border border-zinc-850 rounded-xl px-3.5 py-2.5 flex items-center shadow-inner">
                            <Search className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
                            <input
                              type="text"
                              placeholder="Fuzzy-filter page title, note content, domain, or tag..."
                              value={dashSearchQuery}
                              onChange={(e) => setDashSearchQuery(e.target.value)}
                              className="w-full bg-transparent text-xs focus:outline-none font-medium text-zinc-200 placeholder-zinc-500"
                            />
                            {dashSearchQuery && (
                              <button
                                onClick={() => setDashSearchQuery("")}
                                className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
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
                            className="bg-indigo-600 hover:bg-indigo-50 text-white text-xs font-bold px-4.5 py-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-lg shadow-indigo-600/10 cursor-pointer"
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
                            <div className="flex flex-col gap-2 pt-1 border-t border-zinc-900">
                              <div className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-wider">
                                Filter by tag:
                              </div>
                              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                                <button
                                  onClick={() => setSelectedTag(null)}
                                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all border cursor-pointer ${
                                    selectedTag === null
                                      ? "bg-indigo-600 text-white border-indigo-600"
                                      : "bg-zinc-900 hover:bg-zinc-850 text-zinc-400 border-zinc-800"
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
                                      className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all border flex items-center gap-1 cursor-pointer ${
                                        isSelected
                                          ? "bg-indigo-600 text-white border-indigo-600"
                                          : "bg-zinc-900 hover:bg-zinc-850 text-zinc-400 border-zinc-800"
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
                            <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10 space-y-4">
                              <Brain className="w-10 h-10 text-zinc-700 mx-auto" />
                              <div className="space-y-1">
                                <h4 className="font-bold text-zinc-300 text-sm">You haven't forgotten anything yet.</h4>
                                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
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
                                className="bg-zinc-950 rounded-3xl border border-zinc-900 p-6 shadow-md hover:shadow-2xl hover:-translate-y-1 hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between gap-5 relative group"
                              >
                                <div className="space-y-4">
                                  {/* Favicon & domain info row */}
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 min-w-0">
                                      <span className="text-2xl select-none w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner shrink-0">{mem.websiteIcon}</span>
                                      <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                          <span className="font-display font-extrabold text-sm text-zinc-200 truncate">{mem.websiteName}</span>
                                          <span className="text-[10px] text-zinc-500 font-mono truncate">({mem.domain})</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Action items */}
                                    <div className="flex items-center gap-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0">
                                      <button
                                        onClick={() => handleTogglePin(mem.id)}
                                        className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                                          mem.pinned 
                                            ? "bg-indigo-950/40 border-indigo-500/20 text-indigo-300 shadow-sm" 
                                            : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-indigo-450 hover:border-zinc-700"
                                        }`}
                                        title={mem.pinned ? "Unpin" : "Pin memory"}
                                      >
                                        <Pin className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => setEditingMemory(mem)}
                                        className="p-2 rounded-xl border bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-350 hover:border-zinc-750 transition-all duration-200 cursor-pointer"
                                        title="Edit note"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteMemory(mem.id)}
                                        className="p-2 rounded-xl border bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-rose-450 hover:border-zinc-750 transition-all duration-200 cursor-pointer"
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
                                      className="text-xs font-bold text-zinc-500 hover:text-indigo-400 transition-colors inline-flex items-center gap-1 hover:underline"
                                    >
                                      {mem.pageTitle}
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                    
                                    {/* Original note with nice quoting */}
                                    <p className="text-sm text-zinc-350 font-medium leading-relaxed italic border-l-2 border-indigo-500/60 pl-4 bg-zinc-900/30 py-3 pr-3 rounded-r-xl">
                                      &ldquo;{mem.originalNote.replace(/\[Selected Highlight: ".*"\]\n\n/, "")}&rdquo;
                                    </p>
                                    
                                    {/* Extracted Highlight if present */}
                                    {mem.originalNote.includes('[Selected Highlight: "') && (
                                      <p className="text-[11px] text-zinc-400 pl-4 leading-relaxed bg-amber-955/10 py-2.5 rounded-r-xl border-l-2 border-amber-500/30">
                                        <span className="font-extrabold text-amber-400 uppercase tracking-wider text-[9px] block mb-1">Highlighted Selection:</span>
                                        {mem.originalNote.match(/\[Selected Highlight: "(.*)"\]/) ? mem.originalNote.match(/\[Selected Highlight: "(.*)"\]/)![1] : ""}
                                      </p>
                                    )}
                                  </div>

                                  {/* AI Summary Badge */}
                                  <div className="bg-indigo-950/10 rounded-2xl p-3.5 border border-indigo-500/10 flex gap-3">
                                    <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                                    <div>
                                      <span className="text-[9px] font-mono font-extrabold text-indigo-450 uppercase tracking-wider block mb-0.5">Gemini Synthesis Summary</span>
                                      <p className="text-[11px] text-zinc-300 font-medium leading-relaxed">
                                        {mem.aiSummary}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Badges bottom row */}
                                <div className="flex flex-wrap items-center justify-between pt-4 border-t border-zinc-900 text-[10px] text-zinc-500 font-bold gap-2">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className={`px-2.5 py-1 rounded-lg uppercase tracking-wider font-extrabold ${
                                      mem.priority === 'high' 
                                        ? 'bg-rose-955/30 text-rose-400 border border-rose-900/30' 
                                        : mem.priority === 'medium'
                                        ? 'bg-amber-955/20 text-amber-400 border border-amber-900/20'
                                        : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                                    }`}>
                                      {mem.priority} priority
                                    </span>
                                    {mem.tags.map(t => (
                                      <span key={t} className="bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg text-zinc-450 font-semibold">#{t}</span>
                                    ))}
                                  </div>
                                  <span className="font-mono text-zinc-500">Added {new Date(mem.createdAt).toLocaleDateString()}</span>
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
                <div className="pt-8 border-t border-zinc-900 text-center text-[10px] text-zinc-500 font-mono">
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 text-left border border-zinc-900 max-h-[calc(100vh-32px)] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
                <h4 className="font-bold text-zinc-100 text-base flex items-center gap-1.5">
                  <Edit2 className="w-4 h-4 text-indigo-400" />
                  Edit Saved Memory
                </h4>
                <button onClick={() => setEditingMemory(null)} className="text-zinc-500 hover:text-zinc-300 cursor-pointer">
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Website</label>
                  <p className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                    <span>{editingMemory.websiteIcon}</span>
                    <span>{editingMemory.pageTitle}</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Your Note Context</label>
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
                    className="w-full text-xs p-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-zinc-900/80 transition-all h-24 resize-none font-medium text-zinc-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Priority Level</label>
                    <select
                      value={editingMemory.priority}
                      onChange={(e) => setEditingMemory({ ...editingMemory, priority: e.target.value as any })}
                      className="w-full text-xs p-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-zinc-900/80 text-zinc-200"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Pin to Top</label>
                    <select
                      value={editingMemory.pinned ? "yes" : "no"}
                      onChange={(e) => setEditingMemory({ ...editingMemory, pinned: e.target.value === "yes" })}
                      className="w-full text-xs p-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-zinc-900/80 text-zinc-200"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Gemini Summary</label>
                  <input
                    type="text"
                    value={editingMemory.aiSummary}
                    onChange={(e) => setEditingMemory({ ...editingMemory, aiSummary: e.target.value })}
                    className="w-full text-xs p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-zinc-900/80 font-medium text-zinc-200"
                  />
                </div>

                <div className="flex items-center gap-2 justify-end pt-2 border-t border-zinc-900">
                  <button
                    type="button"
                    onClick={() => setEditingMemory(null)}
                    className="text-xs text-zinc-500 hover:text-zinc-350 px-3 py-1.5 font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateMemory(editingMemory)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-md transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 mt-auto border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-medium">
        <div>
          &copy; {new Date().getFullYear()} Memory Desk. All rights reserved.
        </div>
        <div className="flex items-center gap-1 text-zinc-400 font-semibold">
          made with ❤️ by{" "}
          <a
            href="https://kumarharsh.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 transition-colors hover:underline"
          >
            harsh
          </a>
        </div>
      </footer>

    </div>
  );
}
