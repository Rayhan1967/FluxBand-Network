const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'FluxBand Network API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/api/nodes', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'No nodes registered yet'
  });
});

app.post('/api/nodes/register', (req, res) => {
  const { nodeId, walletAddress } = req.body;
  
  if (!nodeId || !walletAddress) {
    return res.status(400).json({
      success: false,
      message: 'nodeId and walletAddress are required'
    });
  }

  res.status(201).json({
    success: true,
    data: { nodeId, walletAddress, registered: true },
    message: 'Node registered successfully'
  });
});

app.post('/api/bandwidth/test', (req, res) => {
  const { nodeId, uploadSpeed, downloadSpeed, latency } = req.body;
  
  res.json({
    success: true,
    data: {
      nodeId,
      uploadSpeed,
      downloadSpeed, 
      latency,
      timestamp: new Date().toISOString(),
      reward: '1.0'
    },
    message: 'Bandwidth test recorded'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 FluxBand Network API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

module.exports = app;
