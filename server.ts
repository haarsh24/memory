import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const PORT = 3000;
  const app = express();
  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // AI Memory Processing endpoint
  app.post("/api/gemini/process", async (req, res) => {
    const { url, title, originalNote, existingProjects = [] } = req.body;
    
    if (!originalNote) {
      return res.status(400).json({ error: "originalNote is required" });
    }

    // Use a timeout to prevent hanging requests when Gemini is slow
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini processing timed out")), 4500)
    );

    try {
      const prompt = `You are the AI engine of "Memory", a personal context layers app.
User saved a note: "${originalNote}" for webpage: "${title || url}" (URL: ${url}).
Perform the following tasks:
1. Create a beautiful, concise summary (1-2 sentences, max 25 words) of why they saved this page and what matters. Keep it very conversational and professional.
2. Extract 2-4 tags (e.g. "React", "Shopping", "Recruiting", "Research", "Docs").
3. Suggest a single "Project" name (e.g. "MacBook Purchase", "Career Prep", "System Design Reference"). Choose from existing projects if there is a semantic match: ${JSON.stringify(existingProjects)}. If no existing project is a good fit, generate a new specific, humbler project name (max 3 words).
4. Assign a priority level ("high", "medium", or "low") based on the urgency of the note.

Return a JSON object with keys: "aiSummary", "tags", "projectSuggestion", and "priority".`;

      const geminiCall = ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              aiSummary: { type: Type.STRING, description: "A concise summary of the note context" },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of relevant keyword tags"
              },
              projectSuggestion: { type: Type.STRING, description: "A suggested project name" },
              priority: { type: Type.STRING, description: "low, medium, or high" }
            },
            required: ["aiSummary", "tags", "projectSuggestion", "priority"]
          }
        }
      });

      const response = await Promise.race([geminiCall, timeoutPromise]) as any;
      const responseText = response.text || "{}";
      const result = JSON.parse(responseText.trim());
      res.json(result);
    } catch (error: any) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.log(`[INFO] Process fallback applied: ${errMsg.slice(0, 100)}`);
      res.json({
        aiSummary: originalNote.slice(0, 50) + (originalNote.length > 50 ? "..." : ""),
        tags: ["General"],
        projectSuggestion: "General",
        priority: "medium"
      });
    }
  });

  // AI Semantic Search / Ranking endpoint
  app.post("/api/gemini/search", async (req, res) => {
    const { query, memories = [] } = req.body;

    if (!query) {
      return res.json({ results: memories });
    }

    if (memories.length === 0) {
      return res.json({ results: [] });
    }

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini search timed out")), 3500)
    );

    try {
      const prompt = `You are a semantic search and matching engine for "Memory".
The user searched for: "${query}".
We have the following user memories (each has an id, url, title, tags, originalNote, aiSummary):
${JSON.stringify(memories.map((m: any) => ({
        id: m.id,
        url: m.url,
        pageTitle: m.pageTitle || m.title || "",
        originalNote: m.originalNote,
        aiSummary: m.aiSummary || "",
        tags: m.tags || []
      })))}

Rank these memories by semantic relevance to the search query "${query}".
Return a JSON array of objects, where each object has:
- "id": string (the exact id from the inputs)
- "relevanceScore": number (from 0 to 1, where 1 is highly relevant and 0 is not relevant at all)
- "matchExplanation": string (a short 5-10 word explanation of why it matches, e.g., "Mentioned MacBook specs" or "Follow-up recruiter info").

Only include items with a relevanceScore greater than 0.15. Sort the array descending by relevanceScore.`;

      const geminiCall = ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                relevanceScore: { type: Type.NUMBER },
                matchExplanation: { type: Type.STRING }
              },
              required: ["id", "relevanceScore", "matchExplanation"]
            }
          }
        }
      });

      const response = await Promise.race([geminiCall, timeoutPromise]) as any;
      const responseText = response.text || "[]";
      const rankings = JSON.parse(responseText.trim());
      
      // Re-map memories with score and explanation
      const results = rankings
        .map((rank: any) => {
          const original = memories.find((m: any) => m.id === rank.id);
          if (!original) return null;
          return {
            ...original,
            relevanceScore: rank.relevanceScore,
            matchExplanation: rank.matchExplanation
          };
        })
        .filter(Boolean);

      res.json({ results });
    } catch (error: any) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.log(`[INFO] Search fallback applied: ${errMsg.slice(0, 100)}`);
      // Fallback to client-side simple fuzzy match on server
      const lowercaseQuery = query.toLowerCase();
      const results = memories.map((m: any) => {
        const textToSearch = `${m.url} ${m.pageTitle || m.title || ""} ${m.originalNote} ${m.aiSummary || ""} ${(m.tags || []).join(" ")}`.toLowerCase();
        const score = textToSearch.includes(lowercaseQuery) ? 0.8 : 0;
        return {
          ...m,
          relevanceScore: score,
          matchExplanation: score > 0 ? "Fuzzy keyword match" : ""
        };
      }).filter((m: any) => m.relevanceScore > 0);

      res.json({ results });
    }
  });

  // Matching Engine URL endpoint
  app.post("/api/gemini/match-url", async (req, res) => {
    const { url, title, memories = [] } = req.body;

    if (!url || memories.length === 0) {
      return res.json({ matchedMemory: null });
    }

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini match-url timed out")), 1800)
    );

    try {
      const prompt = `You are the webpage matching engine for "Memory".
The user is currently visiting a webpage with:
- URL: "${url}"
- Title: "${title || ""}"

We have the following saved user memories:
${JSON.stringify(memories.map((m: any) => ({
        id: m.id,
        url: m.url,
        canonicalUrl: m.canonicalUrl || m.url,
        pageTitle: m.pageTitle || m.title || "",
        originalNote: m.originalNote
      })))}

We want to find if any of these memories match the current webpage the user is visiting.
Remember:
- Do not depend only on exact URL string.
- If the domain matches and the query params are just tracking variables, they are a match.
- If they are semantically the same page (e.g. mobile vs desktop URL or staging vs production), they match.
- Be precise. If it's a completely different article on the same domain, it is NOT a match.

Return a JSON object:
{
  "matchedId": "string or null",
  "confidence": number (from 0 to 1),
  "reason": "string describing why it matches or why no match was found"
}`;

      const geminiCall = ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchedId: { type: Type.STRING, nullable: true },
              confidence: { type: Type.NUMBER },
              reason: { type: Type.STRING }
            },
            required: ["matchedId", "confidence", "reason"]
          }
        }
      });

      const response = await Promise.race([geminiCall, timeoutPromise]) as any;
      const responseText = response.text || "{}";
      const matchResult = JSON.parse(responseText.trim());

      if (matchResult.matchedId && matchResult.confidence > 0.65) {
        const matched = memories.find((m: any) => m.id === matchResult.matchedId);
        return res.json({ matchedMemory: matched, reason: matchResult.reason });
      }

      res.json({ matchedMemory: null });
    } catch (error: any) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.log(`[INFO] Match-url fallback applied: ${errMsg.slice(0, 100)}`);
      // Simple exact match fallback
      const cleanUrl = (u: string) => u.split('?')[0].replace(/\/$/, '').toLowerCase();
      const targetClean = cleanUrl(url);
      const matched = memories.find((m: any) => cleanUrl(m.url) === targetClean);
      res.json({ matchedMemory: matched || null, reason: matched ? "Exact URL match" : "No match found" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
