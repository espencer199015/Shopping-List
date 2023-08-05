const request = require('supertest');
const app = require('./app');
const items = require('./fakeDb');

describe('Shopping List API', () => {
  beforeEach(() => {
    // Clear the items array before each test
    items.length = 0;
  });

  test('GET /items should return a list of shopping items', async () => {
    const newItem = { name: 'popsicle', price: 1.45 };
    items.push(newItem);

    const response = await request(app).get('/items');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([newItem]);
  });

  test('POST /items should add a new shopping item', async () => {
    const newItem = { name: 'popsicle', price: 1.45 };

    const response = await request(app).post('/items').send(newItem);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ added: newItem, });
    expect(items).toHaveLength(1);
    expect(items[0]).toEqual(newItem);
  });

  test('GET /items/:name should return a single shopping item by name', async () => {
    const newItem = { name: 'popsicle', price: 1.45 };
    items.push(newItem);

    const response = await request(app).get(`/items/${newItem.name}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(newItem);
  });

  test('GET /items/:name should return 404 for non-existing item', async () => {
    const response = await request(app).get('/items/non-existing-item');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Item not found' });
  });

  test('PATCH /items/:name should update a single shopping item by name', async () => {
    const newItem = { name: 'popsicle', price: 1.45 };
    items.push(newItem);

    const updatedItem = { name: 'new popsicle', price: 2.45 };

    const response = await request(app)
      .patch(`/items/${newItem.name}`)
      .send(updatedItem);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ updated: updatedItem });
    expect(items).toHaveLength(1);
    expect(items[0]).toEqual(updatedItem);
  });

  test('PATCH /items/:name should return 404 for updating non-existing item', async () => {
    const response = await request(app)
      .patch('/items/non-existing-item')
      .send({ name: 'new popsicle', price: 2.45 });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Item not found' });
  });

  test('DELETE /items/:name should delete a single shopping item by name', async () => {
    const newItem = { name: 'popsicle', price: 1.45 };
    items.push(newItem);

    const response = await request(app).delete(`/items/${newItem.name}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Deleted' });
    expect(items).toHaveLength(0);
  });

  test('DELETE /items/:name should return 404 for deleting non-existing item', async () => {
    const response = await request(app).delete('/items/non-existing-item');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Item not found' });
  });
});