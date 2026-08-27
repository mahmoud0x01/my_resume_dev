---
title: "Using Docker Compose for Local Development"
date: 2025-01-05T10:00:00+00:00
draft: false
author: "Mahmoud"
tags:
  - DevOps
  - Docker
  - Development
  - Python
image: /images/post.jpg
description: "How to use Docker Compose to create reproducible development environments for your web applications"
toc: true
---

## Introduction

Docker Compose simplifies multi-container application development by defining your entire stack in a single YAML file. In this guide, I'll show you how to set up a development environment for a typical Python web application.

## Why Docker Compose for Development?

- **Reproducible environments** — "works on my machine" is no longer an excuse
- **Easy onboarding** — new team members run one command to start
- **Service isolation** — each component runs in its own container
- **Production parity** — development mirrors production setup

## Basic Project Structure

```
myproject/
├── docker-compose.yml
├── docker-compose.override.yml  # Development overrides
├── Dockerfile
├── app/
│   └── main.py
└── requirements.txt
```

## Docker Compose Configuration

### Production-Ready Base (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/myapp
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=myapp

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Development Overrides (`docker-compose.override.yml`)

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      target: development
    volumes:
      - ./app:/app  # Hot reload
    command: uvicorn main:app --reload --host 0.0.0.0
    environment:
      - DEBUG=1
    
  db:
    ports:
      - "5432:5432"  # Expose for local access
```

## Multi-Stage Dockerfile

```dockerfile
# Base stage
FROM python:3.11-slim as base
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Development stage
FROM base as development
RUN pip install --no-cache-dir pytest pytest-cov ipdb
COPY . .

# Production stage
FROM base as production
COPY . .
CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker"]
```

## Common Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f web

# Run tests inside container
docker-compose exec web pytest

# Access database shell
docker-compose exec db psql -U user -d myapp

# Rebuild after Dockerfile changes
docker-compose up -d --build

# Stop and remove containers
docker-compose down

# Remove volumes too (clears data)
docker-compose down -v
```

## Development Tips

### 1. Use `.env` Files

```bash
# .env
POSTGRES_PASSWORD=localdev123
DEBUG=1
```

Reference in compose:

```yaml
environment:
  - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
```

### 2. Health Checks

```yaml
db:
  image: postgres:15-alpine
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U user -d myapp"]
    interval: 5s
    timeout: 5s
    retries: 5
```

### 3. Volume for Dependencies

Speed up rebuilds by caching pip packages:

```yaml
volumes:
  - pip_cache:/root/.cache/pip
```

## Real-World Example

My [Telegram News Bot](https://github.com/mahmoud0x01/news_bot_telegram) project uses this exact pattern — PostgreSQL for storage, the Python app for logic, all orchestrated with Docker Compose for easy deployment.

## Conclusion

Docker Compose transforms development setup from hours of configuration to a single `docker-compose up` command. Start simple, add services as needed, and keep development/production configurations aligned.

---

*Check out my [GitHub](https://github.com/mahmoud0x01) for more examples of Docker Compose in action.*
