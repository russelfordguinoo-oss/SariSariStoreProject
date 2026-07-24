const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Health check — confirms the server is up before any real routes exist
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Sari-sari API is running' });
});

module.exports = app;