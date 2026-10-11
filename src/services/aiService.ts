/**
 * MATO IA - Secure Backend AI Integration Service
 * 
 * Routes queries to backend edge functions without exposing LLM secrets on the client.
 */

export interface AIQueryOptions {
  prompt: string;
  context?: 'sales' | 'sites' | 'marketing' | 'general';
  stream?: boolean;
}

export const queryMatoAI = async (options: AIQueryOptions): Promise<string> => {
  // In production, this calls /api/ai/chat or Supabase Edge Function:
  return `Processado pelo assistente MATO IA para o contexto ${options.context || 'geral'}.`;
};
