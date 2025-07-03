import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { StandaloneAI } from "./standalone-ai";
import { StandaloneStorage } from "./standalone-storage";

// Initialize standalone services
const standaloneAI = new StandaloneAI();
const standaloneStorage = new StandaloneStorage();

// Use hosted Replit backend for APK deployment
const STANDALONE_MODE = false;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://36a00fdd-b558-4b85-acec-5ac02d33f0fc-00-1mkusf0mqzlrp.picard.replit.dev';

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Handle requests in standalone mode
  if (STANDALONE_MODE) {
    return handleStandaloneRequest(method, url, data);
  }
  
  const fullUrl = url.startsWith('/api/') 
    ? `${BACKEND_URL}${url}` 
    : url;
  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Handle queries in standalone mode
    if (STANDALONE_MODE) {
      return handleStandaloneQuery(queryKey[0] as string);
    }
    
    const url = (queryKey[0] as string).startsWith('/api/') 
      ? `${BACKEND_URL}${queryKey[0]}` 
      : queryKey[0] as string;
    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

// Standalone mode handlers
async function handleStandaloneRequest(method: string, url: string, data?: unknown): Promise<Response> {
  // Simulate API responses using local AI and storage
  if (url.includes('/api/ai/generate')) {
    const requestData = data as any;
    const result = await standaloneAI.generateContent({
      topic: requestData.topic,
      platform: requestData.platform,
      style: requestData.style || 'viral'
    });
    
    // Save to local storage
    await standaloneStorage.saveContent(result);
    standaloneAI.updateUsageStats();
    
    return new Response(JSON.stringify({
      success: true,
      ...result,
      mode: 'standalone'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  
  if (url.includes('/api/dashboard/stats')) {
    const stats = standaloneStorage.getStats();
    return new Response(JSON.stringify({
      ...stats,
      mode: 'standalone',
      message: 'Running offline - No internet required'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  
  // Default response for unhandled endpoints
  return new Response(JSON.stringify({
    message: 'Standalone mode - Limited functionality',
    mode: 'standalone'
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

async function handleStandaloneQuery(url: string): Promise<any> {
  if (url.includes('/api/dashboard/stats')) {
    const stats = standaloneStorage.getStats();
    return {
      ...stats,
      mode: 'standalone',
      message: '📱 Standalone Mode - No Internet Required',
      costSaved: stats.contentGenerated * 0.50
    };
  }
  
  if (url.includes('/api/content')) {
    return standaloneStorage.getContent(20);
  }
  
  if (url.includes('/api/analytics')) {
    return standaloneStorage.getPlatformAnalytics();
  }
  
  // Default response
  return {
    message: 'Standalone mode active',
    mode: 'standalone'
  };
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
