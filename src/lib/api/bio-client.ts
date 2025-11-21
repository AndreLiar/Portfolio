import { getApiBaseUrl } from './utils';

const bioApi = {
  async getBio() {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/bio`);
    if (!res.ok) {
      throw new Error('Failed to fetch bio');
    }
    return res.json();
  },

  async updateBio(bio: any) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/bio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bio),
    });
    if (!res.ok) {
      throw new Error('Failed to update bio');
    }
    return res.json();
  },
};

export { bioApi };
