import test from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryInventoryRepository, MockWineInfoService, MockSommelierChatService } from '../web/core.js';

test('repository fetches newest first', async () => {
  const repo = new InMemoryInventoryRepository([
    { id: '1', bottleName: 'A', producerName: 'P', region: 'R', country: 'C', storageLocation: {}, addedDate: '2023-01-01T00:00:00.000Z' },
    { id: '2', bottleName: 'B', producerName: 'P', region: 'R', country: 'C', storageLocation: {}, addedDate: '2024-01-01T00:00:00.000Z' }
  ]);

  const rows = await repo.fetchBottles();
  assert.equal(rows[0].id, '2');
});

test('mock info service returns sources', async () => {
  const svc = new MockWineInfoService();
  const rows = await svc.search('Pinot Noir');
  assert.equal(rows.length, 2);
  assert.equal(rows[0].source, 'wine.com');
});

test('chat service includes inventory picks', async () => {
  const svc = new MockSommelierChatService();
  const reply = await svc.send('steak pairing', [{ producerName: 'Alpha', bottleName: 'Cab' }]);
  assert.match(reply.text, /Alpha Cab/);
});
