import { getApiBaseUrl } from './utils';

const journeyApi = {
  async getJourneyItems() {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/journey`);
    if (!res.ok) {
      throw new Error('Failed to fetch journey items');
    }
    return res.json();
  },

  async getJourneyItem(id: string) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/journey/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch journey item');
    }
    return res.json();
  },

  async createJourneyItem(item: any) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/journey`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      throw new Error('Failed to create journey item');
    }
    return res.json();
  },

  async updateJourneyItem(id: string, item: any) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/journey/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      throw new Error('Failed to update journey item');
    }
    return res.json();
  },

  async deleteJourneyItem(id: string) {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/portfolio/journey/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Failed to delete journey item');
    }
    return res.json();
  },
};

export { journeyApi };
