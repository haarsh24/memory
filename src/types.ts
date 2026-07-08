export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface Memory {
  id: string;
  userId: string;
  url: string;
  canonicalUrl: string;
  domain: string;
  pageTitle: string;
  websiteName: string;
  websiteIcon: string;
  contentFingerprint?: string;
  originalNote: string;
  aiSummary: string;
  tags: string[];
  priority: "low" | "medium" | "high";
  projectId?: string;
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface RecentVisit {
  id: string;
  url: string;
  title: string;
  visitedAt: string;
}

export interface SearchResult extends Memory {
  relevanceScore?: number;
  matchExplanation?: string;
}
