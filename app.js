const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const items = require('./fakeDb');

app.use(bodyParser.json());

// GET /items - get all shopping items
app.get('/items', (req, res) => {
  res.json(items);
});

// POST /items - add a new shopping item
app.post('/items', (req, res) => {
  const newItem = req.body;
  items.push(newItem);
  res.json({ added: newItem });
});

// GET /items/:name - get a single shopping item by name
app.get('/items/:name', (req, res) => {
  const {name} = req.params;
  const foundItem = items.find((item) => item.name === name);
  if (foundItem) {
    res.json(foundItem);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// PATCH /items/:name - update a single shopping item by name
app.patch('/items/:name', (req, res) => {
  const {name} = req.params;
  const updatedItem = req.body;

  const index = items.findIndex((item) => item.name === name);
  if (index !== -1) {
    items[index] = { ...items[index], ...updatedItem };
    res.json({ updated: items[index] });
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// DELETE /items/:name - delete a single shopping item by name
app.delete('/items/:name', (req, res) => {
  const {name} = req.params;
  const index = items.findIndex((item) => item.name === name);
  if (index !== -1) {
    items.splice(index, 1);
    res.json({ message: 'Deleted' });
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
