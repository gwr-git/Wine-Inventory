export const now = () => new Date().toISOString();

export class InMemoryInventoryRepository {
  constructor(seed = []) {
    this.bottles = [...seed];
  }
  async fetchBottles() {
    return [...this.bottles].sort((a, b) => b.addedDate.localeCompare(a.addedDate));
  }
  async addBottle(bottle) {
    this.bottles.push(bottle);
  }
}

export class MockWineInfoService {
  async search(query) {
    return [
      {
        bottleName: `${query} Reserve`,
        producerName: 'Mock Producer',
        region: 'Napa Valley',
        country: 'United States',
        source: 'wine.com'
      },
      {
        bottleName: `${query} Single Vineyard`,
        producerName: 'K&L Example',
        region: 'Sonoma Coast',
        country: 'United States',
        source: 'klwines.com'
      }
    ];
  }
}

export class MockSommelierChatService {
  async send(message, inventory) {
    const picks = inventory.slice(0, 3).map((b) => `${b.producerName} ${b.bottleName}`).join(', ');
    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      text: `For "${message}", I'd start with: ${picks || 'no bottles yet—add a few first.'}`,
      timestamp: now()
    };
  }
}

export function makeBottle(formData) {
  return {
    id: crypto.randomUUID(),
    photoURL: null,
    bottleName: formData.get('bottleName'),
    producerName: formData.get('producerName'),
    region: formData.get('region'),
    country: formData.get('country'),
    storageLocation: {
      cellarName: formData.get('cellarName'),
      rack: formData.get('rack')
    },
    purchasePrice: null,
    purchaseDate: null,
    source: null,
    bottleSizeML: 750,
    addedDate: now(),
    marketPrice: null,
    criticScores: [],
    drinkingWindow: null
  };
}
