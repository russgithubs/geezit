const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
  };
}

interface UserProfile {
  id: number;
  username: string;
  email?: string;
  message_count: number;
  heart_count: number;
  created_at: string;
}

interface Message {
  id: number;
  message_text: string;
  created_at: string;
}

interface Heart {
  created_at: string;
}

class ApiService {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async signup(username: string, password: string): Promise<AuthResponse> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async getUserProfile(token: string): Promise<UserProfile> {
    return this.request('/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateProfile(token: string, updates: { username?: string; email?: string }) {
    return this.request('/user/profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
  }

  async sendMessage(username: string, message: string) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify({ username, message }),
    });
  }

  async getMessages(token: string): Promise<Message[]> {
    return this.request('/messages', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async sendHeart(token: string, username: string) {
    return this.request('/hearts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username }),
    });
  }

  async getHearts(token: string): Promise<Heart[]> {
    return this.request('/hearts', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async checkUserExists(username: string): Promise<{ exists: boolean }> {
    return this.request(`/users/${username}`);
  }
}

export const api = new ApiService();