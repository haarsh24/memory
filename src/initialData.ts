import { Memory, Project } from "./types";

export const initialProjects: Project[] = [
  {
    id: "proj_tech_stack",
    name: "Tech Stack Options",
    description: "Comparing libraries, frameworks, and reference docs for upcoming engineering project.",
    createdAt: "2026-06-15T10:00:00Z"
  },
  {
    id: "proj_macbook_research",
    name: "MacBook Purchase",
    description: "Tracking prices and reviews of M3 MacBook Pro options.",
    createdAt: "2026-06-20T12:30:00Z"
  },
  {
    id: "proj_career",
    name: "Career Outreach",
    description: "Recruiters and networking contacts to follow up with.",
    createdAt: "2026-06-25T08:15:00Z"
  },
  {
    id: "proj_learning",
    name: "Learning & Reference",
    description: "General reference materials, system design guides, and tutorials.",
    createdAt: "2026-07-01T14:20:00Z"
  }
];

export const initialMemories: Memory[] = [
  {
    id: "mem_linkedin",
    userId: "user_demo",
    url: "https://linkedin.com/in/john",
    canonicalUrl: "https://linkedin.com/in/john",
    domain: "linkedin.com",
    pageTitle: "John Doe | Tech Recruiter at Microsoft | LinkedIn",
    websiteName: "LinkedIn",
    websiteIcon: "💼",
    originalNote: "Met him at React India conference. Works at Microsoft on Azure UI team. Follow up in August when their hiring budget opens up.",
    aiSummary: "Met Azure recruiter John at React India; follow up in August regarding hiring budget.",
    tags: ["Recruiting", "Networking", "Microsoft"],
    priority: "medium",
    projectId: "proj_career",
    createdAt: "2026-07-01T09:00:00Z",
    updatedAt: "2026-07-01T09:00:00Z",
    pinned: true
  },
  {
    id: "mem_amazon",
    userId: "user_demo",
    url: "https://amazon.in/macbook-pro",
    canonicalUrl: "https://amazon.in/macbook-pro",
    domain: "amazon.in",
    pageTitle: "Apple MacBook Pro (M3, 14-inch) - Amazon",
    websiteName: "Amazon",
    websiteIcon: "📦",
    originalNote: "Buy after salary credit. Target price to trigger buy is ₹95,000 during the upcoming festival sale.",
    aiSummary: "MacBook Pro target buy price set to ₹95,000 for upcoming festival sale.",
    tags: ["Shopping", "MacBook", "Tech Specs"],
    priority: "high",
    projectId: "proj_macbook_research",
    createdAt: "2026-07-02T18:45:00Z",
    updatedAt: "2026-07-02T18:45:00Z",
    pinned: true
  },
  {
    id: "mem_github",
    userId: "user_demo",
    url: "https://github.com/facebook/react",
    canonicalUrl: "https://github.com/facebook/react",
    domain: "github.com",
    pageTitle: "GitHub - facebook/react: The library for web and native user interfaces",
    websiteName: "GitHub",
    websiteIcon: "🐙",
    originalNote: "I planned to use this library for my upcoming analytics dashboard. Check out their documentation for concurrent features.",
    aiSummary: "Planned React library as the analytics dashboard core framework.",
    tags: ["React", "Web Dev", "Dashboard"],
    priority: "low",
    projectId: "proj_tech_stack",
    createdAt: "2026-07-03T11:20:00Z",
    updatedAt: "2026-07-03T11:20:00Z"
  },
  {
    id: "mem_youtube",
    userId: "user_demo",
    url: "https://youtube.com/watch?v=react-compiler",
    canonicalUrl: "https://youtube.com/watch?v=react-compiler",
    domain: "youtube.com",
    pageTitle: "React Compiler: Deep Dive & Architecture Explained",
    websiteName: "YouTube",
    websiteIcon: "📺",
    originalNote: "Stopped watching at 18:42 because this section explains the React Compiler's auto-memoization engine which was highly detailed.",
    aiSummary: "Resuming video from 18:42 explains React Compiler auto-memoization.",
    tags: ["React", "Compiler", "Memoization"],
    priority: "low",
    projectId: "proj_tech_stack",
    createdAt: "2026-07-04T15:30:00Z",
    updatedAt: "2026-07-04T15:30:00Z"
  },
  {
    id: "mem_reddit",
    userId: "user_demo",
    url: "https://reddit.com/r/webdev",
    canonicalUrl: "https://reddit.com/r/webdev",
    domain: "reddit.com",
    pageTitle: "Web Development: Why do we use Embeddings in Vector Databases? - Reddit",
    websiteName: "Reddit",
    websiteIcon: "🤖",
    originalNote: "Found the best explanation of embeddings and pgvector here in the top comment. Explains spatial distance logic perfectly.",
    aiSummary: "Highly clear pgvector and embeddings spatial distance guide in the comments.",
    tags: ["Embeddings", "AI", "Databases"],
    priority: "medium",
    projectId: "proj_learning",
    createdAt: "2026-07-05T08:12:00Z",
    updatedAt: "2026-07-05T08:12:00Z"
  },
  {
    id: "mem_wikipedia",
    userId: "user_demo",
    url: "https://en.wikipedia.org/wiki/System_design",
    canonicalUrl: "https://en.wikipedia.org/wiki/System_design",
    domain: "wikipedia.org",
    pageTitle: "System design - Wikipedia",
    websiteName: "Wikipedia",
    websiteIcon: "🌐",
    originalNote: "Useful reference for the upcoming high-level architectural interview. Focus on the definitions of microservices.",
    aiSummary: "Architectural prep material; key focus points on microservices design definitions.",
    tags: ["System Design", "Interview Prep", "Reference"],
    priority: "low",
    projectId: "proj_learning",
    createdAt: "2026-07-05T14:10:00Z",
    updatedAt: "2026-07-05T14:10:00Z"
  },
  {
    id: "mem_stackoverflow",
    userId: "user_demo",
    url: "https://stackoverflow.com/questions/shadow-dom",
    canonicalUrl: "https://stackoverflow.com/questions/shadow-dom",
    domain: "stackoverflow.com",
    pageTitle: "How to fix querySelector with Shadow DOM elements? - Stack Overflow",
    websiteName: "Stack Overflow",
    websiteIcon: "🥞",
    originalNote: "Correct fix for the Shadow DOM querySelector issue. Need to query the shadowRoot recursively as shown in the second answer.",
    aiSummary: "Shadow DOM querySelector recursing fix; use the shadowRoot tree search.",
    tags: ["JavaScript", "Shadow DOM", "Bugs"],
    priority: "high",
    projectId: "proj_tech_stack",
    createdAt: "2026-07-06T10:05:00Z",
    updatedAt: "2026-07-06T10:05:00Z"
  },
  {
    id: "mem_medium",
    userId: "user_demo",
    url: "https://medium.com/engineering/caching-strategies",
    canonicalUrl: "https://medium.com/engineering/caching-strategies",
    domain: "medium.com",
    pageTitle: "Scaling API responses: Complete Caching Strategies",
    websiteName: "Medium",
    websiteIcon: "✍️",
    originalNote: "Excellent article on Redis vs Memcached for session management and cache invalidation policies like write-through.",
    aiSummary: "Redis/Memcached performance review and write-through cache invalidation guide.",
    tags: ["Caching", "Redis", "Scaling"],
    priority: "medium",
    projectId: "proj_learning",
    createdAt: "2026-07-07T16:22:00Z",
    updatedAt: "2026-07-07T16:22:00Z"
  }
];
