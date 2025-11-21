import { getApiBaseUrl } from './utils';

const projectApi = {
  async getProjects() {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/projects`);
    if (!res.ok) {
      throw new Error('Failed to fetch projects');
    }
    return res.json();
  },

  async getProject(id: string) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/projects/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch project');
    }
    return res.json();
  },

  async createProject(project: any) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    if (!res.ok) {
      throw new Error('Failed to create project');
    }
    return res.json();
  },

  async updateProject(id: string, project: any) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    if (!res.ok) {
      throw new Error('Failed to update project');
    }
    return res.json();
  },

  async deleteProject(id: string) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/projects/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Failed to delete project');
    }
    return res.json();
  },
};

export { projectApi };
