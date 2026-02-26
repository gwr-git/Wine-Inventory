import {
  InMemoryInventoryRepository,
  MockSommelierChatService,
  MockWineInfoService,
  makeBottle,
  now
} from './core.js';

const repo = new InMemoryInventoryRepository([
  {
    id: crypto.randomUUID(),
    bottleName: 'Estate Cabernet Sauvignon',
    producerName: 'Hillside Cellars',
    region: 'Napa Valley',
    country: 'United States',
    storageLocation: { cellarName: 'Home', rack: 'B2 / Bin 12' },
    purchasePrice: 120,
    purchaseDate: '2025-01-03',
    source: 'K&L Wines',
    bottleSizeML: 750,
    addedDate: now(),
    marketPrice: 155,
    criticScores: [{ criticName: 'WA', score: 95 }],
    drinkingWindow: { startYear: 2026, endYear: 2035 }
  }
]);
const infoService = new MockWineInfoService();
const chatService = new MockSommelierChatService();

const els = {
  addForm: document.querySelector('#add-form'),
  smartFill: document.querySelector('#smart-fill'),
  smartFillStatus: document.querySelector('#smart-fill-status'),
  search: document.querySelector('#inventory-search'),
  list: document.querySelector('#inventory-list'),
  chatHistory: document.querySelector('#chat-history'),
  chatForm: document.querySelector('#chat-form')
};

let inventory = [];
let chat = [];

function renderInventory() {
  const q = els.search.value.trim().toLowerCase();
  const visible = q
    ? inventory.filter((b) =>
        [b.bottleName, b.producerName, b.region].some((v) => v.toLowerCase().includes(q))
      )
    : inventory;

  els.list.innerHTML = visible
    .map(
      (b) => `<li>
        <strong>${b.bottleName}</strong><br />
        ${b.producerName} • ${b.region}, ${b.country}<br />
        <span class="muted">Cellar: ${b.storageLocation.cellarName} • ${b.storageLocation.rack ?? ''}</span>
      </li>`
    )
    .join('');
}

function renderChat() {
  els.chatHistory.innerHTML = chat
    .map((m) => `<div class="msg"><strong>${m.role}</strong>${m.text}</div>`)
    .join('');
  els.chatHistory.scrollTop = els.chatHistory.scrollHeight;
}

async function boot() {
  inventory = await repo.fetchBottles();
  renderInventory();
}

els.search.addEventListener('input', renderInventory);

els.addForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const bottle = makeBottle(new FormData(els.addForm));
  await repo.addBottle(bottle);
  inventory = await repo.fetchBottles();
  renderInventory();
  els.addForm.reset();
  els.smartFillStatus.textContent = 'Saved.';
});

els.smartFill.addEventListener('click', async () => {
  const form = new FormData(els.addForm);
  const bottleName = String(form.get('bottleName') || '').trim();
  if (!bottleName) {
    els.smartFillStatus.textContent = 'Enter a bottle name first.';
    return;
  }

  const results = await infoService.search(bottleName);
  const top = results[0];
  if (!top) {
    els.smartFillStatus.textContent = 'No matches found.';
    return;
  }

  els.addForm.elements.producerName.value = top.producerName;
  els.addForm.elements.region.value = top.region;
  els.addForm.elements.country.value = top.country;
  els.smartFillStatus.textContent = `Prefilled from ${top.source}.`;
});

els.chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = new FormData(els.chatForm);
  const prompt = String(form.get('prompt') || '').trim();
  if (!prompt) return;

  chat.push({ id: crypto.randomUUID(), role: 'user', text: prompt, timestamp: now() });
  const response = await chatService.send(prompt, inventory);
  chat.push(response);
  renderChat();
  els.chatForm.reset();
});

boot();
