/**
 * Centralized API service — all backend calls live here.
 * Uses VITE_API_URL env var so it works in dev, Docker, and ECS.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/api/stats`);
  if (!res.ok) throw new Error(`Stats fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/api/health`);
  if (!res.ok) throw new Error(`Health fetch failed: ${res.status}`);
  return res.json();
}
