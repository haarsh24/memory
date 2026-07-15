# 🧠 Memory: Your Internet Second Brain

> **A personal memory layer for the web.** Attach your contextual thoughts, notes, and task references to any URL or domain, and watch them automatically resurface when you return to those pages. 

---

## 🌌 The Vision
Our minds are built for *having* ideas, not for *holding* them. As we surf the web, we consume hundreds of pages of information, only to lose the context of our thoughts when we return to those pages days or weeks later.

**Memory** bridges this gap. It acts as a lightweight, intelligent cognitive layer over your browser. When you visit a website, the Memory system instantly matches and overlays your historical thoughts, annotations, key-value code snippets, or client notes.

---

## ✨ Features

### 💻 1. Interactive Web Simulator
Experience the extension instantly within your browser. Surf preset demonstration domains (like *GitHub*, *Wikipedia*, *StackOverflow*, or *Linear*) or enter custom URLs, and watch the Memory frame dynamically inject historical insights on-demand.

### 🔍 2. AI-Powered Semantic Search
Powered by **Gemini 2.5**, our semantic search allows you to search your vaults conceptually. You don't need to remember exact keyword matches. Ask questions like:
* *"Where is the Microsoft contact form?"*
* *"What was the solution to the Shadow DOM query fix?"*
* *"Show me the project pricing guidelines."*

### 📥 3. Chrome Extension Installer & Package Bundler
Ready to take your second brain to the real browser? Download a fully operational **Chrome/Edge Extension bundle** as a `.zip` direct from the setup panel.
* Fully standalone with manifest v3 support.
* Real-time background sync with your dashboard's server endpoints.
* Inline popup to save new memories instantly from any active browser tab.

### 🗃️ 4. The Vault Dashboard
A centralized control room to search, pin, filter, group, and archive your memories by project folders.
* **Responsive Design**: Fluidly adaptive layouts that look spectacular on both desktop ultrawides and compact mobile screens.
* **Project View**: Categorize thoughts into dedicated folders (e.g., *Personal*, *Work*, *Developer*, *Research*).

---

## ⚡ Developer Quickstart

Follow these simple steps to spin up the Memory Second Brain workspace on your local machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org) (v18 or higher) and `npm` installed.

### 1. Clone & Setup Workspace
```bash
# Clone or navigate into the directory
cd memory-second-brain

# Install base dependencies
npm install
```

### 2. Configure Environment Variables
Create a `.env` file at the root of the project (or copy from `.env.example`):
```env
# Port the server will run on (Default: 3000)
PORT=3000

# Your Google Gemini API Key for Semantic Search & Auto-Categorization
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
Boot both the custom Express API gateway and the Vite compiler concurrently:
```bash
npm run dev
```
Once started, open your browser and navigate to **`http://localhost:3000`** to interact with the full experience!

### 4. Build for Production
To bundle and compile the application for a highly optimized, cold-start resistant production container:
```bash
npm run build
```
This compiles the static React assets into `/dist` and bundles the Express server into a standalone CommonJS file at `/dist/server.cjs` via `esbuild`.

### 5. Launch Production Server
```bash
npm start
```

---

## 🔌 How to Load the Chrome Extension Locally

To run the compiled extension in your physical Chrome browser:

1. Open **The Vault Dashboard** or navigate to the **Install Extension** tab in the app.
2. Enter your Local Host address (e.g., `http://localhost:3000`) to let the extension know where to fetch/push memories, and click **Download Extension Package (ZIP)**.
3. Extract the downloaded `memory_extension.zip` file somewhere safe on your disk.
4. In Google Chrome, navigate to `chrome://extensions/`.
5. Enable **Developer mode** in the top-right corner.
6. Click **Load unpacked** in the top-left corner and select the extracted folder.
7. Click the extension icon on any live website to save thoughts immediately into your Second Brain!

---

## 🛠️ Technology Stack & Architecture

```
                       ┌──────────────────────────────┐
                       │        React 19 SPA          │
                       │    (Tailwind CSS v4 + Motion)│
                       └──────────────┬───────────────┘
                                      │  REST API
                                      ▼
                       ┌──────────────────────────────┐
                       │        Express Server        │
                       │    (Bundled with esbuild)    │
                       └──────────────┬───────────────┘
                                      │  Semantic queries
                                      ▼
                       ┌──────────────────────────────┐
                       │       Google Gemini API      │
                       │  (Via @google/genai SDK)     │
                       └──────────────────────────────┘
```

* **Frontend**: Powered by **React 19**, styled beautifully with **Tailwind CSS v4**'s responsive primitives, and animated gracefully using **Motion** for smooth state transitions.
* **Backend**: **Express** server acting as a secure proxy to process AI semantic matching queries, package up Chrome extension manifests, and serve the dashboard API endpoints.
* **AI Engine**: Seamless integration with the ultra-fast, modern `@google/genai` SDK to run zero-shot context classification and semantic lookups.

---

## 💡 Pro-Tips for Maximum Flow
* **Use Pinned Memories**: Keep your most-referenced cards (like API keys, snippets, or design coordinates) pinned. They float right to the top of your simulated browser overlay!
* **Categorize into Projects**: Keep separate environments clean by organizing memories into custom folders.
* **Seamless Offline-Fallback**: App state persists locally using secure storage fallbacks, ensuring you never lose your ideas if your network drops out.

---

*Memory — Connecting your past thoughts to your future surfing.* 🚀
