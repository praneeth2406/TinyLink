const express = require('express');
const cors = require('cors');
const linkRoutes = require('./routes/linkRoutes');
const { redirectHandler } = require('./controllers/linkController');
require('dotenv').config();
const {neon} = require('@neondatabase/serverless');

const app = express();

app.use(cors());
app.use(express.json());

// Healthcheck: GET /healthz
app.get('/healthz', (_req, res) => {
  res.status(200).json({ ok: true, version: '1.0' });
});

// API routes
app.use('/api/links', linkRoutes);

// (Later, when building & serving React, you’ll add static serving here)

// Redirect route (must be last to avoid conflicts)
app.get('/:code', redirectHandler);

module.exports = app;
