import { getApiBaseUrl } from './utils';

const languageApi = {
  async getLanguages() {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/languages`);
    if (!res.ok) {
      throw new Error('Failed to fetch languages');
    }
    return res.json();
  },

  async getLanguage(id: string) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/languages/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch language');
    }
    return res.json();
  },

  async createLanguage(item: any) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/languages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      throw new Error('Failed to create language');
    }
    return res.json();
  },

  async updateLanguage(id: string, item: any) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/languages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      throw new Error('Failed to update language');
    }
    return res.json();
  },

  async deleteLanguage(id: string) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/languages/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Failed to delete language');
    }
    return res.json();
  },
};

export { languageApi };
