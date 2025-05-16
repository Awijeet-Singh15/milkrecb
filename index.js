// === BACKEND (Node.js + Express) ===
// server/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const milkRoutes = require('./routes/milk');
const { authenticate } = require('./middleware/auth');
require('dotenv').config();

const app = express();

app.use(cors({ origin:"https://milkrecf.vercel.app", credentials: true }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/milk', authenticate, milkRoutes);

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Milk Portal</title>
        <style>
          body {
            background-color: #f0fff0;
            font-family: sans-serif;
            text-align: center;
            padding-top: 100px;
          }
          h1 {
            color: green;
            font-size: 3em;
          }
        </style>
      </head>
      <body>
        <h1>🥛 Milk Record Portal is Running ✨</h1>
      </body>
    </html>
  `);
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🛠️ Server running on http://localhost:${PORT}`));
}

module.exports = app; 
