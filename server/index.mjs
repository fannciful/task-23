import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import path from 'path';
import Todo from './Todo.js';
import mongoose from 'mongoose';

const dbUrl = 'mongodb+srv://juliya992:fTvhEn4x04FDRq8R@cluster0.xf6es.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', () => {
  console.log('DB error');
});
db.once('open', () => {
  console.log('DB opened');
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();

app.register(fastifyStatic, {
  root: path.join(__dirname, '../client')
});

// Додаємо підтримку JSON для вхідних запитів
app.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
  try {
    const json = JSON.parse(body);
    done(null, json);
  } catch (err) {
    err.statusCode = 400;
    done(err, undefined);
  }
});

app.get('/list', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    return res.send(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return res.status(500).send('Internal Server Error');
  }
});

app.post('/list-item', async (req, res) => {
  try {
    const todoItem = new Todo({
      id: 'id' + Date.now(),
      text: req.body.text  // Змінено на req.body.text
    });
    await todoItem.save();
    return res.send(todoItem);  // Повертаємо весь об'єкт, а не тільки id
  } catch (error) {
    console.error('Error creating todo:', error);
    return res.status(500).send('Internal Server Error');
  }
});

app.put('/list-item/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const todoItem = await Todo.findOneAndUpdate({ id }, { text, updatedAt: Date.now() }, { new: true });
    if (todoItem) {
      return res.send(todoItem);  // Повертаємо оновлений об'єкт
    }
    return res.status(400).send(`No such todo item: ${id}`);
  } catch (error) {
    console.error('Error updating todo:', error);
    return res.status(500).send('Internal Server Error');
  }
});

app.delete('/list-item/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todoItem = await Todo.findOneAndDelete({ id });
    if (todoItem) {
      return res.send(todoItem);  // Повертаємо видалений об'єкт
    }
    return res.status(400).send(`No such todo item: ${id}`);
  } catch (error) {
    console.error('Error deleting todo:', error);
    return res.status(500).send('Internal Server Error');
  }
});

app.listen({ port: process.env.port || 5555, host: process.env.host || 'localhost' })
  .then((address) => {
    console.log('App started at ', address)
  });