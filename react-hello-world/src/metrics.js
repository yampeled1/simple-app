import { useEffect } from 'react';

function reportPageLoadMetrics() {
  const { timing } = window.performance;
  const metrics = {
    pageLoadTime: timing.loadEventEnd - timing.navigationStart,
    domContentLoadedTime: timing.domContentLoadedEventEnd - timing.navigationStart,
  };

  // Send metrics to your backend
  fetch('http://localhost:5000/metrics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ metrics }),
  }).catch((err) => console.error('Failed to report metrics', err));
}

export function usePageLoadMetrics() {
  useEffect(() => {
    reportPageLoadMetrics();
  }, []);
}
