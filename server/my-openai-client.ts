// Your Custom OpenAI Client - Drop-in Replacement
// Use this instead of the OpenAI npm package

export class MyOpenAI {
  private baseURL: string;
  private apiKey: string;

  constructor(options: { apiKey?: string; baseURL?: string } = {}) {
    this.baseURL = options.baseURL || 'http://localhost:5000/api/my-openai';
    this.apiKey = options.apiKey || 'your-custom-key'; // Not actually used, but maintains compatibility
  }

  get chat() {
    return {
      completions: {
        create: async (params: {
          model: string;
          messages: Array<{
            role: 'system' | 'user' | 'assistant';
            content: string;
          }>;
          temperature?: number;
          max_tokens?: number;
          response_format?: { type: 'json_object' };
        }) => {
          const response = await fetch(`${this.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify(params)
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          return await response.json();
        }
      }
    };
  }

  get images() {
    return {
      generate: async (params: {
        model?: string;
        prompt: string;
        n?: number;
        size?: string;
        quality?: string;
      }) => {
        const response = await fetch(`${this.baseURL}/images/generations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify(params)
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      }
    };
  }

  async getUsage() {
    const response = await fetch(`${this.baseURL}/usage`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }
}

// Export a default instance
export const myOpenAI = new MyOpenAI();