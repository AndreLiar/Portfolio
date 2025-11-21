import { getApiBaseUrl } from './utils';

const interestApi = {
  async getInterests() {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/interests`);
    if (!res.ok) {
      throw new Error('Failed to fetch interests');
    }
    return res.json();
  },

  async getInterest(id: string) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/interests/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch interest');
    }
    return res.json();
  },

  async createInterest(item: any) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/interests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      throw new Error('Failed to create interest');
    }
    return res.json();
  },

  async updateInterest(id: string, item: any) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/interests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      throw new Error('Failed to update interest');
    }
    return res.json();
  },

  async deleteInterest(id: string) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/interests/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Failed to delete interest');
    }
    return res.json();
  },
};

export { interestApi };
