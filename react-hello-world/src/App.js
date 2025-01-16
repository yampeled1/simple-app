import logo from './logo.svg';
import './App.css';
import { usePageLoadMetrics } from './metrics.js';
import React, { useState, useEffect } from 'react';


async function fetchWithMetrics(url, options) {
  const start = performance.now();
  const response = await fetch(url, options);
  const end = performance.now();

  const latency = end - start;

  // Send metrics to your backend
  fetch('http://localhost:3000/metrics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      metric: 'api_call_latency',
      url,
      latency,
    }),
  }).catch((err) => console.error('Failed to report metrics', err));

  return response;
}

async function fetchBackendData() {
  try {
    const response = await fetchWithMetrics('http://localhost:3000/api/data'); // Replace with your backend URL
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data from backend:', error);
    return { error: 'Failed to fetch data' };
  }
}

function App() {

  usePageLoadMetrics();
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    // Fetch data from the backend on component mount
    fetchBackendData().then((data) => {
      if (data.error) {
        setMessage(data.error);
      } else {
        setMessage(data.message || 'Hello from Backend!');
      }
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>
          Hello world!
        </h1>
        <p>
          {message}
        </p>
      </header>
    </div>
  );
}

export default App;
