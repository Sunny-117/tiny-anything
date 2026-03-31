const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
app.use(morgan('dev'));
// npm install express cors morgan  body-parser --save
app.use(cors(
  {
    origin: 'http://localhost:3000',
    credentials: true
  }
));
app.use(bodyParser.json());
const users = [];
app.get('/api/user/1', (req, res) => {
  setTimeout(() => {
    res.json({ name: '张三', ts: Date.now() });
  }, 3000);
});
app.get('/api/search', (req, res) => {
  const q = req.query.q;
  const data = [];
  for (let i = 1; i <= 10; i++) {
    data.push(q + i);
  }
  res.json(data);
});
app.post('/api/user', (req, res) => {
  const user = req.body;
  user.id = Date.now();
  users.push(user);
  res.json(user)
});
app.delete('/api/user/1', (req, res) => {
  res.status(500).json({ message: '删除失败' });
});
app.listen(8080, () => {
  console.log('server start at 8080');
});