import { getApiBaseUrl } from './utils';

const workExperienceApi = {
  async getWorkExperiences() {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/work-experience`);
    if (!res.ok) {
      throw new Error('Failed to fetch work experiences');
    }
    return res.json();
  },

  async getWorkExperience(id: string) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/work-experience/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch work experience');
    }
    return res.json();
  },

  async createWorkExperience(item: any) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/work-experience`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      throw new Error('Failed to create work experience');
    }
    return res.json();
  },

  async updateWorkExperience(id: string, item: any) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/work-experience/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      throw new Error('Failed to update work experience');
    }
    return res.json();
  },

  async deleteWorkExperience(id: string) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/work-experience/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Failed to delete work experience');
    }
    return res.json();
  },
};

export { workExperienceApi };
