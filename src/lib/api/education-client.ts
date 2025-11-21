import { getApiBaseUrl } from './utils';

const educationApi = {
  async getEducationItems() {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/education`);
    if (!res.ok) {
      throw new Error('Failed to fetch education items');
    }
    return res.json();
  },

  async getEducationItem(id: string) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/education/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch education item');
    }
    return res.json();
  },

  async createEducationItem(item: any) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/education`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      throw new Error('Failed to create education item');
    }
    return res.json();
  },

  async updateEducationItem(id: string, item: any) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/education/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      throw new Error('Failed to update education item');
    }
    return res.json();
  },

  async deleteEducationItem(id: string) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/education/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Failed to delete education item');
    }
    return res.json();
  },
};

export { educationApi };
