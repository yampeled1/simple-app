// Import necessary libraries
const express = require('express');
const promClient = require('prom-client');
const cors = require('cors');

// Initialize the Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON bodies

// Prometheus metrics
const apiCallLatency = new promClient.Histogram({
  name: 'api_call_latency_seconds',
  help: 'Latency of API calls in seconds',
  labelNames: ['url'],
});

const pageLoadTime = new promClient.Histogram({
  name: 'page_load_time_seconds',
  help: 'Page load time in seconds',
});

const domContentLoadedTime = new promClient.Histogram({
  name: 'dom_content_loaded_time_seconds',
  help: 'DOM Content Loaded time in seconds',
});

const requestCount = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

const responseTimeHistogram = new promClient.Histogram({
  name: 'http_response_time_seconds',
  help: 'Response time in seconds',
  labelNames: ['method', 'route', 'status'],
});

const errorRateCounter = new promClient.Counter({
  name: 'http_error_count',
  help: 'Number of HTTP errors',
  labelNames: ['method', 'route', 'status'],
});

app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000; // Convert to seconds
    const route = req.route ? req.route.path : req.url;
    const method = req.method;
    const status = res.statusCode;

    // Increment request count
    requestCount.labels(method, route, status).inc();

    // Record response time
    responseTimeHistogram.labels(method, route, status).observe(duration);

    // Increment error count if status is 4xx or 5xx
    if (status >= 400) {
      errorRateCounter.labels(method, route, status).inc();
    }
  });

  next();
});

app.post('/metrics', (req, res) => {
  const { metric, latency, metrics, url } = req.body;

  if (metric === 'api_call_latency') {
    apiCallLatency.labels(url).observe(latency / 1000); // Convert to seconds
  } else if (metrics) {
    pageLoadTime.observe(metrics.pageLoadTime / 1000);
    domContentLoadedTime.observe(metrics.domContentLoadedTime / 1000);
  }

  res.status(204).send();
});

app.get('/', (req, res) => {
  res.redirect('/api/data');
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Define a single endpoint
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the backend server!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

