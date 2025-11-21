import { getApiBaseUrl } from './utils';

const skillApi = {
  async getSkills() {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/skills`);
    if (!res.ok) {
      throw new Error('Failed to fetch skills');
    }
    return res.json();
  },

  async getSkill(id: string) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/skills/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch skill');
    }
    return res.json();
  },

  async createSkill(skill: any) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(skill),
    });
    if (!res.ok) {
      throw new Error('Failed to create skill');
    }
    return res.json();
  },

  async updateSkill(id: string, skill: any) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/skills/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(skill),
    });
    if (!res.ok) {
      throw new Error('Failed to update skill');
    }
    return res.json();
  },

  async deleteSkill(id: string) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/skills/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Failed to delete skill');
    }
    return res.json();
  },
};

export { skillApi };
