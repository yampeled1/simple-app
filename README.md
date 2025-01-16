# Project Name: Backend and React App with Metrics Visualization

## Overview
This project contains a backend service and a React application, both dockerized and configured with Prometheus and Grafana for monitoring. The backend exposes metrics for HTTP request counts, response times, and error rates. Prometheus scrapes these metrics, and Grafana visualizes them in dashboards.

---

## Requirements
- Docker (>= 20.10)
- Docker Compose (>= 1.29)
- Node.js (>= 18.x, for local development without Docker)
- Prometheus (configured in Docker Compose)
- Grafana (configured in Docker Compose)

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yampeled1/simple-app.git
```

### 2. Start the Services
Using Docker Compose:
```bash
docker compose up -d
```

This will start the following services:
- **Backend**: Accessible at `http://localhost:3000`
- **React App**: Accessible at `http://localhost:8080`
- **Prometheus**: Accessible at `http://localhost:9090`
- **Grafana**: Accessible at `http://localhost:3002` (default credentials: `admin`/`admin`)

---

## Local Development Guide

### Backend Development
1. Navigate to the backend directory:
   ```bash
   cd simple-node-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend locally:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:3000`.

### React Development
1. Navigate to the frontend directory:
   ```bash
   cd react-hello-world
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app locally:
   ```bash
   npm start
   ```
   The app will run on `http://localhost:300x`.
   Please notice react will try to deploy on port 3000, If the backend already deployed on this port it will disocver it and will ask to deploy on any random port

### Updating Prometheus Configuration
1. Edit `prometheus.yml` to adjust scrape intervals or add new scrape targets.
2. Restart the Prometheus container:
   ```bash
   docker-compose restart prometheus
   ```

---

## Troubleshooting

### Common Issues

#### **Docker Service Fails to Start**
- Ensure Docker is running.
- Check for conflicting ports (e.g. 8080, 3000, 9090).
- Restart services:
  ```bash
  docker-compose down
  docker-compose up -d
  ```

#### **Prometheus Cannot Scrape Metrics**
- Confirm that the backend `/metrics` endpoint is accessible.
  ```bash
  curl http://localhost:3000/metrics
  ```
- Ensure `prometheus.yml` has the correct `backend_metrics:3000` target.
- Check Prometheus logs:
  ```bash
  docker logs prometheus
  ```

#### **Grafana Dashboards Show No Data**
- Verify the Prometheus datasource in Grafana is correctly configured (URL: `http://prometheus:9090`).
- Confirm Prometheus is scraping metrics using its UI (`http://localhost:9090`).
- Ensure the backend is up and exposing metrics.



## Architecture Diagram

![alt text](https://github.com/yampeled1/simple-app/blob/dev/diagram.png?raw=true)
